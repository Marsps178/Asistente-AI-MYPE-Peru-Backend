/**
 * Rutas de Régimen Tributario
 * Define los endpoints relacionados con el cálculo de regímenes tributarios
 */

const express = require('express');
const router = express.Router();
const taxRegimeController = require('../controllers/taxRegimeController');
const { validateTaxRegimeCalculation } = require('../middleware/validators');

/**
 * @route POST /api/tax-regime/calculate
 * @desc Calcula el régimen tributario apropiado basado en ingresos mensuales
 * @access Public
 */
router.post('/calculate', validateTaxRegimeCalculation, taxRegimeController.calculateRegime);

/**
 * @route GET /api/tax-regime/regimes
 * @desc Obtiene información de todos los regímenes tributarios disponibles
 * @access Public
 */
router.get('/regimes', taxRegimeController.getAllRegimes);

/**
 * @route GET /api/tax-regime/health
 * @desc Endpoint de salud para verificar el servicio de régimen tributario
 * @access Public
 */
router.get('/health', taxRegimeController.healthCheck);

module.exports = router;