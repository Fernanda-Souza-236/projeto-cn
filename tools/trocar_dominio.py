#!/usr/bin/env python3
"""
Troca o endereço do site em todos os arquivos (canonical, Open Graph,
dados estruturados, sitemap, robots, config e README).

uso:  python3 tools/trocar_dominio.py fernandasouzacnh.eu.org
"""
import pathlib, sys

ANTIGO = "projeto-cn-wzxn.onrender.com"
if len(sys.argv) != 2:
    print(__doc__); sys.exit(1)
novo = sys.argv[1].strip().replace("https://", "").replace("http://", "").strip("/")
raiz = pathlib.Path(__file__).resolve().parent.parent
alterados = []
for p in raiz.rglob("*"):
    if not p.is_file() or ".git" in p.parts or "tools" in p.parts:
        continue
    if p.suffix not in {".html", ".xml", ".txt", ".js", ".webmanifest", ".md"}:
        continue
    t = p.read_text(encoding="utf-8")
    if ANTIGO in t:
        p.write_text(t.replace(ANTIGO, novo), encoding="utf-8")
        alterados.append(str(p.relative_to(raiz)))
print("\n".join(alterados) or "nada para trocar")
