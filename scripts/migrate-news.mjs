import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const newsTsPath = path.join(rootDir, 'src', 'data', 'news.ts');
const contentNewsDir = path.join(rootDir, 'content', 'news');

if (!fs.existsSync(contentNewsDir)) {
  fs.mkdirSync(contentNewsDir, { recursive: true });
}

// Read and extract newsData array from news.ts
const content = fs.readFileSync(newsTsPath, 'utf-8');

// Use node to extract newsData via an isolated typescript evaluation or regex/JSON conversion
// Since news.ts is standard JS object literal after the export, let's parse it safely
const match = content.match(/export const newsData: NewsItem\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.error("Could not find newsData in news.ts");
  process.exit(1);
}

// Evaluate the array literal safely
const rawArrayCode = match[1];
const fn = new Function(`return ${rawArrayCode};`);
const newsItems = fn();

console.log(`[Migration] Found ${newsItems.length} news items in src/data/news.ts`);

let migratedCount = 0;

for (const item of newsItems) {
  const slug = item.id;
  const targetPath = path.join(contentNewsDir, `${slug}.json`);

  const article = {
    id: item.id,
    slug: item.id,
    title_vi: item.vi?.title || "",
    title_en: item.en?.title || "",
    excerpt_vi: item.vi?.summary || "",
    excerpt_en: item.en?.summary || "",
    body_vi: item.vi?.summary || "", // Initial body uses summary; editors can expand
    body_en: item.en?.summary || "",
    cover_image: item.imageWebp || item.imageJpg || "",
    cover_image_alt_vi: item.vi?.title || "",
    cover_image_alt_en: item.en?.title || "",
    gallery: [],
    category: item.category || "press",
    badgeType: item.badgeType || "quote",
    badgeTextVi: item.badgeTextVi || "",
    badgeTextEn: item.badgeTextEn || "",
    source: item.source || "VINAXO",
    sourceUrl: item.sourceUrl || "",
    secondaryUrls: item.secondaryUrls || [],
    author: item.personQuoted?.name || "Ban Biên Tập VINAXO",
    personQuoted: item.personQuoted || null,
    published_at: item.publishedAt || "2025-01-01",
    updated_at: item.publishedAt || "2025-01-01",
    dateVi: item.dateVi || "",
    dateEn: item.dateEn || "",
    featured: item.id === "press-cafef-natural-fruits", // First article was featured
    tags: [item.category, item.badgeType, item.source].filter(Boolean),
    verified: Boolean(item.verified),
    seo_title_vi: item.vi?.title || "",
    seo_title_en: item.en?.title || "",
    seo_description_vi: item.vi?.summary || "",
    seo_description_en: item.en?.summary || ""
  };

  fs.writeFileSync(targetPath, JSON.stringify(article, null, 2), 'utf-8');
  migratedCount++;
  console.log(`  ✓ Migrated: ${slug}.json -> "${article.title_vi.substring(0, 40)}..."`);
}

console.log(`[Migration Complete] Successfully migrated ${migratedCount} of ${newsItems.length} articles.`);
