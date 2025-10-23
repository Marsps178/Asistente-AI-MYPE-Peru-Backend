/**
 * Rutas de Pagos
 * Define los endpoints para el sistema de pagos
 */

const express = require('express');
const { body, param } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route POST /api/payments/create-order
 * @desc Crear una nueva orden de pago
 * @access Private
 */
router.post('/create-order', 
  requireAuth,
  [
    body('amount')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('El monto debe ser mayor a 0'),
    body('currency')
      .optional()
      .isIn(['PEN', 'USD'])
      .withMessage('La moneda debe ser PEN o USD')
  ],
  paymentController.createPaymentOrder
);

/**
 * @route POST /api/payments/process
 * @desc Procesar un pago (simulado)
 * @access Public
 */
router.post('/process',
  [
    body('orderId')
      .notEmpty()
      .withMessage('El ID de la orden es requerido'),
    body('paymentMethod')
      .optional()
      .isIn(['card', 'bank_transfer', 'wallet'])
      .withMessage('Método de pago inválido')
  ],
  paymentController.processPayment
);

/**
 * @route POST /api/payments/webhook
 * @desc Webhook para notificaciones de pago
 * @access Public (pero debe validar firma en producción)
 */
router.post('/webhook', paymentController.paymentWebhook);

/**
 * @route GET /api/payments/history
 * @desc Obtener historial de pagos del usuario
 * @access Private
 */
router.get('/history', requireAuth, paymentController.getPaymentHistory);

/**
 * @route GET /api/payments/:paymentId/status
 * @desc Obtener estado de un pago específico
 * @access Public
 */
router.get('/:paymentId/status',
  [
    param('paymentId')
      .notEmpty()
      .withMessage('El ID del pago es requerido')
  ],
  paymentController.getPaymentStatus
);

/**
 * @route PUT /api/payments/:paymentId/cancel
 * @desc Cancelar un pago pendiente
 * @access Public
 */
router.put('/:paymentId/cancel',
  [
    param('paymentId')
      .notEmpty()
      .withMessage('El ID del pago es requerido')
  ],
  paymentController.cancelPayment
);

module.exports = router;