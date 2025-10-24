const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3001';

function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ data: parsed, status: res.statusCode });
        } catch (e) {
          resolve({ data: body, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testPaymentFlow() {
  console.log('🧪 Iniciando prueba del flujo de pagos...\n');

  try {
    // 1. Crear orden de pago (URL corregida)
    console.log('1️⃣ Creando orden de pago...');
    const orderResponse = await makeRequest(`${BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    }, {
      amount: 15.00,
      currency: 'PEN'
    });

    if (orderResponse.status !== 200) {
      throw new Error(`Error creando orden: ${orderResponse.status} - ${JSON.stringify(orderResponse.data)}`);
    }

    console.log('✅ Orden creada:', {
      orderId: orderResponse.data.data.orderId,
      amount: orderResponse.data.data.amount,
      currency: orderResponse.data.data.currency
    });

    const orderId = orderResponse.data.data.orderId;

    // 2. Procesar pago con QR code (URL corregida)
    console.log('\n2️⃣ Procesando pago con QR code...');
    const paymentResponse = await makeRequest(`${BASE_URL}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      orderId: orderId,
      paymentMethod: 'qr_code'
    });

    if (paymentResponse.status !== 200) {
      throw new Error(`Error procesando pago: ${paymentResponse.status} - ${JSON.stringify(paymentResponse.data)}`);
    }

    console.log('✅ Pago procesado:', {
      success: paymentResponse.data.success,
      transactionId: paymentResponse.data.data.transactionId,
      status: paymentResponse.data.data.status
    });

    // 3. Verificar estado del pago (URL corregida)
    console.log('\n3️⃣ Verificando estado del pago...');
    const statusResponse = await makeRequest(`${BASE_URL}/payments/${orderId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (statusResponse.status !== 200) {
      throw new Error(`Error verificando estado: ${statusResponse.status} - ${JSON.stringify(statusResponse.data)}`);
    }

    console.log('✅ Estado verificado:', {
      status: statusResponse.data.data.status,
      amount: statusResponse.data.data.amount,
      transactionId: statusResponse.data.data.transactionId
    });

    console.log('\n🎉 ¡Flujo de pagos completado exitosamente!');

  } catch (error) {
    console.error('\n❌ Error en el flujo de pagos:');
    console.error('Error:', error.message);
  }
}

// Ejecutar la prueba
testPaymentFlow();