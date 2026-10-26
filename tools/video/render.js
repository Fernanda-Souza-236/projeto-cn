#!/usr/bin/env node
/*
  Gera as peças de vídeo da marca (precisa de Playwright + ffmpeg).
    node render.js moldura  saida.png   [--tel "(31) 97147-0515"] [--site dominio.com.br]
    node render.js final    saida.mp4   [--tel ...] [--site ...]   (cartão final de 3,5 s)
    node render.js promo    saida.mp4   [--tel ...] [--site ...]   (vídeo de 15 s para Reels/anúncio)
*/
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");

const [, , kind, out, ...rest] = process.argv;
const opt = {}; for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, "")] = rest[i + 1];
const DUR = { final: 3.5, promo: 15, final_anuncio: 3.5, anuncio: 15 };
const FPS = 30;
if (!kind || !out) { console.error("uso: node render.js moldura|final|promo saida [--tel ..] [--site ..]"); process.exit(1); }

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const qs = new URLSearchParams(opt).toString();
  const file = path.join(__dirname, kind + ".html");
  await p.goto("file://" + file + (qs ? "?" + qs : ""));
  await p.evaluate(() => document.fonts.ready);
  if (kind === "moldura" || kind === "gancho") {
    await p.screenshot({ path: out, omitBackground: true });
    await b.close(); console.log("ok", out); return;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "frames-"));
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const N = Math.round(DUR[kind] * FPS);
  for (let f = 0; f < N; f++) {
    const t = (f * 1000) / FPS;
    await p.evaluate(t => document.getAnimations().forEach(a => { a.currentTime = t; }), t);
    await p.screenshot({ path: path.join(dir, String(f).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
  }
  await b.close();
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", path.join(dir, "%04d.jpg"),
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("ok", out);
})();
