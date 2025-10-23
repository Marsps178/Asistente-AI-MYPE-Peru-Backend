/**
 * Controlador de Chat con IA
 * Maneja las peticiones relacionadas con el chat inteligente
 */

const aiService = require('../services/aiService');
const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ChatController {
  /**
   * Procesa un mensaje del chat y devuelve la respuesta de la IA
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async sendMessage(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      // Verificar si el servicio de IA está disponible
      if (!aiService.isAvailable()) {
        return res.status(503).json({
          success: false,
          message: 'Servicio de IA no disponible. Verifica la configuración de la API key.',
          timestamp: new Date().toISOString()
        });
      }

      const { message } = req.body;
      const user = req.user; // Viene del middleware de autenticación

      // Si hay usuario autenticado, verificar límites y incrementar contador
      if (user) {
        // Verificar si puede hacer consultas
        if (!user.isPremium) {
          const freeQueriesLimit = parseInt(process.env.FREE_QUERIES_LIMIT || 5);
          if (user.freeQueriesUsed >= freeQueriesLimit) {
            return res.status(403).json({
              success: false,
              message: 'Has alcanzado el límite de consultas gratuitas',
              code: 'QUERY_LIMIT_EXCEEDED',
              data: {
                freeQueriesUsed: user.freeQueriesUsed,
                freeQueriesLimit,
                requiresPayment: true,
                paymentAmount: parseFloat(process.env.PAYMENT_AMOUNT || 15.00),
                currency: process.env.PAYMENT_CURRENCY || 'PEN'
              }
            });
          }
        }
      }
      
      // Enviar mensaje a la IA
      const reply = await aiService.sendMessage(message);
      
      // Generar timestamps para cada mensaje
      const currentTime = Date.now(); // Usar timestamp en milisegundos

      // Si hay usuario autenticado, incrementar contador y guardar en historial
      if (user) {
        // Incrementar contador de consultas gratuitas si no es premium
        if (!user.isPremium) {
          await authService.incrementFreeQueries(user.id);
        }

        // Guardar en historial de chat
        await prisma.chatMessage.create({
          data: {
            userId: user.id,
            message,
            response: reply
          }
        });
      }
      
      res.json({
        success: true,
        data: {
          userMessage: {
            text: message,
            timestamp: currentTime
          },
          aiResponse: {
            text: reply,
            timestamp: currentTime + 1 // Timestamp ligeramente posterior
          }
        },
        // Información adicional para usuarios autenticados
        ...(user && {
          userInfo: {
            freeQueriesUsed: user.freeQueriesUsed + (user.isPremium ? 0 : 1),
            freeQueriesRemaining: user.isPremium ? 'unlimited' : Math.max(0, parseInt(process.env.FREE_QUERIES_LIMIT || 5) - user.freeQueriesUsed - 1),
            isPremium: user.isPremium
          }
        })
      });

    } catch (error) {
      console.error('Error procesando mensaje:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al procesar el mensaje',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene el historial de chat del usuario autenticado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getChatHistory(req, res) {
    try {
      const user = req.user;
      const { page = 1, limit = 20 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const chatHistory = await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          message: true,
          response: true,
          createdAt: true
        }
      });

      const total = await prisma.chatMessage.count({
        where: { userId: user.id }
      });

      res.json({
        success: true,
        data: {
          chatHistory,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error obteniendo historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el historial de chat'
      });
    }
  }

  /**
   * Obtiene información sobre el asistente de IA
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAssistantInfo(req, res) {
    try {
      const assistantInfo = {
        name: 'Asistente AI-MYPE Peru',
        description: 'Asistente virtual especializado en ayudar a emprendedores peruanos a formalizarse',
        capabilities: [
          'Asesoría sobre regímenes tributarios',
          'Información sobre formalización de negocios',
          'Guía para emprendedores',
          'Respuestas sobre impuestos y obligaciones tributarias'
        ],
        limitations: [
          'Solo responde preguntas sobre negocios y emprendimiento en Perú',
          'No proporciona asesoría legal específica',
          'Recomienda consultar con profesionales para casos complejos'
        ],
        isAvailable: aiService.isAvailable()
      };

      res.json({
        success: true,
        data: assistantInfo,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error en getAssistantInfo:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al obtener información del asistente',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Endpoint de salud para verificar el servicio de chat
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async healthCheck(req, res) {
    const isAIAvailable = aiService.isAvailable();
    
    res.json({
      success: true,
      message: 'Servicio de chat funcionando correctamente',
      service: 'chat-service',
      aiServiceAvailable: isAIAvailable,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new ChatController();