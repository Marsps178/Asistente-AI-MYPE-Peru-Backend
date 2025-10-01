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
      console.error('Error en AIService.sendMessage:', error);
      throw new Error('Error al comunicarse con el servicio de IA');
    }
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