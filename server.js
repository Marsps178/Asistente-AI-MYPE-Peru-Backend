/**
 * Servidor del Asistente AI-MYPE Peru
 * Backend para el asistente inteligente de micro y pequeñas empresas
 * Versión profesional con arquitectura modular
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./src/config/config');

// Importar middleware
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const requestLogger = require('./src/middleware/requestLogger');

// Importar rutas
const apiRoutes = require('./src/routes');

const app = express();

// Middleware de logging
app.use(requestLogger);

// Configuración de CORS
app.use(cors(config.cors));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de seguridad básica
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Asistente AI-MYPE Peru funcionando correctamente',
    version: '1.0.0',
    environment: config.server.env,
    endpoints: {
      auth: '/auth',
      taxRegime: '/tax-regime',
      chat: '/chat',
      payments: '/payments',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Registrar rutas de la API (sin prefijo /api)
app.use('/', apiRoutes);

// Middleware de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const server = app.listen(config.server.port, () => {
  console.log(`🚀 Servidor del Asistente AI-MYPE Peru ejecutándose en http://localhost:${config.server.port}`);
  console.log(`📊 Ambiente: ${config.server.env}`);
  console.log(`🤖 IA configurada: ${config.googleAI.apiKey ? '✅' : '❌'}`);
  console.log(`🔧 Modo debug: ${config.server.debug ? '✅' : '❌'}`);
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

module.exports = app;