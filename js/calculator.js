/**
 * Electrowerk Technologies - Solar Savings & Sizing Calculator (PKR Currency)
 * High precision financial & energy modeling engine
 */

(function () {
  'use strict';

  // Engineering Constants & Default NEPRA Tariffs in PKR
  const MODEL_PARAMS = {
    residential: {
      avgTariff: 62.0, // PKR per kWh
      yieldPerKwp: 1550, // kWh / kWp / year in Pakistan
      areaPerKwp: 65, // sq. ft per kWp
      offsetTarget: 0.90, // 90% bill offset
      costPerWatt: 145 // PKR / Wp turnkey estimate
    },
    commercial: {
      avgTariff: 68.0, // PKR per kWh
      yieldPerKwp: 1580,
      areaPerKwp: 60,
      offsetTarget: 0.85,
      costPerWatt: 135
    },
    industrial: {
      avgTariff: 56.0, // PKR per kWh (B3 / B4 Industrial)
      yieldPerKwp: 1600,
      areaPerKwp: 55,
      offsetTarget: 0.80,
      costPerWatt: 120
    }
  };

  const CO2_FACTOR_PER_KWH = 0.000785; // Metric Tons CO2 per kWh
  const TREES_PER_TON_CO2 = 45; // Trees per ton CO2/yr

  // DOM Elements
  const billSlider = document.getElementById('calcBillInput');
  const billDisplay = document.getElementById('calcBillVal');
  const areaSlider = document.getElementById('calcAreaInput');
  const areaDisplay = document.getElementById('calcAreaVal');
  const systemSelect = document.getElementById('calcSystemType');
  const typeButtons = document.querySelectorAll('.calc-type-btn');

  // Outputs
  const outSystemSize = document.getElementById('resSystemSize');
  const outAnnualGen = document.getElementById('resAnnualGen');
  const outAnnualSavings = document.getElementById('resAnnualSavings');
  const outLifetimeSavings = document.getElementById('resLifetimeSavings');
  const outCo2Offset = document.getElementById('resCo2Offset');
  const outTrees = document.getElementById('resTrees');
  const outPayback = document.getElementById('resPayback');
  const btnGetProposal = document.getElementById('calcGetProposalBtn');

  let currentCategory = 'commercial'; // Default

  function formatCurrencyPKR(val) {
    if (val >= 10000000) {
      return 'PKR ' + (val / 10000000).toFixed(2) + ' Crore';
    } else if (val >= 1000000) {
      return 'PKR ' + (val / 100000).toFixed(2) + ' Lakh';
    }
    return 'PKR ' + Math.round(val).toLocaleString('en-US');
  }

  function formatNumber(val, decimals = 0) {
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function recalculate() {
    if (!billSlider || !areaSlider) return;

    const bill = parseFloat(billSlider.value) || 250000;
    const area = parseFloat(areaSlider.value) || 5000;
    const config = MODEL_PARAMS[currentCategory] || MODEL_PARAMS.commercial;

    // Update Slider Displays in PKR
    if (billDisplay) billDisplay.textContent = `PKR ${formatNumber(bill)}`;
    if (areaDisplay) areaDisplay.textContent = `${formatNumber(area)} sq.ft`;

    // 1. Monthly & Annual Energy Consumption
    const monthlyKwh = bill / config.avgTariff;
    const annualKwhNeeded = monthlyKwh * 12 * config.offsetTarget;

    // 2. Capacity by Bill vs Capacity by Roof Area
    const targetKwp = annualKwhNeeded / config.yieldPerKwp;
    const maxKwpFromArea = area / config.areaPerKwp;

    // Recommend optimal size
    const recommendedKwp = Math.min(targetKwp, maxKwpFromArea);
    const roundedSize = Math.max(3.0, Math.round(recommendedKwp * 10) / 10);

    // 3. Generation & Savings in PKR
    const annualGenKwh = Math.round(roundedSize * config.yieldPerKwp);
    const annualSavingsVal = Math.min(bill * 12 * 0.95, annualGenKwh * config.avgTariff);
    
    // 25-Year Cumulative Savings factoring 6% annual inflation
    let cumulativeSavings = 0;
    let currentYearSavings = annualSavingsVal;
    for (let yr = 1; yr <= 25; yr++) {
      cumulativeSavings += currentYearSavings;
      currentYearSavings *= 1.06;
    }

    // 4. Environmental Impact
    const co2Tons = Math.round(annualGenKwh * CO2_FACTOR_PER_KWH * 10) / 10;
    const treesCount = Math.round(co2Tons * TREES_PER_TON_CO2);

    // 5. Payback Period in Pakistan
    const turnkeyCostPKR = roundedSize * 1000 * config.costPerWatt;
    const paybackYears = Math.min(6.5, Math.max(2.2, Math.round((turnkeyCostPKR / annualSavingsVal) * 10) / 10));

    // Update DOM
    if (outSystemSize) outSystemSize.textContent = `${roundedSize} kWp`;
    if (outAnnualGen) outAnnualGen.textContent = `${formatNumber(annualGenKwh)} kWh`;
    if (outAnnualSavings) outAnnualSavings.textContent = `PKR ${formatNumber(annualSavingsVal)} / yr`;
    if (outLifetimeSavings) outLifetimeSavings.textContent = formatCurrencyPKR(cumulativeSavings);
    if (outCo2Offset) outCo2Offset.textContent = `${co2Tons} Tons/yr`;
    if (outTrees) outTrees.textContent = `${formatNumber(treesCount)} Trees`;
    if (outPayback) outPayback.textContent = `${paybackYears} Years`;

    return {
      category: currentCategory,
      systemSize: roundedSize,
      bill: bill,
      area: area,
      annualSavings: annualSavingsVal,
      systemType: systemSelect ? systemSelect.value : 'On-Grid Solar System'
    };
  }

  // Setup Event Listeners
  if (billSlider) {
    billSlider.addEventListener('input', recalculate);
  }
  if (areaSlider) {
    areaSlider.addEventListener('input', recalculate);
  }
  if (systemSelect) {
    systemSelect.addEventListener('change', recalculate);
  }

  // Category Selector Buttons
  typeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      typeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.getAttribute('data-type') || 'commercial';
      
      // Auto-adjust sliders to realistic ranges based on customer type in Pakistan (PKR)
      if (currentCategory === 'residential') {
        billSlider.min = 20000;
        billSlider.max = 300000;
        billSlider.step = 5000;
        billSlider.value = 75000;

        areaSlider.min = 500;
        areaSlider.max = 6000;
        areaSlider.step = 100;
        areaSlider.value = 1800;
      } else if (currentCategory === 'commercial') {
        billSlider.min = 80000;
        billSlider.max = 2500000;
        billSlider.step = 20000;
        billSlider.value = 350000;

        areaSlider.min = 1500;
        areaSlider.max = 25000;
        areaSlider.step = 500;
        areaSlider.value = 7500;
      } else if (currentCategory === 'industrial') {
        billSlider.min = 300000;
        billSlider.max = 12000000;
        billSlider.step = 50000;
        billSlider.value = 1500000;

        areaSlider.min = 5000;
        areaSlider.max = 100000;
        areaSlider.step = 1000;
        areaSlider.value = 35000;
      }

      recalculate();
    });
  });

  // Bridge "Get My Solar Proposal" to Contact Form (PKR)
  if (btnGetProposal) {
    btnGetProposal.addEventListener('click', function (e) {
      e.preventDefault();
      const calcData = recalculate();

      // Scroll to Contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Pre-fill form fields
      setTimeout(() => {
        const formBill = document.getElementById('contactBill');
        const formType = document.getElementById('contactProjectType');
        const formNotes = document.getElementById('contactMessage');

        if (formBill) formBill.value = `PKR ${formatNumber(calcData.bill)} / month`;
        
        if (formType) {
          if (calcData.category === 'residential') formType.value = 'Residential Solar';
          else if (calcData.category === 'industrial') formType.value = 'Industrial 1MW+ Solar';
          else formType.value = 'Commercial Rooftop Solar';
        }

        if (formNotes) {
          formNotes.value = `[Inquiry via Solar Savings Calculator] Recommended System Size: ${calcData.systemSize} kWp (${calcData.systemType}), Est. Monthly Electricity Bill: PKR ${formatNumber(calcData.bill)}, Available Area: ${formatNumber(calcData.area)} sq.ft, Estimated Annual Savings: PKR ${formatNumber(calcData.annualSavings)}/yr. Please provide complete turnkey EPC proposal and Net-Metering schedule.`;
          formNotes.focus();
        }
      }, 500);
    });
  }

  // Initial calculation on load
  document.addEventListener('DOMContentLoaded', recalculate);
})();
