# 📖 Documentación de API - Asistente AI-MYPE Peru

## 🌐 Información General

**Base URL**: `http://localhost:3001/api`  
**Formato**: JSON  
**Autenticación**: JWT (JSON Web Tokens) - Incluye el token en el header: `Authorization: Bearer <token>`  
**CORS**: Habilitado para `http://localhost:3001`

## Códigos de Estado HTTP
- `200` - OK: Solicitud exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Datos de entrada inválidos
- `401` - Unauthorized: No autorizado o token inválido
- `403` - Forbidden: Acceso denegado
- `404` - Not Found: Recurso no encontrado
- `409` - Conflict: Conflicto (ej: usuario ya existe)
- `500` - Internal Server Error: Error interno del servidor

## 📋 Endpoints Disponibles

### 🔐 Rutas de Autenticación (`/api/auth`)

#### POST `/api/auth/register`
**Descripción**: Registra un nuevo usuario en el sistema  
**Acceso**: Público  
**Método**: POST

**Body (JSON)**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123",
  "name": "Nombre Usuario"
}
```

**Validaciones**:
- `email`: Email válido requerido
- `password`: Mínimo 6 caracteres, debe contener mayúscula, minúscula y número
- `name`: Entre 2 y 50 caracteres

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@ejemplo.com",
      "name": "Nombre Usuario",
      "isPremium": false,
      "freeQueriesUsed": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Errores Posibles**:
- `400`: Datos de entrada inválidos
- `409`: El usuario ya existe con este email
- `500`: Error interno del servidor

---

#### POST `/api/auth/login`
**Descripción**: Inicia sesión de usuario  
**Acceso**: Público  
**Método**: POST

**Body (JSON)**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```

**Validaciones**:
- `email`: Email válido requerido
- `password`: Contraseña requerida

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@ejemplo.com",
      "name": "Nombre Usuario",
      "isPremium": false,
      "freeQueriesUsed": 2
    },
    "token": "jwt_token_here"
  }
}
```

**Errores Posibles**:
- `400`: Datos de entrada inválidos
- `401`: Credenciales inválidas
- `500`: Error interno del servidor

---

#### GET `/api/auth/profile`
**Descripción**: Obtiene el perfil del usuario autenticado  
**Acceso**: Privado (requiere token)  
**Método**: GET

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@ejemplo.com",
      "name": "Nombre Usuario",
      "isPremium": false,
      "freeQueriesUsed": 2,
      "freeQueriesRemaining": 3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errores Posibles**:
- `401`: Token inválido o expirado
- `404`: Usuario no encontrado
- `500`: Error interno del servidor

---

#### POST `/api/auth/logout`
**Descripción**: Cierra sesión del usuario  
**Acceso**: Público  
**Método**: POST

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

#### GET `/api/auth/verify`
**Descripción**: Verifica si un token JWT es válido  
**Acceso**: Público  
**Método**: GET

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "userId": "user_id",
    "email": "usuario@ejemplo.com"
  }
}
```

**Errores Posibles**:
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

---

#### GET `/api/auth/status`
**Descripción**: Verifica el estado del servicio de autenticación  
**Acceso**: Público  
**Método**: GET

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Servicio de autenticación funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "auth"
}
```

## 💳 Rutas de Pagos (`/api/payments`)

### POST `/api/payments/create-order`
**Descripción**: Crea una nueva orden de pago para acceso premium  
**Acceso**: Privado (requiere token)  
**Método**: POST

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body (JSON)** - Opcional:
```json
{
  "amount": 15.00,
  "currency": "PEN"
}
```

**Validaciones**:
- `amount`: Opcional, debe ser mayor a 0.01 (por defecto: 15.00)
- `currency`: Opcional, debe ser "PEN" o "USD" (por defecto: "PEN")

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Orden de pago creada exitosamente",
  "data": {
    "orderId": "payment_id_123",
    "amount": 15.00,
    "currency": "PEN",
    "paymentData": {
      "paymentUrl": "https://payment-gateway.com/pay/123",
      "expiresAt": "2024-01-01T01:00:00.000Z"
    }
  }
}
```

**Errores Posibles**:
- `400`: Ya tienes acceso premium activo / Datos inválidos
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

---

### POST `/api/payments/process`
**Descripción**: Procesa un pago (simulado para desarrollo)  
**Acceso**: Público  
**Método**: POST

**Body (JSON)**:
```json
{
  "orderId": "payment_id_123",
  "paymentMethod": "card"
}
```

**Validaciones**:
- `orderId`: ID de la orden requerido
- `paymentMethod`: Opcional, debe ser "card", "bank_transfer" o "wallet"

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Pago procesado exitosamente",
  "data": {
    "paymentId": "payment_id_123",
    "status": "COMPLETED",
    "amount": 15.00,
    "currency": "PEN",
    "transactionId": "txn_456789",
    "processedAt": "2024-01-01T00:30:00.000Z"
  }
}
```

**Errores Posibles**:
- `400`: Datos inválidos / Orden ya procesada
- `404`: Orden de pago no encontrada
- `500`: Error interno del servidor

---

### POST `/api/payments/webhook`
**Descripción**: Webhook para recibir notificaciones del gateway de pagos  
**Acceso**: Público (para gateway de pagos)  
**Método**: POST

**Body**: Depende del proveedor de pagos

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Webhook procesado correctamente"
}
```

---

### GET `/api/payments/history`
**Descripción**: Obtiene el historial de pagos del usuario  
**Acceso**: Privado (requiere token)  
**Método**: GET

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters** - Opcionales:
- `page`: Número de página (por defecto: 1)
- `limit`: Elementos por página (por defecto: 10)

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment_id_123",
        "amount": 15.00,
        "currency": "PEN",
        "status": "COMPLETED",
        "paymentMethod": "card",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "processedAt": "2024-01-01T00:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

**Errores Posibles**:
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

---

### GET `/api/payments/:paymentId/status`
**Descripción**: Obtiene el estado de un pago específico  
**Acceso**: Público  
**Método**: GET

**Parámetros de URL**:
- `paymentId`: ID del pago (requerido)

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "payment_id_123",
      "status": "COMPLETED",
      "amount": 15.00,
      "currency": "PEN",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "processedAt": "2024-01-01T00:30:00.000Z"
    }
  }
}
```

**Estados Posibles**:
- `PENDING`: Pago pendiente
- `COMPLETED`: Pago completado
- `FAILED`: Pago fallido
- `CANCELLED`: Pago cancelado

**Errores Posibles**:
- `400`: ID de pago inválido
- `404`: Pago no encontrado
- `500`: Error interno del servidor

---

### PUT `/api/payments/:paymentId/cancel`
**Descripción**: Cancela un pago pendiente  
**Acceso**: Público  
**Método**: PUT

**Parámetros de URL**:
- `paymentId`: ID del pago (requerido)

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Pago cancelado exitosamente",
  "data": {
    "paymentId": "payment_id_123",
    "status": "CANCELLED",
    "cancelledAt": "2024-01-01T00:45:00.000Z"
  }
}
```

**Errores Posibles**:
- `400`: ID de pago inválido / Pago no se puede cancelar
- `404`: Pago no encontrado
- `500`: Error interno del servidor

## 🤖 Rutas del Chat con IA (`/api/chat`)

### POST `/api/chat/message`
**Descripción**: Envía un mensaje al asistente IA especializado en MYPEs  
**Acceso**: Público (con autenticación opcional)  
**Método**: POST

**Headers** - Opcional:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "message": "¿Qué es el Régimen Único Simplificado (RUS)?"
}
```

**Validaciones**:
- `message`: Entre 1 y 2000 caracteres, requerido

**Respuesta Exitosa (200)** - Usuario autenticado:
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "text": "¿Qué es el Régimen Único Simplificado (RUS)?",
      "timestamp": 1640995200000
    },
    "aiResponse": {
      "text": "El RUS es un régimen tributario especial para pequeños negocios...",
      "timestamp": 1640995200001
    }
  },
  "userInfo": {
    "freeQueriesUsed": 3,
    "freeQueriesRemaining": 2,
    "isPremium": false
  }
}
```

**Respuesta Exitosa (200)** - Usuario no autenticado:
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "text": "¿Qué es el Régimen Único Simplificado (RUS)?",
      "timestamp": 1640995200000
    },
    "aiResponse": {
      "text": "El RUS es un régimen tributario especial para pequeños negocios...",
      "timestamp": 1640995200001
    }
  }
}
```

**Errores Posibles**:
- `400`: Datos de entrada inválidos
- `403`: Límite de consultas gratuitas alcanzado
- `503`: Servicio de IA no disponible
- `500`: Error interno del servidor

---

### GET `/api/chat/history`
**Descripción**: Obtiene el historial de conversaciones del usuario  
**Acceso**: Privado (requiere token)  
**Método**: GET

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters** - Opcionales:
- `page`: Número de página (por defecto: 1)
- `limit`: Elementos por página (por defecto: 10, máximo: 50)

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "chatHistory": [
      {
        "id": "msg_123",
        "message": "¿Qué es el RUS?",
        "response": "El RUS es un régimen tributario...",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "msg_124",
        "message": "¿Cómo me registro?",
        "response": "Para registrarte en el RUS...",
        "createdAt": "2024-01-01T00:05:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 2,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

**Errores Posibles**:
- `400`: Parámetros de paginación inválidos
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

---

### GET `/api/chat/info`
**Descripción**: Obtiene información sobre el asistente IA  
**Acceso**: Público  
**Método**: GET

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "assistant": {
      "name": "Asistente MYPE Perú",
      "description": "Asistente inteligente especializado en Micro y Pequeñas Empresas de Perú",
      "version": "1.0.0",
      "capabilities": [
        "Consultas sobre regímenes tributarios",
        "Información sobre formalización de empresas",
        "Asesoría en trámites empresariales",
        "Orientación sobre beneficios para MYPEs"
      ],
      "languages": ["es"],
      "maxMessageLength": 2000
    },
    "limits": {
      "freeQueriesPerUser": 5,
      "premiumUnlimited": true
    }
  }
}
```

---

### GET `/api/chat/health`
**Descripción**: Verifica el estado del servicio de chat  
**Acceso**: Público  
**Método**: GET

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Servicio de chat funcionando correctamente",
  "data": {
    "status": "healthy",
    "aiService": "available",
    "database": "connected",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Respuesta con Problemas (503)**:
```json
{
  "success": false,
  "message": "Servicio de chat con problemas",
  "data": {
    "status": "degraded",
    "aiService": "unavailable",
    "database": "connected",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🏠 Endpoints Generales

### GET `/`
**Descripción**: Información básica de la API  
**Acceso**: Público  
**Método**: GET

**Respuesta Exitosa (200)**:
```json
{
  "message": "Backend Asistente MYPE - API funcionando correctamente",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "endpoints": {
    "auth": "/api/auth",
    "chat": "/api/chat",
    "payments": "/api/payments"
  }
}
```

#### GET `/api/health`
Estado de salud de la API

**Respuesta:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "status": "healthy",
  "uptime": 3600.123,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## 📊 Códigos de Respuesta Comunes

### Estructura de Respuesta Exitosa
```json
{
  "success": true,
  "message": "Descripción del resultado",
  "data": {
    // Datos específicos del endpoint
  }
}
```

### Estructura de Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE", // Opcional
  "errors": [ // Opcional, para errores de validación
    {
      "field": "campo",
      "message": "Mensaje específico del error"
    }
  ]
}
```

---

## 🔒 Sistema de Autenticación

### JWT Token
- **Algoritmo**: HS256
- **Expiración**: 24 horas
- **Header**: `Authorization: Bearer <token>`

### Middleware de Autenticación
- `requireAuth`: Requiere token válido
- `optionalAuth`: Token opcional, proporciona información del usuario si está presente

---

## 💰 Sistema de Límites y Pagos

### Usuarios Gratuitos
- **Consultas gratuitas**: 5 por usuario
- **Restricción**: Al alcanzar el límite, se requiere pago para continuar

### Usuarios Premium
- **Consultas**: Ilimitadas
- **Costo**: S/. 15.00 PEN (configurable)
- **Duración**: Permanente (una vez pagado)

---

## 🗄️ Base de Datos

### Modelos Principales
- **User**: Información de usuarios y estado premium
- **ChatMessage**: Historial de conversaciones
- **Payment**: Transacciones y órdenes de pago

### Conexión
- **Motor**: MySQL
- **ORM**: Prisma
- **Hosting**: Railway

---

## 🚀 Despliegue y Configuración

### Variables de Entorno Requeridas
```env
# Base de datos
DATABASE_URL="mysql://user:password@host:port/database"

# JWT
JWT_SECRET="your-secret-key"

# IA Service
OPENAI_API_KEY="your-openai-api-key"

# Límites
FREE_QUERIES_LIMIT=5

# Pagos
PAYMENT_AMOUNT=15.00
PAYMENT_CURRENCY=PEN
```

### Comandos de Desarrollo
```bash
# Instalar dependencias
pnpm install

# Ejecutar migraciones
npx prisma db push

# Iniciar servidor de desarrollo
pnpm start

# Generar cliente Prisma
npx prisma generate
```

---

## 📝 Notas Importantes

1. **Seguridad**: Todos los endpoints sensibles requieren autenticación JWT
2. **Validación**: Se validan todos los datos de entrada con express-validator
3. **Límites**: Los usuarios gratuitos tienen límite de 5 consultas
4. **Pagos**: Sistema de pagos simulado para desarrollo
5. **IA**: Requiere API key de OpenAI válida para funcionar
6. **CORS**: Configurado para permitir requests desde el frontend
7. **Logs**: Se registran errores y actividades importantes
8. **Paginación**: Implementada en endpoints que retornan listas

---

## 🔧 Solución de Problemas

### Errores Comunes

**503 - Servicio de IA no disponible**
- Verificar que `OPENAI_API_KEY` esté configurada
- Comprobar conectividad a internet

**500 - Error de base de datos**
- Verificar `DATABASE_URL`
- Ejecutar `npx prisma db push`

**401 - Token inválido**
- Verificar que el token no haya expirado
- Comprobar formato del header Authorization

**403 - Límite de consultas**
- Usuario ha alcanzado el límite gratuito
- Requiere pago para continuar

---

## 💰 Regímenes Tributarios

### POST `/api/tax-regime/calculate`
Calcula el régimen tributario apropiado basado en ingresos mensuales.

**Request Body:**
```json
{
  "monthlyIncome": 5000
}
```

**Validaciones:**
- `monthlyIncome`: Número requerido, mayor a 0, máximo 10,000,000, máximo 2 decimales

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "monthlyIncome": 5000,
    "recommendation": {
      "regime": "Nuevo RUS",
      "description": "Nuevo Régimen Único Simplificado",
      "benefits": [
        "Pago único mensual que incluye IGV e Impuesto a la Renta",
        "No requiere llevar libros contables",
        "Comprobantes de pago simplificados",
        "Proceso de inscripción sencillo"
      ],
      "requirements": [
        "Ingresos anuales hasta S/ 96,000",
        "Máximo 2 establecimientos",
        "No realizar actividades de construcción",
        "No superar activos fijos por S/ 126,000"
      ],
      "monthlyTax": 50,
      "annualIncome": 60000
    },
    "calculatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores Posibles:**
```json
// Error de validación (400)
{
  "success": false,
  "error": "Errores de validación",
  "details": [
    {
      "field": "monthlyIncome",
      "message": "El ingreso mensual debe ser un número"
    }
  ]
}

// Error interno (500)
{
  "success": false,
  "error": "Error interno del servidor"
}
```

### GET `/api/tax-regime/regimes`
Obtiene información de todos los regímenes tributarios disponibles.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "regimes": [
      {
        "name": "Nuevo RUS",
        "description": "Nuevo Régimen Único Simplificado",
        "maxAnnualIncome": 96000,
        "maxMonthlyIncome": 8000,
        "taxRate": "Fijo según categoría",
        "benefits": ["..."],
        "requirements": ["..."]
      },
      {
        "name": "RER",
        "description": "Régimen Especial de Renta",
        "maxAnnualIncome": 525000,
        "maxMonthlyIncome": 43750,
        "taxRate": "1.5%",
        "benefits": ["..."],
        "requirements": ["..."]
      }
    ]
  }
}
```

### GET `/api/tax-regime/health`
Estado del servicio de regímenes tributarios.

---

## 🤖 Chat con IA

### POST `/api/chat/message`
Envía un mensaje al asistente de IA y obtiene una respuesta.

**Request Body:**
```json
{
  "message": "¿Qué beneficios tiene el Nuevo RUS?"
}
```

**Validaciones:**
- `message`: String requerido, entre 1 y 1000 caracteres

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "message": "El Nuevo RUS ofrece varios beneficios importantes para micro empresas:\n\n1. **Simplicidad**: Un solo pago mensual que incluye tanto el IGV como el Impuesto a la Renta...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores Posibles:**
```json
// IA no disponible (503)
{
  "success": false,
  "error": "Servicio de IA no disponible temporalmente"
}

// Error de validación (400)
{
  "success": false,
  "error": "Errores de validación",
  "details": [
    {
      "field": "message",
      "message": "El mensaje debe tener entre 1 y 1000 caracteres"
    }
  ]
}
```

### GET `/api/chat/assistant-info`
Información sobre el asistente de IA.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "name": "Asistente AI-MYPE Peru",
    "description": "Asistente especializado en micro y pequeñas empresas en Perú",
    "capabilities": [
      "Información sobre regímenes tributarios",
      "Asesoría en formalización de empresas",
      "Orientación sobre beneficios y obligaciones MYPE",
      "Consejos de gestión empresarial",
      "Información sobre programas de apoyo gubernamental"
    ],
    "model": "Google Gemini Pro",
    "available": true
  }
}
```

### GET `/api/chat/health`
Estado del servicio de chat.

---

## 🔧 Ejemplos de Implementación Frontend

### JavaScript Vanilla

```javascript
// Configuración base
const API_BASE_URL = 'http://localhost:3001/api';

// Función para calcular régimen tributario
async function calculateTaxRegime(monthlyIncome) {
  try {
    const response = await fetch(`${API_BASE_URL}/tax-regime/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ monthlyIncome })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    console.error('Error calculando régimen:', error);
    throw error;
  }
}

// Función para enviar mensaje al chat
async function sendChatMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    throw error;
  }
}

// Uso de las funciones
calculateTaxRegime(5000)
  .then(result => {
    console.log('Régimen recomendado:', result.data.recommendation);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

sendChatMessage('¿Cómo me formalizo como MYPE?')
  .then(result => {
    console.log('Respuesta IA:', result.data.message);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

### React con Hooks

```jsx
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

// Hook personalizado para la API
function useMyPeAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateTaxRegime = useCallback(async (monthlyIncome) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tax-regime/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyIncome })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendChatMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    calculateTaxRegime,
    sendChatMessage,
    loading,
    error
  };
}

// Componente de ejemplo
function TaxCalculator() {
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);
  const { calculateTaxRegime, loading, error } = useMyPeAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await calculateTaxRegime(parseFloat(income));
      setResult(data.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Ingreso mensual"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular Régimen'}
        </button>
      </form>

      {error && <div className="error">Error: {error}</div>}
      
      {result && (
        <div className="result">
          <h3>Régimen Recomendado: {result.recommendation.regime}</h3>
          <p>{result.recommendation.description}</p>
          <p>Impuesto mensual estimado: S/ {result.recommendation.monthlyTax}</p>
        </div>
      )}
    </div>
  );
}
```

### Axios (Alternativa)

```javascript
import axios from 'axios';

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || 'Error de conexión';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Servicios
export const taxRegimeService = {
  calculate: (monthlyIncome) => 
    api.post('/tax-regime/calculate', { monthlyIncome }),
  
  getAllRegimes: () => 
    api.get('/tax-regime/regimes')
};

export const chatService = {
  sendMessage: (message) => 
    api.post('/chat/message', { message }),
  
  getAssistantInfo: () => 
    api.get('/chat/assistant-info')
};

// Uso
taxRegimeService.calculate(5000)
  .then(response => {
    console.log('Resultado:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | Solicitud exitosa |
| 400 | Bad Request | Datos de entrada inválidos |
| 404 | Not Found | Endpoint no encontrado |
| 500 | Internal Server Error | Error interno del servidor |
| 503 | Service Unavailable | Servicio de IA no disponible |

### Estructura de Errores

```json
{
  "success": false,
  "error": "Mensaje de error principal",
  "details": [
    {
      "field": "campo_con_error",
      "message": "Descripción específica del error"
    }
  ]
}
```

### Mejores Prácticas para Manejo de Errores

```javascript
async function handleAPICall(apiFunction) {
  try {
    const result = await apiFunction();
    return { success: true, data: result.data };
  } catch (error) {
    // Log del error para debugging
    console.error('API Error:', error);
    
    // Retornar error estructurado
    return {
      success: false,
      error: error.message || 'Error desconocido',
      code: error.response?.status
    };
  }
}

// Uso
const result = await handleAPICall(() => 
  calculateTaxRegime(monthlyIncome)
);

if (result.success) {
  // Manejar éxito
  console.log('Datos:', result.data);
} else {
  // Manejar error
  console.error('Error:', result.error);
  // Mostrar mensaje al usuario
}
```

---

## 🔄 Estados de Carga y UX

### Implementación de Loading States

```javascript
// Estado de carga para mejor UX
function useAPICall() {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const execute = useCallback(async (apiCall) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({
        loading: false,
        data: result.data,
        error: null
      });
      return result;
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error.message
      });
      throw error;
    }
  }, []);

  return { ...state, execute };
}
```

---

## 🧪 Testing de la API

### Ejemplos con curl

```bash
# Calcular régimen tributario
curl -X POST http://localhost:3001/api/tax-regime/calculate \
  -H "Content-Type: application/json" \
  -d '{"monthlyIncome": 5000}'

# Enviar mensaje al chat
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Qué es el Nuevo RUS?"}'

# Verificar salud de la API
curl http://localhost:3001/api/health
```

### Testing con Postman

1. **Crear Collection**: "Asistente AI-MYPE Peru"
2. **Configurar Environment**:
   - `base_url`: `http://localhost:3001/api`
3. **Requests de ejemplo**:
   - GET `{{base_url}}/health`
   - POST `{{base_url}}/tax-regime/calculate`
   - POST `{{base_url}}/chat/message`

---

## 📝 Notas Importantes

1. **CORS**: La API está configurada para aceptar requests desde `http://localhost:3000`
2. **Rate Limiting**: Actualmente no implementado, pero recomendado para producción
3. **Autenticación**: No requerida actualmente, pero planificada para futuras versiones
4. **Versionado**: La API está en versión 1.0.0, futuras versiones mantendrán compatibilidad
5. **Logs**: Todas las requests son loggeadas para debugging

---

## 🔗 Enlaces Útiles

- **Servidor Local**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Documentación Principal**: [README.md](./README.md)
- **Repositorio**: [GitHub](https://github.com/tuusuario/backend-asistente-mype)

---

**¡Happy Coding! 🚀**