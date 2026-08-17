/**
 * Electrowerk Technologies - Main Application Script
 * Navigation, Portfolio Filtering, Modal Dialogs, and Interactive Workflows
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Header and Scroll Spy ---
  const header = document.querySelector('.main-header');
  const scrollBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollBtn?.classList.add('visible');
    } else {
      scrollBtn?.classList.remove('visible');
    }
  });

  scrollBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNavMenu');

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('mobile-active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  // Close mobile menu when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('mobile-active');
      const icon = mobileToggle?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });

  // --- 3. Portfolio Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 4. Project Modal Lightbox Data & Handler ---
  const projectDatabase = {
    'proj-01': {
      title: 'Commercial Rooftop Solar Installation',
      code: 'PROJECT 01 - COMMERCIAL EPC',
      capacity: '500 kWp Solar System',
      category: 'Commercial Rooftop',
      location: 'Sundar Industrial Estate, Lahore',
      annualGen: '825,000 kWh / Year',
      co2Reduction: '580 Metric Tons / Year',
      panels: 'LONGi Hi-MO 6 Tier-1 Mono-PERC 580W',
      inverters: 'Huawei SUN2000-100KTL High-Efficiency String Inverters',
      completion: 'Commissioned Q1 2026',
      image: 'assets/images/project-commercial.jpg',
      description: 'Engineered for a major logistics & corporate manufacturing headquarters. The 500 kWp rooftop installation features aerodynamic non-penetrating aluminum mounting structures, integrated Net-Metering bi-directional power sync, and cloud SCADA yield telemetry.'
    },
    'proj-02': {
      title: 'Industrial Factory Solar Power Plant',
      code: 'PROJECT 02 - INDUSTRIAL MEGAWATT',
      capacity: '1 MW Solar Power Plant',
      category: 'Industrial Installation',
      location: 'Korangi Industrial Area, Karachi',
      annualGen: '1,720,000 kWh / Year',
      co2Reduction: '1,210 Metric Tons / Year',
      panels: 'JinkoSolar Tiger Neo N-Type TOPCon 610W Modules',
      inverters: 'Sungrow SG125HX Industrial Multi-MPPT Inverters',
      completion: 'Commissioned Q4 2025',
      image: 'assets/images/project-industrial.jpg',
      description: 'A flagship 1.0 MW industrial rooftop & ground integrated solar power station powering continuous heavy manufacturing lines. Includes automated reactive power compensation, 11kV medium-voltage step-up transformer substation, and drone thermal inspection.'
    },
    'proj-03': {
      title: 'Residential Villa Solar Installation',
      code: 'PROJECT 03 - RESIDENTIAL VILLA',
      capacity: '25 kW Rooftop System',
      category: 'Residential Luxury Villa',
      location: 'DHA Phase 6, Islamabad',
      annualGen: '39,500 kWh / Year',
      co2Reduction: '28.5 Metric Tons / Year',
      panels: 'SunPower Maxeon 6 Premium All-Black 430W',
      inverters: 'SolarEdge Home Hub Inverter with 20kWh Lithium Battery Backup',
      completion: 'Commissioned Q2 2026',
      image: 'assets/images/project-residential.jpg',
      description: 'Architecturally integrated ultra-high efficiency residential system designed with zero aesthetic compromise. Coupled with intelligent lithium battery storage and three-phase NEPRA green net-metering to achieve 95% bill reduction.'
    },
    'proj-04': {
      title: 'Solar Car Parking Structure',
      code: 'PROJECT 04 - SOLAR CARPORT',
      capacity: '250 kW Solar Carport',
      category: 'Commercial Carport & EV Station',
      location: 'Tech Park Campus, Rawalpindi',
      annualGen: '410,000 kWh / Year',
      co2Reduction: '295 Metric Tons / Year',
      panels: 'Canadian Solar BiHiKu7 Bifacial 660W Modules',
      inverters: 'SMA Sunny Tripower CORE2 High-Yield Inverters',
      completion: 'Commissioned Q3 2025',
      image: 'assets/images/project-carport.jpg',
      description: 'Dual-purpose solar carport covering 120 corporate parking bays with integrated fast EV charging stations. Generates high-yield bifacial clean energy while providing vehicle shade protection.'
    },
    'proj-05': {
      title: 'Ground Mounted Solar Farm',
      code: 'PROJECT 05 - UTILITY SCALE',
      capacity: '2 MW Solar Project',
      category: 'Utility Scale Power Farm',
      location: 'Multan Renewable Energy Corridor',
      annualGen: '3,550,000 kWh / Year',
      co2Reduction: '2,500 Metric Tons / Year',
      panels: 'Trina Solar Vertex 670W Ultra-High Power Modules',
      inverters: 'Fronius Tauro 100kW Central Inverter Network',
      completion: 'Commissioned Q1 2026',
      image: 'assets/images/project-ground.jpg',
      description: 'Utility-scale ground mounted installation utilizing single-axis tracking technology for 22% higher energy capture throughout peak irradiance hours. Fully synchronized to high-voltage national grid.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalClose = document.getElementById('closeProjectModal');
  const projectModalBody = document.getElementById('projectModalBody');

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const projId = this.getAttribute('data-project');
      const data = projectDatabase[projId];
      if (!data) return;

      projectModalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          <div style="position:relative; border-radius:16px; overflow:hidden; height:340px; border:1px solid #e2e8f0;">
            <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; top:1.25rem; right:1.25rem; background:rgba(7,18,43,0.9); color:#f59e0b; padding:0.45rem 1.15rem; border-radius:999px; font-weight:800; font-size:0.95rem; border:1px solid rgba(245,158,11,0.4);">
              ${data.capacity}
            </div>
          </div>
          <div>
            <div style="font-family:'JetBrains Mono', monospace; font-size:0.85rem; color:#0056e0; font-weight:700; text-transform:uppercase; margin-bottom:0.35rem;">
              ${data.code}
            </div>
            <h2 style="font-family:'Plus Jakarta Sans', sans-serif; font-size:1.9rem; font-weight:800; color:#09142e; margin-bottom:0.65rem; line-height:1.25;">
              ${data.title}
            </h2>
            <div style="display:flex; align-items:center; gap:0.75rem; color:#64748b; font-size:0.95rem; margin-bottom:1.5rem;">
              <span><i class="fa-solid fa-location-dot" style="color:#0056e0;"></i> ${data.location}</span>
              <span>•</span>
              <span><i class="fa-solid fa-calendar-check" style="color:#059669;"></i> ${data.completion}</span>
            </div>
            <p style="color:#334155; font-size:1.05rem; line-height:1.8; margin-bottom:1.75rem;">
              ${data.description}
            </p>
          </div>
          <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:1.5rem; display:grid; grid-template-columns:repeat(2, 1fr); gap:1.25rem;">
            <div>
              <div style="font-size:0.78rem; color:#64748b; text-transform:uppercase; font-family:'JetBrains Mono', monospace; font-weight:600;">Photovoltaic Modules</div>
              <div style="font-weight:800; color:#09142e; font-size:1rem; margin-top:0.3rem;">${data.panels}</div>
            </div>
            <div>
              <div style="font-size:0.78rem; color:#64748b; text-transform:uppercase; font-family:'JetBrains Mono', monospace; font-weight:600;">Inverter & Electronics</div>
              <div style="font-weight:800; color:#0056e0; font-size:1rem; margin-top:0.3rem;">${data.inverters}</div>
            </div>
            <div>
              <div style="font-size:0.78rem; color:#64748b; text-transform:uppercase; font-family:'JetBrains Mono', monospace; font-weight:600;">Annual Generation</div>
              <div style="font-weight:800; color:#d97706; font-size:1.15rem; margin-top:0.3rem;">${data.annualGen}</div>
            </div>
            <div>
              <div style="font-size:0.78rem; color:#64748b; text-transform:uppercase; font-family:'JetBrains Mono', monospace; font-weight:600;">CO₂ Offset</div>
              <div style="font-weight:800; color:#059669; font-size:1.15rem; margin-top:0.3rem;">${data.co2Reduction}</div>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:0.75rem;">
            <button class="btn btn-amber" onclick="prefillAndScrollToContact('${data.title} (${data.capacity})')">
              <i class="fa-solid fa-bolt"></i> Request Similar Solution
            </button>
          </div>
        </div>
      `;

      projectModal?.classList.add('active');
    });
  });

  projectModalClose?.addEventListener('click', () => {
    projectModal?.classList.remove('active');
  });

  // --- 5. System Types Card Quotation Buttons ---
  document.querySelectorAll('.quote-system-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const systemName = this.getAttribute('data-system') || 'On-Grid Solar System';
      window.prefillAndScrollToContact(systemName);
    });
  });

  // Global helper to bridge to contact
  window.prefillAndScrollToContact = function (contextName) {
    projectModal?.classList.remove('active');
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      const formNotes = document.getElementById('contactMessage');
      const formType = document.getElementById('contactProjectType');
      if (formNotes) {
        formNotes.value = `Hello Electrowerk Engineering Team, I would like to request an official EPC consultation and quotation for: ${contextName}. Please share turnkey pricing in PKR and Net-Metering feasibility.`;
        formNotes.focus();
      }
      if (formType) {
        if (contextName.toLowerCase().includes('residential')) formType.value = 'Residential Solar';
        else if (contextName.toLowerCase().includes('off-grid')) formType.value = 'Energy Storage & BESS';
        else if (contextName.toLowerCase().includes('industrial') || contextName.toLowerCase().includes('1 mw')) formType.value = 'Industrial 1MW+ Solar';
        else if (contextName.toLowerCase().includes('carport')) formType.value = 'Solar Carport';
        else formType.value = 'Commercial Rooftop Solar';
      }
    }, 450);
  };

  // --- 6. Contact Form Submission & Confirmation Modal ---
  const contactForm = document.getElementById('consultationForm');
  const confirmModal = document.getElementById('confirmModal');
  const closeConfirmModal = document.getElementById('closeConfirmModal');
  const confirmDetailsBox = document.getElementById('confirmDetailsBox');

  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value || 'Client';
    const email = document.getElementById('contactEmail')?.value || 'N/A';
    const phone = document.getElementById('contactPhone')?.value || 'N/A';
    const projectType = document.getElementById('contactProjectType')?.value || 'Solar EPC';
    const company = document.getElementById('contactCompany')?.value || 'Individual';
    const bill = document.getElementById('contactBill')?.value || 'PKR 85,000 / month';

    // Generate random reference ticket
    const refNumber = 'EW-PK-' + Math.floor(100000 + Math.random() * 900000);

    if (confirmDetailsBox) {
      confirmDetailsBox.innerHTML = `
        <div style="text-align:center; margin-bottom:1.75rem;">
          <div style="width:70px; height:70px; border-radius:50%; background:rgba(5,150,105,0.12); border:2px solid #059669; display:inline-flex; align-items:center; justify-content:center; font-size:2.2rem; color:#059669; margin-bottom:1.25rem;">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 style="font-family:'Plus Jakarta Sans', sans-serif; font-size:1.75rem; font-weight:800; color:#09142e; margin-bottom:0.4rem;">
            Consultation Request Received!
          </h3>
          <p style="color:#475569; font-size:1.02rem; line-height:1.7;">
            Thank you, <strong style="color:#09142e;">${name}</strong>. Our senior solar energy engineering team will review your requirements and share an official technical & financial proposal within 24 business hours.
          </p>
        </div>
        <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:1.5rem; font-size:0.92rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.6rem;">
            <span style="color:#64748b;">Inquiry Reference No:</span>
            <strong style="color:#d97706; font-family:'JetBrains Mono', monospace; font-size:1rem;">${refNumber}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
            <span style="color:#64748b;">Project Scope:</span>
            <strong style="color:#0056e0;">${projectType}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
            <span style="color:#64748b;">Organization / Name:</span>
            <strong style="color:#09142e;">${company}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
            <span style="color:#64748b;">Contact Details:</span>
            <span style="color:#334155; font-weight:600;">${email} | ${phone}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#64748b;">Est. Monthly Bill:</span>
            <span style="color:#059669; font-weight:700;">${bill}</span>
          </div>
        </div>
      `;
    }

    confirmModal?.classList.add('active');
    contactForm.reset();
  });

  closeConfirmModal?.addEventListener('click', () => {
    confirmModal?.classList.remove('active');
  });

  // Close modals on clicking outside dialog
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove('active');
    }
    if (e.target === confirmModal) {
      confirmModal.classList.remove('active');
    }
  });

  // --- 7. Newsletter Subscription Simulation ---
  const newsForm = document.querySelector('.footer-newsletter-form');
  newsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsForm.querySelector('input');
    if (input && input.value) {
      alert(`Thank you! Technical solar energy bulletins and NEPRA tariff updates will be sent to ${input.value}.`);
      input.value = '';
    }
  });
});
