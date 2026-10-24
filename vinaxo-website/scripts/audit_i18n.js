const fs = require('fs');
const path = require('path');

// 1. Read and parse content.js
const contentJsPath = path.join(__dirname, '..', 'js', 'content.js');
const contentJsText = fs.readFileSync(contentJsPath, 'utf8');

// Evaluate content.js in a safe context
const sandbox = {};
const scriptFunc = new Function('window', contentJsText + '; return { siteContent, productsData, newsData, marketStats };');
const { siteContent, productsData, newsData, marketStats } = scriptFunc(sandbox);

console.log('=== I18N AUDIT TOOL ===\n');

// Helper to get all nested keys
function getDeepKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
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
  ['name', 'badge', 'desc', 'category'].forEach(prop => {
    if (!p[prop] || !p[prop].vi || !p[prop].en) {
      console.error(`Product ${p.id} missing ${prop} (vi/en)`);
      productErrors++;
    }
  });
  if (p.specs) {
    for (const sKey in p.specs) {
      const spec = p.specs[sKey];
      if (typeof spec === 'object' && spec !== null) {
        if (!spec.vi || !spec.en) {
          console.error(`Product ${p.id} spec ${sKey} missing vi or en`);
          productErrors++;
        }
      }
    }
  }
});
if (productErrors === 0) {
  console.log(`[PASS] All ${productsData.length} products have complete VI/EN fields.`);
}

// Check newsData
console.log('\n--- Checking newsData ---');
let newsErrors = 0;
newsData.forEach(n => {
  ['title', 'desc', 'category', 'date'].forEach(prop => {
    if (!n[prop] || !n[prop].vi || !n[prop].en) {
      console.error(`News ${n.id} missing ${prop} (vi/en)`);
      newsErrors++;
    }
  });
});
if (newsErrors === 0) {
  console.log(`[PASS] All ${newsData.length} news items have complete VI/EN fields.`);
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
