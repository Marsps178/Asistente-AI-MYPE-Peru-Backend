/**
 * Controlador de Pagos
 * Maneja las rutas relacionadas con pagos y transacciones
 */

const paymentService = require('../services/paymentService');
const { validationResult } = require('express-validator');

class PaymentController {
  /**
   * Crea una nueva orden de pago
   */
  async createPaymentOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { amount, currency } = req.body;

      // Verificar si el usuario ya es premium
      if (req.user.isPremium) {
        return res.status(400).json({
          success: false,
          message: 'Ya tienes acceso premium activo'
        });
      }

      const result = await paymentService.createPaymentOrder(
        userId, 
        amount || 15.00, 
        currency || 'PEN'
      );

      res.status(201).json({
        success: true,
        message: 'Orden de pago creada exitosamente',
        data: {
          orderId: result.payment.id,
          amount: result.payment.amount,
          currency: result.payment.currency,
          paymentData: result.paymentData
        }
      });

    } catch (error) {
      console.error('Error creando orden de pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Procesa un pago (simulado)
   */
  async processPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('❌ Errores de validación en processPayment:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const { orderId, paymentMethod } = req.body;
      
      console.log('🔄 Iniciando procesamiento de pago:', {
        orderId,
        paymentMethod,
        timestamp: new Date().toISOString()
      });

      // Buscar la orden de pago
      const payment = await paymentService.getPaymentStatus(orderId);
      
      if (!payment) {
        console.error('❌ Orden de pago no encontrada:', orderId);
        return res.status(404).json({
          success: false,
          message: 'Orden de pago no encontrada'
        });
      }

      if (payment.status !== 'PENDING') {
        console.error('❌ Orden ya procesada:', { orderId, status: payment.status });
        return res.status(400).json({
          success: false,
          message: 'La orden de pago ya fue procesada'
        });
      }

      // Procesar el pago
      const paymentData = {
        orderId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: paymentMethod || 'card'
      };

      console.log('💳 Enviando datos a paymentService:', paymentData);
      const result = await paymentService.processPayment(paymentData);

      if (result.success) {
        console.log('✅ Pago exitoso, confirmando:', result.transactionId);
        // Confirmar el pago
        await paymentService.confirmPayment(orderId, result.transactionId);
        
        res.json({
          success: true,
          message: 'Pago procesado exitosamente',
          data: {
            transactionId: result.transactionId,
            status: result.status
          }
        });
      } else {
        console.error('❌ Fallo en el procesamiento:', result);
        res.status(400).json({
          success: false,
          message: result.message || 'Error al procesar el pago',
          data: {
            status: result.status
          }
        });
      }

    } catch (error) {
      console.error('Error procesando pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Webhook para notificaciones de pago (para pasarelas reales)
   */
  async paymentWebhook(req, res) {
    try {
      // En producción, aquí validarías la firma del webhook
      const { orderId, status, transactionId } = req.body;

      if (status === 'completed' || status === 'success') {
        await paymentService.confirmPayment(orderId, transactionId);
      } else if (status === 'failed' || status === 'cancelled') {
        await paymentService.cancelPayment(orderId);
      }

      res.status(200).json({ received: true });

    } catch (error) {
      console.error('Error en webhook de pago:', error);
      res.status(500).json({ error: 'Error procesando webhook' });
    }
  }

  /**
   * Obtiene el historial de pagos del usuario
   */
  async getPaymentHistory(req, res) {
    try {
      const userId = req.user.id;
      const payments = await paymentService.getUserPayments(userId);

      res.json({
        success: true,
        message: 'Historial de pagos obtenido exitosamente',
        data: payments
      });

    } catch (error) {
      console.error('Error obteniendo historial de pagos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obtiene el estado de un pago específico
   */
  async getPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentStatus(paymentId);

      res.json({
        success: true,
        message: 'Estado del pago obtenido exitosamente',
        data: payment
      });

    } catch (error) {
      console.error('Error obteniendo estado del pago:', error);
      
      if (error.message === 'Pago no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Cancela un pago pendiente
   */
  async cancelPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const result = await paymentService.cancelPayment(paymentId);

      res.json({
        success: true,
        message: result.message,
        data: result.payment
      });

    } catch (error) {
      console.error('Error cancelando pago:', error);
      
      if (error.message.includes('no encontrado') || error.message.includes('no puede ser cancelado')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new PaymentController();