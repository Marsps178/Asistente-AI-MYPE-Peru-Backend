/**
 * Rutas de Chat con IA
 * Define los endpoints relacionados con el chat inteligente
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validators');

/**
 * @route POST /api/chat/message
 * @desc Envía un mensaje al asistente de IA y obtiene una respuesta
 * @access Public
 */
router.post('/message', validateChatMessage, chatController.sendMessage);

/**
 * @route GET /api/chat/assistant-info
 * @desc Obtiene información sobre el asistente de IA
 * @access Public
 */
router.get('/assistant-info', chatController.getAssistantInfo);

/**
 * @route GET /api/chat/health
 * @desc Endpoint de salud para verificar el servicio de chat
 * @access Public
 */
router.get('/health', chatController.healthCheck);

module.exports = router;