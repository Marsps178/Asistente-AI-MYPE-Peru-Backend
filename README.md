# 🚀 Asistente AI-MYPE Peru - Backend

Backend profesional para el asistente inteligente de micro y pequeñas empresas (MYPE) en Perú. Proporciona servicios de cálculo de regímenes tributarios y chat con inteligencia artificial especializada en asesoría empresarial.

## 📋 Características

- **Cálculo de Regímenes Tributarios**: Determina automáticamente el régimen tributario más conveniente
- **Chat con IA**: Asistente inteligente especializado en MYPE usando Google Gemini AI
- **Arquitectura Modular**: Estructura profesional con separación de responsabilidades
- **Validación de Datos**: Validación robusta con express-validator
- **Manejo de Errores**: Sistema centralizado de manejo de errores
- **Logging**: Sistema de logs para desarrollo y producción
- **Configuración Centralizada**: Gestión de configuración mediante variables de entorno

## 🏗️ Arquitectura del Proyecto

```
backend-asistente-mype/
├── src/
│   ├── config/
│   │   └── config.js              # Configuración centralizada
│   ├── controllers/
│   │   ├── chatController.js      # Controlador del chat con IA
│   │   └── taxRegimeController.js # Controlador de regímenes tributarios
│   ├── middleware/
│   │   ├── errorHandler.js        # Manejo centralizado de errores
│   │   ├── requestLogger.js       # Logging de requests
│   │   └── validators.js          # Validaciones de entrada
│   ├── routes/
│   │   ├── index.js              # Rutas principales de la API
│   │   ├── chatRoutes.js         # Rutas del chat
│   │   └── taxRegimeRoutes.js    # Rutas de regímenes tributarios
│   ├── services/
│   │   ├── aiService.js          # Servicio de Google Gemini AI
│   │   └── taxRegimeService.js   # Lógica de cálculo tributario
│   └── utils/                    # Utilidades generales
├── .env                          # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts
├── server.js                    # Punto de entrada de la aplicación
└── README.md                    # Documentación del proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- pnpm (recomendado) o npm
- Clave API de Google Gemini AI

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd backend-asistente-mype
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   # Configuración del servidor
   PORT=3001
   NODE_ENV=development
   
   # Google Gemini AI
   GOOGLE_API_KEY=tu_clave_api_aqui
   
   # CORS (opcional)
   FRONTEND_URL=http://localhost:3000
   
   # JWT (para futuras implementaciones)
   JWT_SECRET=tu_jwt_secret_aqui
   
   # Base de datos (para futuras implementaciones)
   DATABASE_URL=tu_url_de_base_de_datos
   ```

4. **Iniciar el servidor**
   ```bash
   # Modo desarrollo
   pnpm dev
   
   # Modo producción
   pnpm start
   ```

## 📚 API Endpoints

### Información General

- **Base URL**: `http://localhost:3001/api`
- **Formato de respuesta**: JSON
- **Autenticación**: No requerida (por ahora)

### Endpoints Disponibles

#### 🏠 Información General
```http
GET /
GET /api/
GET /api/health
```

#### 💰 Regímenes Tributarios
```http
POST /api/tax-regime/calculate
GET /api/tax-regime/regimes
GET /api/tax-regime/health
```

#### 🤖 Chat con IA
```http
POST /api/chat/message
GET /api/chat/assistant-info
GET /api/chat/health
```

### Ejemplos de Uso

#### Calcular Régimen Tributario
```bash
curl -X POST http://localhost:3001/api/tax-regime/calculate \
  -H "Content-Type: application/json" \
  -d '{"monthlyIncome": 5000}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "monthlyIncome": 5000,
    "recommendation": {
      "regime": "Nuevo RUS",
      "description": "Nuevo Régimen Único Simplificado",
      "benefits": [...],
      "requirements": [...],
      "monthlyTax": 50
    },
    "calculatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Chat con IA
```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Qué beneficios tiene el Nuevo RUS?"}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "message": "El Nuevo RUS ofrece varios beneficios...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🛠️ Scripts Disponibles

```bash
# Iniciar servidor en modo producción
pnpm start

# Iniciar servidor en modo desarrollo (con nodemon)
pnpm dev

# Ejecutar tests (cuando estén implementados)
pnpm test

# Linting del código (cuando esté configurado)
pnpm lint
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `PORT` | Puerto del servidor | No | 3001 |
| `NODE_ENV` | Entorno de ejecución | No | development |
| `GOOGLE_API_KEY` | Clave API de Google Gemini | Sí | - |
| `FRONTEND_URL` | URL del frontend para CORS | No | http://localhost:3000 |
| `JWT_SECRET` | Secreto para JWT | No | - |
| `DATABASE_URL` | URL de la base de datos | No | - |

### Regímenes Tributarios Soportados

1. **Nuevo RUS**: Hasta S/ 96,000 anuales
2. **RER**: Hasta S/ 525,000 anuales
3. **MYPE Tributario (RMT)**: Hasta 1,700 UIT anuales (UIT 2025 = S/ 5,350 → S/ 9,095,000)
4. **Régimen General**: Sin límites

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Generar reporte de cobertura
pnpm test:coverage
```

## 📝 Logging

El sistema incluye logging automático de:
- Requests HTTP (método, URL, IP, user-agent)
- Respuestas (status code, tiempo de respuesta)
- Errores del sistema
- Información de debug (solo en desarrollo)

## 🔒 Seguridad

- Validación de entrada con express-validator
- Sanitización de datos
- Headers de seguridad básicos
- Manejo seguro de errores (no exposición de información sensible)

## 🚀 Despliegue

### Desarrollo Local
```bash
pnpm dev
```

### Producción
```bash
NODE_ENV=production pnpm start
```

### Docker (futuro)
```bash
docker build -t asistente-mype-backend .
docker run -p 3001:3001 asistente-mype-backend
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- Google Gemini AI por el servicio de inteligencia artificial
- Comunidad de desarrolladores MYPE Peru
- Express.js y el ecosistema de Node.js

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: soporte@asistente-mype.pe
- 🐛 Issues: [GitHub Issues](https://github.com/tuusuario/backend-asistente-mype/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/tuusuario/backend-asistente-mype/wiki)

---

**¡Hecho con ❤️ para emprendedores peruanos!** 🇵🇪