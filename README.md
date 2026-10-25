# Site Fernanda Souza | CNH

Captação de alunos para **primeira habilitação**, **adição de categoria** e **renovação da CNH**, com atendimento em todo o Brasil.

## O que tem no site
- **Assistente de pré-cadastro** (estilo WhatsApp): conversa guiada que monta a mensagem e abre o WhatsApp da Fernanda.
- **Formulário** alternativo, categorias interativas, passo a passo animado, estados clicáveis.
- **Página de memes** (`memes.html`): cada vídeo fica no site por **72 horas** e some sozinho.
- **Google Analytics 4** (`G-KXY665JVME`) e **Pixel da Meta** (`1101102572523090`), carregados só depois do "Aceitar" no aviso de cookies (LGPD + Consent Mode v2).
- Eventos medidos: `generate_lead` (Pixel: Lead), `contact` (Pixel: Contact), `share`, `click_social`, `chat_open`, `view_memes`.
- SEO: `sitemap.xml`, `robots.txt`, dados estruturados (negócio + FAQ), Open Graph, manifest (ícone de app).

## Editar dados
Tudo em **`js/config.js`**: WhatsApp, redes, horário, IDs de medição, domínio (`siteUrl`) e horas dos memes.
Ao trocar de domínio, troque também `siteUrl`, as tags `canonical`/`og:url` nos HTML e o `sitemap.xml`.

## Memes (some em 3 dias no site, fica para sempre nas redes)
Duas formas de entrar um meme no site:
1. **Automática:** postou no YouTube (Shorts) do canal → em até 2 horas aparece no site (GitHub Action `.github/workflows/memes.yml`).
2. **Manual:** coloque o `.mp4` em `memes/` e adicione em `memes/memes.json`:
   ```json
   { "tipo": "video", "src": "memes/nome.mp4", "titulo": "Quando o instrutor...", "data": "2026-10-25T18:00:00-03:00" }
   ```
A mesma Action apaga do site o que passou de 72 horas.

## Vídeos da marca (`tools/video`)
- `python3 moldura.py entrada.mp4 saida.mp4` → coloca qualquer vídeo na moldura dourada com WhatsApp e site, mais o cartão final.
- `node render.js promo promo.mp4 --site seudominio.com.br` → vídeo de 15 s para Reels/anúncio.
- Sem `--site`, os vídeos mostram "link na bio" (não aparece o endereço do servidor).

## Publicação
Render (Static Site) ligado a este repositório: cada commit na `main` publica sozinho.
