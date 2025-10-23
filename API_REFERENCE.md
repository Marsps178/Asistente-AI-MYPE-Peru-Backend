# 📚 API Reference - Backend Asistente MYPE

## 🌐 Información General

**Base URL**: `http://localhost:3000` (desarrollo) | `https://tu-dominio.com` (producción)  
**Autenticación**: JWT Bearer Token  
**Content-Type**: `application/json`

---

## 🔐 APIs de Autenticación

### 1. Registro de Usuario
**Endpoint**: `POST /api/auth/register`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "123456"
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (201)
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "user_123",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "isPremium": false,
      "freeQueriesUsed": 0,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// ❌ Error (400)
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "email",
      "message": "El email debe ser válido"
    },
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}

// ❌ Error (409)
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

### 2. Inicio de Sesión
**Endpoint**: `POST /api/auth/login`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: "juan@example.com",
      password: "123456"
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "user_123",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "isPremium": false,
      "freeQueriesUsed": 3
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// ❌ Error (401)
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### 3. Perfil de Usuario
**Endpoint**: `GET /api/auth/profile`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const getUserProfile = async (token) => {
  const response = await fetch('/api/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "id": "user_123",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "isPremium": true,
      "freeQueriesUsed": 5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T15:45:00.000Z"
    }
  }
}
```

---

### 4. Cerrar Sesión
**Endpoint**: `POST /api/auth/logout`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const logoutUser = async (token) => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### 5. Verificar Token
**Endpoint**: `GET /api/auth/verify`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const verifyToken = async (token) => {
  const response = await fetch('/api/auth/verify', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Token válido",
  "data": {
    "valid": true,
    "user": {
      "id": "user_123",
      "email": "juan@example.com"
    }
  }
}

// ❌ Error (401)
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

### 6. Estado de Autenticación
**Endpoint**: `GET /api/auth/status`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const getAuthStatus = async (token) => {
  const response = await fetch('/api/auth/status', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Estado de autenticación obtenido",
  "data": {
    "authenticated": true,
    "user": {
      "id": "user_123",
      "name": "Juan Pérez",
      "isPremium": false,
      "freeQueriesUsed": 3,
      "freeQueriesLimit": 5
    }
  }
}
```

---

## 💬 APIs de Chat con IA

### 1. Enviar Mensaje
**Endpoint**: `POST /api/chat/message`  
**Autenticación**: Opcional

#### 📤 Request JavaScript
```javascript
// Con autenticación (usuario registrado)
const sendMessageAuth = async (message, token) => {
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: "¿Qué es el RUS y cómo me registro?"
    })
  });
  
  return await response.json();
};

// Sin autenticación (usuario anónimo)
const sendMessageAnon = async (message) => {
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: "¿Qué es el RUS y cómo me registro?"
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito - Usuario Autenticado (200)
{
  "success": true,
  "message": "Mensaje procesado exitosamente",
  "data": {
    "userMessage": "¿Qué es el RUS y cómo me registro?",
    "aiResponse": "El RUS (Régimen Único Simplificado) es un régimen tributario especial diseñado para pequeños contribuyentes en Perú. Para registrarte...",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "messageId": "msg_123",
    "user": {
      "freeQueriesUsed": 4,
      "freeQueriesRemaining": 1,
      "isPremium": false
    }
  }
}

// ✅ Éxito - Usuario Anónimo (200)
{
  "success": true,
  "message": "Mensaje procesado exitosamente",
  "data": {
    "userMessage": "¿Qué es el RUS y cómo me registro?",
    "aiResponse": "El RUS (Régimen Único Simplificado) es un régimen tributario especial...",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "messageId": "msg_124"
  }
}

// ❌ Error - Límite Alcanzado (403)
{
  "success": false,
  "message": "Has alcanzado el límite de consultas gratuitas",
  "code": "QUERY_LIMIT_EXCEEDED",
  "data": {
    "freeQueriesUsed": 5,
    "freeQueriesLimit": 5,
    "upgradeRequired": true,
    "upgradeUrl": "/api/payments/create-order"
  }
}

// ❌ Error - Servicio IA No Disponible (503)
{
  "success": false,
  "message": "El servicio de IA no está disponible temporalmente",
  "code": "AI_SERVICE_UNAVAILABLE"
}
```

---

### 2. Historial de Chat
**Endpoint**: `GET /api/chat/history`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const getChatHistory = async (token, page = 1, limit = 10) => {
  const response = await fetch(`/api/chat/history?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Historial obtenido exitosamente",
  "data": {
    "chatHistory": [
      {
        "id": "msg_123",
        "message": "¿Qué es el RUS?",
        "response": "El RUS (Régimen Único Simplificado) es...",
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "msg_122",
        "message": "¿Cómo calculo mis impuestos?",
        "response": "Para calcular tus impuestos...",
        "createdAt": "2024-01-15T09:15:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalMessages": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}

// ✅ Historial Vacío (200)
{
  "success": true,
  "message": "Historial obtenido exitosamente",
  "data": {
    "chatHistory": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 0,
      "totalMessages": 0,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### 3. Información del Asistente
**Endpoint**: `GET /api/chat/info`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const getAssistantInfo = async () => {
  const response = await fetch('/api/chat/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Información del asistente obtenida",
  "data": {
    "assistant": {
      "name": "Asistente MYPE Perú",
      "version": "1.0.0",
      "description": "Asistente especializado en asesoría tributaria y empresarial para MYPEs peruanas",
      "capabilities": [
        "Asesoría en regímenes tributarios",
        "Cálculo de impuestos",
        "Orientación empresarial",
        "Consultas sobre RUS, RER y Régimen General"
      ],
      "languages": ["Español"],
      "availability": "24/7"
    },
    "limits": {
      "freeQueries": 5,
      "premiumUnlimited": true,
      "premiumCost": "S/. 15.00 PEN"
    }
  }
}
```

---

### 4. Estado de Salud del Chat
**Endpoint**: `GET /api/chat/health`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const getChatHealth = async () => {
  const response = await fetch('/api/chat/health', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Servicio Saludable (200)
{
  "success": true,
  "message": "Servicio de chat funcionando correctamente",
  "data": {
    "status": "healthy",
    "aiService": "available",
    "database": "connected",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": "72h 15m 30s"
  }
}

// ❌ Servicio con Problemas (503)
{
  "success": false,
  "message": "Servicio de chat con problemas",
  "data": {
    "status": "unhealthy",
    "aiService": "unavailable",
    "database": "connected",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 💳 APIs de Pagos

### 1. Crear Orden de Pago
**Endpoint**: `POST /api/payments/create-order`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const createPaymentOrder = async (token, paymentData = {}) => {
  const response = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 15.00,  // Opcional, usa valor por defecto
      currency: "PEN" // Opcional, usa valor por defecto
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (201)
{
  "success": true,
  "message": "Orden de pago creada exitosamente",
  "data": {
    "orderId": "order_abc123",
    "amount": 15.00,
    "currency": "PEN",
    "status": "pending",
    "paymentUrl": "https://payment-gateway.com/pay/order_abc123",
    "expiresAt": "2024-01-15T11:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "user": {
      "id": "user_123",
      "email": "juan@example.com"
    }
  }
}

// ❌ Error - Usuario Ya Premium (400)
{
  "success": false,
  "message": "El usuario ya tiene acceso premium",
  "code": "ALREADY_PREMIUM"
}
```

---

### 2. Procesar Pago
**Endpoint**: `POST /api/payments/process`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const processPayment = async (token, paymentData) => {
  const response = await fetch('/api/payments/process', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId: "order_abc123",
      paymentMethod: "credit_card" // Opcional
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Pago procesado exitosamente",
  "data": {
    "paymentId": "pay_xyz789",
    "orderId": "order_abc123",
    "status": "completed",
    "amount": 15.00,
    "currency": "PEN",
    "paymentMethod": "credit_card",
    "processedAt": "2024-01-15T10:35:00.000Z",
    "user": {
      "id": "user_123",
      "isPremium": true,
      "premiumActivatedAt": "2024-01-15T10:35:00.000Z"
    }
  }
}

// ❌ Error - Orden No Encontrada (404)
{
  "success": false,
  "message": "Orden de pago no encontrada",
  "code": "ORDER_NOT_FOUND"
}
```

---

### 3. Webhook de Pagos
**Endpoint**: `POST /api/payments/webhook`  
**Autenticación**: No requerida (validación por signature)

#### 📤 Request JavaScript
```javascript
// Este endpoint es llamado por el proveedor de pagos
const webhookPayment = async (webhookData) => {
  const response = await fetch('/api/payments/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': 'signature_hash'
    },
    body: JSON.stringify({
      event: "payment.completed",
      orderId: "order_abc123",
      paymentId: "pay_xyz789",
      status: "completed",
      amount: 15.00,
      currency: "PEN"
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Webhook procesado exitosamente",
  "data": {
    "processed": true,
    "orderId": "order_abc123",
    "userUpdated": true
  }
}
```

---

### 4. Historial de Pagos
**Endpoint**: `GET /api/payments/history`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const getPaymentHistory = async (token, page = 1, limit = 10) => {
  const response = await fetch(`/api/payments/history?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Historial de pagos obtenido",
  "data": {
    "payments": [
      {
        "id": "pay_xyz789",
        "orderId": "order_abc123",
        "amount": 15.00,
        "currency": "PEN",
        "status": "completed",
        "paymentMethod": "credit_card",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "processedAt": "2024-01-15T10:35:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalPayments": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### 5. Estado de Pago Específico
**Endpoint**: `GET /api/payments/:paymentId/status`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const getPaymentStatus = async (token, paymentId) => {
  const response = await fetch(`/api/payments/${paymentId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Estado de pago obtenido",
  "data": {
    "paymentId": "pay_xyz789",
    "orderId": "order_abc123",
    "status": "completed",
    "amount": 15.00,
    "currency": "PEN",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "processedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 6. Cancelar Pago
**Endpoint**: `DELETE /api/payments/:paymentId/cancel`  
**Autenticación**: Requerida

#### 📤 Request JavaScript
```javascript
const cancelPayment = async (token, paymentId) => {
  const response = await fetch(`/api/payments/${paymentId}/cancel`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Pago cancelado exitosamente",
  "data": {
    "paymentId": "pay_xyz789",
    "status": "cancelled",
    "cancelledAt": "2024-01-15T10:40:00.000Z"
  }
}

// ❌ Error - No se puede cancelar (400)
{
  "success": false,
  "message": "No se puede cancelar un pago completado",
  "code": "CANNOT_CANCEL_COMPLETED_PAYMENT"
}
```

---

## 📊 APIs de Regímenes Tributarios

### 1. Lista de Regímenes
**Endpoint**: `GET /api/tax-regime/regimes`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const getTaxRegimes = async () => {
  const response = await fetch('/api/tax-regime/regimes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Regímenes tributarios obtenidos",
  "data": {
    "regimes": [
      {
        "id": "rus",
        "name": "Régimen Único Simplificado (RUS)",
        "description": "Para pequeños contribuyentes con ingresos hasta S/. 96,000 anuales",
        "maxAnnualIncome": 96000,
        "benefits": [
          "Pago único mensual",
          "No lleva libros contables",
          "Comprobantes simplificados"
        ],
        "requirements": [
          "Ingresos anuales máximo S/. 96,000",
          "Máximo 2 establecimientos",
          "No más de 2 vehículos"
        ]
      },
      {
        "id": "rer",
        "name": "Régimen Especial de Renta (RER)",
        "description": "Para empresas con ingresos hasta S/. 525,000 anuales",
        "maxAnnualIncome": 525000,
        "taxRate": 1.5,
        "benefits": [
          "Tasa fija del 1.5%",
          "Libros contables simplificados"
        ]
      },
      {
        "id": "general",
        "name": "Régimen General",
        "description": "Para empresas sin límite de ingresos",
        "maxAnnualIncome": null,
        "taxRate": 29.5,
        "benefits": [
          "Sin límite de ingresos",
          "Todos los gastos deducibles"
        ]
      }
    ]
  }
}
```

---

### 2. Recomendación de Régimen
**Endpoint**: `POST /api/tax-regime/recommend`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const getRegimeRecommendation = async (businessData) => {
  const response = await fetch('/api/tax-regime/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      monthlyIncome: 8000,
      businessType: "retail",
      employees: 2,
      hasVehicles: false,
      establishments: 1
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Recomendación generada exitosamente",
  "data": {
    "recommendedRegime": {
      "id": "rus",
      "name": "Régimen Único Simplificado (RUS)",
      "confidence": 95,
      "reasons": [
        "Ingresos mensuales dentro del límite",
        "Solo un establecimiento",
        "No posee vehículos"
      ]
    },
    "alternatives": [
      {
        "id": "rer",
        "name": "Régimen Especial de Renta (RER)",
        "confidence": 75,
        "pros": ["Mayor flexibilidad", "Permite más gastos"],
        "cons": ["Mayor carga tributaria"]
      }
    ],
    "businessProfile": {
      "annualIncomeEstimate": 96000,
      "category": "small_business",
      "riskLevel": "low"
    }
  }
}
```

---

### 3. Cálculo de Impuestos
**Endpoint**: `POST /api/tax-regime/calculate`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const calculateTaxes = async (calculationData) => {
  const response = await fetch('/api/tax-regime/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      regime: "rer",
      monthlyIncome: 15000,
      monthlyExpenses: 8000,
      period: "monthly"
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Cálculo realizado exitosamente",
  "data": {
    "calculation": {
      "regime": "rer",
      "period": "monthly",
      "income": 15000,
      "expenses": 8000,
      "taxableIncome": 15000,
      "taxRate": 1.5,
      "taxAmount": 225,
      "netIncome": 6775
    },
    "breakdown": {
      "incomeTax": 225,
      "igv": 0,
      "totalTax": 225
    },
    "annualProjection": {
      "annualIncome": 180000,
      "annualTax": 2700,
      "effectiveRate": 1.5
    }
  }
}
```

---

### 4. Comparación de Regímenes
**Endpoint**: `POST /api/tax-regime/compare`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const compareRegimes = async (comparisonData) => {
  const response = await fetch('/api/tax-regime/compare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      regimes: ["rus", "rer", "general"],
      monthlyIncome: 12000,
      monthlyExpenses: 7000
    })
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "success": true,
  "message": "Comparación realizada exitosamente",
  "data": {
    "comparison": [
      {
        "regime": "rus",
        "name": "RUS",
        "monthlyTax": 200,
        "annualTax": 2400,
        "netIncome": 4800,
        "eligible": true,
        "pros": ["Simplicidad", "Pago fijo"],
        "cons": ["Límites estrictos"]
      },
      {
        "regime": "rer",
        "name": "RER",
        "monthlyTax": 180,
        "annualTax": 2160,
        "netIncome": 4820,
        "eligible": true,
        "pros": ["Menor impuesto", "Más flexibilidad"],
        "cons": ["Más trámites"]
      },
      {
        "regime": "general",
        "name": "Régimen General",
        "monthlyTax": 1475,
        "annualTax": 17700,
        "netIncome": 3525,
        "eligible": true,
        "pros": ["Sin límites", "Todos los gastos"],
        "cons": ["Mayor carga tributaria"]
      }
    ],
    "recommendation": {
      "bestOption": "rer",
      "reason": "Menor carga tributaria y mayor flexibilidad"
    }
  }
}
```

---

## 🏠 API General

### Información Básica
**Endpoint**: `GET /`  
**Autenticación**: No requerida

#### 📤 Request JavaScript
```javascript
const getApiInfo = async () => {
  const response = await fetch('/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### 📥 Response JSON
```json
// ✅ Éxito (200)
{
  "message": "Backend Asistente MYPE - API funcionando correctamente",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoints": {
    "auth": "/api/auth",
    "chat": "/api/chat",
    "payments": "/api/payments",
    "taxRegime": "/api/tax-regime"
  },
  "status": "operational",
  "documentation": "/api/docs"
}
```

---

## 🚨 Códigos de Error Comunes

### Estructura de Error Estándar
```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "campo",
      "message": "Mensaje específico"
    }
  ]
}
```

### Códigos HTTP Utilizados
- **200** - OK (Éxito)
- **201** - Created (Recurso creado)
- **400** - Bad Request (Datos inválidos)
- **401** - Unauthorized (No autenticado)
- **403** - Forbidden (Sin permisos)
- **404** - Not Found (Recurso no encontrado)
- **409** - Conflict (Conflicto, ej: email duplicado)
- **500** - Internal Server Error (Error del servidor)
- **503** - Service Unavailable (Servicio no disponible)

---

## 🔧 Utilidades JavaScript

### Cliente API Completo
```javascript
class AsistenteMYPEAPI {
  constructor(baseURL = 'http://localhost:3000', token = null) {
    this.baseURL = baseURL;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token && !options.skipAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    return await response.json();
  }

  // Métodos de autenticación
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  // Métodos de chat
  async sendMessage(message) {
    return this.request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async getChatHistory(page = 1, limit = 10) {
    return this.request(`/api/chat/history?page=${page}&limit=${limit}`);
  }

  // Métodos de pagos
  async createPaymentOrder(amount, currency = 'PEN') {
    return this.request('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    });
  }

  async processPayment(orderId, paymentMethod) {
    return this.request('/api/payments/process', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentMethod })
    });
  }

  // Métodos de regímenes tributarios
  async getTaxRegimes() {
    return this.request('/api/tax-regime/regimes', { skipAuth: true });
  }

  async getRegimeRecommendation(businessData) {
    return this.request('/api/tax-regime/recommend', {
      method: 'POST',
      body: JSON.stringify(businessData),
      skipAuth: true
    });
  }
}

// Uso del cliente
const api = new AsistenteMYPEAPI();

// Ejemplo de uso completo
async function example() {
  try {
    // Registro
    const registerResult = await api.register({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "123456"
    });
    
    if (registerResult.success) {
      api.setToken(registerResult.data.token);
      
      // Enviar mensaje
      const messageResult = await api.sendMessage("¿Qué es el RUS?");
      console.log(messageResult.data.aiResponse);
      
      // Crear orden de pago
      const orderResult = await api.createPaymentOrder(15.00);
      console.log(orderResult.data.paymentUrl);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

*Documento generado automáticamente - Versión 1.0.0*  
*Última actualización: Enero 2024*