/* =========================================================
   Página de memes
   - Lê memes/memes.json
   - Mostra só o que tem menos de 72h (SITE_CONFIG.memesHoras)
   - Contagem regressiva em cada vídeo; some sozinho quando zera
   ========================================================= */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var FS = window.FS || {};
  var esc = FS.esc || function (s) { return s; };
  var grid = document.getElementById("memesGrid"), countEl = document.getElementById("memesCount");
  if (!grid) return;
  (function () {
    var st = document.createElement("style");
    st.textContent = ".meme__media--feed{aspect-ratio:4/5}.meme__media img{width:100%;height:100%;object-fit:cover;display:block}" +
      ".mc{display:flex;width:100%;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.mc::-webkit-scrollbar{display:none}" +
      ".mc img{flex:0 0 100%;scroll-snap-align:start}" +
      ".mc__dots{position:absolute;left:0;right:0;top:18px;display:flex;justify-content:center;gap:6px;pointer-events:none}" +
      ".mc__dots i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.45)}.mc__dots i.on{background:#d9ad52;width:18px;border-radius:4px}" +
      ".mc__nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:26px;line-height:1;cursor:pointer}" +
      ".mc__prev{left:8px}.mc__next{right:8px}";
    document.head.appendChild(st);
  })();
  var LIMIT = (C.memesHoras || 72) * 3600e3;
  var track = function (n, p) { if (window.track) window.track(n, p); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Chuva de emojis no topo */
  var rain = document.getElementById("rain");
  if (rain && !reduce) {
    var em = ["😂", "🚗", "🤣", "🏍️", "🚦", "😅", "🛑", "🚚"];
    for (var i = 0; i < 16; i++) {
      var s = document.createElement("span");
      s.textContent = em[i % em.length];
      s.style.left = (Math.random() * 100) + "%";
      s.style.animationDuration = (6 + Math.random() * 8) + "s";
      s.style.animationDelay = (-Math.random() * 10) + "s";
      rain.appendChild(s);
    }
  }

  function left(ms) {
    if (ms <= 0) return "saindo do ar";
    var h = Math.floor(ms / 3600e3), m = Math.floor((ms % 3600e3) / 60e3);
    if (h >= 24) return "some em " + Math.floor(h / 24) + "d " + (h % 24) + "h";
    if (h >= 1) return "some em " + h + "h " + m + "min";
    return "some em " + m + "min ⚠️";
  }

  function media(m) {
    if (m.tipo === "youtube") {
      return '<button type="button" class="yt-thumb" data-yt="' + esc(m.id) + '" aria-label="Assistir: ' + esc(m.titulo || "meme") + '" style="all:unset;cursor:pointer;display:block;width:100%;height:100%;position:relative">' +
        '<img src="https://i.ytimg.com/vi/' + esc(m.id) + '/hqdefault.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover">' +
        '<span style="position:absolute;inset:0;display:grid;place-items:center"><span style="width:68px;height:68px;border-radius:50%;background:rgba(0,0,0,.6);display:grid;place-items:center;color:#fff;font-size:1.8rem">▶</span></span></button>';
    }
    if (m.tipo === "imagem") {
      return '<img src="' + esc(m.src) + '" alt="' + esc(m.titulo || "Post") + '" loading="lazy">';
    }
    if (m.tipo === "carrossel") {
      var fotos = m.fotos || [];
      return '<div class="mc" tabindex="0" aria-label="Carrossel: arraste para o lado">' +
        fotos.map(function (f, i) { return '<img src="' + esc(f) + '" alt="' + esc((m.titulo || "Carrossel") + " " + (i + 1) + "/" + fotos.length) + '" loading="lazy">'; }).join("") +
        '</div><span class="mc__dots">' + fotos.map(function (_, i) { return '<i' + (i ? "" : ' class="on"') + "></i>"; }).join("") + "</span>" +
        '<button type="button" class="mc__nav mc__prev" aria-label="Anterior">‹</button><button type="button" class="mc__nav mc__next" aria-label="Próxima">›</button>';
    }
    return '<video src="' + esc(m.src) + '"' + (m.capa ? ' poster="' + esc(m.capa) + '"' : "") + ' muted loop playsinline preload="metadata"></video>' +
      '<button type="button" class="meme__sound" aria-label="Ativar som">🔇</button>';
  }

  function card(m) {
    var exp = new Date(m.data).getTime() + LIMIT;
    var el = document.createElement("article");
    el.className = "meme reveal is-in";
    el.dataset.exp = exp;
    var urgent = exp - Date.now() < 6 * 3600e3;
    el.innerHTML =
      '<div class="meme__media' + (m.tipo === "imagem" || m.tipo === "carrossel" ? " meme__media--feed" : "") + '">' + media(m) + '<span class="meme__left' + (urgent ? " is-urgent" : "") + '">⏳ ' + left(exp - Date.now()) + "</span></div>" +
      '<div class="meme__body"><h3>' + esc(m.titulo || "Meme da autoescola 😂") + "</h3>" +
      '<div class="meme__actions"><button type="button" class="btn btn--ghost" data-share-meme>📤 Mandar pro amigo</button>' +
      '<button type="button" class="btn btn--dark" data-open-chat>Quero minha CNH</button></div></div>';
    var sh = el.querySelector("[data-share-meme]");
    sh.addEventListener("click", function () {
      var url = (C.siteUrl || location.origin) + "/memes.html";
      var txt = "Kkkkk olha isso 😂 " + (m.titulo ? m.titulo + " " : "") + url;
      track("share", { method: "whatsapp", content_type: "meme", item_id: m.id || m.src });
      window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank", "noopener");
    });
    var v = el.querySelector("video"), snd = el.querySelector(".meme__sound");
    if (v && snd) {
      snd.addEventListener("click", function () {
        v.muted = !v.muted; snd.textContent = v.muted ? "🔇" : "🔊";
        snd.setAttribute("aria-label", v.muted ? "Ativar som" : "Desativar som");
        if (!v.muted) { document.querySelectorAll(".meme video").forEach(function (o) { if (o !== v) { o.muted = true; var b = o.parentElement.querySelector(".meme__sound"); if (b) b.textContent = "🔇"; } }); v.play(); }
      });
    }
    var mc = el.querySelector(".mc");
    if (mc) {
      var dots = el.querySelectorAll(".mc__dots i");
      var go = function (d) { mc.scrollBy({ left: d * mc.clientWidth, behavior: "smooth" }); };
      el.querySelector(".mc__prev").addEventListener("click", function () { go(-1); });
      el.querySelector(".mc__next").addEventListener("click", function () { go(1); });
      mc.addEventListener("scroll", function () {
        var i = Math.round(mc.scrollLeft / mc.clientWidth);
        dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
      }, { passive: true });
    }
    var yt = el.querySelector("[data-yt]");
    if (yt) yt.addEventListener("click", function () {
      var id = yt.getAttribute("data-yt");
      yt.outerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&rel=0&loop=1&playlist=' + encodeURIComponent(id) + '" title="' + esc(m.titulo || "Meme") + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      track("video_start", { video_title: m.titulo || id, origem: "youtube" });
    });
    return el;
  }

  function empty() {
    grid.style.display = "block";
    grid.innerHTML = '<div class="memes-empty"><span class="big">🚗💨</span><h2>Os memes acabaram de sair do ar!</h2>' +
      "<p>Toda semana tem meme novo aqui, e eles ficam só 3 dias. Enquanto isso, os antigos continuam nas redes:</p>" +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
      (C.instagram ? '<a class="btn btn--dark" href="' + C.instagram + '" target="_blank" rel="noopener">Ver no Instagram</a>' : "") +
      (C.youtube ? '<a class="btn btn--ghost" href="' + C.youtube + '/shorts" target="_blank" rel="noopener">Ver no YouTube</a>' : "") +
      "</div></div>";
    if (countEl) countEl.textContent = "⏳ Meme novo chegando em breve";
  }

  function render(list) {
    var now = Date.now();
    var on = (list || []).filter(function (m) { var t = new Date(m.data).getTime(); return t && now - t < LIMIT && now >= t - 60e3; })
      .sort(function (a, b) { return new Date(b.data) - new Date(a.data); });
    grid.innerHTML = "";
    grid.style.display = "";
    if (!on.length) return empty();
    on.forEach(function (m) { grid.appendChild(card(m)); });
    if (countEl) countEl.textContent = "🔥 " + on.length + (on.length === 1 ? " meme no ar agora" : " memes no ar agora") + " · cada um some em 3 dias";
    track("view_memes", { quantidade: on.length });

    /* Toca só o vídeo que está na tela */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { var v = en.target; if (en.isIntersecting && !reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: .6 });
      grid.querySelectorAll("video").forEach(function (v) { io.observe(v); });
    }
  }

  /* Atualiza a contagem a cada minuto e remove o que venceu */
  setInterval(function () {
    var now = Date.now(), any = false;
    grid.querySelectorAll(".meme").forEach(function (el) {
      var ms = +el.dataset.exp - now, b = el.querySelector(".meme__left");
      if (ms <= 0) { el.style.transition = "opacity .6s, transform .6s"; el.style.opacity = "0"; el.style.transform = "scale(.9)"; setTimeout(function () { el.remove(); if (!grid.querySelector(".meme")) empty(); }, 650); return; }
      any = true;
      if (b) { b.textContent = "⏳ " + left(ms); b.classList.toggle("is-urgent", ms < 6 * 3600e3); }
    });
  }, 60e3);

  fetch("memes/memes.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(render)
    .catch(empty);
})();
