/**
 * Validadores de Entrada
 * Define las reglas de validación para los endpoints
 */

const { body } = require('express-validator');

/**
 * Validaciones para el cálculo de régimen tributario
 */
const validateTaxRegimeCalculation = [
  body('monthlyIncome')
    .notEmpty()
    .withMessage('El ingreso mensual es requerido')
    .isNumeric()
    .withMessage('El ingreso mensual debe ser un número')
    .isFloat({ min: 0.01 })
    .withMessage('El ingreso mensual debe ser mayor a 0')
    .isFloat({ max: 10000000 })
    .withMessage('El ingreso mensual no puede exceder S/ 10,000,000')
    .custom((value) => {
      // Validar que tenga máximo 2 decimales
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('El ingreso mensual no puede tener más de 2 decimales');
      }
      return true;
    })
];

/**
 * Validaciones para el chat con IA
 */
const validateChatMessage = [
  body('message')
    .notEmpty()
    .withMessage('El mensaje es requerido')
    .isString()
    .withMessage('El mensaje debe ser texto')
    .isLength({ min: 1, max: 1000 })
    .withMessage('El mensaje debe tener entre 1 y 1000 caracteres')
    .trim()
    .escape() // Escapar caracteres HTML para seguridad
];

/**
 * Validaciones comunes para parámetros de ID
 */
const validateId = [
  body('id')
    .optional()
    .isUUID()
    .withMessage('El ID debe ser un UUID válido')
];

/**
 * Validaciones para parámetros de consulta comunes
 */
const validateQueryParams = {
  page: body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  
  limit: body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
};

/**
 * Sanitizador de entrada para prevenir inyecciones
 */
const sanitizeInput = [
  body('*').trim().escape()
];

module.exports = {
  validateTaxRegimeCalculation,
  validateChatMessage,
  validateId,
  validateQueryParams,
  sanitizeInput
};