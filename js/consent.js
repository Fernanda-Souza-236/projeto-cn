/* =========================================================
   Consentimento de cookies (LGPD) + Google Analytics 4 + Pixel da Meta
   - Nada de rastreamento antes do "Aceitar".
   - Google Consent Mode v2 começa tudo como "negado".
   - window.track(evento, dados) envia para GA4 e Pixel ao mesmo tempo.
   ========================================================= */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var KEY = "fs_consent_v1";

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* Consent Mode v2: padrão negado */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "granted", security_storage: "granted",
    wait_for_update: 500
  });

  var loaded = false;
  function loadTrackers() {
    if (loaded) return; loaded = true;
    gtag("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted"
    });
    if (C.ga4Id) {
      var s = document.createElement("script");
      s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4Id;
      document.head.appendChild(s);
      gtag("js", new Date());
      gtag("config", C.ga4Id, { anonymize_ip: true });
    }
    if (C.metaPixelId) {
      /* Código oficial do Pixel da Meta */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq("init", C.metaPixelId);
      window.fbq("track", "PageView");
    }
    /* eventos que aconteceram antes do "Aceitar" nesta mesma visita */
    setTimeout(function () { var q = pending.splice(0); q.forEach(function (ev) { window.track(ev[0], ev[1]); }); }, 0);
  }

  /* Eventos: GA4 + Pixel */
  var FB_MAP = { generate_lead: "Lead", contact: "Contact", view_memes: "ViewContent", view_content: "ViewContent" };
  var pending = [];
  window.track = function (name, params) {
    params = params || {};
    if (!loaded) { if (pending.length < 30) pending.push([name, params]); return; }
    try { if (loaded) gtag("event", name, params); } catch (e) {}
    try {
      if (loaded && window.fbq) {
        if (FB_MAP[name]) window.fbq("track", FB_MAP[name], params);
        else window.fbq("trackCustom", name, params);
      }
    } catch (e) {}
  };

  /* Banner */
  function banner() {
    if (document.getElementById("cookieBar")) return;
    var el = document.createElement("div");
    el.id = "cookieBar"; el.className = "cookie"; el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Preferências de cookies");
    el.innerHTML =
      '<div class="cookie__icon" aria-hidden="true">🍪</div>' +
      '<p class="cookie__text">Usamos cookies para entender as visitas e melhorar nossos anúncios. Você escolhe. ' +
      '<a href="privacidade.html#cookies">Saiba mais</a></p>' +
      '<div class="cookie__btns"><button type="button" class="btn btn--ghost btn--small" data-c="no">Só o essencial</button>' +
      '<button type="button" class="btn btn--primary btn--small" data-c="yes">Aceitar</button></div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add("is-show");
      document.documentElement.style.setProperty("--cookie-h", (el.offsetHeight + 16) + "px");
    });
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-c]"); if (!b) return;
      var yes = b.getAttribute("data-c") === "yes";
      setChoice(yes ? "granted" : "denied");
      if (yes) loadTrackers();
      else if (loaded) {
        gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
        try { window.fbq && window.fbq("consent", "revoke"); } catch (er) {}
      }
      el.classList.remove("is-show");
      document.documentElement.style.removeProperty("--cookie-h");
      setTimeout(function () { el.remove(); }, 400);
    });
  }

  window.openCookiePrefs = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    banner();
  };

  var choice = getChoice();
  if (choice === "granted") loadTrackers();
  document.addEventListener("DOMContentLoaded", function () {
    if (!getChoice()) setTimeout(banner, 1200);
    document.querySelectorAll("[data-cookie-prefs]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); window.openCookiePrefs(); });
    });
  });
})();
