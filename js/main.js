(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var track = function (n, p) { if (window.track) window.track(n, p); };

  var UFS = [
    ["AC","Acre"],["AL","Alagoas"],["AP","Amapá"],["AM","Amazonas"],["BA","Bahia"],["CE","Ceará"],
    ["DF","Distrito Federal"],["ES","Espírito Santo"],["GO","Goiás"],["MA","Maranhão"],["MT","Mato Grosso"],
    ["MS","Mato Grosso do Sul"],["MG","Minas Gerais"],["PA","Pará"],["PB","Paraíba"],["PR","Paraná"],
    ["PE","Pernambuco"],["PI","Piauí"],["RJ","Rio de Janeiro"],["RN","Rio Grande do Norte"],
    ["RS","Rio Grande do Sul"],["RO","Rondônia"],["RR","Roraima"],["SC","Santa Catarina"],
    ["SP","São Paulo"],["SE","Sergipe"],["TO","Tocantins"]
  ];

  var CATS = {
    A: { e: "🏍️", t: "Categoria A · Moto", d: "Para veículos motorizados de duas ou três rodas.", l: ["Motos, motonetas e ciclomotores", "Triciclos", "Ideal para entregas e para fugir do trânsito"] },
    B: { e: "🚗", t: "Categoria B · Carro", d: "A categoria mais tirada do Brasil, para carros de passeio e utilitários leves.", l: ["Carros com até 8 passageiros além do motorista", "Veículos de até 3.500 kg", "Necessária para trabalhar com aplicativo"] },
    C: { e: "🚚", t: "Categoria C · Caminhão", d: "Para transporte de carga. Exige CNH B há pelo menos 1 ano.", l: ["Caminhões acima de 3.500 kg", "Inclui o que a categoria B permite", "Abre portas para trabalhar como motorista"] },
    D: { e: "🚌", t: "Categoria D · Ônibus", d: "Para transporte de passageiros. Exige 21 anos e tempo mínimo nas categorias B ou C.", l: ["Ônibus, micro-ônibus e vans com mais de 8 passageiros", "Inclui o que as categorias B e C permitem"] },
    E: { e: "🚛", t: "Categoria E · Carreta", d: "A categoria mais completa, para veículos com reboque pesado. Exige 21 anos e tempo mínimo na categoria C ou D.", l: ["Carretas, bitrens e reboques acima de 6.000 kg", "Inclui as categorias B, C e D"] }
  };

  var SOCIAL = {
    whatsapp: { n: "WhatsApp", i: "i-whats", s: "Atendimento rápido" },
    instagram: { n: "Instagram", i: "i-insta", s: "Dicas e memes" },
    facebook: { n: "Facebook", i: "i-face", s: "Curta a página" },
    tiktok: { n: "TikTok", i: "i-tiktok", s: "Vídeos curtos" },
    youtube: { n: "YouTube", i: "i-yt", s: "Shorts e dicas" }
  };

  /* ---------- Utilidades compartilhadas ---------- */
  function whatsLink(text) {
    return "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(text || C.whatsappTexto || "");
  }
  function fmtPhone(n) {
    var d = String(n || "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return d;
  }
  function maskPhone(v) {
    var d = v.replace(/\D/g, "").slice(0, 11), o = d;
    if (d.length > 2) o = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) { var c = d.length === 11 ? 7 : 6; o = "(" + d.slice(0, 2) + ") " + d.slice(2, c) + "-" + d.slice(c); }
    return o;
  }
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("is-show"); }, 2800);
  }
  function svg(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* Confete dourado */
  function confetti() {
    if (reduce) return;
    var cv = document.createElement("canvas"); cv.className = "confetti";
    document.body.appendChild(cv);
    var ctx = cv.getContext("2d"), W = cv.width = innerWidth, H = cv.height = innerHeight;
    var colors = ["#d9ad52", "#f3d68c", "#151515", "#25d366", "#ffffff", "#a97b24"];
    var P = [];
    for (var i = 0; i < 160; i++) P.push({ x: W / 2 + (Math.random() - .5) * 200, y: H * .55, vx: (Math.random() - .5) * 14, vy: -Math.random() * 16 - 6, s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length] });
    var t0 = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
      if (t - t0 < 3200) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  window.FS = { whatsLink: whatsLink, fmtPhone: fmtPhone, maskPhone: maskPhone, toast: toast, confetti: confetti, UFS: UFS, esc: esc };

  /* ---------- Dados do config ---------- */
  $$("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (k === "whatsappFmt") { el.textContent = fmtPhone(C.whatsapp); return; }
    if (k === "email") {
      if (!C.email) { var li = el.closest("li"); (li || el).remove(); return; }
      el.textContent = C.email; el.href = "mailto:" + C.email; return;
    }
    if (C[k]) el.textContent = C[k];
  });
  $$("[data-whats]").forEach(function (a) {
    a.href = whatsLink(); a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", function () { track("contact", { method: "whatsapp", local: a.closest("section,footer,header") ? (a.closest("section,footer,header").id || a.closest("section,footer,header").tagName.toLowerCase()) : "site" }); });
  });
  var ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Redes sociais ---------- */
  var cards = "", foot = "";
  Object.keys(SOCIAL).forEach(function (k) {
    var url = k === "whatsapp" ? (C.whatsapp ? whatsLink() : "") : C[k];
    if (!url) return;
    var s = SOCIAL[k];
    var sub = k === "instagram" && C.instagramUsuario ? "@" + C.instagramUsuario : (k === "whatsapp" ? fmtPhone(C.whatsapp) : s.s);
    cards += '<a class="social social--' + k + '" data-net="' + k + '" href="' + url + '" target="_blank" rel="noopener">' + svg(s.i) + "<span><b>" + s.n + "</b><small>" + esc(sub) + "</small></span></a>";
    foot += '<a href="' + url + '" data-net="' + k + '" target="_blank" rel="noopener" aria-label="' + s.n + '">' + svg(s.i) + "</a>";
  });
  if (C.googleAvaliacao) cards += '<a class="social social--google" data-net="google" href="' + C.googleAvaliacao + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 17.3 18.2 21l-1.6-7 5.4-4.7-7.2-.6L12 2 9.2 8.7 2 9.3l5.4 4.7-1.6 7z"/></svg><span><b>Google</b><small>Avalie meu atendimento</small></span></a>';
  if ($("#socialCards")) $("#socialCards").innerHTML = cards;
  if ($("#footerSocial")) $("#footerSocial").innerHTML = foot;
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-net]");
    if (a) track(a.getAttribute("data-net") === "whatsapp" ? "contact" : "click_social", { rede: a.getAttribute("data-net") });
  });

  /* ---------- Compartilhar ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = (C.siteUrl || location.origin) + "/";
      var txt = "Precisa tirar, adicionar categoria ou renovar a CNH? Fala com a " + (C.nome || "Fernanda") + ": ";
      var t = b.getAttribute("data-share");
      track("share", { method: t, content_type: "site" });
      if (t === "whatsapp") window.open("https://wa.me/?text=" + encodeURIComponent(txt + url), "_blank", "noopener");
      else if (t === "facebook") window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "_blank", "noopener");
      else if (t === "native") {
        if (navigator.share) navigator.share({ title: document.title, text: txt, url: url }).catch(function () {});
        else copy(url);
      } else copy(url);
    });
  });
  function copy(url) {
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast("Link copiado! 📋"); }, function () { toast(url); });
    else toast(url);
  }

  /* ---------- Menu mobile ---------- */
  var btn = $("#menuBtn"), nav = $("#nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }); });
  }

  /* ---------- Rolagem: header, barra de progresso, jornada ---------- */
  var header = $(".header"), bar = $("#progress"), journey = $("#journey");
  var fill = journey && $(".journey__fill", journey), car = journey && $(".journey__car", journey), track_ = journey && $(".journey__track", journey);
  var steps = journey ? $$(".step", journey) : [];
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
      if (header) header.classList.toggle("is-scrolled", y > 10);
      if (bar) bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
      if (journey) {
        var r = journey.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (r.height + innerHeight * .25)));
        if (fill) fill.style.setProperty("--p", p.toFixed(3));
        if (car && track_) car.style.setProperty("--x", (p * track_.clientWidth).toFixed(1) + "px");
        steps.forEach(function (s, i) { s.classList.toggle("is-done", p >= i / (steps.length - 1) - .02); });
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Texto que digita sozinho ---------- */
  var rot = $("#rotator");
  if (rot) {
    var words = ["Primeira habilitação", "Adição de categoria", "Renovação da CNH", "Moto, carro, caminhão…", "Atendimento em todo o Brasil"];
    if (reduce) rot.textContent = words.join(" · ");
    else {
      var wi = 0, ci = words[0].length, del = true;
      var tick = function () {
        var w = words[wi];
        if (!del) {
          ci++; rot.textContent = w.slice(0, ci);
          if (ci >= w.length) { del = true; return setTimeout(tick, 1800); }
          return setTimeout(tick, 70);
        }
        ci--; rot.textContent = w.slice(0, ci) || " ";
        if (ci <= 0) { del = false; wi = (wi + 1) % words.length; return setTimeout(tick, 300); }
        setTimeout(tick, 35);
      };
      setTimeout(tick, 1800);
    }
  }

  /* ---------- CNH 3D ---------- */
  var cnh = $("#cnh");
  if (cnh && !reduce) {
    var wrap = cnh.parentElement;
    wrap.addEventListener("pointermove", function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cnh.style.setProperty("--ry", (x * 26).toFixed(1) + "deg");
      cnh.style.setProperty("--rx", (-y * 20).toFixed(1) + "deg");
      cnh.style.setProperty("--shine", (x * 120).toFixed(0) + "%");
    });
    wrap.addEventListener("pointerleave", function () { cnh.style.removeProperty("--ry"); cnh.style.removeProperty("--rx"); cnh.style.removeProperty("--shine"); });
  }

  /* ---------- Contadores ---------- */
  function count(el) {
    var to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "", t0 = null;
    if (reduce) { el.textContent = to + suf; return; }
    (function f(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1200), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = v + suf; if (p < 1) requestAnimationFrame(f); })(performance.now());
  }

  /* ---------- Categorias ---------- */
  var catBtns = $$(".cat");
  function showCat(k, focus) {
    var c = CATS[k], box = $("#catInfo"); if (!box) return;
    box.innerHTML = '<div class="cat-info__emoji" aria-hidden="true">' + c.e + '</div><div class="cat-info__body"><h3>' + c.t + "</h3><p>" + c.d + "</p><ul>" + c.l.map(function (i) { return "<li>" + i + "</li>"; }).join("") + '</ul><button type="button" class="btn btn--dark btn--small" data-open-chat data-cat="' + k + '">Quero a categoria ' + k + " →</button></div>";
    catBtns.forEach(function (b) { var on = b.getAttribute("data-cat") === k; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    var cc = $("#cnhCat"); if (cc) cc.textContent = "CATEGORIA " + k;
  }
  catBtns.forEach(function (b, i) {
    b.addEventListener("click", function () { showCat(b.getAttribute("data-cat")); track("select_content", { content_type: "categoria", item_id: b.getAttribute("data-cat") }); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      e.preventDefault(); showCat(catBtns[(i + d + catBtns.length) % catBtns.length].getAttribute("data-cat"), true);
    });
  });
  if (catBtns.length) showCat("A");

  /* ---------- Estados ---------- */
  var sel = $("#f-uf"), grid = $("#ufs");
  UFS.forEach(function (u, i) {
    if (sel) sel.insertAdjacentHTML("beforeend", '<option value="' + u[0] + '">' + u[1] + "</option>");
    if (!grid) return;
    var b = document.createElement("button");
    b.className = "uf"; b.type = "button"; b.textContent = u[0]; b.title = u[1]; b.style.setProperty("--i", i);
    b.addEventListener("click", function () { if (window.FSChat) window.FSChat.open({ uf: u[0] }); track("select_content", { content_type: "estado", item_id: u[0] }); });
    grid.appendChild(b);
  });

  /* ---------- Abrir assistente ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open-chat]"); if (!b) return;
    e.preventDefault();
    if (window.FSChat) window.FSChat.open({ servico: b.getAttribute("data-servico") || "", cat: b.getAttribute("data-cat") || "" });
  });

  /* ---------- Formulário → WhatsApp ---------- */
  var tel = $("#f-tel"); if (tel) tel.addEventListener("input", function (e) { e.target.value = maskPhone(e.target.value); });
  var form = $("#leadForm"), err = $("#formError");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = [];
      $$("[required]", form).forEach(function (f) {
        var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
        if (f.id === "f-tel") ok = f.value.replace(/\D/g, "").length >= 10;
        f.classList.remove("is-invalid"); void f.offsetWidth;
        f.classList.toggle("is-invalid", !ok && f.type !== "checkbox");
        if (!ok) bad.push(f);
      });
      if (bad.length) {
        err.textContent = bad.length === 1 && bad[0].name === "lgpd" ? "Marque a autorização de uso dos dados para continuar." : "Preencha os campos obrigatórios (*).";
        err.hidden = false; bad[0].focus(); return;
      }
      err.hidden = true;
      var d = new FormData(form), cats = d.getAll("cat");
      var uf = UFS.filter(function (u) { return u[0] === d.get("uf"); })[0];
      var msg = [
        "Olá, " + (C.nome || "Fernanda").split(" ")[0] + "! Vim pelo site e quero fazer meu pré-cadastro 🚗",
        "",
        "*Nome:* " + d.get("nome").trim(),
        "*WhatsApp:* " + d.get("telefone"),
        d.get("idade") ? "*Idade:* " + d.get("idade") : null,
        "*Cidade/UF:* " + d.get("cidade").trim() + " - " + (uf ? uf[0] : ""),
        "*Serviço:* " + d.get("servico"),
        cats.length ? "*Categoria:* " + cats.join(", ") : null,
        d.get("mensagem").trim() ? "*Mensagem:* " + d.get("mensagem").trim() : null
      ].filter(function (l) { return l !== null; }).join("\n");
      track("generate_lead", { method: "formulario", servico: d.get("servico"), uf: d.get("uf") });
      window.open(whatsLink(msg), "_blank", "noopener");
      confetti();
      toast("Abrindo o WhatsApp... 🚀");
      form.reset();
    });
    $$("input,select", form).forEach(function (f) { f.addEventListener("input", function () { f.classList.remove("is-invalid"); }); });
  }

  /* ---------- Vitrine de memes na home ---------- */
  var teaser = $("#memesTeaser");
  if (teaser && window.fetch) {
    fetch("memes/memes.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      var limit = (C.memesHoras || 72) * 3600e3, now = Date.now();
      var on = (list || []).filter(function (m) { return now - new Date(m.data).getTime() < limit; }).sort(function (a, b) { return new Date(b.data) - new Date(a.data); }).slice(0, 3);
      on.forEach(function (m, i) {
        var ph = teaser.children[i]; if (!ph) return;
        var inner = m.tipo === "youtube"
          ? '<img src="https://i.ytimg.com/vi/' + esc(m.id) + '/hqdefault.jpg" alt="" loading="lazy">'
          : '<video src="' + esc(m.src) + '" muted loop playsinline autoplay preload="metadata"' + (m.capa ? ' poster="' + esc(m.capa) + '"' : "") + "></video>";
        ph.innerHTML = '<a href="memes.html" aria-label="Ver meme: ' + esc(m.titulo || "meme") + '">' + inner + "</a>";
      });
    }).catch(function () {});
  }

  /* ---------- Animações ao rolar ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$("[data-count]", en.target).forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal, #ufs").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal, #ufs").forEach(function (el) { el.classList.add("is-in"); });
    $$("[data-count]").forEach(count);
  }
})();
