#!/usr/bin/env python3
"""Trilha própria (sintetizada, sem direitos autorais de terceiros).
uso: python3 trilha.py <segundos> <variante 0-9> saida.wav"""
import sys, wave
import numpy as np

SR = 44100
dur, var, out = float(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
rng = np.random.default_rng(var)
bpm = [104, 112, 98, 120, 108, 100, 116, 96, 124, 110][var % 10]
beat = 60 / bpm
n = int(dur * SR)
mix = np.zeros(n)

def env(length, a=0.005, r=0.2):
    t = np.arange(length) / SR
    e = np.minimum(1, t / a) * np.exp(-t / r)
    return e

def put(sig, start):
    s = int(start * SR)
    if s >= n: return
    e = min(n, s + len(sig))
    mix[s:e] += sig[: e - s]

def note(f, length, vol, wave_="tri", a=.01, r=.3):
    L = int(length * SR); t = np.arange(L) / SR
    if wave_ == "tri":
        w = 2 * np.abs(2 * ((t * f) % 1) - 1) - 1
    elif wave_ == "saw":
        w = 2 * ((t * f) % 1) - 1
        w = np.convolve(w, np.ones(8) / 8, "same")
    else:
        w = np.sin(2 * np.pi * f * t)
    return w * env(L, a, r) * vol

def kick():
    L = int(.35 * SR); t = np.arange(L) / SR
    f = 120 * np.exp(-t * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * .9

def snare():
    L = int(.2 * SR); t = np.arange(L) / SR
    return (rng.standard_normal(L) * .5 + np.sin(2 * np.pi * 190 * t) * .3) * np.exp(-t * 22) * .5

def hat(o=False):
    L = int((.12 if o else .04) * SR)
    x = rng.standard_normal(L); x = np.diff(np.concatenate([[0], x]))
    return x * np.exp(-np.arange(L) / SR * (25 if o else 90)) * .18

midi = lambda m: 440 * 2 ** ((m - 69) / 12)
progs = [[0, 7, 9, 5], [9, 5, 0, 7], [0, 5, 7, 5], [2, 7, 0, 9]]
prog = progs[var % 4]
root = 60 + [0, 2, -3, 5, 0, -2, 3, 0, 4, -1][var % 10]
maj = {0: [0, 4, 7], 5: [0, 4, 7], 7: [0, 4, 7], 2: [0, 3, 7], 9: [0, 3, 7], 4: [0, 3, 7]}
bars = int(dur / (beat * 4)) + 2
for b in range(bars):
    t0 = b * beat * 4
    deg = prog[b % 4]
    chord = [midi(root + deg + i) for i in maj[deg]]
    for f in chord:  # pad
        put(note(f, beat * 4, .05, "saw", a=.08, r=2.5), t0)
    for k in range(8):  # baixo em colcheias
        if k in (0, 3, 4, 6):
            put(note(midi(root + deg - 24), beat * .45, .32, "tri", r=.25), t0 + k * beat / 2)
    for k in range(4):
        put(kick(), t0 + k * beat) if k in (0, 2) or (var % 2 and k == 3) else None
        if k in (1, 3): put(snare(), t0 + k * beat)
    for k in range(8):
        put(hat(k % 4 == 3), t0 + k * beat / 2)
    if b % 2 == 1:  # melodia simples (pluck)
        scale = [0, 2, 4, 7, 9, 12]
        for k in range(4):
            m = root + 12 + deg + scale[rng.integers(0, len(scale))]
            put(note(midi(m), beat * .5, .09, "sin", r=.18), t0 + (k * 2 + (k % 2) * .5) * beat / 2 + beat * 2)

mix *= np.minimum(1, np.arange(n) / (SR * .4))            # fade in
fo = int(SR * 1.2); mix[-fo:] *= np.linspace(1, 0, fo)    # fade out
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .7
st = np.stack([mix, np.roll(mix, 220)], 1)
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype("<i2").tobytes())
print("ok", out, bpm)
