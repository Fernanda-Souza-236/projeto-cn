# Site Fernanda Souza · Atendimento CNH

Site de captação de alunos para **primeira habilitação**, **adição de categoria** e **renovação da CNH**, com atendimento em todo o Brasil e encaminhamento para CFCs parceiros.

## Como editar os dados (WhatsApp, redes sociais, e-mail)
Abra **`js/config.js`** e troque os valores. Não precisa mexer em mais nada.
Deixe uma rede vazia (`""`) para escondê-la do site.

## Publicar no Render
1. No Render: **New → Static Site** e conecte este repositório.
2. Build Command: deixe **vazio**. Publish Directory: **`.`**
3. Clique em **Create Static Site**. Cada `git push` atualiza o site sozinho.

(Ou use **New → Blueprint**, que lê o arquivo `render.yaml` automaticamente.)

## Estrutura
- `index.html` · página principal
- `privacidade.html` · política de privacidade (LGPD)
- `css/style.css` · visual
- `js/config.js` · **dados da Fernanda**
- `js/main.js` · funcionamento (formulário → WhatsApp, menu, categorias, compartilhar)
- `img/` · ícone e imagem de compartilhamento
