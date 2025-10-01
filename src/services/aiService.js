/**
 * Servicio de Inteligencia Artificial
 * Maneja la comunicación con Google Gemini AI
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.googleAI.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.googleAI.model });
    this.systemPrompt = `
      Eres un asistente virtual llamado 'Asistente AI-MYPE Peru'. 
      Tu misión es ayudar a los emprendedores peruanos a formalizarse. 
      Eres amigable, motivador y experto en los regímenes tributarios para pequeñas empresas (Nuevo RUS, RER, RMT). 
      Tu lenguaje es sencillo y directo.
      No respondas preguntas que no sean sobre negocios, emprendimiento o impuestos en Peru.
    `;
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
            parts: [{ 
              text: "¡Hola! Soy tu asistente para la formalización. Estoy listo para ayudarte a hacer crecer tu negocio. ¿Cuál es tu consulta?" 
            }] 
          },
        ],
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

¿Te gustaría que calculemos qué régimen te conviene más según tus ingresos?`;
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

¿Quieres que te ayude a calcular cuánto pagarías en este régimen?`;
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

¿Te ayudo a evaluar si este régimen te conviene?`;
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

¡Compárteme estos datos y te ayudo al instante!`;
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

¿En qué puedo ayudarte hoy? 😊`;
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

¡Estoy aquí para ayudarte! 😊`;
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