/**
 * Servicio de Inteligencia Artificial
 * Maneja la comunicación con Google Gemini AI
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.googleAI.apiKey);
    this.systemPrompt = `
      Rol: Eres el 'LEGALYTH IA'. Ayudas a emprendedores peruanos a elegir y cumplir el régimen tributario adecuado, explicar obligaciones y guiar pasos prácticos de formalización.

      Alcance: Perú, MYPES (micro y pequeñas empresas). No respondas fuera de negocios/emprendimiento/impuestos peruanos.

      Base de conocimiento (2025, usar como referencia, no inventar):
      - Nuevo RUS (NRUS): Personas naturales/sucesiones indivisas para clientes consumidores finales y oficios. Límites: ingresos y compras hasta S/ 96,000 anuales (S/ 8,000 mensuales), activos fijos hasta S/ 70,000 (sin predios/vehículos). Cuotas: Cat.1 (hasta S/ 5,000) S/ 20; Cat.2 (hasta S/ 8,000) S/ 50; categoría especial agrícola hasta S/ 60,000 S/ 0. Comprobantes: boletas, tickets, guías (sin crédito fiscal). Exclusiones: actividades profesionales, transporte ≥ 2t, pasajeros, agencias, casinos, espectáculos, inmuebles, combustibles.
      - RER (Régimen Especial de Renta): Pequeñas empresas de comercialización/servicios. Límites: ingresos netos anuales ≤ S/ 525,000; compras ≤ S/ 525,000; activos fijos ≤ S/ 126,000; hasta 10 trabajadores por turno. Impuestos: Renta 1.5% mensual sobre ingresos netos; IGV 18%. Libros: Registro de Compras y Registro de Ventas. Exclusiones: construcción, transporte ≥ 2t, pasajeros, actividades profesionales.
      - RMT (Régimen MYPE Tributario): Para rentas de tercera categoría. Límite: ingresos netos anual ≤ 1,700 UIT. UIT 2025 = S/ 5,350 → 1,700 UIT = S/ 9,095,000. Impuesto mensual: si ingresos ≤ 300 UIT, 1% de ingresos netos; si > 300 UIT, 1.5% o coeficiente (el mayor). IGV 18%. Regularización anual: hasta 15 UIT (S/ 80,250) tasa 10%; exceso 29.5%. Libros: hasta 300 UIT: Registro de Ventas y Compras + Libro Diario simplificado; 300–500 UIT: añadir Libro Diario y Mayor; 500–1,700 UIT: añadir Inventarios y Balances. Exclusiones: vinculados que superen 1,700 UIT, sucursales del exterior, IEP.
      - Régimen General (RG): Sin límites de ingreso/actividad. Contabilidad completa. Declaración anual con 29.5% sobre utilidad neta. Pérdidas se arrastran a utilidades futuras.
      - Registros contables: Registro de Compras/Registro de Ventas obligatorios según régimen; desde julio 2023 obligación gradual de RVIE (Registro de Ventas e Ingresos Electrónicos). Formalidades: legalización y cumplimiento de cronología/correlatividad donde aplique.
      - Conversión UIT 2025: 15 UIT = S/ 80,250; 300 UIT = S/ 1,605,000; 500 UIT = S/ 2,675,000; 1,700 UIT = S/ 9,095,000.

      Comportamiento:
      - Haz 2–4 preguntas de aclaración antes de recomendar: ingresos mensuales aproximados, tipo de actividad, si requiere emitir facturas, clientes (finales vs empresas), nivel de gastos deducibles.
      - Responde en lenguaje sencillo y directo, enfocado en acción.
      - Estructura tus respuestas con: Resumen, Requisitos y límites, Impuestos y pagos (mensual/anual y IGV), Libros y obligaciones, Recomendación, Siguientes pasos.
      - Incluye SIEMPRE al final una sección "Fuentes oficiales" con 2–3 enlaces relevantes, priorizando SUNAT: https://orientacion.sunat.gob.pe/, https://www.gob.pe/sunat, https://www.sunat.gob.pe/ (y páginas específicas si son pertinentes).
      - Si detectas información sensible a cambios (UIT, tasas, exclusiones), advierte que se debe validar en SUNAT y que las cifras pueden actualizarse.
      - No inventes cifras. Si falta un dato, pide la información o indica cómo calcularlo.
    `;
    this.model = this.genAI.getGenerativeModel({ model: config.googleAI.model, systemInstruction: this.systemPrompt });
  }

  /**
   * Envía un mensaje al modelo de IA y obtiene una respuesta
   * @param {string} message - Mensaje del usuario
   * @returns {Promise<string>} - Respuesta de la IA
   */
  async sendMessage(message) {
    try {
      // Intentar usar la API real primero
      const chat = this.model.startChat({
        history: [
          { role: "user", parts: [{ text: this.systemPrompt }] },
          {
            role: "model",
            parts: [{ text: "¡Hola! Soy tu asistente AI-MYPE Perú. Cuéntame tu caso y te ayudo a elegir el régimen adecuado." }]
          }
        ]
      });

      const result = await chat.sendMessage(message);
      const response = result.response;
      
      return response.text();
    } catch (error) {
      console.error('Error en AIService.sendMessage (usando respuesta mock):', error.message);
      
      // Si falla la API real, usar respuestas mock para desarrollo
      return this.getMockResponse(message);
    }
  }

  /**
   * Genera respuestas mock para desarrollo cuando la API real no está disponible
   * @param {string} message - Mensaje del usuario
   * @returns {string} - Respuesta mock
   */
  getMockResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('nuevo rus') || lowerMessage.includes('rus')) {
      return `🏢 **Nuevo RUS (Régimen Único Simplificado)**

El Nuevo RUS es perfecto para pequeños negocios como el tuyo. Te permite:

✅ **Beneficios:**
- Pagos fijos mensuales (S/ 20 o S/ 50)
- No llevar libros contables complicados
- Comprobantes de pago simples
- Ideal para ingresos hasta S/ 8,000 mensuales

💰 **Pagos:**
- Hasta S/ 5,000 mensuales: S/ 20
- De S/ 5,001 a S/ 8,000: S/ 50

¿Te gustaría que calculemos qué régimen te conviene más según tus ingresos?

Fuentes oficiales:
- https://orientacion.sunat.gob.pe/
- https://www.gob.pe/sunat
- https://www.sunat.gob.pe/`;
    }
    
    if (lowerMessage.includes('rer') || lowerMessage.includes('especial')) {
      return `📊 **RER (Régimen Especial de Renta)**

El RER es ideal para negocios en crecimiento:

✅ **Características:**
- Para ingresos anuales hasta S/ 525,000
- Pago del 1.5% de ingresos netos mensuales
- Puedes emitir facturas
- Más flexibilidad que el Nuevo RUS

💡 **¿Cuándo elegirlo?**
- Cuando superas los límites del Nuevo RUS
- Si necesitas emitir facturas
- Para negocios con ingresos variables

¿Quieres que te ayude a calcular cuánto pagarías en este régimen?

Fuentes oficiales:
- https://orientacion.sunat.gob.pe/
- https://www.gob.pe/sunat
- https://www.sunat.gob.pe/`;
    }
    
    if (lowerMessage.includes('mype') || lowerMessage.includes('tributario')) {
      return `🚀 **MYPE Tributario**

El régimen para empresas que van en serio:

✅ **Ventajas:**
- Para ingresos hasta 1,700 UIT anuales
- Tasa progresiva: 10% hasta 15 UIT, 29.5% el exceso
- Puedes deducir todos tus gastos
- Ideal para empresas formales

📈 **Perfecto si:**
- Tienes ingresos altos y regulares
- Manejas muchos gastos deducibles
- Quieres crecer sin límites

¿Te ayudo a evaluar si este régimen te conviene?

Fuentes oficiales:
- https://orientacion.sunat.gob.pe/
- https://www.gob.pe/sunat
- https://www.sunat.gob.pe/`;
    }
    
    if (lowerMessage.includes('calcular') || lowerMessage.includes('cuanto')) {
      return `🧮 **¡Calculemos juntos!**

Para darte la mejor recomendación necesito saber:

1. 💰 ¿Cuáles son tus ingresos mensuales aproximados?
2. 🏪 ¿Qué tipo de negocio tienes?
3. 📄 ¿Necesitas emitir facturas a empresas?

Con esta información te diré exactamente:
- Qué régimen te conviene
- Cuánto pagarías mensualmente
- Qué beneficios tendrías

¡Compárteme estos datos y te ayudo al instante!

Fuentes oficiales:
- https://orientacion.sunat.gob.pe/
- https://www.gob.pe/sunat
- https://www.sunat.gob.pe/`;
    }
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('ayuda')) {
      return `¡Hola! 👋 Soy tu **Asistente AI-MYPE Peru**

Estoy aquí para ayudarte a formalizar tu negocio y elegir el mejor régimen tributario. 

🎯 **Puedo ayudarte con:**
- Nuevo RUS, RER y MYPE Tributario
- Calcular cuánto pagarías en cada régimen
- Explicarte los beneficios de formalizarte
- Resolver tus dudas sobre impuestos

💡 **Pregúntame cosas como:**
- "¿Qué es el Nuevo RUS?"
- "¿Cuánto pagaría con ingresos de S/ 3,000?"
- "¿Qué régimen me conviene?"

¿En qué puedo ayudarte hoy? 😊

Fuentes oficiales:
- https://orientacion.sunat.gob.pe/
- https://www.gob.pe/sunat
- https://www.sunat.gob.pe/`;
    }
    
    // Respuesta por defecto
    return `🤖 **Asistente AI-MYPE Peru**

Entiendo que tienes una consulta sobre formalización de negocios. 

Soy especialista en:
- 📋 Regímenes tributarios (Nuevo RUS, RER, MYPE)
- 💰 Cálculos de pagos mensuales
- 📊 Comparación de beneficios
- 🚀 Consejos para formalizar tu negocio

¿Podrías ser más específico sobre qué necesitas saber? Por ejemplo:
- "Explícame el Nuevo RUS"
- "¿Cuánto pagaría con S/ 4,000 de ingresos?"
- "¿Qué régimen me conviene?"

¡Estoy aquí para ayudarte! 😊

Fuentes oficiales:
- https://orientacion.sunat.gob.pe/
- https://www.gob.pe/sunat
- https://www.sunat.gob.pe/`;
  }

  /**
   * Verifica si el servicio de IA está disponible
   * @returns {boolean} - Estado del servicio
   */
  isAvailable() {
    return !!config.googleAI.apiKey;
  }
}

module.exports = new AIService();