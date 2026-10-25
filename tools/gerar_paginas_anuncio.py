#!/usr/bin/env python3
"""
Gera as 3 páginas de destino dos anúncios (uma por serviço):
  primeira-habilitacao.html, adicao-de-categoria.html, renovacao-cnh.html

uso: python3 tools/gerar_paginas_anuncio.py
Edite o dicionário PAGINAS para mudar textos. O endereço do site vem de SITE.
"""
import html, pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SITE = re.search(r'siteUrl:\s*"([^"]+)"', (RAIZ / "js/config.js").read_text()).group(1).rstrip("/")
ICONES = re.search(r"<!-- Ícones -->.*?</svg>\n", (RAIZ / "index.html").read_text(), re.S).group(0)

PAGINAS = {
    "primeira-habilitacao": {
        "servico": "Primeira habilitação",
        "title": "Primeira Habilitação (CNH A, B ou AB) em todo o Brasil | Fernanda Souza",
        "desc": "Vai tirar sua primeira CNH? Pré-cadastro em 1 minuto e encaminhamento para uma autoescola (CFC) parceira perto de você. Moto, carro ou os dois.",
        "eyebrow": "🎓 Primeira habilitação",
        "h1": "Tire sua <span class=\"hl\">primeira CNH</span> sem dor de cabeça",
        "lead": "Você me conta o que precisa, eu explico cada etapa e te encaminho para uma autoescola (CFC) parceira perto de você. Tudo pelo WhatsApp.",
        "beneficios": [
            ("Passo a passo explicado", "exames, aulas e provas, sem termos complicados"),
            ("Moto, carro ou os dois", "categoria A, B ou AB juntas"),
            ("CFC parceiro na sua cidade", "atendimento em todo o Brasil"),
        ],
        "cnh": "CATEGORIA B",
        "cards_titulo": "Qual CNH você quer tirar?",
        "cards": [
            ("A", "Moto", "Motos, motonetas e triciclos. Ótima para trabalhar com entregas."),
            ("B", "Carro", "Carros de passeio e utilitários leves. Necessária para dirigir por aplicativo."),
            ("AB", "Moto + carro", "As duas juntas, aproveitando o mesmo processo."),
        ],
        "faq": [
            ("Com quantos anos posso tirar a CNH?", "A partir dos 18 anos, sabendo ler e escrever e com documento de identidade e CPF."),
            ("Quanto custa?", "Minha orientação não tem custo. Os valores de aulas, exames e taxas são passados pelo CFC e pelo Detran do seu estado antes de você fechar qualquer coisa."),
            ("Quanto tempo demora?", "Depende do seu estado e da agenda do CFC e do Detran. No atendimento eu te passo uma estimativa realista."),
        ],
        "whats": "Olá, Fernanda! Vi o anúncio e quero tirar minha *primeira habilitação*. Como funciona? 🚗",
    },
    "adicao-de-categoria": {
        "servico": "Adição de categoria",
        "title": "Adição de Categoria na CNH (A, B, C, D, E) | Fernanda Souza",
        "desc": "Já tem CNH? Adicione moto, carro, caminhão, ônibus ou carreta. Pré-cadastro em 1 minuto e CFC parceiro perto de você, em todo o Brasil.",
        "eyebrow": "➕ Adição de categoria",
        "h1": "Adicione a <span class=\"hl\">categoria que falta</span> na sua CNH",
        "lead": "Moto, carro, caminhão, ônibus ou carreta: eu te explico os requisitos, organizo o caminho e te encaminho para um CFC parceiro perto de você.",
        "beneficios": [
            ("Mais oportunidades de trabalho", "entregas, aplicativo, transporte e carga"),
            ("Requisitos explicados", "idade e tempo de habilitação de cada categoria"),
            ("CFC parceiro na sua cidade", "atendimento em todo o Brasil"),
        ],
        "cnh": "CATEGORIA A · B · C · D · E",
        "cards_titulo": "Qual categoria você quer adicionar?",
        "cards": [
            ("A", "Moto", "Para quem já tem B e quer pilotar moto."),
            ("B", "Carro", "Para quem já tem A e quer dirigir carro."),
            ("C", "Caminhão", "Exige CNH B há pelo menos 1 ano."),
            ("D", "Ônibus e vans", "Exige 21 anos e tempo mínimo nas categorias B ou C."),
            ("E", "Carreta", "Exige 21 anos e tempo mínimo na categoria C ou D."),
        ],
        "faq": [
            ("Adicionar categoria é mais rápido que tirar a CNH?", "Geralmente sim, porque parte do processo você já fez na primeira habilitação. Te explico como fica no seu estado."),
            ("Quanto custa?", "Minha orientação não tem custo. Os valores de aulas, exames e taxas são passados pelo CFC e pelo Detran do seu estado antes de você fechar qualquer coisa."),
            ("Preciso fazer prova de novo?", "Para a nova categoria há aulas e exame prático. Os detalhes variam por estado e eu te oriento em cada etapa."),
        ],
        "whats": "Olá, Fernanda! Vi o anúncio e quero *adicionar uma categoria* na minha CNH. Como funciona? 🚚",
    },
    "renovacao-cnh": {
        "servico": "Renovação da CNH",
        "title": "Renovação da CNH vencida ou a vencer | Fernanda Souza",
        "desc": "CNH vencida ou perto de vencer? Orientação sobre exames, documentos e o caminho mais rápido no seu estado. Atendimento em todo o Brasil pelo WhatsApp.",
        "eyebrow": "🔄 Renovação da CNH",
        "h1": "Sua CNH venceu? <span class=\"hl\">A gente resolve</span>",
        "lead": "Te oriento sobre exames, documentos e o caminho mais rápido no seu estado, para você voltar a dirigir tranquilo.",
        "beneficios": [
            ("Vencida ou perto de vencer", "dá para renovar mesmo depois do vencimento"),
            ("Exames e documentos explicados", "sem perder tempo indo e voltando"),
            ("Atendimento em todo o Brasil", "pelo WhatsApp, com alguém de verdade"),
        ],
        "cnh": "VALIDADE: RENOVADA ✨",
        "cards_titulo": "Em qual situação você está?",
        "cards": [
            ("⏰", "Vai vencer", "Renove antes e não fique sem dirigir."),
            ("⚠️", "Já venceu", "Ainda dá para renovar. Te explico o que muda no seu caso."),
            ("➕", "Renovar e mudar", "Quer aproveitar e adicionar ou mudar de categoria? Também ajudo."),
        ],
        "faq": [
            ("Posso dirigir com a CNH vencida?", "Existe um prazo curto de tolerância depois do vencimento, que pode mudar. Passou disso, não pode dirigir até renovar. Confirme sempre no Detran do seu estado."),
            ("Quanto custa?", "Minha orientação não tem custo. As taxas e exames são do Detran e das clínicas credenciadas do seu estado."),
            ("Quais documentos preciso?", "Em geral, documento de identidade com foto, CPF e comprovante de residência. Te passo a lista certinha do seu estado."),
        ],
        "whats": "Olá, Fernanda! Vi o anúncio e preciso *renovar minha CNH*. Como funciona? 🔄",
    },
}

def e(t):
    return html.escape(t, quote=True)

def pagina(slug, p):
    url = f"{SITE}/{slug}.html"
    ben = "\n".join(f'          <li><span class="ok">✓</span><span><b>{e(a)}</b>, {e(b)}</span></li>' for a, b in p["beneficios"])
    cards = "\n".join(
        f'        <article class="req reveal" style="--d:{i*0.08:.2f}s"><span class="req__badge">{e(a)}</span><h3>{e(b)}</h3><p>{e(c)}</p></article>'
        for i, (a, b, c) in enumerate(p["cards"]))
    faq = "\n".join(f"        <details><summary>{e(q)}</summary><p>{e(r)}</p></details>" for q, r in p["faq"])
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{e(p["title"])}</title>
  <meta name="description" content="{e(p["desc"])}">
  <meta name="robots" content="noindex, follow">
  <meta name="theme-color" content="#151515">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{e(p["title"])}">
  <meta property="og:description" content="{e(p["desc"])}">
  <meta property="og:image" content="{SITE}/img/og-image.png">
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="img/icon-192.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css?v=4">
  <script>window.LP_SERVICO = {p["servico"]!r}; window.LP_ORIGEM = "anúncio: " + {p["servico"]!r}.toLowerCase(); window.LP_WHATS_TEXT = {p["whats"]!r};</script>
  <script src="js/config.js?v=4"></script>
  <script src="js/consent.js?v=4"></script>
</head>
<body class="lp-page">
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="progress" id="progress" aria-hidden="true"></div>

<header class="lp-top header">
  <div class="container header__inner">
    <a href="index.html" class="logo" aria-label="Página inicial">
      <img src="img/favicon.svg" alt="" width="38" height="38">
      <span><strong data-cfg="nome">Fernanda Souza</strong><small>Atendimento CNH</small></span>
    </a>
    <a href="#" class="btn btn--whats btn--small" data-whats><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whats"/></svg> WhatsApp</a>
  </div>
</header>

<main id="conteudo">
  <section class="lp-hero">
    <div class="container hero__grid">
      <div class="reveal">
        <span class="tag"><span class="dot"></span> {e(p["eyebrow"])} · todo o Brasil</span>
        <h1>{p["h1"]}</h1>
        <p class="lead">{e(p["lead"])}</p>
        <ul class="benefits">
{ben}
        </ul>
        <div class="hero__cta" style="margin:0">
          <button type="button" class="btn btn--primary btn--lg" data-open-chat data-servico="{e(p["servico"])}">Fazer meu pré-cadastro (1 min)</button>
          <a href="#" class="btn btn--whats btn--lg" data-whats><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whats"/></svg> Chamar no WhatsApp</a>
        </div>
        <div class="trust"><span>💬 Atendimento humano</span><span>🆓 Orientação sem custo</span><span>📍 CFCs parceiros no Brasil todo</span></div>
      </div>
      <div class="hero__card reveal" style="--d:.15s" aria-hidden="true">
        <div class="cnh" id="cnh">
          <div class="cnh__top"><span>REPÚBLICA FEDERATIVA DO BRASIL</span><span>CARTEIRA NACIONAL DE HABILITAÇÃO</span></div>
          <div class="cnh__body">
            <div class="cnh__photo">😎</div>
            <div class="cnh__lines">
              <div><small>NOME</small><b>VOCÊ</b></div>
              <div><small>SERVIÇO</small><b>{e(p["servico"].upper())}</b></div>
              <div><small>STATUS</small><b>{e(p["cnh"])}</b></div>
            </div>
          </div>
          <div class="cnh__stamp">APRO-<br>VADO!</div>
          <div class="cnh__foot">ILUSTRAÇÃO — NÃO É UM DOCUMENTO</div>
        </div>
      </div>
    </div>
    <div class="road" aria-hidden="true"><div class="road__lines"></div>
      <svg class="road__car" viewBox="0 0 120 52"><defs><linearGradient id="carG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d68c"/><stop offset="1" stop-color="#b8862c"/></linearGradient></defs><path d="M6 38 12 25q4-7 13-8l27-3q11-1 19 6l12 8 22 3q8 1 9 8v5H6z" fill="url(#carG)"/><path d="M29 20 50 18q8 0 14 5l5 5H27z" fill="#1d1d1d" opacity=".85"/><rect x="106" y="34" width="8" height="4" rx="2" fill="#fff8d6"/><g class="wheel"><circle cx="30" cy="43" r="8.5" fill="#111"/><circle cx="30" cy="43" r="3.5" fill="#d9ad52"/><path d="M30 36v14M23 43h14" stroke="#444" stroke-width="1.6"/></g><g class="wheel"><circle cx="91" cy="43" r="8.5" fill="#111"/><circle cx="91" cy="43" r="3.5" fill="#d9ad52"/><path d="M91 36v14M84 43h14" stroke="#444" stroke-width="1.6"/></g></svg>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <header class="section__head reveal"><span class="eyebrow">{e(p["servico"])}</span><h2>{e(p["cards_titulo"])}</h2></header>
      <div class="req-grid">
{cards}
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <header class="section__head reveal"><span class="eyebrow">Como funciona</span><h2>Simples assim</h2></header>
      <ol class="steps-mini">
        <li class="reveal"><h3>Pré-cadastro</h3><p>Você responde 5 perguntinhas no site. Leva menos de 1 minuto.</p></li>
        <li class="reveal" style="--d:.1s"><h3>WhatsApp</h3><p>Sua mensagem chega pronta no WhatsApp da Fernanda e ela te responde.</p></li>
        <li class="reveal" style="--d:.2s"><h3>CFC parceiro</h3><p>Você é encaminhado para uma autoescola (CFC) parceira perto de você.</p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="container container--narrow">
      <header class="section__head reveal"><span class="eyebrow">Dúvidas</span><h2>Perguntas frequentes</h2></header>
      <div class="faq reveal">
{faq}
      </div>
      <p class="note">As regras variam por estado e podem mudar. Confirme sempre as informações oficiais no Detran do seu estado.</p>
    </div>
  </section>

  <section class="section section--dark cta-band">
    <div class="container" style="max-width:720px">
      <span class="eyebrow eyebrow--light">Bora começar?</span>
      <h2 style="color:#fff;font-size:clamp(1.8rem,3.6vw,2.6rem);margin:8px 0 10px">Seu pré-cadastro leva 1 minuto</h2>
      <p>Atendimento humano, orientação sem custo e CFC parceiro perto de você.</p>
      <div class="btns">
        <button type="button" class="btn btn--primary btn--lg" data-open-chat data-servico="{e(p["servico"])}">Fazer meu pré-cadastro</button>
        <a href="#" class="btn btn--whats btn--lg" data-whats><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whats"/></svg> WhatsApp</a>
      </div>
    </div>
  </section>
</main>

<footer class="lp-footer">
  <div class="container">
    <p>Atendimento independente de captação e encaminhamento. Não somos o Detran nem um órgão público. O processo oficial é realizado por CFCs credenciados e pelo Detran de cada estado.</p>
    <p style="margin-top:8px">© <span id="ano"></span> Fernanda Souza · <a href="index.html">Site</a> · <a href="privacidade.html">Privacidade</a> · <a href="#" data-cookie-prefs>Cookies</a></p>
  </div>
</footer>

<div class="sticky-cta">
  <button type="button" class="btn btn--primary" data-open-chat data-servico="{e(p["servico"])}">Pré-cadastro</button>
  <a href="#" class="btn btn--whats" data-whats><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whats"/></svg> WhatsApp</a>
</div>

<button type="button" class="fab" id="fab" aria-label="Abrir conversa" aria-controls="chat" aria-expanded="false">
  <span class="fab__bubble">Posso te ajudar? 👋</span>
  <span class="fab__btn"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whats"/></svg><span class="fab__dot" aria-hidden="true">1</span></span>
</button>
<section class="chat" id="chat" role="dialog" aria-label="Assistente de pré-cadastro" aria-modal="false">
  <header class="chat__head">
    <div class="chat__avatar"><img src="img/favicon.svg" alt=""></div>
    <div><b data-cfg="nome">Fernanda Souza</b><small>online agora</small></div>
    <button type="button" class="chat__close" id="chatClose" aria-label="Fechar conversa">×</button>
  </header>
  <div class="chat__body" id="chatBody" aria-live="polite"></div>
  <form class="chat__input" id="chatForm" hidden>
    <label class="sr-only" for="chatInput">Sua resposta</label>
    <input id="chatInput" autocomplete="off">
    <button type="submit" class="chat__send" aria-label="Enviar"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 21 23 12 2 3v7l15 2-15 2z"/></svg></button>
  </form>
</section>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

{ICONES}
<script src="js/main.js?v=4" defer></script>
<script src="js/chat.js?v=4" defer></script>
<script>window.addEventListener("load", function () {{ if (window.track) window.track("view_content", {{ content_name: {p["servico"]!r}, content_category: "pagina_anuncio" }}); }});</script>
</body>
</html>
'''

for slug, p in PAGINAS.items():
    (RAIZ / f"{slug}.html").write_text(pagina(slug, p), encoding="utf-8")
    print("ok", slug + ".html")
