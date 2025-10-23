/**
 * Índice de Rutas
 * Centraliza y organiza todas las rutas de la aplicación
 */

const express = require('express');
const router = express.Router();

// Importar rutas específicas
const taxRegimeRoutes = require('./taxRegimeRoutes');
const chatRoutes = require('./chatRoutes');
const authRoutes = require('./authRoutes');
const paymentRoutes = require('./paymentRoutes');

/**
 * @route GET /
 * @desc Endpoint raíz de la API
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Asistente AI-MYPE Peru funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      taxRegime: '/tax-regime',
      chat: '/chat',
      health: '/health',
      payments: '/payments'
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /health
 * @desc Endpoint de salud de la API
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Registrar rutas
router.use('/auth', authRoutes);
router.use('/tax-regime', taxRegimeRoutes);
router.use('/chat', chatRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;