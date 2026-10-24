import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = [
  'index.html',
  'about.html',
  'products.html',
  'quality.html',
  'markets.html',
  'news.html',
  'contact.html'
];

console.log('=== DEEP DOM TEXT AUDIT FOR HARDCODED TEXT ===\n');

// Regular expressions to detect Vietnamese diacritics
const vietnameseDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;

// Exempt proper nouns, numbers, symbols, trademarks
const exemptWords = [
  'VINAXO', 'SONAI', 'BRCGS', 'OCOP', 'FDA', 'HACCP', 'ISO', 'OEM', 'ODM',
  'EUDR', 'ESG', 'Tiền Giang', 'Đồng Tháp', 'Vĩnh Long', 'Gò Công Tây', 'Vĩnh Bình',
  'Nguyễn Anh Khoa', 'Hoàng Thị Thu Thảo', 'Hoàng Mạnh Cường',
  'CafeF', 'Người Lao Động', 'Thanh Niên', 'Sài Gòn Giải Phóng', 'Nông nghiệp & Môi trường',
  '24H', 'Facebook', 'LinkedIn', 'YouTube', 'Zalo'
];

let totalUntranslatedFound = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const html = fs.readFileSync(filePath, 'utf8');

  // Simple tag parser to find text nodes
  // Remove script and style tags
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Match tags with text
  // We look for elements that have text content but no data-i18n on either themselves or their parent
  // Regex to match tag and its immediate inner text: <tag attrs>inner_text<
  const tagWithTextRegex = /<([a-z0-9]+)([^>]*)>([^<]+)</gi;
  let match;
  let fileIssues = 0;

  while ((match = tagWithTextRegex.exec(cleanHtml)) !== null) {
    const tagName = match[1].toLowerCase();
    const attrs = match[2];
    let text = match[3].trim();

    // Ignore tags like svg, path, circle, etc.
    if (['svg', 'path', 'circle', 'line', 'polyline', 'polygon', 'rect', 'title', 'option'].includes(tagName)) {
      continue;
    }

    // Skip empty, whitespace, numbers, symbols, bullets
    if (!text || /^[\d\s\.,\-\+–—:;%&•*\/\\#()|]+$/.test(text)) {
      continue;
    }

    // If tag has data-i18n, it is translated!
    if (attrs.includes('data-i18n')) {
      continue;
    }

    // Check if the text is purely an exempt proper noun or metric
    const isExempt = exemptWords.some(w => text === w || text.includes(w) && text.length < w.length + 5);
    if (isExempt) {
      continue;
    }

    // If text has significant words
    if (text.length > 3 && !/^(\$|€|£|VNĐ|tấn|kg|m²|\+|-)$/.test(text)) {
      console.log(`[POTENTIAL HARDCODED] ${file} <${tagName}>: "${text}"`);
      fileIssues++;
      totalUntranslatedFound++;
    }
  }

  if (fileIssues === 0) {
    console.log(`[CLEAN] ${file}: 0 untranslated text nodes found.`);
  }
});

console.log(`\nAudit complete. Total potential untranslated text nodes: ${totalUntranslatedFound}`);
