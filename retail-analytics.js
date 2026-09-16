/*
 * Retail access analytics (Google Analytics 4).
 * Set MEASUREMENT_ID to the Retail GA4 web stream ID (G-XXXXXXXXXX).
 * Until then, no third-party analytics script loads and no events are sent.
 * Events: page_view on opening Retail; retail_password_success only when a
 * newly entered shared password is accepted (not on session restoration).
 * Never transmit the password, password hash, or customer/order information.
 */
(() => {
  'use strict';
  const MEASUREMENT_ID = '';
  const enabled = /^G-[A-Z0-9]{6,20}$/.test(MEASUREMENT_ID);

  window.RetailAnalytics = Object.freeze({
    passwordAccepted() {
      if (!enabled || typeof window.gtag !== 'function') return;
      window.gtag('event', 'retail_password_success', { method: 'shared_password' });
    }
  });

  if (!enabled) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // GA4 sends exactly one page_view on initial configuration.
  window.gtag('config', MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(script);
})();
