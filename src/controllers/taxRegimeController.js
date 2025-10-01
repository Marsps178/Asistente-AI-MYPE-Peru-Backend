/**
 * Controlador de Régimen Tributario
 * Maneja las peticiones relacionadas con el cálculo de regímenes tributarios
 */

const taxRegimeService = require('../services/taxRegimeService');
const { validationResult } = require('express-validator');

class TaxRegimeController {
  /**
   * Calcula el régimen tributario apropiado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async calculateRegime(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { monthlyIncome } = req.body;
      
      // Calcular régimen tributario
      const result = taxRegimeService.calculateRegime(monthlyIncome);
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error en calculateRegime:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Error al calcular el régimen tributario',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene información de todos los regímenes tributarios
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllRegimes(req, res) {
    try {
      const regimes = taxRegimeService.getAllRegimesInfo();
      
      res.json({
        success: true,
        data: regimes,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error en getAllRegimes:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al obtener información de regímenes',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Endpoint de salud para verificar el servicio
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async healthCheck(req, res) {
    res.json({
      success: true,
      message: 'Servicio de régimen tributario funcionando correctamente',
      service: 'tax-regime-service',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new TaxRegimeController();