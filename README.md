# Folken's Dependency Getter

One module that drags the whole Folken Games loadout (431 modules) onto a
fresh FoundryVTT instance, so nobody hand-installs them one at a time ever
again.

## How it works

Foundry's installer resolves a module's `relationships.requires` list, and
each entry here carries the dependency's own **manifest URL**. Installing
this module therefore makes Foundry offer to download every missing module
in the list, in one pass.

## Usage on a fresh instance

1. Setup → Add-on Modules → Install Module → paste:
   `https://github.com/folken88/folken-dependency-getter/releases/latest/download/module.json`
2. Foundry lists the missing dependencies — accept.
3. Go get coffee; it's ~430 downloads.
4. In any world, enable **Folken's Dependency Getter** once: it audits the
   instance and reports (console + notification) anything still missing.

## What it cannot fetch (by design of the ecosystem, not this module)

- **Foundry-protected premium content** (9): filepicker-plus, fxmaster-plus,
  mastercrafted, media-optimizer, ripper-premium-dice, simple-timekeeping,
  the-stockpile, tokenflip, world-setting-sync. These are signed per
  instance — install them from the **premium content tab** of each
  instance's setup (license must be linked to the owning Foundry account).
  A file-copied version runs with an "invalid signature" warning.
- **Manifest-less modules** (33): the Folken compendium/content modules and
  Patreon-zip map packs (tomcartos, jb2a_patreon, …). Copy these from an
  existing instance or reinstall from the creator. The getter names any
  that are missing when enabled.

## Regenerating the list

`tools/harvest.py` rebuilds `module.json`'s requires list from a reference
instance's installed modules (run against f1). Re-run whenever the standard
loadout changes meaningfully, bump the version, cut a release.

## License

MIT. The listed modules belong to their respective authors; this module
contains none of their content — only public manifest URLs.
