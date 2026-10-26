/* Roteiros dos reels. t = início da cena (s), d = duração (s), at = quando o elemento entra (s). */
const REELS = {

r1: { dur: 10, scenes: [
  { t: 0, d: 3.1, i: [
    { h: "POV:", c: "h gold-text", a: "slam", at: .1 },
    { h: "o instrutor fala<br><b>“pode ir”</b><br>pela 1ª vez 🚗", c: "m", at: .6, s: "margin-top:26px" } ] },
  { t: 3, d: 4.1, i: [
    { h: "😰", c: "em", a: "pop", at: 3.05, loop: "shake .5s 3.6s 6" },
    { h: "✔️ Liga o limpador em vez da seta", c: "chk", a: "right", at: 3.7 },
    { h: "✔️ Esquece que existe embreagem", c: "chk", a: "right", at: 4.4 },
    { h: "✔️ O carro morre 3 vezes", c: "chk", a: "right", at: 5.1 },
    { h: "✔️ Pede desculpa pro carro 🙏", c: "chk", a: "right", at: 5.8 } ] },
  { t: 7, d: 3, i: [
    { h: "Relaxa 😅", c: "h", a: "slam", at: 7.1 },
    { h: "todo mundo começa assim.<br>Com orientação certa,", c: "k", at: 7.6, s: "margin-top:24px" },
    { h: "SUA CNH SAI 💛", c: "h gold-text", a: "pop", at: 8.3, s: "margin-top:18px" } ] }
]},

r2: { dur: 11, css: `
  .lane{position:relative;width:940px;height:420px;border-radius:34px;background:#2a2a2a;overflow:hidden;border:3px solid rgba(217,173,82,.45);margin:14px 0}
  .lane::after{content:"";position:absolute;left:0;right:0;bottom:70px;height:8px;background:repeating-linear-gradient(90deg,#fff 0 60px,transparent 60px 120px);opacity:.5}
  .cone{position:absolute;bottom:110px;font-size:110px;line-height:1;transform-origin:50% 90%}
  .cA{left:250px}.cB{left:640px}
  .vc{position:absolute;bottom:96px;font-size:170px;line-height:1;transform:scaleX(-1)}
  .exp .vc{left:-260px;animation:park 2s 1.2s both cubic-bezier(.3,.7,.3,1)}
  .rea .vc{left:-260px;animation:crash 2.4s 4.4s both ease-in-out}
  .rea .cA{animation:tip .5s 5.7s both}.rea .cB{animation:tip2 .5s 6.2s both}
  @keyframes park{to{transform:scaleX(-1) translateX(-640px)}}
  @keyframes crash{40%{transform:scaleX(-1) translateX(-500px) rotate(18deg)}70%{transform:scaleX(-1) translateX(-720px) rotate(-14deg) translateY(-30px)}100%{transform:scaleX(-1) translateX(-610px) rotate(24deg) translateY(-20px)}}
  @keyframes tip{to{transform:translateX(-90px) rotate(-100deg)}}
  @keyframes tip2{to{transform:translateX(120px) translateY(-60px) rotate(130deg)}}
  .lab{position:absolute;top:22px;left:26px}` ,
  scenes: [
  { t: 0, d: 8.6, i: [
    { h: "A BALIZA 👇", c: "h gold-text", a: "slam", at: .1, s: "margin-bottom:20px" },
    { h: '<div class="lane exp"><span class="lab lbl lbl--g">EXPECTATIVA</span><span class="cone cA">🚧</span><span class="cone cB">🚧</span><span class="vc">🚗</span></div>', a: "left", at: .5 },
    { h: '<div class="lane rea"><span class="lab lbl lbl--r">REALIDADE</span><span class="cone cA">🚧</span><span class="cone cB">🚧</span><span class="vc">🚗</span></div>', a: "right", at: 3.5 } ] },
  { t: 8.5, d: 2.5, i: [
    { h: "Quem nunca? 😂", c: "h", a: "slam", at: 8.6 },
    { h: "Marca aquele amigo<br>que é ruim de baliza 👇", c: "k", at: 9.1, s: "margin-top:24px" } ] }
]},

r3: { dur: 12, scenes: [
  { t: 0, d: 2.6, i: [
    { h: "Os 3 tipos de aluno<br>na autoescola", c: "h", a: "slam", at: .1 },
    { h: "qual é você? 👀", c: "k gold-text", at: .9, s: "margin-top:26px" } ] },
  { t: 2.5, d: 6.7, i: [
    { h: '<div class="box"><span class="ic">😎</span><span><b>1. O confiante</b><small>“Já sei dirigir, só falta o papel”</small></span></div>', a: "right", at: 2.6 },
    { h: '<div class="box"><span class="ic">🙏</span><span><b>2. O que reza</b><small>“Senhor, que o examinador seja gente boa”</small></span></div>', a: "right", at: 4.4 },
    { h: '<div class="box"><span class="ic">🪞</span><span><b>3. O caprichoso</b><small>15 minutos ajustando banco e retrovisor</small></span></div>', a: "right", at: 6.2 } ] },
  { t: 9.1, d: 2.9, i: [
    { h: "Comenta o número 👇", c: "h", a: "slam", at: 9.2 },
    { h: "Seja qual for, eu te ajudo<br>a tirar a sua CNH 💛", c: "k", at: 9.8, s: "margin-top:26px" } ] }
]},

r4: { dur: 13, css: `.phone{transform:scale(.92)} .phone .body{min-height:0;padding:24px 24px 30px}.b{font-size:40px;padding:16px 24px}`, scenes: [
  { t: 9.5, d: 3.5, i: [
    { h: "CNH nova =", c: "m", a: "up", at: 9.6 },
    { h: "motorista oficial<br>da família 🚗🛒", c: "h gold-text", a: "slam", at: 10.0, s: "margin-top:18px" },
    { h: "Marca sua mãe aqui 😂👇", c: "k", at: 10.8, s: "margin-top:30px" } ] },
  { t: 0, d: 9.6, i: [
    { h: '<div class="phone"><div class="top"><span class="av">👩</span><span>Mãe ❤️<small>online</small></span></div><div class="body" id="cb"></div></div>', a: "pop", at: .1 } ] }
], chat: [
  ["in", "Filho, quando você tirar a carteira vai me levar no mercado? 🥺", .8],
  ["out", "Claro, mãe! 😊", 2.3],
  ["sys", "1 semana depois da CNH…", 3.6],
  ["in", "Me leva no mercado", 4.4],
  ["in", "Depois na feira", 5.0],
  ["in", "No banco", 5.5],
  ["in", "Na casa da tia Cida", 6.0],
  ["in", "E busca seu primo na escola 😘", 6.6],
  ["out", "😭😭😭", 7.8]
]},

r5: { dur: 11, css: `
  .cal{width:760px;border-radius:40px;overflow:hidden;background:#fff;color:#111;box-shadow:0 30px 80px rgba(0,0,0,.5);margin:30px 0}
  .cal .hd{background:#d9ad52;font:800 46px Poppins;padding:20px}
  .yr{position:relative;height:200px}
  .yr span{position:absolute;inset:0;display:grid;place-items:center;font:800 120px Poppins;opacity:0}
  .y1{animation:yr 1s 2.1s both}.y2{animation:yr 1s 3.0s both}.y3{animation:yrEnd .6s 3.9s both;color:#e5484d}
  @keyframes yr{0%{opacity:0;transform:translateY(60px)}20%,80%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-60px)}}
  @keyframes yrEnd{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
  .stamp{position:absolute;inset:auto;transform:rotate(-12deg)}` ,
  scenes: [
  { t: 0, d: 7.1, i: [
    { h: "Sua CNH vencida há anos<br>e você:", c: "m", a: "up", at: .1 },
    { h: "☕😌", c: "em", a: "pop", at: .8, s: "font-size:180px;margin-top:10px", loop: "wob 1.6s 1.4s infinite" },
    { h: "“tá tudo bem”", c: "k", at: 1.3 },
    { h: '<div class="cal"><div class="hd">VALIDADE DA CNH</div><div class="yr"><span class="y1">2024</span><span class="y2">2025</span><span class="y3">VENCIDA</span></div></div>', a: "pop", at: 1.7 } ] },
  { t: 7, d: 4, i: [
    { h: "Não deixa virar problema ⏰", c: "m", a: "slam", at: 7.1 },
    { h: "Renovação da CNH com<br>orientação do começo ao fim", c: "k", at: 7.8, s: "margin-top:26px" },
    { h: "TE AJUDO A RENOVAR 💛", c: "h gold-text", a: "pop", at: 8.6, s: "margin-top:26px;font-size:76px" } ] }
]},

r6: { dur: 11, css: `
  .jam{font-size:120px;line-height:1.15;letter-spacing:6px;filter:saturate(.8)}
  .moto{position:absolute;left:-260px;top:58%;font-size:190px;animation:zip 1.1s 4.3s both cubic-bezier(.5,0,.3,1)}
  @keyframes zip{from{transform:translateX(0) scaleX(-1)}to{transform:translateX(1700px) scaleX(-1)}}` ,
  scenes: [
  { t: 0, d: 6.4, i: [
    { h: "Eu de carro<br>no trânsito parado:", c: "m", a: "up", at: .1 },
    { h: "🚗🚙🚕🚗<br>🚙🚗🚐🚙<br>🚕🚗🚙🚗", c: "jam", a: "pop", at: .8, s: "margin:30px 0" },
    { h: "😩", c: "em", a: "pop", at: 1.8, s: "font-size:150px", loop: "wob 1.2s 2.4s infinite" },
    { h: "O motoboy:", c: "m gold-text", a: "slam", at: 3.6 },
    { h: '<span class="moto">🏍️💨</span>', a: "up", at: 4.2, du: .1 } ] },
  { t: 6.3, d: 4.7, i: [
    { h: "Já tem CNH de carro?", c: "m", a: "up", at: 6.4 },
    { h: "Adicione a<br>categoria A 🏍️", c: "h gold-text", a: "slam", at: 7.0, s: "margin-top:20px" },
    { h: "Te explico tudo pelo WhatsApp", c: "k", at: 7.9, s: "margin-top:26px" } ] }
]},

r7: { dur: 13, scenes: [
  { t: 0, d: 2.4, i: [
    { h: "Prova prática?", c: "h", a: "slam", at: .1 },
    { h: "Checklist em 10 segundos ⏱️", c: "m gold-text", at: .7, s: "margin-top:24px" } ] },
  { t: 2.3, d: 8, i: [
    { h: "🔒 Cinto antes de ligar o carro", c: "chk", a: "right", at: 2.4 },
    { h: "🪞 Ajusta banco e retrovisores", c: "chk", a: "right", at: 3.4 },
    { h: "💡 Seta SEMPRE antes de virar", c: "chk", a: "right", at: 4.4 },
    { h: "👀 Olha os retrovisores ao sair", c: "chk", a: "right", at: 5.4 },
    { h: "🛑 Placa PARE é parar mesmo", c: "chk", a: "right", at: 6.4 },
    { h: "🐢 Baliza com calma: devagar vale", c: "chk", a: "right", at: 7.4 },
    { h: "😮‍💨 Respira. Você treinou pra isso", c: "chk", a: "right", at: 8.4 } ] },
  { t: 10.2, d: 2.8, i: [
    { h: "Salva pra lembrar 📌", c: "h", a: "slam", at: 10.3 },
    { h: "e manda pra quem vai fazer a prova", c: "k", at: 10.9, s: "margin-top:24px" } ] }
]},

r8: { dur: 12, css: `
  .ped{display:flex;gap:40px;margin:34px 0}
  .ped span{width:190px;height:260px;border-radius:30px;background:#2b2b2b;border:4px solid #555;display:grid;place-items:end center;padding-bottom:20px;font:800 34px Poppins;color:#cfc6b3}
  .q{font:800 120px Poppins;color:#d9ad52}` ,
  scenes: [
  { t: 0, d: 2.2, i: [
    { h: "Ninguém:", c: "h", a: "slam", at: .1 },
    { h: "…", c: "xl", a: "pop", at: .8 } ] },
  { t: 2.1, d: 5.6, i: [
    { h: "Eu na 1ª aula:", c: "m gold-text", a: "up", at: 2.2 },
    { h: "“Por que tem<br>TRÊS pedais??”", c: "h", a: "slam", at: 2.8, s: "margin-top:20px" },
    { h: '<div class="ped"><span>EMBR.</span><span>FREIO</span><span>ACEL.</span></div>', a: "pop", at: 3.8 },
    { h: '<span class="q">? ? ?</span>', a: "pop", at: 4.6, loop: "shake .5s 5.2s 3" } ] },
  { t: 7.6, d: 4.4, i: [
    { h: "O instrutor:", c: "m", a: "up", at: 7.7 },
    { h: "🧘", c: "em", a: "pop", at: 8.1 },
    { h: "“Respira… a gente chega lá”", c: "k", at: 8.7, s: "margin-top:16px" },
    { h: "E chega mesmo 💛", c: "m gold-text", a: "pop", at: 9.6, s: "margin-top:24px" } ] }
]},

r9: { dur: 12, confetti: 6.0, css: `
  .drum{font-size:200px;line-height:1}
  .dots span{display:inline-block;font:800 140px Poppins;color:#d9ad52;animation:bounce .6s infinite}
  .dots span:nth-child(2){animation-delay:.15s}.dots span:nth-child(3){animation-delay:.3s}
  .ok{font:800 150px Poppins;color:#25d366;text-shadow:0 10px 50px rgba(37,211,102,.5)}` ,
  scenes: [
  { t: 0, d: 6.0, i: [
    { h: "Resultado da<br>prova prática…", c: "h", a: "up", at: .1 },
    { h: "🥁", c: "drum", a: "pop", at: 1.2, loop: "shake .3s 1.6s 12" },
    { h: '<div class="dots"><span>.</span><span>.</span><span>.</span></div>', a: "up", at: 2.0 } ] },
  { t: 5.9, d: 6.1, i: [
    { h: "APROVADO", c: "ok", a: "slam", at: 6.0 },
    { h: "✅🥳🚗", c: "em", a: "pop", at: 6.6, s: "font-size:160px" },
    { h: "Esse dia vai chegar<br>pra você também 💛", c: "m", at: 7.6, s: "margin-top:20px" } ] }
]},

r10: { dur: 13, scenes: [
  { t: 0, d: 2.5, i: [
    { h: "Coisas que mudam quando você tira a CNH", c: "h", a: "slam", at: .1 },
    { h: "(a 4ª é real demais 😂)", c: "k gold-text", at: .9, s: "margin-top:24px" } ] },
  { t: 2.4, d: 7.6, i: [
    { h: '<div class="box"><span class="ic">🛣️</span><span><b>1. Liberdade</b><small>Vai e volta na hora que quiser</small></span></div>', a: "right", at: 2.5 },
    { h: '<div class="box"><span class="ic">💼</span><span><b>2. Mais vagas</b><small>Muita vaga de emprego pede CNH</small></span></div>', a: "right", at: 4.0 },
    { h: '<div class="box"><span class="ic">💸</span><span><b>3. Adeus, corrida cara</b><small>Aplicativo só quando você quer</small></span></div>', a: "right", at: 5.5 },
    { h: '<div class="box"><span class="ic">🍕</span><span><b>4. Motorista do rolê</b><small>Todo mundo vira seu amigo 😅</small></span></div>', a: "right", at: 7.0 } ] },
  { t: 9.9, d: 3.1, i: [
    { h: "Bora começar? 🚀", c: "h", a: "slam", at: 10.0 },
    { h: "Pré-cadastro em 1 minuto", c: "m gold-text", at: 10.6, s: "margin-top:24px" } ] }
]}
};

/* Monta o chat do reel 4 */
document.addEventListener("DOMContentLoaded", () => {});
function montaChat(R) {
  const cb = document.getElementById("cb"); if (!cb || !R.chat) return;
  R.chat.forEach(([k, txt, at]) => {
    const d = document.createElement("div");
    d.className = k === "sys" ? "sys f" : "b " + k + " f";
    d.innerHTML = txt + (k === "sys" ? "" : "<em>" + (k === "out" ? "18:4" + Math.floor(at) + " ✓✓" : "18:4" + Math.floor(at)) + "</em>");
    d.style.animation = "pop .4s " + at + "s both";
    cb.appendChild(d);
  });
}
