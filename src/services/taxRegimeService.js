/**
 * Servicio de Cálculo de Régimen Tributario
 * Maneja la lógica de negocio para determinar el régimen tributario apropiado
 */

const config = require('../config/config');

class TaxRegimeService {
  /**
   * Calcula el régimen tributario apropiado basado en los ingresos mensuales
   * @param {number} monthlyIncome - Ingresos mensuales en soles
   * @returns {Object} - Información del régimen tributario
   */
  calculateRegime(monthlyIncome) {
    const income = parseFloat(monthlyIncome);

    if (isNaN(income) || income <= 0) {
      throw new Error('Por favor, ingresa un monto válido.');
    }

    // Nuevo RUS
    if (income <= config.taxRegimes.nuevoRUS.maxIncome) {
      return this._calculateNuevoRUS(income);
    }

    // RER (Régimen Especial de Renta)
    const annualIncome = income * 12;
    if (annualIncome <= config.taxRegimes.rer.maxAnnualIncome) {
      return this._calculateRER(income);
    }

    // MYPE Tributario o Régimen General
    return this._calculateMYPEOrGeneral(income);
  }

  /**
   * Calcula información para Nuevo RUS
   * @private
   */
  _calculateNuevoRUS(income) {
    const { payments } = config.taxRegimes.nuevoRUS;
    const payment = income <= payments.low.threshold ? payments.low.amount : payments.high.amount;

    return {
      regime: 'Nuevo RUS',
      payment: payment,
      message: `Con S/ ${income.toFixed(2)} de ingresos, tu pago único mensual sería de S/ ${payment.toFixed(2)}. ¡Es perfecto para empezar!`,
      benefits: [
        'Puedes emitir boletas de venta.',
        'Acceso a créditos para emprendedores.',
        'Te permite tener un negocio formal de manera muy sencilla.'
      ],
      details: {
        monthlyIncome: income,
        annualIncome: income * 12,
        taxType: 'Pago único mensual',
        igvIncluded: true
      }
    };
  }

  /**
   * Calcula información para RER
   * @private
   */
  _calculateRER(income) {
    const taxPayment = income * config.taxRegimes.rer.taxRate;

    return {
      regime: 'Régimen Especial de Renta (RER)',
      payment: taxPayment,
      message: `Con el RER, tu pago a cuenta de Renta sería del 1.5% mensual (S/ ${taxPayment.toFixed(2)}) más el IGV correspondiente.`,
      benefits: [
        'Puedes emitir facturas.',
        'Contabilidad simplificada (solo Compras y Ventas).',
        'Sin límite de compras.'
      ],
      details: {
        monthlyIncome: income,
        annualIncome: income * 12,
        taxType: 'Pago a cuenta de Renta (1.5%) + IGV',
        igvIncluded: false,
        taxRate: config.taxRegimes.rer.taxRate
      }
    };
  }

  /**
   * Calcula información para MYPE Tributario o Régimen General
   * @private
   */
  _calculateMYPEOrGeneral(income) {
    return {
      regime: 'Régimen MYPE Tributario o Régimen General',
      message: 'Tus ingresos proyectan un gran crecimiento. El Régimen MYPE Tributario o el General son tus siguientes pasos. ¿Quieres que te explique más sobre ellos en el chat?',
      benefits: [
        'Acceso a mercados más grandes.',
        'Sin límite de ingresos.',
        'Mayor flexibilidad operativa.'
      ],
      details: {
        monthlyIncome: income,
        annualIncome: income * 12,
        recommendation: 'Consultar con un contador para determinar el régimen más conveniente'
      }
    };
  }

  /**
   * Obtiene información general sobre todos los regímenes
   * @returns {Object} - Información de todos los regímenes
   */
  getAllRegimesInfo() {
    return {
      nuevoRUS: {
        name: 'Nuevo RUS',
        maxMonthlyIncome: config.taxRegimes.nuevoRUS.maxIncome,
        description: 'Ideal para pequeños negocios que recién empiezan',
        requirements: ['Ingresos hasta S/ 8,000 mensuales', 'Solo boletas de venta']
      },
      rer: {
        name: 'Régimen Especial de Renta (RER)',
        maxAnnualIncome: config.taxRegimes.rer.maxAnnualIncome,
        taxRate: config.taxRegimes.rer.taxRate,
        description: 'Para negocios en crecimiento con mayor facturación',
        requirements: ['Ingresos hasta S/ 525,000 anuales', 'Puede emitir facturas']
      },
      mype: {
        name: 'Régimen MYPE Tributario',
        description: 'Para empresas con ingresos superiores a S/ 525,000 anuales',
        requirements: ['Sin límite de ingresos', 'Contabilidad completa']
      }
    };
  }
}

module.exports = new TaxRegimeService();