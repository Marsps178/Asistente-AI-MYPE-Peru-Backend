import api from './api.js'

/**
 * Servicio para manejar operaciones del chat con IA
 */
export const chatService = {
  /**
   * Envía un mensaje al asistente de IA
   * @param {string} message - Mensaje a enviar
   * @returns {Promise<Object>} Respuesta del asistente
   */
  async sendMessage(message) {
    try {
      if (!message || message.trim().length === 0) {
        throw new Error('El mensaje no puede estar vacío')
      }

      if (message.length > 2000) {
        throw new Error('El mensaje no puede exceder 2000 caracteres')
      }

      const response = await api.post('/chat/message', { 
        message: message.trim() 
      })
      return response.data
    } catch (error) {
      console.error('Error enviando mensaje:', error.message)
      
      // Si el servidor responde con un error específico, usar ese mensaje
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  /**
   * Obtiene el historial de chat del usuario autenticado
   * @param {number} page - Página a obtener (por defecto 1)
   * @param {number} limit - Límite de mensajes por página (por defecto 10)
   * @returns {Promise<Object>} Historial de chat
   */
  async getChatHistory(page = 1, limit = 10) {
    try {
      const response = await api.get(`/chat/history?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo historial de chat:', error.message)
      
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  /**
   * Obtiene información sobre el asistente de IA
   * @returns {Promise<Object>} Información del asistente
   */
  async getAssistantInfo() {
    try {
      const response = await api.get('/chat/info')
      return response.data
    } catch (error) {
      console.error('Error obteniendo información del asistente:', error.message)
      throw error
    }
  },

  /**
   * Verifica el estado del servicio de chat
   * @returns {Promise<Object>} Estado del servicio
   */
  async checkHealth() {
    try {
      const response = await api.get('/chat/health')
      return response.data
    } catch (error) {
      console.error('Error verificando salud del chat:', error.message)
      throw error
    }
  }
}

export default chatService