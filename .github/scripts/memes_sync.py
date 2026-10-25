#!/usr/bin/env python3
"""
Sincroniza a página de memes.

1. Lê o feed público do canal do YouTube e adiciona os vídeos novos
   (das últimas 72h) em memes/memes.json.
2. Remove do site tudo que tem mais de 72h (vídeos .mp4 enviados
   manualmente também são apagados da pasta memes/ para não pesar).

Nas redes sociais os vídeos continuam para sempre.
"""
import json, os, sys, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta

CANAL = os.environ.get("YT_CHANNEL_ID", "UC9FIcU6fQjA9HwK28cn35cA")
HORAS = int(os.environ.get("MEMES_HORAS", "72"))
ARQ = "memes/memes.json"
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}

agora = datetime.now(timezone.utc)
limite = agora - timedelta(hours=HORAS)

def parse(d):
    return datetime.fromisoformat(d.replace("Z", "+00:00"))

try:
    memes = json.load(open(ARQ, encoding="utf-8"))
except FileNotFoundError:
    memes = []
antes = json.dumps(memes, ensure_ascii=False, sort_keys=True)

# 1) YouTube
try:
    url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + CANAL
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 memes-sync"})
    xml = urllib.request.urlopen(req, timeout=20).read()
    root = ET.fromstring(xml)
    ids = {m.get("id") for m in memes}
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", namespaces=NS)
        pub = e.findtext("a:published", namespaces=NS)
        tit = e.findtext("a:title", namespaces=NS) or "Meme da autoescola"
        if not vid or not pub or vid in ids:
            continue
        if parse(pub) < limite:
            continue
        memes.append({"id": vid, "tipo": "youtube", "titulo": tit.strip(), "data": pub, "origem": "youtube"})
        print("+ novo do YouTube:", vid, tit)
except Exception as ex:  # sem internet / canal vazio: segue só com a limpeza
    print("aviso: não consegui ler o YouTube:", ex, file=sys.stderr)

# 2) Limpeza do que venceu
ficam = []
for m in memes:
    try:
        vencido = parse(m["data"]) < limite
    except Exception:
        vencido = True
    if vencido:
        print("- saiu do site:", m.get("id") or m.get("src"))
        for k in ("src", "capa"):
            p = m.get(k)
            if p and p.startswith("memes/") and os.path.exists(p):
                os.remove(p)
        continue
    ficam.append(m)

ficam.sort(key=lambda m: m["data"], reverse=True)
depois = json.dumps(ficam, ensure_ascii=False, sort_keys=True)
if depois != antes:
    with open(ARQ, "w", encoding="utf-8") as f:
        json.dump(ficam, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("memes.json atualizado:", len(ficam), "no ar")
else:
    print("nada mudou")
