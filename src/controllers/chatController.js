/**
 * Controlador de Chat con IA
 * Maneja las peticiones relacionadas con el chat inteligente
 */

const aiService = require('../services/aiService');
const { validationResult } = require('express-validator');

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
      
      // Enviar mensaje a la IA
      const reply = await aiService.sendMessage(message);
      
      res.json({
        success: true,
        data: {
          reply: reply,
          userMessage: message
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error en sendMessage:', error);
      
      res.status(500).json({
        success: false,
        message: 'Hubo un error al comunicarme con la IA. Inténtalo de nuevo.',
        timestamp: new Date().toISOString()
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