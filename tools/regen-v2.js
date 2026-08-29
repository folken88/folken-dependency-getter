// Regenerate module.json from a harvested+liveness-checked requires JSON.
// Usage: node tools/regen-v2.js <requires.json> <version>
const fs = require('fs');
const [, , reqPath, version] = process.argv;
const requires = JSON.parse(fs.readFileSync(reqPath, 'utf8'));
const mod = JSON.parse(fs.readFileSync('module.json', 'utf8'));
mod.version = version;
mod.description = `Bundle module: installing it makes Foundry offer to download the Folken Games TOOLS loadout (${requires.length} modules — system tools and enhancements only; map packs and content modules are deliberately excluded). Enable in a world to audit what is missing.`;
mod.relationships.requires = requires;
fs.writeFileSync('module.json', JSON.stringify(mod, null, 2));
console.log(`v${version}: ${requires.length} requires, ${(fs.statSync('module.json').size / 1024).toFixed(0)}KB`);
