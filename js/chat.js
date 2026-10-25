/* =========================================================
   Assistente de pré-cadastro (estilo WhatsApp)
   Conversa guiada → monta a mensagem → abre o WhatsApp da Fernanda
   ========================================================= */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var FS = window.FS || {};
  var $ = function (s) { return document.querySelector(s); };
  var chat = $("#chat"), body = $("#chatBody"), fab = $("#fab"), form = $("#chatForm"), input = $("#chatInput");
  if (!chat || !body || !fab) return;
  var track = function (n, p) { if (window.track) window.track(n, p); };
  var esc = FS.esc || function (s) { return s; };
  var first = (C.nome || "Fernanda").split(" ")[0];

  var S = { servico: "", cat: "", uf: "", cidade: "", nome: "", tel: "", obs: "" };
  var started = false, waiting = null, busy = false, queue = [];

  /* ---------- Mensagens ---------- */
  function scroll() { body.scrollTop = body.scrollHeight; }
  function bubble(html, who) {
    var d = document.createElement("div");
    d.className = "msg msg--" + (who || "bot");
    d.innerHTML = html; body.appendChild(d); scroll(); return d;
  }
  function say(list, done) {
    list = [].concat(list);
    var i = 0;
    (function next() {
      if (i >= list.length) { if (done) done(); return; }
      var t = document.createElement("div");
      t.className = "msg msg--bot typing"; t.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(t); scroll();
      var txt = list[i++], delay = Math.min(1100, 350 + txt.length * 12);
      setTimeout(function () { t.remove(); bubble(txt); setTimeout(next, 180); }, delay);
    })();
  }
  function me(txt) { bubble(esc(txt), "me"); }
  function quick(opts, cb) {
    var w = document.createElement("div"); w.className = "quick";
    opts.forEach(function (o) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = o.label || o;
      b.addEventListener("click", function () { w.remove(); me(o.label || o); cb(o.value !== undefined ? o.value : o); });
      w.appendChild(b);
    });
    body.appendChild(w); scroll();
    setTimeout(function () { var f = w.querySelector("button"); if (f) f.focus({ preventScroll: true }); }, 50);
  }

  /* ---------- Campo de digitação ---------- */
  function ask(type, cb) {
    form.hidden = false;
    var holder = form.querySelector("#chatInput");
    var el;
    if (type === "uf") {
      el = document.createElement("select"); el.id = "chatInput";
      el.innerHTML = '<option value="">Escolha seu estado</option>' + (FS.UFS || []).map(function (u) { return '<option value="' + u[0] + '">' + u[1] + "</option>"; }).join("");
    } else {
      el = document.createElement("input"); el.id = "chatInput"; el.autocomplete = "off";
      if (type === "tel") { el.type = "tel"; el.inputMode = "tel"; el.placeholder = "(00) 00000-0000"; el.autocomplete = "tel"; el.addEventListener("input", function () { el.value = FS.maskPhone ? FS.maskPhone(el.value) : el.value; }); }
      else if (type === "nome") { el.placeholder = "Seu nome"; el.autocomplete = "given-name"; }
      else if (type === "cidade") { el.placeholder = "Sua cidade"; el.autocomplete = "address-level2"; }
      else el.placeholder = "Digite aqui...";
    }
    holder.replaceWith(el); input = el;
    waiting = { type: type, cb: cb };
    setTimeout(function () { el.focus({ preventScroll: true }); }, 60);
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!waiting) return;
    var v = (input.value || "").trim(), t = waiting.type;
    if (t === "tel" && v.replace(/\D/g, "").length < 10) { shake(); return say("Hmm, acho que faltou número 🤔 Coloca o DDD + número, tipo (31) 99999-9999."); }
    if (!v) { shake(); return; }
    var label = v;
    if (t === "uf") { var u = (FS.UFS || []).filter(function (x) { return x[0] === v; })[0]; label = u ? u[1] : v; }
    me(label);
    var cb = waiting.cb; waiting = null; form.hidden = true;
    cb(v);
  });
  function shake() { input.classList.remove("is-invalid"); void input.offsetWidth; input.classList.add("is-invalid"); }

  /* ---------- Fluxo ---------- */
  var CAT_OPTS = {
    "Primeira habilitação": [{ label: "🏍️ A (moto)", value: "A" }, { label: "🚗 B (carro)", value: "B" }, { label: "🏍️🚗 A e B", value: "AB" }, { label: "🤷 Não sei", value: "Não sei" }],
    "Adição de categoria": [{ label: "🏍️ A", value: "A" }, { label: "🚗 B", value: "B" }, { label: "🚚 C", value: "C" }, { label: "🚌 D", value: "D" }, { label: "🚛 E", value: "E" }, { label: "🤷 Não sei", value: "Não sei" }]
  };

  function start() {
    started = true;
    track("chat_open", {});
    var hi = new Date().getHours(), saud = hi < 12 ? "Bom dia" : hi < 18 ? "Boa tarde" : "Boa noite";
    say([saud + "! 👋 Aqui é o assistente da " + esc(first) + ".", "Vou fazer seu pré-cadastro em menos de 1 minuto. Bora? 🚀"], stepServico);
  }
  function stepServico() {
    if (S.servico) return stepCat();
    say("O que você precisa?", function () {
      quick([
        { label: "🎓 Primeira habilitação", value: "Primeira habilitação" },
        { label: "➕ Adicionar categoria", value: "Adição de categoria" },
        { label: "🔄 Renovar a CNH", value: "Renovação da CNH" },
        { label: "💬 Só tenho uma dúvida", value: "Dúvida" }
      ], function (v) { S.servico = v; track("chat_step", { passo: "servico", valor: v }); stepCat(); });
    });
  }
  function stepCat() {
    if (S.servico === "Dúvida") {
      return say("Claro! Me conta sua dúvida em poucas palavras 😉", function () { ask("text", function (v) { S.obs = v; stepUf(); }); });
    }
    if (S.servico === "Renovação da CNH") {
      if (S.obs) return stepUf();
      return say("Boa! Sua CNH já venceu?", function () {
        quick(["Já venceu", "Vai vencer em breve", "Não sei"], function (v) { S.obs = "CNH: " + v.toLowerCase(); stepUf(); });
      });
    }
    if (S.cat) { return say(S.cat === "Não sei" ? "Sem problema, eu te ajudo a escolher 😉" : "Categoria " + esc(S.cat) + ", anotado! ✍️", stepUf); }
    var opts = CAT_OPTS[S.servico] || CAT_OPTS["Adição de categoria"];
    say(S.servico === "Primeira habilitação" ? "Show! Qual categoria você quer tirar?" : "Qual categoria você quer adicionar?", function () {
      quick(opts, function (v) { S.cat = v; stepUf(); });
    });
  }
  function stepUf() {
    if (S.uf) return stepCidade();
    say("Em qual estado você mora? 📍", function () { ask("uf", function (v) { S.uf = v; stepCidade(); }); });
  }
  function stepCidade() {
    var u = (FS.UFS || []).filter(function (x) { return x[0] === S.uf; })[0];
    say((u ? u[1] + ", " : "") + "e a cidade?", function () {
      ask("cidade", function (v) { S.cidade = v; say("Ótimo! Vou procurar o CFC parceiro mais perto de " + esc(v) + " 🙌", stepNome); });
    });
  }
  function stepNome() {
    say("Como posso te chamar?", function () { ask("nome", function (v) { S.nome = v; stepTel(); }); });
  }
  function stepTel() {
    say("Prazer, " + esc(S.nome.split(" ")[0]) + "! 😄 Qual seu WhatsApp com DDD?", function () { ask("tel", function (v) { S.tel = v; resumo(); }); });
  }
  function resumo() {
    say("Confere se está tudo certo 👇", function () {
      var u = (FS.UFS || []).filter(function (x) { return x[0] === S.uf; })[0];
      var rows = [["Serviço", S.servico], S.cat ? ["Categoria", S.cat] : null, S.obs ? ["Obs.", S.obs] : null, ["Local", S.cidade + " - " + (u ? u[0] : S.uf)], ["Nome", S.nome], ["WhatsApp", S.tel]].filter(Boolean);
      var d = document.createElement("div"); d.className = "summary";
      d.innerHTML = "<b>Seu pré-cadastro</b><dl>" + rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("") + "</dl>" +
        '<label class="consent" style="margin-bottom:12px"><input type="checkbox" id="chatLgpd"><span>Autorizo o uso dos meus dados para contato e encaminhamento a um CFC parceiro (<a href="privacidade.html" target="_blank">privacidade</a>).</span></label>' +
        '<button type="button" class="btn btn--whats btn--block" id="chatSend"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whats"/></svg> Enviar no WhatsApp</button>' +
        '<button type="button" class="link" id="chatRedo" style="margin-top:10px;font-size:.88rem">↺ Corrigir dados</button>';
      body.appendChild(d); scroll();
      d.querySelector("#chatLgpd").addEventListener("change", function () { this.parentElement.classList.remove("is-invalid"); });
      d.querySelector("#chatSend").addEventListener("click", function () {
        var ok = d.querySelector("#chatLgpd");
        if (!ok.checked) { ok.parentElement.classList.remove("is-invalid"); void ok.offsetWidth; ok.parentElement.classList.add("is-invalid"); return say("Só preciso que você marque a autorização ali em cima ☝️"); }
        enviar();
      });
      d.querySelector("#chatRedo").addEventListener("click", function () { reset(); start(); });
    });
  }
  function enviar() {
    var u = (FS.UFS || []).filter(function (x) { return x[0] === S.uf; })[0];
    var msg = [
      "Olá, " + first + "! Vim pelo site e quero fazer meu pré-cadastro 🚗",
      "",
      "*Nome:* " + S.nome,
      "*WhatsApp:* " + S.tel,
      "*Cidade/UF:* " + S.cidade + " - " + (u ? u[0] : S.uf),
      "*Serviço:* " + (S.servico === "Dúvida" ? "Tenho uma dúvida" : S.servico),
      S.cat ? "*Categoria:* " + S.cat : null,
      S.obs ? (S.servico === "Dúvida" ? "*Dúvida:* " : "*Obs.:* ") + S.obs.replace(/^CNH: /, "CNH ") : null
    ].filter(function (l) { return l !== null; }).join("\n");
    track("generate_lead", { method: "assistente", servico: S.servico, uf: S.uf, categoria: S.cat || "" });
    window.open(FS.whatsLink ? FS.whatsLink(msg) : "#", "_blank", "noopener");
    if (FS.confetti) FS.confetti();
    say(["Prontinho, " + esc(S.nome.split(" ")[0]) + "! 🎉", "O WhatsApp abriu com tudo preenchido. É só apertar <b>enviar</b> que a " + esc(first) + " te responde 💚"]);
  }
  function reset() { S = { servico: "", cat: "", uf: "", cidade: "", nome: "", tel: "", obs: "" }; body.innerHTML = ""; form.hidden = true; waiting = null; }

  /* ---------- Abrir / fechar ---------- */
  function open(preset) {
    preset = preset || {};
    if (!started) {
      if (preset.servico) S.servico = preset.servico;
      if (preset.cat) { S.cat = preset.cat; if (!S.servico) S.servico = "Adição de categoria"; }
      if (preset.uf) S.uf = preset.uf;
    }
    chat.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");
    fab.classList.remove("is-hint");
    var dot = fab.querySelector(".fab__dot"); if (dot) dot.remove();
    if (!started) start();
    else if (waiting && input) setTimeout(function () { input.focus({ preventScroll: true }); }, 200);
  }
  function close() { chat.classList.remove("is-open"); fab.setAttribute("aria-expanded", "false"); fab.focus({ preventScroll: true }); }
  fab.addEventListener("click", function () { chat.classList.contains("is-open") ? close() : open(); });
  $("#chatClose").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && chat.classList.contains("is-open")) close(); });

  /* Dica no botão depois de alguns segundos */
  setTimeout(function () { if (!started) { fab.classList.add("is-hint"); setTimeout(function () { fab.classList.remove("is-hint"); }, 6000); } }, 7000);

  window.FSChat = { open: open, close: close };
})();
