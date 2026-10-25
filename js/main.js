(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

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
    instagram: { n: "Instagram", i: "i-insta", s: "Dicas e novidades" },
    facebook: { n: "Facebook", i: "i-face", s: "Curta a página" },
    tiktok: { n: "TikTok", i: "i-tiktok", s: "Vídeos curtos" },
    youtube: { n: "YouTube", i: "i-yt", s: "Tutoriais" }
  };

  function whatsLink(text) {
    return "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(text || C.whatsappTexto || "");
  }
  function fmtPhone(n) {
    var d = String(n || "").replace(/\D/g, "").replace(/^55/, "");
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return d;
  }
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("is-show"); }, 2800);
  }
  function svg(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  /* ---- Dados do config ---- */
  $$("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (k === "whatsappFmt") { el.textContent = fmtPhone(C.whatsapp); return; }
    if (k === "email") { el.textContent = C.email; el.href = "mailto:" + C.email; return; }
    if (C[k]) el.textContent = C[k];
  });
  $$("[data-whats]").forEach(function (a) { a.href = whatsLink(); a.target = "_blank"; a.rel = "noopener"; });
  $("#ano").textContent = new Date().getFullYear();

  /* ---- Redes sociais ---- */
  var cards = "", foot = "";
  Object.keys(SOCIAL).forEach(function (k) {
    var url = k === "whatsapp" ? (C.whatsapp ? whatsLink() : "") : C[k];
    if (!url) return;
    var s = SOCIAL[k];
    var sub = k === "instagram" && C.instagramUsuario ? "@" + C.instagramUsuario : (k === "whatsapp" ? fmtPhone(C.whatsapp) : s.s);
    cards += '<a class="social social--' + k + '" href="' + url + '" target="_blank" rel="noopener">' + svg(s.i) + "<span><b>" + s.n + "</b><small>" + sub + "</small></span></a>";
    foot += '<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + s.n + '">' + svg(s.i) + "</a>";
  });
  $("#socialCards").innerHTML = cards;
  $("#footerSocial").innerHTML = foot;

  /* ---- Compartilhar ---- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = location.href.split("#")[0];
      var txt = "Precisa tirar, adicionar categoria ou renovar a CNH? Fala com a " + (C.nome || "Fernanda") + ": ";
      var t = b.getAttribute("data-share");
      if (t === "whatsapp") window.open("https://wa.me/?text=" + encodeURIComponent(txt + url), "_blank", "noopener");
      else if (t === "facebook") window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "_blank", "noopener");
      else if (t === "native") {
        if (navigator.share) navigator.share({ title: document.title, text: txt, url: url }).catch(function () {});
        else copy(url);
      } else copy(url);
    });
  });
  function copy(url) {
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast("Link copiado!"); }, function () { toast(url); });
    else toast(url);
  }

  /* ---- Menu mobile ---- */
  var btn = $("#menuBtn"), nav = $("#nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }); });

  var header = $(".header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- Categorias ---- */
  function showCat(k) {
    var c = CATS[k];
    $("#catInfo").innerHTML = '<div class="cat-info__emoji" aria-hidden="true">' + c.e + "</div><div><h3>" + c.t + "</h3><p>" + c.d + "</p><ul>" + c.l.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>";
    $$(".cat").forEach(function (b) { var on = b.getAttribute("data-cat") === k; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on); });
  }
  $$(".cat").forEach(function (b) { b.addEventListener("click", function () { showCat(b.getAttribute("data-cat")); }); });
  showCat("A");

  /* ---- Estados ---- */
  var sel = $("#f-uf"), grid = $("#ufs");
  UFS.forEach(function (u) {
    sel.insertAdjacentHTML("beforeend", '<option value="' + u[0] + '">' + u[1] + "</option>");
    var b = document.createElement("button");
    b.className = "uf"; b.type = "button"; b.textContent = u[0]; b.title = u[1];
    b.addEventListener("click", function () { sel.value = u[0]; $("#contato").scrollIntoView(); setTimeout(function () { $("#f-cidade").focus({ preventScroll: true }); }, 500); toast("Estado: " + u[1]); });
    grid.appendChild(b);
  });

  /* Links dos serviços preenchem o formulário */
  $$("[data-servico]").forEach(function (a) { a.addEventListener("click", function () { $("#f-servico").value = a.getAttribute("data-servico"); }); });

  /* Máscara de telefone */
  $("#f-tel").addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11), o = d;
    if (d.length > 2) o = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) o = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length === 11 ? 7 : 6) + "-" + d.slice(d.length === 11 ? 7 : 6);
    e.target.value = o;
  });

  /* ---- Formulário → WhatsApp ---- */
  var form = $("#leadForm"), err = $("#formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = [];
    $$("[required]", form).forEach(function (f) {
      var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
      if (f.id === "f-tel") ok = f.value.replace(/\D/g, "").length >= 10;
      f.classList.toggle("is-invalid", !ok && f.type !== "checkbox");
      if (!ok) bad.push(f);
    });
    if (bad.length) {
      err.textContent = bad.some(function (f) { return f.name === "lgpd"; }) && bad.length === 1
        ? "Marque a autorização de uso dos dados para continuar."
        : "Preencha os campos obrigatórios (*).";
      err.hidden = false; bad[0].focus(); return;
    }
    err.hidden = true;
    var d = new FormData(form);
    var cats = d.getAll("cat");
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
    window.open(whatsLink(msg), "_blank", "noopener");
    toast("Abrindo o WhatsApp...");
    form.reset();
  });
  $$("input,select", form).forEach(function (f) { f.addEventListener("input", function () { f.classList.remove("is-invalid"); }); });

  /* ---- Animação ao rolar ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }); }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
})();
