# 💳 Flujo de Pagos - Guía para Frontend

## 🔄 Flujo Completo de Pago

### 1. **Crear Orden de Pago**
**Endpoint**: `POST /api/payments/create-order`  
**Requiere**: Token de autenticación

```javascript
// 1. Usuario hace clic en "Obtener Acceso Premium"
const createPaymentOrder = async () => {
  try {
    const response = await api.post('/api/payments/create-order', {
      amount: 15.00,  // Opcional, por defecto 15.00
      currency: 'PEN' // Opcional, por defecto 'PEN'
    });

    const { orderId, amount, currency, paymentData } = response.data.data;
    
    // Guardar orderId para el siguiente paso
    return { orderId, amount, currency, paymentData };
    
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message.includes('premium activo')) {
      // Usuario ya es premium
      alert('Ya tienes acceso premium activo');
    }
    throw error;
  }
};
```

### 2. **Procesar Pago (Simulado)**
**Endpoint**: `POST /api/payments/process`  
**No requiere**: Token (es público)

```javascript
// 2. Procesar el pago con la orden creada
const processPayment = async (orderId, paymentMethod = 'card') => {
  try {
    const response = await api.post('/api/payments/process', {
      orderId: orderId,
      paymentMethod: paymentMethod // 'card', 'bank_transfer', 'wallet', 'qr_code'
    });

    const { transactionId, status } = response.data.data;
    
    if (status === 'COMPLETED') {
      // ✅ PAGO EXITOSO - El usuario ya es premium automáticamente
      return { success: true, transactionId, status };
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      // Orden no encontrada
      throw new Error('Orden de pago no encontrada');
    }
    if (error.response?.status === 400) {
      // Orden ya procesada o error en el pago
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
```

### 3. **Verificar Estado del Usuario (Opcional)**
**Endpoint**: `GET /auth/profile`  
**Requiere**: Token de autenticación

```javascript
// 3. Verificar que el usuario ahora es premium
const checkUserStatus = async () => {
  try {
    const response = await api.get('/auth/profile');
    const user = response.data.data.user;
    
    return {
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      freeQueriesRemaining: user.freeQueriesRemaining
    };
    
  } catch (error) {
    console.error('Error verificando estado del usuario:', error);
    return null;
  }
};
```

## 🚀 Implementación Completa en React

```javascript
// Hook personalizado para manejar pagos
const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Paso 1: Crear orden de pago
      console.log('Creando orden de pago...');
      const orderData = await createPaymentOrder();
      
      // Paso 2: Procesar pago (simulado)
      console.log('Procesando pago...');
      const paymentResult = await processPayment(orderData.orderId);
      
      if (paymentResult.success) {
        // Paso 3: Verificar estado del usuario
        console.log('Verificando estado premium...');
        const userStatus = await checkUserStatus();
        
        // ✅ ÉXITO COMPLETO
        return {
          success: true,
          message: '¡Pago exitoso! Ya tienes acceso premium',
          transactionId: paymentResult.transactionId,
          userStatus
        };
      }
      
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading, error };
};
```

## 🎯 Componente de Botón de Pago

```javascript
const PaymentButton = ({ user, onPaymentSuccess }) => {
  const { handlePayment, loading, error } = usePayment();

  const onPayClick = async () => {
    const result = await handlePayment();
    
    if (result.success) {
      // Actualizar estado del usuario en la app
      onPaymentSuccess(result.userStatus);
      
      // Mostrar mensaje de éxito
      alert('¡Pago exitoso! Ya tienes acceso premium por 30 días');
    } else {
      // Mostrar error
      alert(`Error en el pago: ${result.message}`);
    }
  };

  // No mostrar si ya es premium
  if (user?.isPremium) {
    return null;
  }

  return (
    <button 
      onClick={onPayClick}
      disabled={loading}
      className="payment-button"
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Procesando pago...
        </>
      ) : (
        <>
          💎 Obtener Acceso Premium - S/ 15.00
        </>
      )}
    </button>
  );
};
```

## ⚡ Flujo Rápido (Resumen)

```javascript
// Flujo completo en una función
const quickPaymentFlow = async () => {
  try {
    // 1. Crear orden (requiere login)
    const order = await api.post('/api/payments/create-order');
    const orderId = order.data.data.orderId;
    
    // 2. Procesar pago (público)
    const payment = await api.post('/api/payments/process', { orderId });
    
    // 3. ✅ Usuario automáticamente premium si payment.data.data.status === 'COMPLETED'
    if (payment.data.data.status === 'COMPLETED') {
      console.log('¡Usuario ahora es premium!');
      // Actualizar UI, recargar perfil, etc.
    }
    
  } catch (error) {
    console.error('Error en el pago:', error.response?.data?.message);
  }
};
```

## 🔍 Estados de Pago

| Estado | Descripción | Acción del Frontend |
|--------|-------------|-------------------|
| `PENDING` | Orden creada, esperando pago | Mostrar botón "Procesar Pago" |
| `COMPLETED` | Pago exitoso, usuario premium | Actualizar UI, ocultar botón pago |
| `FAILED` | Pago falló | Mostrar error, permitir reintentar |
| `CANCELLED` | Pago cancelado | Permitir crear nueva orden |

## ⚠️ Puntos Importantes

1. **Después de `create-order`**: El frontend debe llamar inmediatamente a `process` con el `orderId`
2. **No hay demora**: El proceso es instantáneo (simulado)
3. **Usuario premium automático**: Si el pago es exitoso, el usuario ya es premium
4. **Sin webhooks reales**: En esta implementación simulada no hay callbacks externos
5. **Reintentos**: Si falla, crear nueva orden (no reutilizar `orderId`)

## 🎨 Ejemplo de UI

```javascript
const PaymentModal = ({ isOpen, onClose, user }) => {
  const [step, setStep] = useState(1); // 1: Confirmar, 2: Procesando, 3: Resultado
  const { handlePayment, loading } = usePayment();

  const onConfirmPayment = async () => {
    setStep(2); // Mostrar "Procesando..."
    
    const result = await handlePayment();
    
    setStep(3); // Mostrar resultado
    
    if (result.success) {
      setTimeout(() => {
        onClose();
        window.location.reload(); // Recargar para actualizar estado
      }, 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {step === 1 && (
        <div>
          <h3>Obtener Acceso Premium</h3>
          <p>Precio: S/ 15.00 PEN</p>
          <p>Duración: 30 días</p>
          <button onClick={onConfirmPayment}>Confirmar Pago</button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h3>Procesando pago...</h3>
          <div className="spinner"></div>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h3>¡Pago exitoso!</h3>
          <p>Ya tienes acceso premium por 30 días</p>
        </div>
      )}
    </Modal>
  );
};
```

## 🔧 Debugging

Si el pago no funciona, verificar:

1. **Usuario autenticado**: `create-order` requiere token
2. **orderId válido**: Usar el ID devuelto por `create-order`
3. **Estado de la orden**: Debe estar en `PENDING`
4. **Respuesta del servidor**: Verificar `status` en la respuesta
5. **Errores de red**: Verificar CORS y conectividad

El flujo es: **Crear Orden → Procesar Pago → Usuario Premium Automáticamente** ✅