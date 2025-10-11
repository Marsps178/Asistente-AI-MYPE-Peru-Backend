/**
 * Configuración centralizada del proyecto
 * Asistente AI-MYPE Peru
 */

require('dotenv').config();

// Valor de la UIT vigente (2025)
const UIT_2025 = 5350;

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
    model: 'gemini-2.0-flash' // Modelo Gemini 2.0 Flash
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
    },
    // Régimen MYPE Tributario (RMT) basado en UIT 2025
    rmt: {
      // Límite de ingresos netos anuales: 1,700 UIT
      maxAnnualIncome: 1700 * UIT_2025, // 1,700 UIT = S/ 9,095,000
      // Umbral para el 1% mensual: hasta 300 UIT anuales
      thresholds: {
        lowAnnualIncome: 300 * UIT_2025 // 300 UIT = S/ 1,605,000
      },
      // Tasas mensuales de pago a cuenta de Renta
      rates: {
        monthlyLow: 0.01, // 1% si <= 300 UIT
        monthlyHigh: 0.015 // 1.5% si > 300 UIT (o coeficiente, el mayor)
      },
      // Tasas de regularización anual (sobre utilidad neta)
      annualRates: {
        lowUIT: 15, // hasta 15 UIT
        lowRate: 0.10, // 10%
        highRate: 0.295 // 29.5%
      }
    }
  }
  ,
  // Parámetros económicos generales
  uit: {
    value: UIT_2025
  },
  igv: {
    rate: 0.18
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