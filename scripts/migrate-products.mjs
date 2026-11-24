import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const productsTsPath = path.join(rootDir, 'src', 'data', 'products.ts');
const contentProductsDir = path.join(rootDir, 'content', 'products');

if (!fs.existsSync(contentProductsDir)) {
  fs.mkdirSync(contentProductsDir, { recursive: true });
}

const content = fs.readFileSync(productsTsPath, 'utf-8');
const match = content.match(/export const productsData: ProductItem\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.error("Could not find productsData in products.ts");
  process.exit(1);
}

const rawArrayCode = match[1];
const fn = new Function(`return ${rawArrayCode};`);
const products = fn();

console.log(`[Products Migration] Found ${products.length} products in src/data/products.ts`);

let count = 0;
for (const p of products) {
  const targetPath = path.join(contentProductsDir, `${p.slug}.json`);
  const item = {
    id: p.id,
    slug: p.slug,
    name_vi: p.nameVi || p.vi?.name || p.name,
    name_en: p.name || p.en?.name || "",
    category: p.category,
    image: p.imageWebp || p.image || "",
    description_vi: p.descriptionVi || p.vi?.desc || "",
    description_en: p.description || p.en?.desc || "",
    origin_vi: p.originVi || p.vi?.origin || "",
    origin_en: p.origin || p.en?.origin || "",
    shelf_life: p.specs?.shelfLifeVi || "12 Tháng",
    packaging: p.specs?.packagingVi || "Túi zip 100g, 500g / Thùng 10kg",
    certifications: p.certifications || [],
    order: count + 1
  };

  fs.writeFileSync(targetPath, JSON.stringify(item, null, 2), 'utf-8');
  count++;
  console.log(`  ✓ Migrated product: ${p.slug}.json -> "${item.name_vi}"`);
}

console.log(`[Products Migration Complete] Successfully migrated ${count} products.`);
