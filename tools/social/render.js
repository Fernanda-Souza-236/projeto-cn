#!/usr/bin/env node
/*
  Renderiza os reels (reel.html?id=rN) em vídeo ou tira prévias.
    node render.js preview r1 r2 ...      -> prévias em out/preview/rN_<t>.jpg
    node render.js video   r1 r2 ...      -> out/raw/rN.mp4 (sem áudio, sem cartão final)
    node render.js slides                 -> out/img/*.png (posts e carrosséis de slides.html)
*/
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");
const [, , mode, ...ids] = process.argv;
const OUT = path.join(__dirname, "out");
const FPS = 30;

(async () => {
  const b = await chromium.launch();
  if (mode === "slides") {
    const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    await p.goto("file://" + path.join(__dirname, "slides.html"));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    fs.mkdirSync(path.join(OUT, "img"), { recursive: true });
    const names = await p.$$eval(".slide", els => els.map(e => e.id));
    for (const n of names) {
      const el = await p.$("#" + n);
      await el.screenshot({ path: path.join(OUT, "img", n + ".png") });
    }
    console.log("slides:", names.length);
    await b.close(); return;
  }
  for (const id of ids) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await p.goto("file://" + path.join(__dirname, "reel.html") + "?id=" + id);
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
    const dur = await p.evaluate(() => window.DUR);
    const seek = t => p.evaluate(t => document.getAnimations().forEach(a => { a.currentTime = t; }), t);
    if (mode === "preview") {
      fs.mkdirSync(path.join(OUT, "preview"), { recursive: true });
      const ts = [];
      for (let t = 1; t < dur; t += 1.5) ts.push(t);
      ts.push(dur - 0.05);
      for (const t of ts) {
        await seek(t * 1000);
        await p.screenshot({ path: path.join(OUT, "preview", `${id}_${t.toFixed(1)}.jpg`), type: "jpeg", quality: 70 });
      }
      console.log("preview", id, ts.length);
    } else {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rf-"));
      const N = Math.round(dur * FPS);
      for (let f = 0; f < N; f++) {
        await seek((f * 1000) / FPS);
        await p.screenshot({ path: path.join(dir, String(f).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
      }
      fs.mkdirSync(path.join(OUT, "raw"), { recursive: true });
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", path.join(dir, "%04d.jpg"),
        "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS), path.join(OUT, "raw", id + ".mp4")]);
      fs.rmSync(dir, { recursive: true, force: true });
      console.log("video", id, N, "frames");
    }
    await p.close();
  }
  await b.close();
})();
