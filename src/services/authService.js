/**
 * Servicio de Autenticación
 * Maneja registro, login, validación de tokens y gestión de sesiones
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../config/config');

const prisma = new PrismaClient();

class AuthService {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Usuario creado y token
   */
  async register(userData) {
    const { email, password, name } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('El usuario ya existe con este email');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        freeQueriesUsed: 0,
        isPremium: false
      },
      select: {
        id: true,
        email: true,
        name: true,
        freeQueriesUsed: true,
        isPremium: true,
        createdAt: true
      }
    });

    // Generar token y sesión
    const { token, session } = await this.createSession(user.id);

    return {
      user,
      token,
      session
    };
  }

  /**
   * Inicia sesión de usuario
   * @param {Object} credentials - Credenciales de login
   * @returns {Object} Usuario y token
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        freeQueriesUsed: true,
        isPremium: true,
        premiumExpiresAt: true
      }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si el premium ha expirado
    if (user.isPremium && user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isPremium: false,
          premiumExpiresAt: null
        }
      });
      user.isPremium = false;
      user.premiumExpiresAt = null;
    }

    // Generar token y sesión
    const { token, session } = await this.createSession(user.id);

    // Remover password del objeto user
    delete user.password;

    return {
      user,
      token,
      session
    };
  }

  /**
   * Crea una nueva sesión para el usuario
   * @param {string} userId - ID del usuario
   * @returns {Object} Token y datos de sesión
   */
  async createSession(userId) {
    // Generar token JWT
    const token = jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Calcular fecha de expiración (24 horas por defecto)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Crear sesión en la base de datos
    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    return { token, session };
  }

  /**
   * Valida un token JWT y verifica la sesión
   * @param {string} token - Token JWT
   * @returns {Object} Usuario y datos de sesión
   */
  async validateToken(token) {
    try {
      // Verificar token JWT
      const decoded = jwt.verify(token, config.jwt.secret);

      // Buscar sesión activa
      const session = await prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              freeQueriesUsed: true,
              isPremium: true,
              premiumExpiresAt: true
            }
          }
        }
      });

      if (!session || new Date() > session.expiresAt) {
        throw new Error('Sesión expirada');
      }

      // Verificar si el premium ha expirado
      if (session.user.isPremium && session.user.premiumExpiresAt && new Date() > session.user.premiumExpiresAt) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { 
            isPremium: false,
            premiumExpiresAt: null
          }
        });
        session.user.isPremium = false;
        session.user.premiumExpiresAt = null;
      }

      return {
        user: session.user,
        session
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Cierra sesión del usuario
   * @param {string} token - Token de la sesión
   */
  async logout(token) {
    await prisma.session.delete({
      where: { token }
    });
  }

  /**
   * Verifica si el usuario puede hacer consultas gratuitas
   * @param {Object} user - Usuario
   * @returns {boolean} Si puede hacer consultas
   */
  canMakeFreeQuery(user) {
    if (user.isPremium) return true;
    return user.freeQueriesUsed < parseInt(process.env.FREE_QUERIES_LIMIT || 5);
  }

  /**
   * Incrementa el contador de consultas gratuitas
   * @param {string} userId - ID del usuario
   */
  async incrementFreeQueries(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        freeQueriesUsed: {
          increment: 1
        }
      }
    });
  }

  /**
   * Activa premium para un usuario
   * @param {string} userId - ID del usuario
   * @param {number} durationDays - Duración en días
   */
  async activatePremium(userId, durationDays = 30) {
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + durationDays);

    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumExpiresAt
      }
    });
  }
}

module.exports = new AuthService();