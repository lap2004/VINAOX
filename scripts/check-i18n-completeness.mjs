import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';

function collectKeys(obj, prefix = '') {
  const keys = [];
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      if (item && typeof item === 'object') {
        keys.push(...collectKeys(item, `${prefix}[${idx}]`));
      } else {
        keys.push(`${prefix}[${idx}]`);
      }
    });
    return keys;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const next = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object') {
        keys.push(...collectKeys(v, next));
      } else {
        keys.push(next);
      }
    }
  }
  return keys;
}

function getValueAt(obj, keyPath) {
  const parts = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

async function main() {
  const tmpOut = path.join(process.cwd(), 'dist', '.tmp-i18n-check.mjs');
  fs.mkdirSync(path.dirname(tmpOut), { recursive: true });

  await build({
    stdin: {
      contents: `
        export { vi } from './src/i18n/vi.ts';
        export { en } from './src/i18n/en.ts';
        export { ko } from './src/i18n/ko.ts';
        export { zhCN } from './src/i18n/zhCN.ts';
      `,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: tmpOut,
    logLevel: 'silent',
  });

  try {
    const dicts = await import('file:///' + tmpOut.replace(/\\/g, '/'));
    const baseKeys = collectKeys(dicts.en);
    const locales = [
      ['vi', dicts.vi],
      ['en', dicts.en],
      ['ko', dicts.ko],
      ['zh-CN', dicts.zhCN],
    ];

    for (const [code, dict] of locales) {
      const keys = collectKeys(dict);
      const missing = baseKeys.filter((k) => !keys.includes(k));
      const extra = keys.filter((k) => !baseKeys.includes(k));
      const empty = baseKeys.filter((k) => {
        const v = getValueAt(dict, k);
        return typeof v !== 'string' || v.trim().length === 0;
      });
      // Except explicit empty string value in contactPage.selectOptions.inquiryTypes[0].value
      const realEmpty = empty.filter((k) => !k.endsWith('.inquiryTypes[0].value'));

      assert.strictEqual(missing.length, 0, `[${code}] Missing keys: ${missing.slice(0, 10).join(', ')}`);
      assert.strictEqual(extra.length, 0, `[${code}] Extra keys: ${extra.slice(0, 10).join(', ')}`);
      assert.strictEqual(realEmpty.length, 0, `[${code}] Empty translation values: ${realEmpty.slice(0, 10).join(', ')}`);
      console.log(`[PASS] ${code}: ${baseKeys.length}/${baseKeys.length} keys present & non-empty.`);
    }
  } finally {
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
  }
}

main();
