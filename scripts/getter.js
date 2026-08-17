/**
 * Folken's Dependency Getter
 * --------------------------
 * The module itself does nothing at runtime except REPORT. Its power is in
 * module.json's relationships.requires: Foundry's installer reads that list
 * (each entry carries a manifest URL) and offers to download every missing
 * module when this one is installed. Install this by manifest URL on a fresh
 * instance -> accept the dependency prompt -> the whole standard loadout
 * arrives without hand-installing each module.
 *
 * On world load it audits: which declared dependencies are absent from the
 * instance, plus the known-unfetchable lists (Foundry-protected premium
 * content and manifest-less Patreon zips) shipped in nomanifest.json.
 */

const MODULE = "folken-dependency-getter";

Hooks.once("ready", async () => {
  if (!game.user.isGM) return;

  const self = game.modules.get(MODULE);
  const required = self?.relationships?.requires ?? [];
  const missing = [];
  for (const r of required) {
    if (!game.modules.has(r.id)) missing.push(r.id);
  }

  let special = { protected: [], nomanifest: [] };
  try {
    const resp = await fetch(`modules/${MODULE}/scripts/nomanifest.json`);
    if (resp.ok) special = await resp.json();
  } catch (_e) { /* report without the lists */ }

  const missingProtected = special.protected.filter(id => !game.modules.has(id));
  const missingManual = special.nomanifest.filter(id => !game.modules.has(id));

  console.log(`%c${MODULE}`, "color:#7ec8e3",
    `| auto-installable declared: ${required.length}, missing here: ${missing.length}`,
    missing.length ? missing : "(all present)");
  if (missingProtected.length) console.warn(`${MODULE} | premium/protected modules missing (install from your Foundry account's premium content per instance):`, missingProtected);
  if (missingManual.length) console.warn(`${MODULE} | manifest-less modules missing (copy from another instance or reinstall from the creator):`, missingManual);

  if (missing.length || missingProtected.length || missingManual.length) {
    ui.notifications.warn(
      `Dependency Getter: ${missing.length} auto-installable module(s) missing` +
      (missingProtected.length ? `, ${missingProtected.length} premium` : "") +
      (missingManual.length ? `, ${missingManual.length} manual-only` : "") +
      ` — see console (F12) for the lists. Reinstall this module from its manifest URL to re-trigger the dependency prompt.`
    );
  } else {
    console.log(`${MODULE} | complete: every tracked module is present on this instance.`);
  }
});
