/**
 * Electrowerk Technologies - Multi-Page Master JS
 * Mobile navigation, WhatsApp quotation form bridge, and utilities
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  mobileToggle?.addEventListener('click', function () {
    navLinks?.classList.toggle('mobile-active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  // Close mobile drawer when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('mobile-active');
      const icon = mobileToggle?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });

  // --- 2. Quote Form WhatsApp Handler ---
  const quoteForm = document.getElementById('quoteForm');
  quoteForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name')?.value || 'Client';
    const phone = document.getElementById('phone')?.value || 'N/A';
    const system = document.getElementById('system')?.value || 'General Inquiry';
    const capacity = document.getElementById('capacity')?.value || 'Not Sure';
    const budget = document.getElementById('budget')?.value || 'Not Specified';
    const details = document.getElementById('details')?.value || 'N/A';

    const message = `Hello Electrowerk Technologies,

I would like to request an official quotation and consultation.

👤 Name: ${name}
📞 Phone: ${phone}
⚡ Service / System: ${system}
📐 Required Capacity: ${capacity}
💰 Budget Estimate: ${budget}

📋 Project Details & Requirements:
${details}

Looking forward to your engineering team's response.`;

    const whatsappURL = `https://wa.me/923216875494?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  });

  // Quick WhatsApp button click event
  window.sendQuickWhatsApp = function(serviceName) {
    const message = `Hello Electrowerk Technologies, I am interested in your engineering services for: ${serviceName}. Please share further specifications and turnkey pricing in PKR.`;
    window.open(`https://wa.me/923216875494?text=${encodeURIComponent(message)}`, '_blank');
  };
});
