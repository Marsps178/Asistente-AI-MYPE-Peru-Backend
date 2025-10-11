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
    // RMT (Régimen MYPE Tributario)
    if (annualIncome <= config.taxRegimes.rmt.maxAnnualIncome) {
      return this._calculateRMT(income);
    }

    // Régimen General
    return this._calculateGeneral(income);
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
      message: `Con el RER, tu pago a cuenta de Renta sería del 1.5% mensual (S/ ${taxPayment.toFixed(2)}). Además, corresponde IGV al ${Math.round(config.igv.rate*100)}%.`,
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
   * Calcula información para Régimen MYPE Tributario (RMT)
   * @private
   */
  _calculateRMT(income) {
    const annualIncome = income * 12;
    const lowThreshold = config.taxRegimes.rmt.thresholds.lowAnnualIncome;
    const monthlyRate = annualIncome <= lowThreshold ? config.taxRegimes.rmt.rates.monthlyLow : config.taxRegimes.rmt.rates.monthlyHigh;
    const monthlyPayment = income * monthlyRate;

    return {
      regime: 'Régimen MYPE Tributario (RMT)',
      payment: monthlyPayment,
      message: `En el RMT, tu pago a cuenta mensual de Renta sería del ${Math.round(monthlyRate*100)}% (S/ ${monthlyPayment.toFixed(2)}). Además, aplica IGV al ${Math.round(config.igv.rate*100)}%.`,
      benefits: [
        'Puedes emitir cualquier tipo de comprobante.',
        'Permite deducir gastos y llevar contabilidad según nivel de ingresos.',
        'Adecuado para crecimiento sostenido dentro de 1,700 UIT anuales.'
      ],
      details: {
        monthlyIncome: income,
        annualIncome,
        taxType: `Pago a cuenta de Renta (${(monthlyRate*100).toFixed(1)}%) + IGV`,
        igvIncluded: false,
        thresholds: {
          maxAnnualIncome: config.taxRegimes.rmt.maxAnnualIncome,
          lowAnnualIncome: lowThreshold
        },
        annualRegularization: {
          note: 'Se calcula sobre la utilidad neta anual, no sobre ingresos brutos.',
          lowRateUntil: `${config.taxRegimes.rmt.annualRates.lowUIT} UIT`,
          lowRate: config.taxRegimes.rmt.annualRates.lowRate,
          highRate: config.taxRegimes.rmt.annualRates.highRate
        }
      }
    };
  }

  /**
   * Calcula información para Régimen General (RG)
   * @private
   */
  _calculateGeneral(income) {
    const annualIncome = income * 12;
    return {
      regime: 'Régimen General (RG)',
      message: 'Por tu nivel de ingresos, correspondería el Régimen General. Aquí la renta anual se determina sobre la utilidad neta con tasa 29.5%, y aplica IGV al 18% donde corresponda.',
      benefits: [
        'Sin límites de ingresos ni actividades.',
        'Puede emitir todo tipo de comprobantes.',
        'Permite arrastre de pérdidas contra utilidades futuras.'
      ],
      details: {
        monthlyIncome: income,
        annualIncome,
        taxType: 'Determinación anual de Renta (29.5% sobre utilidad neta) + IGV',
        igvIncluded: false,
        recommendation: 'Llevar contabilidad completa y consultar coeficientes/anticipos según SUNAT.'
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
        name: 'Régimen MYPE Tributario (RMT)',
        maxAnnualIncome: config.taxRegimes.rmt.maxAnnualIncome,
        thresholds: {
          lowAnnualIncome: config.taxRegimes.rmt.thresholds.lowAnnualIncome
        },
        description: 'Para micro y pequeñas empresas hasta 1,700 UIT anuales',
        requirements: [
          `Ingresos netos anuales ≤ 1,700 UIT (UIT ${config.uit.value})`,
          'Pago a cuenta mensual 1% si ≤ 300 UIT; 1.5% si > 300 UIT',
          'IGV 18% donde corresponda'
        ]
      },
      general: {
        name: 'Régimen General (RG)',
        description: 'Sin límites de ingresos; contabilidad completa',
        requirements: ['Determinación anual de Renta 29.5% sobre utilidad neta', 'Llevar libros completos']
      }
    };
  }
}

module.exports = new TaxRegimeService();