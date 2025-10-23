import axios from 'axios'

/**
 * Configuración de Axios para el Frontend
 * Maneja las peticiones HTTP al backend
 */

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:3001', // URL del backend
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Manejar errores de red
    if (!error.response) {
      console.error('Error de conexión con el servidor')
      return Promise.reject(new Error('Error de conexión con el servidor'))
    }

    // Manejar errores HTTP específicos
    const { status, data } = error.response

    switch (status) {
      case 400:
        console.error('Petición inválida:', data.message || 'Datos incorrectos')
        break
      case 401:
        console.error('No autorizado:', data.message || 'Token inválido o expirado')
        // Limpiar token si es inválido
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        break
      case 403:
        console.error('Acceso denegado:', data.message || 'Sin permisos suficientes')
        break
      case 404:
        console.error('Recurso no encontrado:', data.message || 'Endpoint no existe')
        break
      case 409:
        console.error('Conflicto:', data.message || 'Recurso ya existe')
        break
      case 422:
        console.error('Datos no procesables:', data.message || 'Validación fallida')
        break
      case 429:
        console.error('Demasiadas peticiones:', data.message || 'Límite de rate excedido')
        break
      case 500:
        console.error('Error del servidor:', data.message || 'Error interno del servidor')
        break
      default:
        console.error(`Error HTTP ${status}:`, data.message || 'Error desconocido')
    }

    return Promise.reject(error)
  }
)

/**
 * Funciones de utilidad para peticiones HTTP
 */
export const apiUtils = {
  /**
   * Realiza una petición GET
   * @param {string} url - URL del endpoint
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  get: (url, config = {}) => api.get(url, config),

  /**
   * Realiza una petición POST
   * @param {string} url - URL del endpoint
   * @param {Object} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  post: (url, data = {}, config = {}) => api.post(url, data, config),

  /**
   * Realiza una petición PUT
   * @param {string} url - URL del endpoint
   * @param {Object} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  put: (url, data = {}, config = {}) => api.put(url, data, config),

  /**
   * Realiza una petición DELETE
   * @param {string} url - URL del endpoint
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  delete: (url, config = {}) => api.delete(url, config),

  /**
   * Configura la URL base del API
   * @param {string} baseURL - Nueva URL base
   */
  setBaseURL: (baseURL) => {
    api.defaults.baseURL = baseURL
  },

  /**
   * Configura el timeout de las peticiones
   * @param {number} timeout - Timeout en milisegundos
   */
  setTimeout: (timeout) => {
    api.defaults.timeout = timeout
  }
}

export default api