/**
 * Servicio de Pagos
 * Maneja transacciones, verificación de pagos y activación de premium
 */

const { PrismaClient } = require('@prisma/client');
const authService = require('./authService');

const prisma = new PrismaClient();

class PaymentService {
  /**
   * Crea una nueva orden de pago
   * @param {string} userId - ID del usuario
   * @param {number} amount - Monto del pago
   * @param {string} currency - Moneda del pago
   * @returns {Object} Orden de pago creada
   */
  async createPaymentOrder(userId, amount = 15.00, currency = 'PEN') {
    try {
      // Verificar que el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Crear orden de pago en la base de datos
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount,
          currency,
          status: 'PENDING'
        }
      });

      // Generar datos para la pasarela de pago
      const paymentData = {
        orderId: payment.id,
        amount: amount,
        currency: currency,
        description: `Acceso Premium - Asistente AI-MYPE Peru`,
        customerEmail: user.email,
        customerName: user.name || user.email,
        // URLs de retorno (ajustar según tu frontend)
        successUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?orderId=${payment.id}`,
        cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?orderId=${payment.id}`,
        notifyUrl: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/webhook`
      };

      return {
        payment,
        paymentData
      };

    } catch (error) {
      console.error('Error creando orden de pago:', error);
      throw error;
    }
  }

  /**
   * Procesa el pago con una pasarela específica (simulado)
   * En producción, aquí integrarías con Culqi, Mercado Pago, etc.
   * @param {Object} paymentData - Datos del pago
   * @returns {Object} Resultado del procesamiento
   */
  async processPayment(paymentData) {
    try {
      console.log('🔄 Procesando pago:', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod
      });

      // SIMULACIÓN - En producción reemplazar con integración real
      // Ejemplo para Culqi, Mercado Pago, etc.
      
      // Validar datos requeridos
      if (!paymentData.orderId || !paymentData.amount) {
        console.error('❌ Datos de pago incompletos:', paymentData);
        return {
          success: false,
          status: 'FAILED',
          message: 'Datos de pago incompletos'
        };
      }

      // En desarrollo, siempre exitoso. En producción usar integración real
      const isDevelopment = process.env.NODE_ENV !== 'production';
      const isSuccessful = isDevelopment ? true : Math.random() > 0.2;
      
      if (isSuccessful) {
        // Generar ID de transacción simulado
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('✅ Pago procesado exitosamente:', {
          transactionId,
          orderId: paymentData.orderId
        });
        
        return {
          success: true,
          transactionId,
          status: 'COMPLETED',
          message: 'Pago procesado exitosamente'
        };
      } else {
        console.log('❌ Simulación de fallo de pago para:', paymentData.orderId);
        return {
          success: false,
          status: 'FAILED',
          message: 'Error al procesar el pago - Simulación de fallo'
        };
      }

    } catch (error) {
      console.error('💥 Error procesando pago:', error);
      return {
        success: false,
        status: 'FAILED',
        message: 'Error interno al procesar el pago'
      };
    }
  }

  /**
   * Confirma un pago y activa el premium
   * @param {string} paymentId - ID del pago
   * @param {string} transactionId - ID de la transacción
   * @returns {Object} Resultado de la confirmación
   */
  async confirmPayment(paymentId, transactionId) {
    try {
      // Buscar el pago
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true }
      });

      if (!payment) {
        throw new Error('Pago no encontrado');
      }

      if (payment.status !== 'PENDING') {
        throw new Error('El pago ya fue procesado');
      }

      // Actualizar el pago como completado
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          transactionId
        }
      });

      // Activar premium para el usuario (30 días)
      await authService.activatePremium(payment.userId, 30);

      return {
        success: true,
        payment: updatedPayment,
        message: 'Pago confirmado y premium activado'
      };

    } catch (error) {
      console.error('Error confirmando pago:', error);
      throw error;
    }
  }

  /**
   * Cancela un pago
   * @param {string} paymentId - ID del pago
   * @returns {Object} Resultado de la cancelación
   */
  async cancelPayment(paymentId) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment) {
        throw new Error('Pago no encontrado');
      }

      if (payment.status !== 'PENDING') {
        throw new Error('El pago no puede ser cancelado');
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'CANCELLED' }
      });

      return {
        success: true,
        payment: updatedPayment,
        message: 'Pago cancelado'
      };

    } catch (error) {
      console.error('Error cancelando pago:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de pagos de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Array} Lista de pagos
   */
  async getUserPayments(userId) {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          transactionId: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return payments;

    } catch (error) {
      console.error('Error obteniendo pagos del usuario:', error);
      throw error;
    }
  }

  /**
   * Verifica el estado de un pago
   * @param {string} paymentId - ID del pago
   * @returns {Object} Estado del pago
   */
  async getPaymentStatus(paymentId) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          transactionId: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!payment) {
        throw new Error('Pago no encontrado');
      }

      return payment;

    } catch (error) {
      console.error('Error obteniendo estado del pago:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();