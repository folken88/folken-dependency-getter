#!/usr/bin/env python3
"""Rebuild module.json's requires list from a reference instance.

Run ON the TrueNAS (or over ssh) against the reference instance's modules
dir, output JSON to stdout; feed it to the repo's generator or paste the
requires array into module.json and bump the version.

  python3 harvest.py /mnt/fast/foundry/data/f1/Data/modules > harvest.json

Skips: protected (premium) modules, modules without a manifest URL, and the
getter itself. Both skip-lists are written into scripts/nomanifest.json so
the in-game audit can name what it can't fetch.
"""
import os, sys, json

base = sys.argv[1] if len(sys.argv) > 1 else '/mnt/fast/foundry/data/f1/Data/modules'
deps, nomanifest, protected = [], [], []
for d in sorted(os.listdir(base)):
    mj = os.path.join(base, d, 'module.json')
    if not os.path.isfile(mj):
        continue
    try:
        m = json.load(open(mj, encoding='utf-8', errors='replace'))
    except Exception:
        continue
    mid = m.get('id') or m.get('name') or d
    if mid == 'folken-dependency-getter':
        continue
    if m.get('protected'):
        protected.append(mid)
        continue
    man = m.get('manifest') or ''
    if man.startswith('http'):
        deps.append({'id': mid, 'type': 'module', 'manifest': man, 'compatibility': {}})
    else:
        nomanifest.append(mid)

json.dump({'requires': deps, 'protected': protected, 'nomanifest': nomanifest},
          sys.stdout, indent=2)
