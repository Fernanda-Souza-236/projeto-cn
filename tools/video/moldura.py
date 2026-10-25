#!/usr/bin/env python3
"""
Coloca qualquer vídeo (meme, depoimento, dica) na moldura da marca e
adiciona o cartão final chamando para o site e o WhatsApp.

uso:  python3 moldura.py entrada.mp4 saida.mp4 [--sem-final]

Precisa de: ffmpeg, moldura.png e final.mp4 (gerados com render.js).
Saída: 1080x1920, 30 fps, H.264 + AAC (pronto para Reels, Shorts, TikTok e site).
"""
import json, os, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
MOLDURA = os.path.join(AQUI, "moldura.png")
FINAL = os.path.join(AQUI, "final.mp4")

def duracao(arq):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", arq],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)

def tem_audio(arq):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "json", arq],
                       capture_output=True, text=True)
    return bool(json.loads(r.stdout or "{}").get("streams"))

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        print(__doc__); sys.exit(1)
    ent, sai = args[0], args[1]
    com_final = "--sem-final" not in sys.argv

    cmd = ["ffmpeg", "-loglevel", "error", "-y", "-i", ent, "-i", MOLDURA]
    if com_final:
        cmd += ["-i", FINAL]
    audio_in = "0:a"
    if not tem_audio(ent):
        cmd += ["-f", "lavfi", "-t", "%.3f" % duracao(ent), "-i", "anullsrc=r=44100:cl=stereo"]
        audio_in = ("3" if com_final else "2") + ":a"

    f = (
        "[0:v]split[a][b];"
        "[a]scale=980:1280:force_original_aspect_ratio=increase,crop=980:1280,boxblur=24:2,eq=brightness=-0.18[bg];"
        "[b]scale=980:1280:force_original_aspect_ratio=decrease[fg];"
        "[bg][fg]overlay=(W-w)/2:(H-h)/2[win];"
        "[win]pad=1080:1920:50:250:color=0x0e0e0e[pad];"
        "[pad][1:v]overlay=0:0:shortest=0,fps=30,format=yuv420p,setsar=1[main];"
        f"[{audio_in}]aresample=44100,aformat=channel_layouts=stereo[ma]"
    )
    if com_final:
        f += ";[2:v]fps=30,format=yuv420p,setsar=1[fv];[2:a]aresample=44100,aformat=channel_layouts=stereo[fa];[main][ma][fv][fa]concat=n=2:v=1:a=1[v][au]"
        maps = ["-map", "[v]", "-map", "[au]"]
    else:
        maps = ["-map", "[main]", "-map", "[ma]"]
    cmd += ["-filter_complex", f] + maps + [
        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-r", "30",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", sai]
    subprocess.run(cmd, check=True)
    print("ok", sai)

if __name__ == "__main__":
    main()
