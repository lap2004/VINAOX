import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';

const SRC_ADMIN_DIR = path.join(process.cwd(), 'server', 'admin');
const OUT_ADMIN_DIR = path.join(process.cwd(), 'api', 'admin');
const SRC_INQUIRY = path.join(process.cwd(), 'server', 'inquiry.ts');
const OUT_API_DIR = path.join(process.cwd(), 'api');

async function main() {
  if (!fs.existsSync(SRC_ADMIN_DIR)) {
    throw new Error(`Missing source directory: ${SRC_ADMIN_DIR}`);
  }

  fs.mkdirSync(OUT_ADMIN_DIR, { recursive: true });

  const tsEntries = fs
    .readdirSync(SRC_ADMIN_DIR)
    .filter((f) => f.endsWith('.ts'))
    .sort();

  const expectedOutNames = new Set(tsEntries.map((f) => f.replace(/\.ts$/, '.mjs')));
  for (const existing of fs.readdirSync(OUT_ADMIN_DIR)) {
    if (existing.endsWith('.mjs') && !expectedOutNames.has(existing)) {
      fs.unlinkSync(path.join(OUT_ADMIN_DIR, existing));
    }
  }

  await build({
    entryPoints: tsEntries.map((f) => path.join(SRC_ADMIN_DIR, f)),
    outdir: OUT_ADMIN_DIR,
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

  if (fs.existsSync(SRC_INQUIRY)) {
    await build({
      entryPoints: [SRC_INQUIRY],
      outdir: OUT_API_DIR,
      outExtension: { '.js': '.mjs' },
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'esm',
      logLevel: 'silent',
      banner: {
        js: '// Auto-generated standalone ESM bundle from server/inquiry.ts via scripts/build-api.mjs'
      }
    });
  }

  console.log(`Built ${tsEntries.length} admin API handlers + inquiry handler -> api/`);
}

main().catch((err) => {
  console.error('Failed to bundle API handlers:', err);
  process.exit(1);
});
