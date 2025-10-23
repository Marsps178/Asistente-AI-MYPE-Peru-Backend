/**
 * Rutas del Chat con IA
 * Define endpoints para interactuar con el asistente inteligente
 */

const express = require('express');
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Validaciones para el mensaje del chat
 */
const messageValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('El mensaje debe tener entre 1 y 2000 caracteres')
    .notEmpty()
    .withMessage('El mensaje es requerido')
];

/**
 * @route POST /api/chat/message
 * @desc Enviar mensaje al asistente IA
 * @access Public (con autenticación opcional)
 */
router.post('/message', optionalAuth, messageValidation, chatController.sendMessage);

/**
 * @route GET /api/chat/history
 * @desc Obtener historial de chat del usuario
 * @access Private
 */
router.get('/history', requireAuth, chatController.getChatHistory);

/**
 * @route GET /api/chat/info
 * @desc Obtener información del asistente
 * @access Public
 */
router.get('/info', chatController.getAssistantInfo);

/**
 * @route GET /api/chat/health
 * @desc Verificar estado del servicio de chat
 * @access Public
 */
router.get('/health', chatController.healthCheck);

module.exports = router;