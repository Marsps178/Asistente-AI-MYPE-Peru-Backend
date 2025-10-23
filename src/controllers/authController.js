/**
 * Controlador de Autenticación
 * Maneja las rutas de registro, login y gestión de usuarios
 */

const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  /**
   * Registra un nuevo usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async register(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email, password, name } = req.body;

      // Registrar usuario
      const result = await authService.register({
        email,
        password,
        name
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      
      if (error.message === 'El usuario ya existe con este email') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Inicia sesión de usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async login(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Iniciar sesión
      const result = await authService.login({
        email,
        password
      });

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Cierra sesión del usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      await authService.logout(token);

      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });

    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfile(req, res) {
    try {
      const user = req.user; // Viene del middleware de autenticación

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            freeQueriesUsed: user.freeQueriesUsed,
            freeQueriesRemaining: Math.max(0, parseInt(process.env.FREE_QUERIES_LIMIT || 5) - user.freeQueriesUsed),
            isPremium: user.isPremium,
            premiumExpiresAt: user.premiumExpiresAt
          }
        }
      });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Verifica el estado de autenticación
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async verifyAuth(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado',
          authenticated: false
        });
      }

      const result = await authService.validateToken(token);

      res.json({
        success: true,
        authenticated: true,
        data: {
          user: result.user
        }
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
        authenticated: false
      });
    }
  }
}

module.exports = new AuthController();