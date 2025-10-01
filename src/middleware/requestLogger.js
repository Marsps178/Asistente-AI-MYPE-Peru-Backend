/**
 * Middleware de Logging de Peticiones
 * Registra información de las peticiones HTTP
 */

const config = require('../config/config');

/**
 * Middleware para logging de peticiones HTTP
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Capturar información de la petición
  const requestInfo = {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };

  // Solo en desarrollo, mostrar el body (sin datos sensibles)
  if (config.server.env === 'development' && req.body) {
    const sanitizedBody = { ...req.body };
    // Ocultar campos sensibles
    if (sanitizedBody.password) sanitizedBody.password = '[HIDDEN]';
    if (sanitizedBody.apiKey) sanitizedBody.apiKey = '[HIDDEN]';
    requestInfo.body = sanitizedBody;
  }

  console.log('📥 Petición entrante:', requestInfo);

  // Interceptar la respuesta para logging
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('📤 Respuesta enviada:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware simplificado para producción
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const simpleLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

module.exports = config.server.env === 'development' ? requestLogger : simpleLogger;