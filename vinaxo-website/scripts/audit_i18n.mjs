import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { siteContent, productsData, newsData } from '../js/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== I18N AUDIT TOOL ===\n');

// Helper to get all nested keys
function getDeepKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        keys = keys.concat(getDeepKeys(obj[k], fullKey));
      } else {
        keys.push({ key: fullKey, value: obj[k] });
      }
    }
  }
  return keys;
}

function getValueByPath(obj, pathStr) {
  const parts = pathStr.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[p];
  }
  return curr;
}

const viKeys = getDeepKeys(siteContent.vi);
const enKeys = getDeepKeys(siteContent.en);

const viKeySet = new Set(viKeys.map(k => k.key));
const enKeySet = new Set(enKeys.map(k => k.key));

console.log(`Total VI content keys: ${viKeys.length}`);
console.log(`Total EN content keys: ${enKeys.length}`);

// Check for missing keys between VI and EN in siteContent
const missingInEn = [...viKeySet].filter(k => !enKeySet.has(k));
const missingInVi = [...enKeySet].filter(k => !viKeySet.has(k));

if (missingInEn.length > 0) {
  console.error(`\n[ERROR] Keys present in VI but missing in EN (${missingInEn.length}):`);
  missingInEn.forEach(k => console.error(`  - ${k}`));
} else {
  console.log('\n[PASS] All VI keys exist in EN.');
}

if (missingInVi.length > 0) {
  console.error(`\n[ERROR] Keys present in EN but missing in VI (${missingInVi.length}):`);
  missingInVi.forEach(k => console.error(`  - ${k}`));
} else {
  console.log('[PASS] All EN keys exist in VI.');
}

// Check for empty values
const emptyVi = viKeys.filter(k => k.value === '' || k.value === null || k.value === undefined);
const emptyEn = enKeys.filter(k => k.value === '' || k.value === null || k.value === undefined);

if (emptyVi.length > 0) {
  console.warn(`\n[WARN] Empty values in VI:`, emptyVi);
} else {
  console.log('[PASS] No empty values in VI.');
}

if (emptyEn.length > 0) {
  console.warn(`\n[WARN] Empty values in EN:`, emptyEn);
} else {
  console.log('[PASS] No empty values in EN.');
}

// Check productsData
console.log('\n--- Checking productsData ---');
let productErrors = 0;
productsData.forEach(p => {
  if (!p.vi || !p.vi.name || !p.vi.desc) {
    console.error(`Product ${p.id} missing vi.name or vi.desc`);
    productErrors++;
  }
  if (!p.en || !p.en.name || !p.en.desc) {
    console.error(`Product ${p.id} missing en.name or en.desc`);
    productErrors++;
  }
  if (p.specs) {
    const specFields = ['shelfLife', 'storage', 'ingredients', 'process', 'packaging', 'certifications'];
    specFields.forEach(sf => {
      const viKey = sf + 'Vi';
      const enKey = sf + 'En';
      if (p.specs[viKey] === undefined) {
        console.error(`Product ${p.id} missing spec ${viKey}`);
        productErrors++;
      }
      if (p.specs[enKey] === undefined) {
        console.error(`Product ${p.id} missing spec ${enKey}`);
        productErrors++;
      }
    });
  }
});
if (productErrors === 0) {
  console.log(`[PASS] All ${productsData.length} products have complete VI/EN fields and specs.`);
}

// Check newsData
console.log('\n--- Checking newsData ---');
let newsErrors = 0;
newsData.forEach(n => {
  if (!n.vi || !n.vi.title || !n.vi.summary) {
    console.error(`News ${n.id} missing vi.title or vi.summary`);
    newsErrors++;
  }
  if (!n.en || !n.en.title || !n.en.summary) {
    console.error(`News ${n.id} missing en.title or en.summary`);
    newsErrors++;
  }
  if (!n.dateVi || !n.dateEn) {
    console.error(`News ${n.id} missing dateVi or dateEn`);
    newsErrors++;
  }
  if (!n.badgeTextVi || !n.badgeTextEn) {
    console.error(`News ${n.id} missing badgeTextVi or badgeTextEn`);
    newsErrors++;
  }
});
if (newsErrors === 0) {
  console.log(`[PASS] All ${newsData.length} news items have complete VI/EN fields, dates, and badges.`);
}

// 2. Audit all HTML files for data-i18n attributes
const htmlFiles = [
  'index.html',
  'about.html',
  'products.html',
  'quality.html',
  'markets.html',
  'news.html',
  'contact.html'
];

console.log('\n--- Checking HTML data-i18n bindings ---');
let htmlErrors = 0;
const dataI18nRegex = /data-i18n="([^"]+)"/g;
const dataI18nPlaceholderRegex = /data-i18n-placeholder="([^"]+)"/g;
const dataI18nTitleRegex = /data-i18n-title="([^"]+)"/g;
const dataI18nAriaLabelRegex = /data-i18n-aria-label="([^"]+)"/g;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const html = fs.readFileSync(filePath, 'utf8');

  function checkAttr(regex, attrName) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      const key = match[1];
      const viVal = getValueByPath(siteContent.vi, key);
      const enVal = getValueByPath(siteContent.en, key);

      if (viVal === undefined) {
        console.error(`[FAIL] ${file}: ${attrName}="${key}" NOT FOUND in siteContent.vi`);
        htmlErrors++;
      }
      if (enVal === undefined) {
        console.error(`[FAIL] ${file}: ${attrName}="${key}" NOT FOUND in siteContent.en`);
        htmlErrors++;
      }
    }
  }

  checkAttr(dataI18nRegex, 'data-i18n');
  checkAttr(dataI18nPlaceholderRegex, 'data-i18n-placeholder');
  checkAttr(dataI18nTitleRegex, 'data-i18n-title');
  checkAttr(dataI18nAriaLabelRegex, 'data-i18n-aria-label');
});

if (htmlErrors === 0) {
  console.log('[PASS] All data-i18n references in HTML files exist in both VI and EN content.');
}

// 3. Scan for bilingual parentheses or mixed text patterns
console.log('\n--- Checking for mixed language patterns in HTML files ---');
const suspiciousPatterns = [
  /\((Request a Quote|Full Name|All|Hoa Kỳ|Châu Âu|Mỹ)\)/i,
  /United States \(Hoa Kỳ\)/i,
  /European Union \(Châu Âu\)/i,
  /Nga & Đông Âu/i,
  /Hàn Quốc & Đông Á/i,
  /Họ và Tên \(/i
];

let patternIssues = 0;
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const html = fs.readFileSync(filePath, 'utf8');
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(html)) {
      console.warn(`[WARNING] Pattern ${pattern} matched in ${file}`);
      patternIssues++;
    }
  });
});

if (patternIssues === 0) {
  console.log('[PASS] No known mixed-language/bilingual parenthetical patterns found in HTML files.');
}

console.log('\n=== AUDIT COMPLETED ===');
if (missingInEn.length === 0 && missingInVi.length === 0 && emptyVi.length === 0 && emptyEn.length === 0 && productErrors === 0 && newsErrors === 0 && htmlErrors === 0 && patternIssues === 0) {
  console.log('RESULT: 100% PERFECT I18N CONSISTENCY REACHED!');
} else {
  console.log('RESULT: Some issues need attention.');
}
