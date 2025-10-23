/**
 * Middleware de Autenticación
 * Verifica tokens JWT y protege rutas
 */

const authService = require('../services/authService');

/**
 * Middleware para verificar autenticación requerida
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
        code: 'AUTH_REQUIRED'
      });
    }

    const result = await authService.validateToken(token);
    
    // Agregar usuario y sesión al request
    req.user = result.user;
    req.session = result.session;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Middleware para verificar autenticación opcional
 * Si hay token, lo valida, si no, continúa sin usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const result = await authService.validateToken(token);
        req.user = result.user;
        req.session = result.session;
      } catch (error) {
        // Si el token es inválido, continúa sin usuario
        req.user = null;
        req.session = null;
      }
    } else {
      req.user = null;
      req.session = null;
    }
    
    next();
  } catch (error) {
    req.user = null;
    req.session = null;
    next();
  }
};

/**
 * Middleware para verificar si el usuario puede hacer consultas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const checkQueryLimits = async (req, res, next) => {
  try {
    // Si no hay usuario autenticado, denegar acceso
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Debes registrarte para usar el asistente',
        code: 'REGISTRATION_REQUIRED',
        data: {
          freeQueriesLimit: parseInt(process.env.FREE_QUERIES_LIMIT || 5),
          requiresRegistration: true
        }
      });
    }

    // Si el usuario es premium, permitir acceso
    if (req.user.isPremium) {
      return next();
    }

    // Verificar límite de consultas gratuitas
    const freeQueriesLimit = parseInt(process.env.FREE_QUERIES_LIMIT || 5);
    
    if (req.user.freeQueriesUsed >= freeQueriesLimit) {
      return res.status(403).json({
        success: false,
        message: 'Has alcanzado el límite de consultas gratuitas',
        code: 'QUERY_LIMIT_EXCEEDED',
        data: {
          freeQueriesUsed: req.user.freeQueriesUsed,
          freeQueriesLimit,
          requiresPayment: true,
          paymentAmount: parseFloat(process.env.PAYMENT_AMOUNT || 15.00),
          currency: process.env.PAYMENT_CURRENCY || 'PEN'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error verificando límites:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para verificar que el usuario sea premium
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isPremium) {
    return res.status(403).json({
      success: false,
      message: 'Acceso premium requerido',
      code: 'PREMIUM_REQUIRED',
      data: {
        paymentAmount: parseFloat(process.env.PAYMENT_AMOUNT || 15.00),
        currency: process.env.PAYMENT_CURRENCY || 'PEN'
      }
    });
  }

  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  checkQueryLimits,
  requirePremium
};