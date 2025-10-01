/**
 * Middleware de Manejo de Errores
 * Centraliza el manejo de errores de la aplicación
 */

const config = require('../config/config');

/**
 * Middleware para manejo centralizado de errores
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por errorHandler:', {
    message: err.message,
    stack: config.server.env === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición',
      timestamp: new Date().toISOString()
    });
  }

  // Error de API de Google
  if (err.message && err.message.includes('API')) {
    return res.status(503).json({
      success: false,
      message: 'Servicio de IA temporalmente no disponible',
      timestamp: new Date().toISOString()
    });
  }

  // Error genérico del servidor
  res.status(err.status || 500).json({
    success: false,
    message: config.server.env === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    timestamp: new Date().toISOString(),
    ...(config.server.env === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};