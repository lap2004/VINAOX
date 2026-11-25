import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';

const SRC_DIR = path.join(process.cwd(), 'server', 'admin');
const OUT_DIR = path.join(process.cwd(), 'api', 'admin');

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    throw new Error(`Missing source directory: ${SRC_DIR}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const tsEntries = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.endsWith('.ts'))
    .sort();

  const expectedOutNames = new Set(tsEntries.map((f) => f.replace(/\.ts$/, '.mjs')));
  for (const existing of fs.readdirSync(OUT_DIR)) {
    if (existing.endsWith('.mjs') && !expectedOutNames.has(existing)) {
      fs.unlinkSync(path.join(OUT_DIR, existing));
    }
  }

  await build({
    entryPoints: tsEntries.map((f) => path.join(SRC_DIR, f)),
    outdir: OUT_DIR,
    outExtension: { '.js': '.mjs' },
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    logLevel: 'silent',
    banner: {
      js: '// Auto-generated standalone ESM bundle from server/admin/*.ts via scripts/build-api.mjs'
    }
  });

  console.log(`Built ${tsEntries.length} standalone ESM API handlers -> api/admin/*.mjs`);
}

main().catch((err) => {
  console.error('Failed to bundle API handlers:', err);
  process.exit(1);
});
