/**
 * Rutas de Autenticación
 * Define endpoints para registro, login y gestión de usuarios
 */

const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email válido es requerido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
];

/**
 * Validaciones para login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email válido es requerido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña es requerida')
];

/**
 * @route POST /auth/register
 * @desc Registrar nuevo usuario
 * @access Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route POST /auth/login
 * @desc Iniciar sesión
 * @access Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route POST /auth/logout
 * @desc Cerrar sesión
 * @access Private
 */
router.post('/logout', authController.logout);

/**
 * @route GET /auth/profile
 * @desc Obtener perfil del usuario
 * @access Private
 */
router.get('/profile', requireAuth, authController.getProfile);

/**
 * @route GET /auth/verify
 * @desc Verificar estado de autenticación
 * @access Public
 */
router.get('/verify', authController.verifyAuth);

/**
 * @route GET /auth/status
 * @desc Obtener información del sistema de autenticación
 * @access Public
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      freeQueriesLimit: parseInt(process.env.FREE_QUERIES_LIMIT || 5),
      paymentAmount: parseFloat(process.env.PAYMENT_AMOUNT || 15.00),
      currency: process.env.PAYMENT_CURRENCY || 'PEN',
      features: {
        registration: true,
        freeQueries: true,
        premiumAccess: true
      }
    }
  });
});

module.exports = router;