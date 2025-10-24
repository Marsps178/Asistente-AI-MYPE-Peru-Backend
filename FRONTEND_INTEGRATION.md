# 🔗 Guía de Integración Frontend - Backend Asistente AI-MYPE Peru

## 📋 Información General

**Base URL del Backend**: `http://localhost:3001`  
**Formato de Datos**: JSON  
**Método de Autenticación**: JWT Bearer Token  
**Headers Requeridos**:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>' // Solo para rutas protegidas
}
```

## 🚀 Configuración Inicial del Frontend

### 1. Configurar Cliente HTTP (Axios/Fetch)

```javascript
// Configuración con Axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Manejo de Respuestas y Errores

```javascript
// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 Endpoints de Autenticación

### 1. Registro de Usuario
**Ruta**: `POST /auth/register`  
**Acceso**: Público

```javascript
// Datos que envía el frontend
const registerData = {
  email: "usuario@ejemplo.com",
  password: "MiPassword123",
  name: "Nombre Usuario"
};

// Llamada desde el frontend
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Respuesta exitosa (201)
    const { user, token } = response.data.data;
    
    // Guardar token en localStorage
    localStorage.setItem('auth_token', token);
    
    return { success: true, user, token };
  } catch (error) {
    // Manejar errores (400, 409)
    return { 
      success: false, 
      message: error.response.data.message,
      errors: error.response.data.errors 
    };
  }
};
```

**Validaciones del Frontend**:
- Email válido
- Contraseña mínimo 6 caracteres con mayúscula, minúscula y número
- Nombre entre 2 y 50 caracteres

### 2. Inicio de Sesión
**Ruta**: `POST /auth/login`  
**Acceso**: Público

```javascript
// Datos que envía el frontend
const loginData = {
  email: "usuario@ejemplo.com",
  password: "MiPassword123"
};

// Llamada desde el frontend
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Respuesta exitosa (200)
    const { user, token } = response.data.data;
    
    // Guardar token
    localStorage.setItem('auth_token', token);
    
    return { success: true, user, token };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

### 3. Obtener Perfil de Usuario
**Ruta**: `GET /auth/profile`  
**Acceso**: Privado (requiere token)

```javascript
const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    
    // Respuesta exitosa (200)
    const user = response.data.data;
    
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};
```

### 4. Cerrar Sesión
**Ruta**: `POST /auth/logout`  
**Acceso**: Público

```javascript
const logout = async () => {
  try {
    await api.post('/auth/logout');
    
    // Limpiar token local
    localStorage.removeItem('auth_token');
    
    return { success: true };
  } catch (error) {
    // Limpiar token aunque falle
    localStorage.removeItem('auth_token');
    return { success: false };
  }
};
```

## 🤖 Endpoints del Chat con IA

### 1. Enviar Mensaje al Asistente
**Ruta**: `POST /chat/message`  
**Acceso**: Público (con autenticación opcional)

```javascript
// Datos que envía el frontend
const messageData = {
  message: "¿Qué régimen tributario me conviene si facturo S/ 6,000 mensuales?"
};

// Llamada desde el frontend
const sendMessage = async (message) => {
  try {
    const response = await api.post('/chat/message', { message });
    
    // Respuesta exitosa (200)
    const { response: aiResponse, user } = response.data.data;
    
    return { 
      success: true, 
      response: aiResponse,
      user: user // Info actualizada del usuario (consultas restantes)
    };
  } catch (error) {
    if (error.response?.status === 403) {
      // Límite de consultas gratuitas alcanzado
      return { 
        success: false, 
        limitReached: true,
        message: error.response.data.message 
      };
    }
    
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

**Validaciones del Frontend**:
- Mensaje entre 1 y 2000 caracteres
- No puede estar vacío

### 2. Obtener Historial de Chat
**Ruta**: `GET /chat/history`  
**Acceso**: Privado (requiere token)

```javascript
const getChatHistory = async () => {
  try {
    const response = await api.get('/chat/history');
    
    // Respuesta exitosa (200)
    const messages = response.data.data;
    
    return { success: true, messages };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};
```

### 3. Información del Asistente
**Ruta**: `GET /chat/info`  
**Acceso**: Público

```javascript
const getAssistantInfo = async () => {
  try {
    const response = await api.get('/chat/info');
    
    // Respuesta exitosa (200)
    const info = response.data.data;
    
    return { success: true, info };
  } catch (error) {
    return { success: false };
  }
};
```

## 💰 Endpoints de Pagos

### 1. Crear Orden de Pago
**Ruta**: `POST /payments/create-order`  
**Acceso**: Privado (requiere token)

```javascript
// Datos opcionales (el backend usa valores por defecto)
const orderData = {
  amount: 15.00, // Opcional, por defecto 15.00
  currency: "PEN" // Opcional, por defecto "PEN"
};

const createPaymentOrder = async (orderData = {}) => {
  try {
    const response = await api.post('/payments/create-order', orderData);
    
    // Respuesta exitosa (201)
    const { orderId, amount, currency } = response.data.data;
    
    return { success: true, orderId, amount, currency };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

### 2. Procesar Pago (Simulado)
**Ruta**: `POST /payments/process`  
**Acceso**: Público

```javascript
// Datos que envía el frontend
const paymentData = {
  orderId: "order_123456",
  paymentMethod: "qr_code" // Opcional: "card", "bank_transfer", "wallet", "qr_code"
};

const processPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/process', paymentData);
    
    // Respuesta exitosa (200)
    const { paymentId, status, transactionId } = response.data.data;
    
    return { success: true, paymentId, status, transactionId };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

### 3. Obtener Estado de Pago
**Ruta**: `GET /payments/{paymentId}/status`  
**Acceso**: Público

```javascript
const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/status`);
    
    // Respuesta exitosa (200)
    const payment = response.data.data;
    
    return { success: true, payment };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

### 4. Historial de Pagos
**Ruta**: `GET /payments/history`  
**Acceso**: Privado (requiere token)

```javascript
const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/history');
    
    // Respuesta exitosa (200)
    const payments = response.data.data;
    
    return { success: true, payments };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

## 📊 Endpoints de Regímenes Tributarios

### 1. Calcular Régimen Apropiado
**Ruta**: `POST /tax-regime/calculate`  
**Acceso**: Público

```javascript
// Datos que envía el frontend
const calculationData = {
  monthlyIncome: 6000, // Ingresos mensuales en soles
  businessType: "comercio", // Opcional
  hasEmployees: false // Opcional
};

const calculateTaxRegime = async (data) => {
  try {
    const response = await api.post('/tax-regime/calculate', data);
    
    // Respuesta exitosa (200)
    const { 
      recommendedRegime, 
      calculation, 
      alternatives 
    } = response.data.data;
    
    return { 
      success: true, 
      recommendedRegime, 
      calculation, 
      alternatives 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data.message 
    };
  }
};
```

### 2. Obtener Todos los Regímenes
**Ruta**: `GET /tax-regime/regimes`  
**Acceso**: Público

```javascript
const getAllRegimes = async () => {
  try {
    const response = await api.get('/tax-regime/regimes');
    
    // Respuesta exitosa (200)
    const regimes = response.data.data;
    
    return { success: true, regimes };
  } catch (error) {
    return { success: false };
  }
};
```

## 🔍 Endpoints de Estado y Salud

### 1. Estado General de la API
**Ruta**: `GET /`  
**Acceso**: Público

```javascript
const getApiStatus = async () => {
  try {
    const response = await api.get('/');
    
    // Respuesta exitosa (200)
    const { message, version, endpoints } = response.data;
    
    return { success: true, message, version, endpoints };
  } catch (error) {
    return { success: false };
  }
};
```

### 2. Health Check
**Ruta**: `GET /health`  
**Acceso**: Público

```javascript
const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    
    // Respuesta exitosa (200)
    const { message, uptime } = response.data;
    
    return { success: true, message, uptime };
  } catch (error) {
    return { success: false };
  }
};
```

## 🎯 Flujo Completo de Integración

### 1. Flujo de Registro y Login

```javascript
// Componente de registro/login
const AuthComponent = () => {
  const [user, setUser] = useState(null);
  
  const handleRegister = async (userData) => {
    const result = await register(userData);
    if (result.success) {
      setUser(result.user);
      // Redirigir al dashboard
    } else {
      // Mostrar errores de validación
      console.error(result.errors);
    }
  };
  
  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      setUser(result.user);
      // Redirigir al dashboard
    } else {
      // Mostrar error de login
      console.error(result.message);
    }
  };
};
```

### 2. Flujo del Chat

```javascript
// Componente de chat
const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  
  const handleSendMessage = async (message) => {
    const result = await sendMessage(message);
    
    if (result.success) {
      // Agregar mensaje y respuesta al chat
      setMessages(prev => [...prev, 
        { type: 'user', content: message },
        { type: 'ai', content: result.response }
      ]);
      
      // Actualizar info del usuario (consultas restantes)
      if (result.user) {
        setUser(result.user);
      }
    } else if (result.limitReached) {
      // Mostrar modal de upgrade a premium
      showUpgradeModal();
    } else {
      // Mostrar error
      console.error(result.message);
    }
  };
};
```

### 3. Flujo de Pagos

```javascript
// Componente de pagos
const PaymentComponent = () => {
  const handleUpgradeToPremium = async () => {
    // 1. Crear orden de pago
    const orderResult = await createPaymentOrder();
    
    if (orderResult.success) {
      // 2. Procesar pago
      const paymentResult = await processPayment({
        orderId: orderResult.orderId,
        paymentMethod: 'card'
      });
      
      if (paymentResult.success) {
        // 3. Verificar estado del pago
        const statusResult = await getPaymentStatus(paymentResult.paymentId);
        
        if (statusResult.success && statusResult.payment.status === 'COMPLETED') {
          // Usuario ahora es premium
          // Actualizar estado de la aplicación
          updateUserToPremium();
        }
      }
    }
  };
};
```

## ⚠️ Solución a Problemas de CORS

### Error Común: "Access-Control-Allow-Origin"

Si recibes este error:
```
Access to XMLHttpRequest at 'http://localhost:3001/chat/info' from origin 'http://localhost:5174' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Solución**: El backend ya incluye configuración CORS para los puertos más comunes:
- `http://localhost:3000`
- `http://localhost:3001` 
- `http://localhost:5173`
- `http://localhost:5174` ✅ (Agregado)
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174` ✅ (Agregado)
- `http://127.0.0.1:8080`

### Si usas un puerto diferente:

1. **Opción 1**: Agregar tu puerto en `src/config/config.js`:
```javascript
cors: {
  origin: [
    // ... otros puertos
    'http://localhost:TU_PUERTO',
    'http://127.0.0.1:TU_PUERTO'
  ]
}
```

2. **Opción 2**: Usar variable de entorno:
```bash
# En tu archivo .env
CORS_ORIGIN=http://localhost:5174,http://localhost:3000
```

### Reiniciar el Servidor

Después de cambiar la configuración CORS, **debes reiniciar el servidor backend**:
```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
# o
node server.js
```

## ⚠️ Manejo de Errores Comunes

### Códigos de Estado HTTP

```javascript
const handleApiError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message;
  
  switch (status) {
    case 400:
      // Datos inválidos - mostrar errores de validación
      return { type: 'validation', message };
    
    case 401:
      // No autorizado - redirigir a login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return { type: 'auth', message: 'Sesión expirada' };
    
    case 403:
      // Límite alcanzado - mostrar upgrade
      return { type: 'limit', message };
    
    case 404:
      // No encontrado
      return { type: 'notFound', message };
    
    case 503:
      // Servicio no disponible (IA)
      return { type: 'service', message: 'Servicio temporalmente no disponible' };
    
    default:
      // Error genérico
      return { type: 'generic', message: 'Error inesperado' };
  }
};
```

## 🔧 Variables de Entorno del Frontend

```javascript
// .env del frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000
```

## 📱 Ejemplo de Implementación Completa

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      getProfile().then(result => {
        if (result.success) {
          setUser(result.user);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  
  return { user, setUser, loading };
};

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async (message) => {
    setLoading(true);
    const result = await sendMessage(message);
    setLoading(false);
    
    if (result.success) {
      setMessages(prev => [...prev, 
        { type: 'user', content: message },
        { type: 'ai', content: result.response }
      ]);
    }
    
    return result;
  };
  
  return { messages, sendMessage, loading };
};
```

Esta documentación proporciona todo lo necesario para integrar el frontend con el backend del Asistente AI-MYPE Peru de manera efectiva y segura.