# 📖 Documentación de API - Asistente AI-MYPE Peru

## 🌐 Información General

**Base URL**: `http://localhost:3001/api`  
**Formato**: JSON  
**Autenticación**: No requerida  
**CORS**: Habilitado para `http://localhost:3000`

## 📋 Endpoints Disponibles

### 🏠 Endpoints Generales

#### GET `/`
Información básica de la API

**Respuesta:**
```json
{
  "success": true,
  "message": "API del Asistente AI-MYPE Peru funcionando correctamente",
  "version": "1.0.0",
  "environment": "development",
  "endpoints": {
    "api": "/api",
    "health": "/api/health",
    "taxRegime": "/api/tax-regime",
    "chat": "/api/chat"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
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