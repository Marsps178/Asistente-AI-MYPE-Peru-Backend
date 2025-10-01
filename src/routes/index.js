/**
 * Índice de Rutas
 * Centraliza y organiza todas las rutas de la aplicación
 */

const express = require('express');
const router = express.Router();

// Importar rutas específicas
const taxRegimeRoutes = require('./taxRegimeRoutes');
const chatRoutes = require('./chatRoutes');

/**
 * @route GET /api/
 * @desc Endpoint raíz de la API
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Asistente AI-MYPE Peru funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      taxRegime: '/api/tax-regime',
      chat: '/api/chat',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /api/health
 * @desc Endpoint de salud general de la API
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Registrar rutas específicas
router.use('/tax-regime', taxRegimeRoutes);
router.use('/chat', chatRoutes);

module.exports = router;