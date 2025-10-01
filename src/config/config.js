/**
 * Configuración centralizada del proyecto
 * Asistente AI-MYPE Peru
 */

require('dotenv').config();

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost'
  },

  // Configuración de Google AI
  googleAI: {
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-1.5-pro'
  },

  // Configuración de base de datos (para futuras implementaciones)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'asistente_mype',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || ''
  },

  // Configuración de JWT (para futuras implementaciones)
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  // Límites de régimen tributario MYPE
  taxRegimes: {
    nuevoRUS: {
      maxIncome: 8000,
      payments: {
        low: { threshold: 5000, amount: 20 },
        high: { threshold: 8000, amount: 50 }
      }
    },
    rer: {
      maxAnnualIncome: 525000,
      taxRate: 0.015 // 1.5%
    }
  }
};

// Validación de configuración crítica
const validateConfig = () => {
  const requiredEnvVars = ['GOOGLE_API_KEY'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Variable de entorno requerida no encontrada: ${envVar}`);
    }
  }
};

// Validar configuración al cargar el módulo
if (config.server.env === 'production') {
  validateConfig();
}

module.exports = config;