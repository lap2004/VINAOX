// Auto-generated standalone ESM bundle from server/ via scripts/build-api.mjs

// server/inquiry.ts
import crypto from "crypto";

// server/lib/security.ts
var HttpRequestError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
};
function sendJson(res, statusCode, payload) {
  if (typeof res?.status === "function" && typeof res?.json === "function") {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  if (typeof res?.setHeader === "function") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
  }
  if (typeof res?.end === "function") {
    res.end(JSON.stringify(payload));
  }
  return res;
}
function wrapHandler(handlerFn) {
  return async (req, res) => {
    try {
      applySecurityHeaders(res);
      return await handlerFn(req, res);
    } catch (err) {
      const status = typeof err?.statusCode === "number" ? err.statusCode : 500;
      const msg = err?.message || "L\u1ED7i h\u1EC7 th\u1ED1ng n\u1ED9i b\u1ED9 t\u1EA1i m\xE1y ch\u1EE7 qu\u1EA3n tr\u1ECB.";
      console.error("[VINAXO Admin API Error]", err);
      return sendJson(res, status, { error: msg });
    }
  };
}
function parseJsonObject(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return {};
  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    throw new HttpRequestError(400, "D\u1EEF li\u1EC7u JSON g\u1EEDi l\xEAn kh\xF4ng h\u1EE3p l\u1EC7.");
  }
}
async function readJsonBody(req, maxBytes = 45e5) {
  const existing = req?.body;
  if (existing !== void 0 && existing !== null) {
    if (typeof existing === "string") return parseJsonObject(existing);
    if (Buffer.isBuffer(existing)) return parseJsonObject(existing.toString("utf8"));
    if (typeof existing === "object") return existing;
  }
  if (!req || typeof req[Symbol.asyncIterator] !== "function") {
    return {};
  }
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    total += buf.length;
    if (total > maxBytes) {
      throw new HttpRequestError(413, "D\u1EEF li\u1EC7u g\u1EEDi l\xEAn v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n cho ph\xE9p.");
    }
    chunks.push(buf);
  }
  return chunks.length === 0 ? {} : parseJsonObject(Buffer.concat(chunks).toString("utf8"));
}
function applySecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
}
function getClientIp(req) {
  const forwarded = req?.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req?.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return req?.socket?.remoteAddress || "unknown";
}
function stripUnsafeKeys(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return {};
  }
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype" || key === "sha" || key === "_sha") {
      continue;
    }
    clean[key] = obj[key];
  }
  return clean;
}

// src/data/products.ts
var BASE_PRODUCTS_DATA = [
  // 01 — Soft Dried Red Dragonfruit
  {
    id: "soft-dried-red-dragonfruit",
    slug: "soft-dried-red-dragonfruit",
    aliases: ["dried-dragon-fruit"],
    name: "Soft Dried Red Dragonfruit",
    nameVi: "Thanh long ru\u1ED9t \u0111\u1ECF s\u1EA5y d\u1EBBo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y d\u1EBBo",
    image: "/images/products/soft-dried-red-dragonfruit.webp",
    imageWebp: "/images/products/soft-dried-red-dragonfruit.webp",
    imageJpg: "/images/products/soft-dried-red-dragonfruit.jpg",
    shortDescription: "Vibrant ruby-red slices with gentle natural sweetness and characteristic crunchy seeds.",
    shortDescriptionVi: "S\u1EAFc \u0111\u1ECF t\xEDm t\u1EF1 nhi\xEAn, v\u1ECB ng\u1ECDt thanh d\u1ECBu nh\u1EB9 h\xF2a quy\u1EC7n c\xF9ng h\u1EA1t gi\xF2n li ti \u0111\u1EB7c tr\u01B0ng.",
    description: "Sourced from Cho Gao, Tien Giang, our red dragonfruit is gently low-temperature dehydrated to retain its natural vibrant color, rich betacyanin antioxidants, dietary fiber, and authentic tropical taste without artificial coloring or added sugar.",
    descriptionVi: "\u0110\u01B0\u1EE3c tuy\u1EC3n ch\u1ECDn t\u1EEB v\xF9ng chuy\xEAn canh thanh long ru\u1ED9t \u0111\u1ECF Ch\u1EE3 G\u1EA1o (Ti\u1EC1n Giang). Quy tr\xECnh s\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p tu\u1EA7n ho\xE0n gi\xFAp gi\u1EEF tr\u1ECDn s\u1EAFc \u0111\u1ECF t\xEDm t\u1EF1 nhi\xEAn, h\xE0m l\u01B0\u1EE3ng betacyanin ch\u1ED1ng oxy h\xF3a v\xE0 v\u1ECB ng\u1ECDt thanh nh\u1EB9 t\u1EF1 nhi\xEAn kh\xF4ng qua ph\u1EA9m m\xE0u.",
    origin: "Cho Gao, Tien Giang Orchards",
    originVi: "V\xF9ng tr\u1ED3ng Ch\u1EE3 G\u1EA1o, Ti\u1EC1n Giang",
    certifications: ["OCOP 3-Star Tien Giang", "BRCGS Facility", "Clean Label"],
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 16%",
      brix: "50\xB0 - 55\xB0 Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place (20 - 25\xB0C), away from direct sunlight",
      storageVi: "N\u01A1i kh\xF4 r\xE1o, tho\xE1ng m\xE1t (20 - 25\xB0C), tr\xE1nh \xE1nh n\u1EAFng tr\u1EF1c ti\u1EBFp",
      ingredientsEn: "100% Fresh Cho Gao Red Flesh Dragon Fruit, zero added sugar, no artificial color",
      ingredientsVi: "100% Thanh long ru\u1ED9t \u0111\u1ECF Ch\u1EE3 G\u1EA1o t\u01B0\u01A1i ch\xEDn c\xE2y, kh\xF4ng ph\u1EA9m m\xE0u, kh\xF4ng ch\u1EA5t b\u1EA3o qu\u1EA3n",
      processEn: "Low-temperature convective heat-pump drying (~50 - 55\xB0C) preserving natural ruby anthocyanin pigments",
      processVi: "S\u1EA5y b\u01A1m nhi\u1EC7t nhi\u1EC7t \u0111\u1ED9 th\u1EA5p tu\u1EA7n ho\xE0n (~50 - 55\xB0C) b\u1EA3o to\xE0n s\u1EAFc t\u1ED1 t\u1EF1 nhi\xEAn v\xE0 vi ch\u1EA5t",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master export carton 5kg, 10kg with N2 flushing / OEM",
      packagingVi: "T\xFAi zip 100g, 250g, 500g / Th\xF9ng carton xu\u1EA5t kh\u1EA9u 5kg, 10kg n\u1EA1p kh\xED Nit\u01A1 / OEM",
      certificationsEn: "3-Star OCOP Tien Giang, BRCGS Grade B Facility, Clean Label",
      certificationsVi: "OCOP 3 Sao Ti\u1EC1n Giang, Nh\xE0 m\xE1y chu\u1EA9n BRCGS Grade B, Clean Label"
    },
    en: {
      name: "Soft Dried Red Dragonfruit",
      desc: "Vibrant ruby-red slices with gentle natural sweetness and characteristic crunchy seeds.",
      origin: "Cho Gao, Tien Giang Orchards",
      features: "OCOP 3-Star certified. Premium red-flesh dragon fruit from Cho Gao, Tien Giang. Gently dehydrated to preserve natural color, betacyanin antioxidants, and fiber."
    },
    vi: {
      name: "Thanh long ru\u1ED9t \u0111\u1ECF s\u1EA5y d\u1EBBo",
      desc: "S\u1EAFc \u0111\u1ECF t\xEDm t\u1EF1 nhi\xEAn, v\u1ECB ng\u1ECDt thanh d\u1ECBu nh\u1EB9 h\xF2a quy\u1EC7n c\xF9ng h\u1EA1t gi\xF2n li ti \u0111\u1EB7c tr\u01B0ng.",
      origin: "V\xF9ng tr\u1ED3ng Ch\u1EE3 G\u1EA1o, Ti\u1EC1n Giang",
      features: "S\u1EA3n ph\u1EA9m \u0111\u1EA1t chu\u1EA9n OCOP 3 sao Ti\u1EC1n Giang. Nguy\xEAn li\u1EC7u thanh long ru\u1ED9t \u0111\u1ECF t\u01B0\u01A1i Ch\u1EE3 G\u1EA1o, c\xF4ng ngh\u1EC7 s\u1EA5y nhi\u1EC7t th\u1EA5p b\u1EA3o t\u1ED3n s\u1EAFc t\xEDm \u0111\u1ECF t\u1EF1 nhi\xEAn, gi\xE0u ch\u1EA5t ch\u1ED1ng oxy h\xF3a v\xE0 vitamin C."
    }
  },
  // 02 — Banana Chips
  {
    id: "banana-chips",
    slug: "banana-chips",
    aliases: ["dried-banana"],
    name: "Banana Chips",
    nameVi: "Chu\u1ED1i s\u1EA5y gi\xF2n",
    category: "chips",
    categoryLabelEn: "Fruit Chips",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y gi\xF2n",
    image: "/images/products/banana-chips.webp",
    imageWebp: "/images/products/banana-chips.webp",
    imageJpg: "/images/products/banana-chips.jpg",
    shortDescription: "Golden, crispy banana slices with natural honeyed fragrance and light crunch.",
    shortDescriptionVi: "L\xE1t chu\u1ED1i v\xE0ng \u01B0\u01A1m, gi\xF2n r\u1EE5m th\u01A1m l\u1EEBng h\u01B0\u01A1ng chu\u1ED1i ch\xEDn t\u1EF1 nhi\xEAn.",
    description: "Prepared from ripe Mekong Delta bananas, modern crisping technology ensures an irresistibly crunchy texture while preserving the fruit's natural sweetness, potassium, and wholesome minerals.",
    descriptionVi: "\u0110\u01B0\u1EE3c ch\u1EBF bi\u1EBFn t\u1EEB chu\u1ED1i ch\xEDn t\u1EF1 nhi\xEAn c\u1EE7a v\xF9ng \u0111\u1ED3ng b\u1EB1ng s\xF4ng C\u1EEDu Long. C\xF4ng ngh\u1EC7 s\u1EA5y gi\xF2n hi\u1EC7n \u0111\u1EA1i gi\xFAp t\u1EEBng l\xE1t chu\u1ED1i gi\u1EEF \u0111\u1ED9 gi\xF2n x\u1ED1p t\u1EF1 nhi\xEAn, m\xF9i th\u01A1m ng\u1ECDt ng\xE0o \u0111\u1EB7c tr\u01B0ng v\xE0 gi\xE0u kali.",
    origin: "Mekong Delta Orchards",
    originVi: "V\xF9ng chu\u1ED1i \u0110BSCL",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural banana sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place, seal tightly after opening",
      storageVi: "N\u01A1i kh\xF4 r\xE1o tho\xE1ng m\xE1t, gi\u1EEF k\xEDn mi\u1EC7ng t\xFAi sau khi m\u1EDF",
      ingredientsEn: "100% Selected ripe banana, refined vegetable oil",
      ingredientsVi: "100% Chu\u1ED1i ch\xEDn t\u1EF1 nhi\xEAn tuy\u1EC3n ch\u1ECDn, d\u1EA7u th\u1EF1c v\u1EADt tinh luy\u1EC7n",
      processEn: "Low-temperature vacuum crisping with high-efficiency centrifugal de-oiling",
      processVi: "Chi\xEAn s\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t th\u1EA5p k\u1EBFt h\u1EE3p ly t\xE2m t\xE1ch d\u1EA7u tri\u1EC7t \u0111\u1EC3",
      packagingEn: "Zip pouch 100g, 250g, 500g / Bulk carton 10kg",
      packagingVi: "T\xFAi zip 100g, 250g, 500g / Th\xF9ng x\xE1 10kg",
      certificationsEn: "BRCGS Grade B Facility, Clean Label, Export Quality",
      certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS Grade B, Clean Label, \u0110\u1EA1t chu\u1EA9n xu\u1EA5t kh\u1EA9u"
    },
    en: {
      name: "Banana Chips",
      desc: "Golden, crispy banana slices with natural honeyed fragrance and light crunch.",
      origin: "Mekong Delta Orchards",
      features: "Naturally sweet and crunchy. Processed with advanced vacuum technology to retain rich potassium, dietary fiber, and natural banana aroma."
    },
    vi: {
      name: "Chu\u1ED1i s\u1EA5y gi\xF2n",
      desc: "L\xE1t chu\u1ED1i v\xE0ng \u01B0\u01A1m, gi\xF2n r\u1EE5m th\u01A1m l\u1EEBng h\u01B0\u01A1ng chu\u1ED1i ch\xEDn t\u1EF1 nhi\xEAn.",
      origin: "V\xF9ng chu\u1ED1i \u0110BSCL",
      features: "Ch\u1EBF bi\u1EBFn t\u1EEB chu\u1ED1i ch\xEDn c\xE2y \u0110BSCL. S\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t th\u1EA5p gi\u1EEF v\u1ECB ng\u1ECDt d\u1ECBu t\u1EF1 nhi\xEAn, gi\xF2n tan, gi\xE0u kali v\xE0 ch\u1EA5t x\u01A1 c\xF3 l\u1EE3i cho s\u1EE9c kh\u1ECFe."
    }
  },
  // 03 — Cashew
  {
    id: "cashew",
    slug: "cashew",
    name: "Cashew",
    nameVi: "H\u1EA1t \u0111i\u1EC1u",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "H\u1EA1t dinh d\u01B0\u1EE1ng",
    image: "/images/products/cashew.webp",
    imageWebp: "/images/products/cashew.webp",
    imageJpg: "/images/products/cashew.jpg",
    shortDescription: "Premium roasted Vietnamese cashews, delightfully crunchy with a buttery nutty finish.",
    shortDescriptionVi: "H\u1EA1t \u0111i\u1EC1u B\xECnh Ph\u01B0\u1EDBc tuy\u1EC3n ch\u1ECDn, rang th\u01A1m b\xF9i b\xE9o ng\u1EADy t\u1EF1 nhi\xEAn.",
    description: "Renowned globally for superior flavor and texture, our Binh Phuoc whole cashews are carefully roasted to golden perfection, packed with heart-healthy monounsaturated fats, protein, and essential minerals.",
    descriptionVi: "H\u1EA1t \u0111i\u1EC1u chu\u1EA9n xu\u1EA5t kh\u1EA9u t\u1EEB th\u1EE7 ph\u1EE7 B\xECnh Ph\u01B0\u1EDBc. T\u1EEBng m\u1EBB h\u1EA1t \u0111\u01B0\u1EE3c ph\xE2n lo\u1EA1i k\xEDch th\u01B0\u1EDBc \u0111\u1EC1u \u0111\u1EB7n, rang ch\xEDn t\u1EDBi gi\u1EEF tr\u1ECDn \u0111\u1ED9 gi\xF2n, b\xE9o b\xF9i t\u1EF1 nhi\xEAn, d\u1ED3i d\xE0o ch\u1EA5t b\xE9o kh\xF4ng b\xE3o h\xF2a v\xE0 kho\xE1ng ch\u1EA5t.",
    origin: "Binh Phuoc, Vietnam",
    originVi: "B\xECnh Ph\u01B0\u1EDBc, Vi\u1EC7t Nam",
    certifications: ["BRCGS Facility", "ISO 22000", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural nutty flavor",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Store in a cool, dry place away from heat and moisture",
      storageVi: "B\u1EA3o qu\u1EA3n n\u01A1i kh\xF4 r\xE1o, tho\xE1ng m\xE1t, tr\xE1nh nhi\u1EC7t \u0111\u1ED9 cao v\xE0 \u1EA9m \u01B0\u1EDBt",
      ingredientsEn: "100% Grade A Vietnamese Cashew Kernels (W240 / W320)",
      ingredientsVi: "100% Nh\xE2n h\u1EA1t \u0111i\u1EC1u B\xECnh Ph\u01B0\u1EDBc chu\u1EA9n lo\u1EA1i A (W240 / W320)",
      processEn: "Gentle hot-air roasting under controlled thermal curve without excessive oil",
      processVi: "Rang s\u1EA5y nhi\u1EC7t phong tu\u1EA7n ho\xE0n ki\u1EC3m so\xE1t nhi\u1EC7t \u0111\u1ED9, kh\xF4ng chi\xEAn ng\u1EADp d\u1EA7u",
      packagingEn: "Vacuum pouch / Nitrogen-flushed can 250g, 500g / Bulk vacuum box 10kg, 22.68kg",
      packagingVi: "T\xFAi h\xFAt ch\xE2n kh\xF4ng / Lon n\u1EA1p kh\xED Nit\u01A1 250g, 500g / Th\xF9ng ch\xE2n kh\xF4ng 10kg, 22.68kg",
      certificationsEn: "BRCGS Facility, ISO 22000:2018, HACCP Certified",
      certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS, ISO 22000:2018, \u0110\u1EA1t chu\u1EA9n HACCP"
    },
    en: {
      name: "Vietnamese Roasted Cashew",
      desc: "Premium roasted Vietnamese cashews, delightfully crunchy with a buttery nutty finish.",
      origin: "Binh Phuoc, Vietnam",
      features: "Sourced from the famous Binh Phuoc cashew terroir. Whole kernels roasted to perfection, delivering rich plant proteins, zinc, and healthy unsaturated fatty acids."
    },
    vi: {
      name: "H\u1EA1t \u0111i\u1EC1u B\xECnh Ph\u01B0\u1EDBc",
      desc: "H\u1EA1t \u0111i\u1EC1u B\xECnh Ph\u01B0\u1EDBc tuy\u1EC3n ch\u1ECDn, rang th\u01A1m b\xF9i b\xE9o ng\u1EADy t\u1EF1 nhi\xEAn.",
      origin: "B\xECnh Ph\u01B0\u1EDBc, Vi\u1EC7t Nam",
      features: "H\u1EA1t \u0111i\u1EC1u lo\u1EA1i 1 xu\u1EA5t x\u1EE9 B\xECnh Ph\u01B0\u1EDBc. H\u1EA1t ch\u1EAFc m\u1EA9y, rang s\u1EA5y c\xF4ng ngh\u1EC7 cao gi\u1EEF tr\u1ECDn \u0111\u1ED9 ng\u1EADy b\xE9o, th\u01A1m ngon \u0111\u1EB7c tr\u01B0ng v\xE0 d\u1ED3i d\xE0o dinh d\u01B0\u1EE1ng."
    }
  },
  // 04 — Soft Dried Jackfruit
  {
    id: "soft-dried-jackfruit",
    slug: "soft-dried-jackfruit",
    aliases: ["dried-jackfruit"],
    name: "Soft Dried Jackfruit",
    nameVi: "M\xEDt s\u1EA5y d\u1EBBo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y d\u1EBBo",
    image: "/images/products/soft-dried-jackfruit.webp",
    imageWebp: "/images/products/soft-dried-jackfruit.webp",
    imageJpg: "/images/products/soft-dried-jackfruit.jpg",
    shortDescription: "Thick golden Thai jackfruit segments, naturally fragrant with a soft, chewy texture.",
    shortDescriptionVi: "M\xFAi m\xEDt v\xE0ng \xF3ng \u1EA3, th\u01A1m n\u1ED3ng n\xE0n h\u01B0\u01A1ng m\xEDt nhi\u1EC7t \u0111\u1EDBi, d\u1EBBo m\u1EC1m m\u1ECDng v\u1ECB.",
    description: "Prepared from premium Thai jackfruit harvested in Tien Giang and Hau Giang orchards. Low-temperature convective drying preserves the authentic sweet aroma, succulent chewy texture, and natural vitamins.",
    descriptionVi: "Tuy\u1EC3n ch\u1ECDn t\u1EEB gi\u1ED1ng m\xEDt Th\xE1i t\u01B0\u01A1i ch\xEDn c\xE2y t\u1EA1i Ti\u1EC1n Giang v\xE0 H\u1EADu Giang. C\xF4ng ngh\u1EC7 s\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p tu\u1EA7n ho\xE0n gi\u1EEF nguy\xEAn m\xE0u v\xE0ng \xF3ng, th\u1EDB m\xEDt d\u1EBBo m\u1EC1m th\u01A1m ng\xE1t v\xE0 v\u1ECB ng\u1ECDt t\u1EF1 nhi\xEAn kh\xF4ng qua \u01B0\u1EDBp \u0111\u01B0\u1EDDng.",
    origin: "Tien Giang & Hau Giang Orchards",
    originVi: "V\xF9ng m\xEDt Ti\u1EC1n Giang & H\u1EADu Giang",
    certifications: ["OCOP 3-Star Tien Giang", "BRCGS Facility", "BSCI"],
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 15%",
      brix: "60\xB0 - 65\xB0 Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry environment, keep tightly sealed after opening",
      storageVi: "N\u01A1i kh\xF4 r\xE1o tho\xE1ng m\xE1t, \u0111\xF3ng k\xEDn mi\u1EC7ng t\xFAi sau khi m\u1EDF",
      ingredientsEn: "100% Tree-ripened Thai jackfruit, zero cholesterol, no artificial preservatives",
      ingredientsVi: "100% M\xEDt Th\xE1i t\u01B0\u01A1i ch\xEDn c\xE2y tuy\u1EC3n ch\u1ECDn, kh\xF4ng cholesterol, kh\xF4ng ph\u1EA9m m\xE0u",
      processEn: "Gentle low-temperature convective drying (~55 - 60\xB0C) preserving juicy fibers",
      processVi: "S\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p tu\u1EA7n ho\xE0n (~55 - 60\xB0C) b\u1EA3o to\xE0n th\u1EDB m\xFAi d\u1EBBo th\u01A1m t\u1EF1 nhi\xEAn",
      packagingEn: "Zip pouch 100g, 250g, 500g / Export Master carton 5kg, 10kg",
      packagingVi: "T\xFAi zip 100g, 250g, 500g / Th\xF9ng carton xu\u1EA5t kh\u1EA9u 5kg, 10kg",
      certificationsEn: "3-Star OCOP Tien Giang, BRCGS Grade B Facility, Clean Label",
      certificationsVi: "OCOP 3 Sao Ti\u1EC1n Giang, Nh\xE0 m\xE1y chu\u1EA9n BRCGS Grade B, Clean Label"
    },
    en: {
      name: "Naturally Soft-Dried Jackfruit",
      desc: "Thick golden Thai jackfruit segments, naturally fragrant with a soft, chewy texture.",
      origin: "Tien Giang & Hau Giang Orchards",
      features: "OCOP 3-Star certified. Tree-ripened Thai jackfruit from Mekong riverbanks. Dehydrated at low temperatures to lock in juicy texture and rich tropical aroma."
    },
    vi: {
      name: "M\xEDt s\u1EA5y d\u1EBBo t\u1EF1 nhi\xEAn",
      desc: "M\xFAi m\xEDt v\xE0ng \xF3ng \u1EA3, th\u01A1m n\u1ED3ng n\xE0n h\u01B0\u01A1ng m\xEDt nhi\u1EC7t \u0111\u1EDBi, d\u1EBBo m\u1EC1m m\u1ECDng v\u1ECB.",
      origin: "V\xF9ng m\xEDt Ti\u1EC1n Giang & H\u1EADu Giang",
      features: "S\u1EA3n ph\u1EA9m OCOP 3 sao Ti\u1EC1n Giang. Tuy\u1EC3n ch\u1ECDn t\u1EEB m\xEDt Th\xE1i ch\xEDn c\xE2y \u0110BSCL, c\xF4ng ngh\u1EC7 s\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p gi\xFAp gi\u1EEF tr\u1ECDn m\xE0u v\xE0ng t\u01B0\u01A1i, \u0111\u1ED9 ng\u1ECDt thanh m\xE1t v\xE0 th\u1EDB m\xEDt d\u1EBBo ngon."
    }
  },
  // 05 — Mango Chips
  {
    id: "mango-chips",
    slug: "mango-chips",
    name: "Mango Chips",
    nameVi: "Xo\xE0i s\u1EA5y gi\xF2n",
    category: "chips",
    categoryLabelEn: "Fruit Chips",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y gi\xF2n",
    image: "/images/products/mango-chips.webp",
    imageWebp: "/images/products/mango-chips.webp",
    imageJpg: "/images/products/mango-chips.jpg",
    shortDescription: "Crisp and airy mango slices delivering an enticing sweet-tart tropical burst.",
    shortDescriptionVi: "L\xE1t xo\xE0i gi\xF2n tan, v\u1ECB chua ng\u1ECDt h\xE0i h\xF2a b\xF9ng n\u1ED5 h\u01B0\u01A1ng v\u1ECB nhi\u1EC7t \u0111\u1EDBi.",
    description: "Crafted from fresh Mekong Delta mangoes, our mango chips undergo high-precision vacuum crisping that produces a clean, brittle snap while retaining true mango flavor and vibrant sunny color.",
    descriptionVi: "\u0110\u01B0\u1EE3c s\u1EA3n xu\u1EA5t t\u1EEB xo\xE0i t\u01B0\u01A1i \u0111\u1ED3ng b\u1EB1ng s\xF4ng C\u1EEDu Long. Quy tr\xECnh chi\xEAn s\u1EA5y ch\xE2n kh\xF4ng hi\u1EC7n \u0111\u1EA1i t\u1EA1o n\xEAn l\xE1t xo\xE0i gi\xF2n x\u1ED1p h\u1EA5p d\u1EABn, v\u1ECB chua ng\u1ECDt t\u1EF1 nhi\xEAn h\xE0i h\xF2a v\xE0 m\xE0u v\xE0ng t\u01B0\u01A1i \u0111\u1EB9p m\u1EAFt.",
    origin: "Mekong Delta Orchards",
    originVi: "V\xF9ng xo\xE0i \u0110BSCL",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural mango sweet-tart profile",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Store in a dry, cool place; reseal immediately after use",
      storageVi: "B\u1EA3o qu\u1EA3n n\u01A1i kh\xF4 m\xE1t; \u0111\xF3ng k\xEDn kh\xF3a zip ngay sau khi s\u1EED d\u1EE5ng",
      ingredientsEn: "Fresh selected mango (98%), refined vegetable oil",
      ingredientsVi: "Xo\xE0i t\u01B0\u01A1i tuy\u1EC3n ch\u1ECDn (98%), d\u1EA7u th\u1EF1c v\u1EADt tinh luy\u1EC7n",
      processEn: "Low-temperature vacuum crisping with centrifugal oil extraction",
      processVi: "S\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t th\u1EA5p k\u1EBFt h\u1EE3p c\xF4ng ngh\u1EC7 ly t\xE2m t\xE1ch d\u1EA7u",
      packagingEn: "Aluminium foil zip pouch 50g, 100g, 200g / Master carton 10kg",
      packagingVi: "T\xFAi nh\xF4m zipper 50g, 100g, 200g / Th\xF9ng carton xu\u1EA5t kh\u1EA9u 10kg",
      certificationsEn: "BRCGS Facility, Clean Label, Export Standard",
      certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS, Clean Label, Ti\xEAu chu\u1EA9n xu\u1EA5t kh\u1EA9u"
    },
    en: {
      name: "Crispy Mango Chips",
      desc: "Crisp and airy mango slices delivering an enticing sweet-tart tropical burst.",
      origin: "Mekong Delta Orchards",
      features: "Carefully produced from fresh Mekong mangoes. Light, crispy texture with vibrant natural golden color and refreshing sweet-tart taste."
    },
    vi: {
      name: "Xo\xE0i s\u1EA5y gi\xF2n",
      desc: "L\xE1t xo\xE0i gi\xF2n tan, v\u1ECB chua ng\u1ECDt h\xE0i h\xF2a b\xF9ng n\u1ED5 h\u01B0\u01A1ng v\u1ECB nhi\u1EC7t \u0111\u1EDBi.",
      origin: "V\xF9ng xo\xE0i \u0110BSCL",
      features: "\u0110\u01B0\u1EE3c s\u1EA3n xu\u1EA5t t\u1EEB xo\xE0i t\u01B0\u01A1i \u0110BSCL. T\u1EEBng l\xE1t xo\xE0i gi\xF2n tan r\u1EE5m, l\u01B0u gi\u1EEF tr\u1ECDn v\u1EB9n h\u01B0\u01A1ng v\u1ECB chua ng\u1ECDt nhi\u1EC7t \u0111\u1EDBi \u0111\u1ED9c \u0111\xE1o m\xE0 kh\xF4ng ng\u1EA5y d\u1EA7u."
    }
  },
  // 06 — Macadamia Nuts
  {
    id: "macadamia-nuts",
    slug: "macadamia-nuts",
    name: "Macadamia Nuts",
    nameVi: "H\u1EA1t m\u1EAFc ca",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "H\u1EA1t dinh d\u01B0\u1EE1ng",
    image: "/images/products/macadamia-nuts.webp",
    imageWebp: "/images/products/macadamia-nuts.webp",
    imageJpg: "/images/products/macadamia-nuts.jpg",
    shortDescription: "Central Highlands macadamia nuts, naturally creamy and rich in essential fatty acids.",
    shortDescriptionVi: "M\u1EAFc ca T\xE2y Nguy\xEAn n\u1EE9t v\u1ECF t\u1EF1 nhi\xEAn, nh\xE2n tr\xF2n \u0111\u1EA7y, b\xE9o ng\u1EADy thanh tao.",
    description: "Harvested from volcanic basalt soil in Vietnam's Central Highlands, our premium macadamias feature smooth, creamy kernels packed with heart-healthy monounsaturated fats and essential antioxidants.",
    descriptionVi: "H\u1EA1t m\u1EAFc ca th\u01B0\u1EE3ng h\u1EA1ng sinh tr\u01B0\u1EDFng tr\xEAn \u0111\u1EA5t \u0111\u1ECF bazan m\xE0u m\u1EE1 v\xF9ng T\xE2y Nguy\xEAn. H\u1EA1t \u0111\u01B0\u1EE3c s\u1EA5y n\u1EE9t v\u1ECF t\u1EF1 nhi\xEAn, nh\xE2n tr\u1EAFng ng\xE0 tr\xF2n tr\u1ECBa, b\xE9o b\xF9i thanh tho\xE1t v\xE0 d\u1ED3i d\xE0o axit b\xE9o Omega-7 qu\xFD gi\xE1.",
    origin: "Central Highlands, Vietnam",
    originVi: "T\xE2y Nguy\xEAn, Vi\u1EC7t Nam",
    certifications: ["Premium Grade", "ISO 22000", "Clean Label"],
    verified: true,
    ocop: "Premium Grade",
    specs: {
      moisture: "< 3%",
      brix: "Rich buttery profile",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place away from heat and light",
      storageVi: "N\u01A1i tho\xE1ng m\xE1t, kh\xF4 r\xE1o, tr\xE1nh \xE1nh s\xE1ng tr\u1EF1c ti\u1EBFp",
      ingredientsEn: "100% In-shell cracked Vietnamese Macadamia Nuts (with shell-opening key)",
      ingredientsVi: "100% H\u1EA1t m\u1EAFc ca n\u1EE9t v\u1ECF T\xE2y Nguy\xEAn tuy\u1EC3n ch\u1ECDn (k\xE8m d\u1EE5ng c\u1EE5 t\xE1ch v\u1ECF)",
      processEn: "Low-temperature multi-stage hot-air drying to preserve delicate healthy oils",
      processVi: "S\u1EA5y nhi\u1EC7t th\u1EA5p \u0111a t\u1EA7ng ki\u1EC3m so\xE1t \u0111\u1ED9 \u1EA9m, b\u1EA3o to\xE0n tr\u1ECDn v\u1EB9n tinh d\u1EA7u qu\xFD",
      packagingEn: "Zip pouch / PET jar 250g, 500g / Master carton 10kg",
      packagingVi: "T\xFAi zip / H\u1ED9p PET 250g, 500g / Th\xF9ng xu\u1EA5t kh\u1EA9u 10kg",
      certificationsEn: "ISO 22000:2018, HACCP, Clean Label",
      certificationsVi: "ISO 22000:2018, HACCP, Clean Label"
    },
    en: {
      name: "Vietnamese Macadamia Nuts",
      desc: "Central Highlands macadamia nuts, naturally creamy and rich in essential fatty acids.",
      origin: "Central Highlands, Vietnam",
      features: "Grown in high-altitude volcanic basalt soils. Shells are mechanically cracked for effortless peeling, revealing fresh, buttery, nutrient-dense kernels."
    },
    vi: {
      name: "H\u1EA1t m\u1EAFc ca T\xE2y Nguy\xEAn",
      desc: "M\u1EAFc ca T\xE2y Nguy\xEAn n\u1EE9t v\u1ECF t\u1EF1 nhi\xEAn, nh\xE2n tr\xF2n \u0111\u1EA7y, b\xE9o ng\u1EADy thanh tao.",
      origin: "T\xE2y Nguy\xEAn, Vi\u1EC7t Nam",
      features: "V\xF9ng nguy\xEAn li\u1EC7u \u0111\u1EA1i ng\xE0n T\xE2y Nguy\xEAn. H\u1EA1t s\u1EA5y n\u1EE9t v\u1ECF d\u1EC5 t\xE1ch, gi\u1EEF nguy\xEAn \u0111\u1ED9 t\u01B0\u01A1i m\u1EDBi, nh\xE2n gi\xF2n b\xF9i ng\u1EADy b\xE9o t\u1EF1 nhi\xEAn v\xE0 gi\xE0u d\u01B0\u1EE1ng ch\u1EA5t cho tim m\u1EA1ch."
    }
  },
  // 07 — Soft Dried Mango
  {
    id: "soft-dried-mango",
    slug: "soft-dried-mango",
    aliases: ["dried-mango"],
    name: "Soft Dried Mango",
    nameVi: "Xo\xE0i s\u1EA5y d\u1EBBo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y d\u1EBBo",
    image: "/images/products/soft-dried-mango.webp",
    imageWebp: "/images/products/soft-dried-mango.webp",
    imageJpg: "/images/products/soft-dried-mango.jpg",
    shortDescription: "Premium Cat Chu and Hoa Loc mangoes, gently dehydrated with a soft, chewy texture.",
    shortDescriptionVi: "Tuy\u1EC3n ch\u1ECDn t\u1EEB xo\xE0i C\xE1t Chu & C\xE1t H\xF2a L\u1ED9c, d\u1EBBo m\u1EC1m m\u1ECDng v\u1ECB, ng\u1ECDt thanh t\u1EF1 nhi\xEAn.",
    description: "Carefully sourced from Dong Thap and Tien Giang orchards, using premium Cat Chu and Cat Hoa Loc varieties. Low-temperature convective drying (~60\xB0C) locks in the sunny golden color, chewy succulent texture, and rich vitamins A & C without added refined sugar.",
    descriptionVi: "\u0110\u01B0\u1EE3c tuy\u1EC3n ch\u1ECDn t\u1EEB gi\u1ED1ng xo\xE0i danh ti\u1EBFng C\xE1t Chu v\xE0 C\xE1t H\xF2a L\u1ED9c t\u1EA1i v\u1EF1a xo\xE0i \u0110\u1ED3ng Th\xE1p v\xE0 Ti\u1EC1n Giang. C\xF4ng ngh\u1EC7 s\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p tu\u1EA7n ho\xE0n (~60\xB0C) gi\xFAp gi\u1EEF nguy\xEAn s\u1EAFc v\xE0ng \xF3ng \u1EA3, c\u1EA5u tr\xFAc d\u1EBBo th\u01A1m m\u1ECDng v\u1ECB v\xE0 h\xE0m l\u01B0\u1EE3ng vitamin A, C t\u1EF1 nhi\xEAn.",
    origin: "Dong Thap & Tien Giang Orchards",
    originVi: "V\xF9ng xo\xE0i \u0110\u1ED3ng Th\xE1p & Ti\u1EC1n Giang",
    certifications: ["OCOP 3-Star Tien Giang", "BRCGS Grade B Facility", "BSCI"],
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 15%",
      brix: "65\xB0 - 70\xB0 Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place (20 - 25\xB0C), away from direct sunlight",
      storageVi: "N\u01A1i kh\xF4 r\xE1o, tho\xE1ng m\xE1t (20 - 25\xB0C), tr\xE1nh \xE1nh n\u1EAFng tr\u1EF1c ti\u1EBFp",
      ingredientsEn: "100% Fresh Mekong Delta mango (Cat Chu & Hoa Loc), zero added sugar, preservative-free",
      ingredientsVi: "100% Xo\xE0i t\u01B0\u01A1i tuy\u1EC3n ch\u1ECDn (Xo\xE0i C\xE1t Chu & C\xE1t H\xF2a L\u1ED9c), kh\xF4ng \u0111\u01B0\u1EDDng tinh luy\u1EC7n, kh\xF4ng ch\u1EA5t b\u1EA3o qu\u1EA3n",
      processEn: "Low-temperature convective hot air drying (~60\xB0C) retaining natural golden hue, fiber, and vitamins A & C",
      processVi: "S\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p tu\u1EA7n ho\xE0n (~60\xB0C) b\u1EA3o to\xE0n m\xE0u v\xE0ng \xF3ng, c\u1EA5u tr\xFAc d\u1EBBo th\u01A1m v\xE0 vitamin A, C t\u1EF1 nhi\xEAn",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master carton 5kg, 10kg with N2 flushing / OEM Private Label",
      packagingVi: "T\xFAi zip 100g, 250g, 500g / Th\xF9ng carton xu\u1EA5t kh\u1EA9u 5kg, 10kg n\u1EA1p kh\xED Nit\u01A1 / OEM nh\xE3n ri\xEAng",
      certificationsEn: "3-Star OCOP Tien Giang, BRCGS Grade B Facility, BSCI Social Compliance",
      certificationsVi: "OCOP 3 Sao Ti\u1EC1n Giang, Nh\xE0 m\xE1y chu\u1EA9n BRCGS Grade B, Tu\xE2n th\u1EE7 BSCI"
    },
    en: {
      name: "Naturally Soft-Dried Mango",
      desc: "Premium Cat Chu and Hoa Loc mangoes, gently dehydrated with a soft, chewy texture.",
      origin: "Dong Thap & Tien Giang Orchards",
      features: "OCOP 3-Star certified. Carefully sliced from premium Cat Chu and selected mangoes. Low-temperature dried (~60\xB0C) to preserve bright natural color, dietary fiber, and vitamins A & C."
    },
    vi: {
      name: "Xo\xE0i s\u1EA5y d\u1EBBo t\u1EF1 nhi\xEAn",
      desc: "Tuy\u1EC3n ch\u1ECDn t\u1EEB xo\xE0i C\xE1t Chu & C\xE1t H\xF2a L\u1ED9c, d\u1EBBo m\u1EC1m m\u1ECDng v\u1ECB, ng\u1ECDt thanh t\u1EF1 nhi\xEAn.",
      origin: "V\xF9ng xo\xE0i \u0110\u1ED3ng Th\xE1p & Ti\u1EC1n Giang",
      features: "S\u1EA3n ph\u1EA9m \u0111\u1EA1t chu\u1EA9n OCOP 3 sao Ti\u1EC1n Giang. Ch\u1EBF bi\u1EBFn t\u1EEB xo\xE0i C\xE1t Chu v\xE0 C\xE1t H\xF2a L\u1ED9c \u0110BSCL. C\xF4ng ngh\u1EC7 s\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p (~60\xB0C) gi\u1EEF tr\u1ECDn s\u1EAFc v\xE0ng \xF3ng, c\u1EA5u tr\xFAc d\u1EBBo th\u01A1m v\xE0 vitamin A, C t\u1EF1 nhi\xEAn."
    }
  },
  // 08 — Jackfruit Chips
  {
    id: "jackfruit-chips",
    slug: "jackfruit-chips",
    name: "Jackfruit Chips",
    nameVi: "M\xEDt s\u1EA5y gi\xF2n",
    category: "chips",
    categoryLabelEn: "Fruit Chips",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y gi\xF2n",
    image: "/images/products/jackfruit-chips.webp",
    imageWebp: "/images/products/jackfruit-chips.webp",
    imageJpg: "/images/products/jackfruit-chips.jpg",
    shortDescription: "Crispy golden jackfruit chips with rich tropical sweetness and signature aroma.",
    shortDescriptionVi: "M\xFAi m\xEDt v\xE0ng ru\u1ED9m gi\xF2n tan, th\u01A1m n\u1EE9c h\u01B0\u01A1ng v\u1ECB nhi\u1EC7t \u0111\u1EDBi ng\u1ECDt ng\xE0o \u0111\u1EB7c tr\u01B0ng.",
    description: "Made from fresh ripe Thai jackfruit sourced from Tien Giang. Advanced vacuum frying and centrifugal oil extraction deliver an exceptionally crispy crunch with zero excess oil, capturing full authentic jackfruit flavor.",
    descriptionVi: "\u0110\u01B0\u1EE3c s\u1EA3n xu\u1EA5t t\u1EEB m\xFAi m\xEDt Th\xE1i t\u01B0\u01A1i ch\xEDn c\xE2y t\u1EA1i Ti\u1EC1n Giang. C\xF4ng ngh\u1EC7 chi\xEAn s\u1EA5y ch\xE2n kh\xF4ng k\u1EBFt h\u1EE3p ly t\xE2m t\xE1ch d\u1EA7u tri\u1EC7t \u0111\u1EC3 gi\xFAp t\u1EEBng m\xFAi m\xEDt gi\xF2n r\u1EE5m, ng\u1ECDt \u0111\u1EADm \u0111\xE0 t\u1EF1 nhi\xEAn m\xE0 kh\xF4ng h\u1EC1 ng\u1EA5y.",
    origin: "Tien Giang, Vietnam",
    originVi: "Ti\u1EC1n Giang, Vi\u1EC7t Nam",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural jackfruit sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place, seal tightly after opening",
      storageVi: "B\u1EA3o qu\u1EA3n n\u01A1i kh\xF4 r\xE1o tho\xE1ng m\xE1t, \u0111\u1EADy k\xEDn sau khi m\u1EDF bao b\xEC",
      ingredientsEn: "Fresh ripe Thai jackfruit (98%), refined vegetable oil",
      ingredientsVi: "M\xEDt Th\xE1i t\u01B0\u01A1i ch\xEDn c\xE2y (98%), d\u1EA7u th\u1EF1c v\u1EADt tinh luy\u1EC7n",
      processEn: "Low-temperature vacuum drying with high-speed centrifugal oil separation",
      processVi: "Chi\xEAn s\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t th\u1EA5p v\xE0 ly t\xE2m t\xE1ch d\u1EA7u c\xF4ng ngh\u1EC7 cao",
      packagingEn: "Zip pouch 100g, 250g, 500g / Bulk master carton 10kg",
      packagingVi: "T\xFAi zip 100g, 250g, 500g / Th\xF9ng carton xu\u1EA5t kh\u1EA9u 10kg",
      certificationsEn: "BRCGS Grade B Facility, Clean Label, Export Standard",
      certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS Grade B, Clean Label, Ti\xEAu chu\u1EA9n xu\u1EA5t kh\u1EA9u"
    },
    en: {
      name: "Crispy Jackfruit Chips",
      desc: "Crispy golden jackfruit chips with rich tropical sweetness and signature aroma.",
      origin: "Tien Giang, Vietnam",
      features: "Prepared from ripe Tien Giang Thai jackfruit. Ultra-crispy bite with irresistible natural fragrance, zero cholesterol, and low fat."
    },
    vi: {
      name: "M\xEDt s\u1EA5y gi\xF2n",
      desc: "M\xFAi m\xEDt v\xE0ng ru\u1ED9m gi\xF2n tan, th\u01A1m n\u1EE9c h\u01B0\u01A1ng v\u1ECB nhi\u1EC7t \u0111\u1EDBi ng\u1ECDt ng\xE0o \u0111\u1EB7c tr\u01B0ng.",
      origin: "Ti\u1EC1n Giang, Vi\u1EC7t Nam",
      features: "Ch\u1EBF bi\u1EBFn t\u1EEB m\xEDt Th\xE1i t\u01B0\u01A1i ch\xEDn c\xE2y Ti\u1EC1n Giang. C\xF4ng ngh\u1EC7 s\u1EA5y gi\xF2n hi\u1EC7n \u0111\u1EA1i gi\u1EEF tr\u1ECDn s\u1EAFc v\xE0ng t\u1EF1 nhi\xEAn, h\u01B0\u01A1ng th\u01A1m ng\xE1t v\xE0 \u0111\u1ED9 gi\xF2n x\u1ED1p m\xEA ly."
    }
  },
  // 09 — Walnuts
  {
    id: "walnuts",
    slug: "walnuts",
    name: "Walnuts",
    nameVi: "H\u1EA1t \xF3c ch\xF3",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "H\u1EA1t dinh d\u01B0\u1EE1ng",
    image: "/images/products/walnuts.webp",
    imageWebp: "/images/products/walnuts.webp",
    imageJpg: "/images/products/walnuts.jpg",
    shortDescription: "Nutritious whole walnut halves, gently roasted with a subtle nutty crunch.",
    shortDescriptionVi: "Nh\xE2n qu\u1EA3 \xF3c ch\xF3 tuy\u1EC3n ch\u1ECDn h\u1EA1t to \u0111\u1EC1u, gi\xF2n b\xF9i v\xE0 gi\xE0u d\u01B0\u1EE1ng ch\u1EA5t v\xE0ng cho tr\xED n\xE3o.",
    description: "Carefully sorted and lightly roasted walnut halves providing clean, nutty richness. Abundant in plant-based Omega-3 ALA, polyphenols, and essential minerals for daily wellness.",
    descriptionVi: "Nh\xE2n \xF3c ch\xF3 tuy\u1EC3n ch\u1ECDn \u0111\u1ED3ng \u0111\u1EC1u k\xEDch th\u01B0\u1EDBc, \u0111\u01B0\u1EE3c x\u1EED l\xFD nhi\u1EC7t nh\u1EB9 \u0111\u1EC3 gi\u1EEF \u0111\u1ED9 gi\xF2n th\u01A1m t\u1EF1 nhi\xEAn m\xE0 kh\xF4ng l\xE0m bi\u1EBFn t\xEDnh c\xE1c axit b\xE9o qu\xFD. D\u1ED3i d\xE0o Omega-3 th\u1EF1c v\u1EADt, ch\u1EA5t ch\u1ED1ng oxy h\xF3a v\xE0 kho\xE1ng ch\u1EA5t.",
    origin: "Selected Premium Grade",
    originVi: "Ngu\u1ED3n nguy\xEAn li\u1EC7u ch\u1ECDn l\u1ECDc cao c\u1EA5p",
    certifications: ["Premium Grade", "ISO 22000", "Clean Label"],
    verified: true,
    ocop: "Premium Grade",
    specs: {
      moisture: "< 5%",
      brix: "Natural nutty profile",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place (15 - 20\xB0C); refrigerate after opening to preserve freshness",
      storageVi: "N\u01A1i kh\xF4 m\xE1t (15 - 20\xB0C); n\xEAn \u0111\u1EC3 ng\u0103n m\xE1t sau khi m\u1EDF \u0111\u1EC3 gi\u1EEF \u0111\u1ED9 t\u01B0\u01A1i ngon",
      ingredientsEn: "100% Selected Premium Walnut Kernels (Light Halves 80%)",
      ingredientsVi: "100% Nh\xE2n qu\u1EA3 \xF3c ch\xF3 tuy\u1EC3n ch\u1ECDn (N\u1EEDa h\u1EA1t nguy\xEAn v\u1EB9n)",
      processEn: "Low-temperature thermal convection drying to stabilize omega fatty acids",
      processVi: "S\u1EA5y \u0111\u1ED1i l\u01B0u nhi\u1EC7t th\u1EA5p b\u1EA3o to\xE0n vi ch\u1EA5t v\xE0 ch\u1ED1ng \xF4i d\u1EA7u",
      packagingEn: "Nitrogen-flushed foil pouch / Tin 200g, 400g / Master carton 10kg",
      packagingVi: "T\xFAi nh\xF4m n\u1EA1p kh\xED Nit\u01A1 / Lon 200g, 400g / Th\xF9ng carton 10kg",
      certificationsEn: "ISO 22000, HACCP, Clean Label",
      certificationsVi: "ISO 22000, HACCP, Clean Label"
    },
    en: {
      name: "Premium Walnut Kernels",
      desc: "Nutritious whole walnut halves, gently roasted with a subtle nutty crunch.",
      origin: "Selected Premium Grade",
      features: "Selected whole halves packed with plant-derived Omega-3 (ALA), vitamin E, and polyphenols. Perfectly roasted for snacking and premium culinary use."
    },
    vi: {
      name: "H\u1EA1t \xF3c ch\xF3 cao c\u1EA5p",
      desc: "Nh\xE2n qu\u1EA3 \xF3c ch\xF3 tuy\u1EC3n ch\u1ECDn h\u1EA1t to \u0111\u1EC1u, gi\xF2n b\xF9i v\xE0 gi\xE0u d\u01B0\u1EE1ng ch\u1EA5t v\xE0ng cho tr\xED n\xE3o.",
      origin: "Ngu\u1ED3n nguy\xEAn li\u1EC7u ch\u1ECDn l\u1ECDc cao c\u1EA5p",
      features: "H\u1EA1t \xF3c ch\xF3 nh\xE2n nguy\xEAn n\u1EEDa h\u1EA1t cao c\u1EA5p. Rang s\u1EA5y nhi\u1EC7t th\u1EA5p b\u1EA3o v\u1EC7 l\u01B0\u1EE3ng Omega-3 v\xE0 ch\u1EA5t ch\u1ED1ng oxy h\xF3a d\u1ED3i d\xE0o, v\u1ECB b\xF9i b\xE9o t\u1EF1 nhi\xEAn."
    }
  },
  // 10 — Soft Dried Papaya
  {
    id: "soft-dried-papaya",
    slug: "soft-dried-papaya",
    name: "Soft Dried Papaya",
    nameVi: "\u0110u \u0111\u1EE7 s\u1EA5y d\u1EBBo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Tr\xE1i c\xE2y s\u1EA5y d\u1EBBo",
    image: "/images/products/soft-dried-papaya.webp",
    imageWebp: "/images/products/soft-dried-papaya.webp",
    imageJpg: "/images/products/soft-dried-papaya.jpg",
    shortDescription: "Tender, succulent papaya slices glowing with natural orange-red hue and mild sweetness.",
    shortDescriptionVi: "T\u1EEBng l\xE1t \u0111u \u0111\u1EE7 m\u1EC1m d\u1EBBo m\u1ECDng n\u01B0\u1EDBc, s\u1EAFc cam \u0111\u1ECF t\u1EF1 nhi\xEAn c\xF9ng v\u1ECB ng\u1ECDt d\u1ECBu thanh m\xE1t.",
    description: "Sourced from fertile Mekong Delta alluvial soil, our ripe papayas are gently low-temperature dehydrated to preserve their luscious color, dietary fiber, beta-carotene, and natural digestive papain enzymes.",
    descriptionVi: "Tuy\u1EC3n ch\u1ECDn t\u1EEB nh\u1EEFng tr\xE1i \u0111u \u0111\u1EE7 ch\xEDn c\xE2y tr\xEAn v\xF9ng \u0111\u1EA5t ph\xF9 sa tr\xF9 ph\xFA \u0110BSCL. C\xF4ng ngh\u1EC7 s\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p gi\xFAp l\xE1t \u0111u \u0111\u1EE7 gi\u1EEF tr\u1ECDn s\u1EAFc cam \u0111\u1ECF r\u1EF1c r\u1EE1, \u0111\u1ED9 d\u1EBBo m\u1EC1m m\u1ECDng v\u1ECB, gi\xE0u beta-carotene v\xE0 enzym papain t\u1EF1 nhi\xEAn.",
    origin: "Mekong Delta Orchards",
    originVi: "V\xF9ng tr\u1ED3ng \u0110BSCL",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 16%",
      brix: "55\xB0 - 60\xB0 Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place (20 - 25\xB0C), away from direct sunlight",
      storageVi: "N\u01A1i kh\xF4 r\xE1o, tho\xE1ng m\xE1t (20 - 25\xB0C), tr\xE1nh \xE1nh n\u1EAFng tr\u1EF1c ti\u1EBFp",
      ingredientsEn: "100% Ripe Mekong Delta Papaya, zero artificial colors, preservative-free",
      ingredientsVi: "100% \u0110u \u0111\u1EE7 ch\xEDn c\xE2y \u0110BSCL t\u01B0\u01A1i ngon, kh\xF4ng ph\u1EA9m m\xE0u h\xF3a h\u1ECDc, kh\xF4ng ch\u1EA5t b\u1EA3o qu\u1EA3n",
      processEn: "Low-temperature convective heat-pump drying preserving beta-carotene and texture",
      processVi: "S\u1EA5y b\u01A1m nhi\u1EC7t tu\u1EA7n ho\xE0n nhi\u1EC7t \u0111\u1ED9 th\u1EA5p b\u1EA3o to\xE0n s\u1EAFc t\u1ED1 carotenoid v\xE0 c\u1EA5u tr\xFAc d\u1EBBo",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master export carton 5kg, 10kg",
      packagingVi: "T\xFAi zip 100g, 250g, 500g / Th\xF9ng carton xu\u1EA5t kh\u1EA9u 5kg, 10kg",
      certificationsEn: "BRCGS Facility, Clean Label, Export Standard",
      certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS, Clean Label, Ti\xEAu chu\u1EA9n xu\u1EA5t kh\u1EA9u"
    },
    en: {
      name: "Naturally Soft-Dried Papaya",
      desc: "Tender, succulent papaya slices glowing with natural orange-red hue and mild sweetness.",
      origin: "Mekong Delta Orchards",
      features: "Grown in nutrient-rich Mekong alluvial orchards. Gently dehydrated to preserve natural carotenoids, digestive enzymes, and pleasant fruity chew."
    },
    vi: {
      name: "\u0110u \u0111\u1EE7 s\u1EA5y d\u1EBBo t\u1EF1 nhi\xEAn",
      desc: "T\u1EEBng l\xE1t \u0111u \u0111\u1EE7 m\u1EC1m d\u1EBBo m\u1ECDng n\u01B0\u1EDBc, s\u1EAFc cam \u0111\u1ECF t\u1EF1 nhi\xEAn c\xF9ng v\u1ECB ng\u1ECDt d\u1ECBu thanh m\xE1t.",
      origin: "V\xF9ng tr\u1ED3ng \u0110BSCL",
      features: "Thu ho\u1EA1ch t\u1EEB \u0111u \u0111\u1EE7 ch\xEDn t\u01B0\u01A1i \u0110BSCL. S\u1EA5y d\u1EBBo nhi\u1EC7t th\u1EA5p b\u1EA3o to\xE0n vi ch\u1EA5t dinh d\u01B0\u1EE1ng, s\u1EAFc cam t\u1EF1 nhi\xEAn b\u1EAFt m\u1EAFt, v\u1ECB ng\u1ECDt thanh v\xE0 th\u1EDB d\u1EBBo th\u01A1m h\u1EA5p d\u1EABn."
    }
  },
  // 11 — Mix Fruits and Vegetables
  {
    id: "mix-fruits-and-vegetables",
    slug: "mix-fruits-and-vegetables",
    aliases: ["mixed-fruits-vegetables"],
    name: "Mix Fruits and Vegetables",
    nameVi: "Tr\xE1i c\xE2y v\xE0 rau c\u1EE7 s\u1EA5y th\u1EADp c\u1EA9m",
    category: "mixed",
    categoryLabelEn: "Mixed Products",
    categoryLabelVi: "Tr\xE1i c\xE2y & rau c\u1EE7 s\u1EA5y th\u1EADp c\u1EA9m",
    image: "/images/products/mix-fruits-and-vegetables.webp",
    imageWebp: "/images/products/mix-fruits-and-vegetables.webp",
    imageJpg: "/images/products/mix-fruits-and-vegetables.jpg",
    shortDescription: "A colorful medley of crispy jackfruit, banana, sweet potatoes, taro, carrot, and green beans.",
    shortDescriptionVi: "B\u1EA3n h\xF2a t\u1EA5u s\u1EAFc m\xE0u gi\xF2n r\u1EE5m t\u1EEB m\xEDt, chu\u1ED1i, khoai lang v\xE0ng, khoai m\xF4n, c\xE0 r\u1ED1t v\xE0 \u0111\u1EADu b\u1EAFp.",
    description: "A wholesome blend of Vietnamese tropical fruits and highland root vegetables. Vacuum crisping delivers an enjoyable multi-texture snacking experience loaded with dietary fiber, vibrant natural colors, and zero artificial flavorings.",
    descriptionVi: "S\u1EF1 k\u1EBFt h\u1EE3p ho\xE0n h\u1EA3o gi\u1EEFa c\xE1c lo\u1EA1i tr\xE1i c\xE2y nhi\u1EC7t \u0111\u1EDBi tr\u1EE9 danh v\xE0 c\u1EE7 qu\u1EA3 t\u01B0\u01A1i n\xF4ng s\u1EA3n Vi\u1EC7t Nam. C\xF4ng ngh\u1EC7 s\u1EA5y ch\xE2n kh\xF4ng hi\u1EC7n \u0111\u1EA1i t\u1EA1o n\xEAn m\xF3n \u0103n v\u1EB7t gi\xF2n tan \u0111a d\u1EA1ng h\u01B0\u01A1ng v\u1ECB, gi\xE0u ch\u1EA5t x\u01A1 v\xE0 ho\xE0n to\xE0n t\u1EF1 nhi\xEAn.",
    origin: "Mekong Delta & Da Lat Highlands",
    originVi: "\u0110BSCL & N\xF4ng s\u1EA3n \u0110\xE0 L\u1EA1t",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural mixed produce sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Cool, dry place; seal tightly after opening",
      storageVi: "N\u01A1i kh\xF4 m\xE1t, bu\u1ED9c k\xEDn mi\u1EC7ng t\xFAi sau khi s\u1EED d\u1EE5ng \u0111\u1EC3 gi\u1EEF \u0111\u1ED9 gi\xF2n",
      ingredientsEn: "Jackfruit, banana, sweet potato, purple sweet potato, taro, carrot, green beans, vegetable oil",
      ingredientsVi: "M\xEDt, chu\u1ED1i, khoai lang v\xE0ng, khoai lang t\xEDm, khoai m\xF4n, c\xE0 r\u1ED1t, \u0111\u1EADu b\u1EAFp, d\u1EA7u th\u1EF1c v\u1EADt",
      processEn: "Low-temperature vacuum drying with high-speed centrifugal oil separation",
      processVi: "Chi\xEAn s\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t th\u1EA5p k\u1EBFt h\u1EE3p c\xF4ng ngh\u1EC7 ly t\xE2m t\xE1ch d\u1EA7u",
      packagingEn: "Zip pouch 150g, 250g, 500g / Master carton 10kg",
      packagingVi: "T\xFAi zip 150g, 250g, 500g / Th\xF9ng carton 10kg",
      certificationsEn: "BRCGS Facility, Clean Label, Export Standard",
      certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS, Clean Label, \u0110\u1EA1t chu\u1EA9n xu\u1EA5t kh\u1EA9u"
    },
    en: {
      name: "Mixed Dried Fruits & Vegetables",
      desc: "A colorful medley of crispy jackfruit, banana, sweet potatoes, taro, carrot, and green beans.",
      origin: "Mekong Delta & Da Lat Highlands",
      features: "A premium assortment of Vietnamese agricultural produce. Crispy, fiber-rich, and free from artificial flavorings or synthetic colorants."
    },
    vi: {
      name: "Tr\xE1i c\xE2y & rau c\u1EE7 s\u1EA5y th\u1EADp c\u1EA9m",
      desc: "B\u1EA3n h\xF2a t\u1EA5u s\u1EAFc m\xE0u gi\xF2n r\u1EE5m t\u1EEB m\xEDt, chu\u1ED1i, khoai lang v\xE0ng, khoai m\xF4n, c\xE0 r\u1ED1t v\xE0 \u0111\u1EADu b\u1EAFp.",
      origin: "\u0110BSCL & N\xF4ng s\u1EA3n \u0110\xE0 L\u1EA1t",
      features: "T\u1ED5ng h\xF2a tinh hoa n\xF4ng s\u1EA3n Vi\u1EC7t Nam. T\u1EEBng mi\u1EBFng s\u1EA5y gi\xF2n x\u1ED1p t\u1EF1 nhi\xEAn, m\xE0u s\u1EAFc b\u1EAFt m\u1EAFt, d\u1ED3i d\xE0o ch\u1EA5t x\u01A1 v\xE0 vitamin c\xF3 l\u1EE3i cho s\u1EE9c kh\u1ECFe."
    }
  },
  // 12 — Lotus Seeds
  {
    id: "lotus-seeds",
    slug: "lotus-seeds",
    name: "Lotus Seeds",
    nameVi: "H\u1EA1t sen",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "H\u1EA1t dinh d\u01B0\u1EE1ng",
    image: "/images/products/lotus-seeds.webp",
    imageWebp: "/images/products/lotus-seeds.webp",
    imageJpg: "/images/products/lotus-seeds.jpg",
    shortDescription: "Renowned Dong Thap lotus seeds, gently dried to a crisp bite with subtle nutty sweetness.",
    shortDescriptionVi: "\u0110\u1EB7c s\u1EA3n h\u1EA1t sen \u0110\u1ED3ng Th\xE1p, s\u1EA5y gi\xF2n b\xF9i x\u1ED1p, v\u1ECB ng\u1ECDt thanh t\u1EF1 nhi\xEAn thanh l\u1ECDc c\u01A1 th\u1EC3.",
    description: "Harvested from the pristine lotus heartland of Dong Thap, Vietnam. Delicately dried to produce a light, powdery crispness and soothing sweet-nutty flavor, packed with plant protein and calming traditional nutritional qualities.",
    descriptionVi: "\u0110\u01B0\u1EE3c thu ho\u1EA1ch t\u1EEB th\u1EE7 ph\u1EE7 sen \u0110\u1ED3ng Th\xE1p danh ti\u1EBFng. T\u1EEBng h\u1EA1t sen tr\xF2n m\u1EA9y \u0111\u01B0\u1EE3c b\xF3c v\u1ECF, t\xE1ch t\xE2m v\xE0 s\u1EA5y gi\xF2n x\u1ED1p nh\u1EB9 t\xEAnh, v\u1ECB ng\u1ECDt b\xF9i thanh tao t\u1EF1 nhi\xEAn, gi\xE0u protein th\u1EF1c v\u1EADt v\xE0 kho\xE1ng ch\u1EA5t an th\u1EA7n b\u1ED5 d\u01B0\u1EE1ng.",
    origin: "Dong Thap, Vietnam",
    originVi: "\u0110\u1ED3ng Th\xE1p, Vi\u1EC7t Nam",
    certifications: ["Dong Thap Specialty", "BRCGS Facility", "Clean Label"],
    verified: true,
    ocop: "Dong Thap Specialty",
    specs: {
      moisture: "< 6%",
      brix: "Delicate nutty sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Th\xE1ng",
      storageEn: "Store in a cool, dry place away from moisture and direct light",
      storageVi: "B\u1EA3o qu\u1EA3n n\u01A1i kh\xF4 r\xE1o, tho\xE1ng m\xE1t, tr\xE1nh \u1EA9m \u01B0\u1EDBt v\xE0 \xE1nh s\xE1ng tr\u1EF1c ti\u1EBFp",
      ingredientsEn: "100% Selected Dong Thap Lotus Seeds, zero artificial preservatives",
      ingredientsVi: "100% H\u1EA1t sen \u0110\u1ED3ng Th\xE1p t\u01B0\u01A1i tuy\u1EC3n ch\u1ECDn, kh\xF4ng ch\u1EA5t b\u1EA3o qu\u1EA3n",
      processEn: "Low-temperature vacuum drying preserving porous texture and delicate amino acids",
      processVi: "S\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t th\u1EA5p gi\u1EEF nguy\xEAn \u0111\u1ED9 x\u1ED1p gi\xF2n v\xE0 d\u01B0\u1EE1ng ch\u1EA5t qu\xFD",
      packagingEn: "Zip pouch / Can 150g, 250g, 500g / Master carton 10kg",
      packagingVi: "T\xFAi zip / Lon n\u1EAFp nh\xF4m 150g, 250g, 500g / Th\xF9ng carton 10kg",
      certificationsEn: "Dong Thap Geographic Specialty, BRCGS Facility, Clean Label",
      certificationsVi: "\u0110\u1EB7c s\u1EA3n \u0110\u1ED3ng Th\xE1p, Nh\xE0 m\xE1y chu\u1EA9n BRCGS, Clean Label"
    },
    en: {
      name: "Crispy Dong Thap Lotus Seeds",
      desc: "Renowned Dong Thap lotus seeds, gently dried to a crisp bite with subtle nutty sweetness.",
      origin: "Dong Thap, Vietnam",
      features: "Sourced from the famous lotus fields of Dong Thap. Crisp, light, and naturally sweet, celebrated for calming properties and pure nutritional value."
    },
    vi: {
      name: "H\u1EA1t sen s\u1EA5y gi\xF2n \u0110\u1ED3ng Th\xE1p",
      desc: "\u0110\u1EB7c s\u1EA3n h\u1EA1t sen \u0110\u1ED3ng Th\xE1p, s\u1EA5y gi\xF2n b\xF9i x\u1ED1p, v\u1ECB ng\u1ECDt thanh t\u1EF1 nhi\xEAn thanh l\u1ECDc c\u01A1 th\u1EC3.",
      origin: "\u0110\u1ED3ng Th\xE1p, Vi\u1EC7t Nam",
      features: "\u0110\u1EB7c s\u1EA3n tr\u1EE9 danh t\u1EEB \u0111\u1EA5t sen h\u1ED3ng \u0110\u1ED3ng Th\xE1p. H\u1EA1t sen s\u1EA5y gi\xF2n x\u1ED1p, th\u01A1m b\xF9i thanh nh\xE3, d\u1ED3i d\xE0o dinh d\u01B0\u1EE1ng b\u1ED3i b\u1ED5 s\u1EE9c kh\u1ECFe."
    }
  }
];
var CATEGORY_LABELS = {
  "soft-dried": {
    vi: "Tr\xE1i c\xE2y s\u1EA5y d\u1EBBo",
    en: "Soft-Dried Fruits",
    ko: "\uC18C\uD504\uD2B8 \uAC74\uC870 \uACFC\uC77C",
    zh: "\u8F6F\u70D8\u5E72\u679C"
  },
  chips: {
    vi: "Tr\xE1i c\xE2y s\u1EA5y gi\xF2n",
    en: "Fruit Chips",
    ko: "\uD06C\uB9AC\uC2A4\uD53C \uACFC\uC77C \uCE69",
    zh: "\u9999\u8106\u679C\u5E72\u7247"
  },
  "nuts-seeds": {
    vi: "H\u1EA1t dinh d\u01B0\u1EE1ng",
    en: "Nuts & Seeds",
    ko: "\uACAC\uACFC\uB958 \uBC0F \uC5F0\uC790\uC721",
    zh: "\u575A\u679C\u4E0E\u83B2\u5B50"
  },
  mixed: {
    vi: "Tr\u1ED9n th\u1EADp c\u1EA9m",
    en: "Mixed Products",
    ko: "\uBAA8\uB4EC \uACFC\uC77C\xB7\uCC44\uC18C",
    zh: "\u7EFC\u5408\u679C\u852C"
  }
};
var PRODUCT_SPECS_I18N = {
  "soft-dried-red-dragonfruit": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3 \uBCF4\uAD00 (20 - 25\xB0C), \uC9C1\uC0AC\uAD11\uC120 \uD68C\uD53C",
      ingredientsKo: "100% \uB760\uC5D4\uC7A5\uC131 \uCA4C\uAC00\uC624\uC0B0 \uC2E0\uC120 \uC801\uC0C9 \uC6A9\uACFC, \uC124\uD0D5 \uBB34\uCCA8\uAC00, \uC778\uACF5 \uC0C9\uC18C \uBB34\uCCA8\uAC00",
      processKo: "\uC800\uC628 \uC21C\uD658 \uD788\uD2B8\uD38C\uD504 \uAC74\uC870 (~50 - 55\xB0C)\uB85C \uCC9C\uC5F0 \uBCA0\uD0C0\uC2DC\uC544\uB2CC \uC0C9\uC18C\uC640 \uC601\uC591\uC18C \uBCF4\uC874",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 100g, 250g, 500g / \uC9C8\uC18C \uCDA9\uC804 \uC218\uCD9C \uB9C8\uC2A4\uD130 \uCE74\uD1A4 5kg, 10kg / OEM",
      certificationsKo: "\uBCA0\uD2B8\uB0A8 OCOP 3\uC131\uAE09, BRCGS Grade B \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58\uFF0820 - 25\xB0C\uFF09\uFF0C\u907F\u514D\u9633\u5149\u76F4\u5C04",
      ingredientsZh: "100% \u9E45\u8D21\u4EA7\u533A\u65B0\u9C9C\u7EA2\u5FC3\u706B\u9F99\u679C\uFF0C\u4E0D\u6DFB\u52A0\u7CBE\u5236\u7CD6\uFF0C\u65E0\u4EBA\u5DE5\u8272\u7D20",
      processZh: "\u4F4E\u6E29\u70ED\u6CF5\u5FAA\u73AF\u5E72\u71E5\uFF08\u7EA6 50 - 55\xB0C\uFF09\uFF0C\u5B8C\u6574\u4FDD\u7559\u5929\u7136\u751C\u83DC\u7EA2\u7D20\u4E0E\u8425\u517B\u6210\u5206",
      packagingZh: "\u81EA\u5C01\u888B 100g\u3001250g\u3001500g / \u5145\u6C2E\u51FA\u53E3\u7EB8\u7BB1 5kg\u300110kg / OEM \u8D34\u724C",
      certificationsZh: "\u8D8A\u5357 OCOP \u4E09\u661F\u7EA7\u3001BRCGS B\u7EA7\u8BA4\u8BC1\u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E"
    }
  },
  "banana-chips": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3 \uBCF4\uAD00, \uAC1C\uBD09 \uD6C4 \uBC00\uBD09",
      ingredientsKo: "100% \uC5C4\uC120\uB41C \uC644\uC219 \uBC14\uB098\uB098, \uC815\uC81C \uC2DD\uBB3C\uC131 \uC720\uC9C0",
      processKo: "\uC800\uC628 \uC9C4\uACF5 \uD06C\uB9AC\uC2A4\uD551 \uBC0F \uACE0\uD6A8\uC728 \uC6D0\uC2EC \uD0C8\uC720 \uACF5\uC815",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 100g, 250g, 500g / \uBC8C\uD06C \uCE74\uD1A4 10kg",
      certificationsKo: "BRCGS Grade B \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8, \uC218\uCD9C \uADDC\uACA9"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u7F6E\u4E8E\u9634\u51C9\u5E72\u71E5\u5904\u4FDD\u5B58\uFF0C\u5F00\u5C01\u540E\u8BF7\u5BC6\u5C01",
      ingredientsZh: "100% \u7CBE\u9009\u6210\u719F\u9999\u8549\u3001\u7CBE\u70BC\u690D\u7269\u6CB9",
      processZh: "\u4F4E\u6E29\u771F\u7A7A\u8106\u5316\u53CA\u9AD8\u6548\u79BB\u5FC3\u8131\u6CB9\u5DE5\u827A",
      packagingZh: "\u81EA\u5C01\u888B 100g\u3001250g\u3001500g / \u6563\u88C5\u7EB8\u7BB1 10kg",
      certificationsZh: "BRCGS B\u7EA7\u8BA4\u8BC1\u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E\u3001\u51FA\u53E3\u54C1\u8D28"
    }
  },
  cashew: {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC5F4\uAE30\uC640 \uC2B5\uAE30\uB97C \uD53C\uD574 \uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3\uC5D0 \uBCF4\uAD00",
      ingredientsKo: "100% Grade A \uBCA0\uD2B8\uB0A8\uC0B0 \uCE90\uC288\uB11B \uCEE4\uB110 (W240 / W320)",
      processKo: "\uACFC\uB3C4\uD55C \uC720\uBD84 \uC5C6\uC774 \uC815\uBC00 \uC5F4\uD48D \uCEE4\uBE0C \uB85C\uC2A4\uD305",
      packagingKo: "\uC9C4\uACF5 \uD30C\uC6B0\uCE58 / \uC9C8\uC18C \uCDA9\uC804 \uCE94 250g, 500g / \uBC8C\uD06C \uC9C4\uACF5 \uBC15\uC2A4 10kg, 22.68kg",
      certificationsKo: "BRCGS \uC2DC\uC124, ISO 22000:2018, HACCP \uC778\uC99D"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u8FDC\u79BB\u9AD8\u6E29\u548C\u6F6E\u6E7F\uFF0C\u7F6E\u4E8E\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58",
      ingredientsZh: "100% A\u7EA7\u8D8A\u5357\u8170\u679C\u4EC1\uFF08W240 / W320\uFF09",
      processZh: "\u63A7\u6E29\u66F2\u7EBF\u8F7B\u67D4\u70ED\u98CE\u70D8\u7119\uFF0C\u65E0\u591A\u4F59\u6CB9\u8102",
      packagingZh: "\u771F\u7A7A\u888B / \u5145\u6C2E\u7F50 250g\u3001500g / \u51FA\u53E3\u771F\u7A7A\u5927\u7BB1 10kg\u300122.68kg",
      certificationsZh: "BRCGS \u5DE5\u5382\u3001ISO 22000:2018\u3001HACCP \u8BA4\u8BC1"
    }
  },
  "soft-dried-jackfruit": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uD658\uACBD, \uAC1C\uBD09 \uD6C4 \uBC00\uBD09 \uBCF4\uAD00",
      ingredientsKo: "100% \uB098\uBB34\uC5D0\uC11C \uC644\uC219\uD55C \uD0DC\uAD6D \uD488\uC885 \uC7AD\uD504\uB8E8\uD2B8, \uBB34\uCF5C\uB808\uC2A4\uD14C\uB864, \uBB34\uBC29\uBD80\uC81C",
      processKo: "\uC800\uC628 \uC21C\uD658 \uC5F4\uD48D \uAC74\uC870 (~55 - 60\xB0C)\uB85C \uCD09\uCD09\uD55C \uACFC\uC721 \uC12C\uC720\uC9C8 \uBCF4\uC874",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 100g, 250g, 500g / \uC218\uCD9C \uB9C8\uC2A4\uD130 \uCE74\uD1A4 5kg, 10kg",
      certificationsKo: "\uBCA0\uD2B8\uB0A8 OCOP 3\uC131\uAE09, BRCGS Grade B \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58\uFF0C\u5F00\u5C01\u540E\u8BF7\u5BC6\u5C01\u4FDD\u5B58",
      ingredientsZh: "100% \u6811\u719F\u6CF0\u56FD\u79CD\u83E0\u841D\u871C\uFF0C\u96F6\u80C6\u56FA\u9187\uFF0C\u65E0\u4EBA\u5DE5\u9632\u8150\u5242",
      processZh: "\u4F4E\u6E29\u70ED\u98CE\u5FAA\u73AF\u8F6F\u70D8\uFF08\u7EA6 55 - 60\xB0C\uFF09\uFF0C\u4FDD\u7559\u9971\u6EE1\u679C\u8089\u7EA4\u7EF4",
      packagingZh: "\u81EA\u5C01\u888B 100g\u3001250g\u3001500g / \u51FA\u53E3\u7EB8\u7BB1 5kg\u300110kg",
      certificationsZh: "\u8D8A\u5357 OCOP \u4E09\u661F\u7EA7\u3001BRCGS B\u7EA7\u8BA4\u8BC1\u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E"
    }
  },
  "mango-chips": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uAC74\uC870\uD558\uACE0 \uC11C\uB298\uD55C \uACF3 \uBCF4\uAD00, \uAC1C\uBD09 \uD6C4 \uC989\uC2DC \uBC00\uBD09",
      ingredientsKo: "\uC5C4\uC120\uB41C \uC2E0\uC120 \uB9DD\uACE0 (98%), \uC815\uC81C \uC2DD\uBB3C\uC131 \uC720\uC9C0",
      processKo: "\uC800\uC628 \uC9C4\uACF5 \uD06C\uB9AC\uC2A4\uD551 \uBC0F \uC6D0\uC2EC \uD0C8\uC720 \uACF5\uC815",
      packagingKo: "\uC54C\uB8E8\uBBF8\uB284 \uC9C0\uD37C \uD30C\uC6B0\uCE58 50g, 100g, 200g / \uB9C8\uC2A4\uD130 \uCE74\uD1A4 10kg",
      certificationsKo: "BRCGS \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8, \uC218\uCD9C \uD45C\uC900"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u4FDD\u5B58\uFF1B\u5F00\u5C01\u540E\u8BF7\u7ACB\u5373\u5BC6\u5C01",
      ingredientsZh: "\u65B0\u9C9C\u7CBE\u9009\u8292\u679C\uFF0898%\uFF09\u3001\u7CBE\u70BC\u690D\u7269\u6CB9",
      processZh: "\u4F4E\u6E29\u771F\u7A7A\u8106\u5316\u53CA\u79BB\u5FC3\u8131\u6CB9\u6280\u672F",
      packagingZh: "\u94DD\u7B94\u81EA\u5C01\u888B 50g\u3001100g\u3001200g / \u51FA\u53E3\u7EB8\u7BB1 10kg",
      certificationsZh: "BRCGS \u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E\u3001\u51FA\u53E3\u6807\u51C6"
    }
  },
  "macadamia-nuts": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC5F4\uAE30\uC640 \uC9C1\uC0AC\uAD11\uC120\uC744 \uD53C\uD574 \uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3\uC5D0 \uBCF4\uAD00",
      ingredientsKo: "100% \uBCA0\uD2B8\uB0A8\uC0B0 \uD06C\uB799 \uC778\uC258 \uB9C8\uCE74\uB2E4\uBBF8\uC544 \uB108\uD2B8 (\uC624\uD504\uB108 \uD3EC\uD568)",
      processKo: "\uBD88\uD3EC\uD654\uC9C0\uBC29\uC0B0 \uBCF4\uC874\uC744 \uC704\uD55C \uC800\uC628 \uB2E4\uB2E8\uACC4 \uC5F4\uD48D \uAC74\uC870",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 / PET \uC6A9\uAE30 250g, 500g / \uB9C8\uC2A4\uD130 \uCE74\uD1A4 10kg",
      certificationsKo: "ISO 22000:2018, HACCP, \uD074\uB9B0 \uB77C\uBCA8"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u907F\u70ED\u907F\u5149\uFF0C\u7F6E\u4E8E\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58",
      ingredientsZh: "100% \u8D8A\u5357\u5E26\u58F3\u5F00\u53E3\u590F\u5A01\u5937\u679C\uFF08\u9644\u8D60\u5F00\u679C\u5668\uFF09",
      processZh: "\u4F4E\u6E29\u591A\u6BB5\u70ED\u98CE\u5E72\u71E5\u5DE5\u827A\uFF0C\u9501\u4F4F\u73CD\u8D35\u5065\u5EB7\u6CB9\u8102",
      packagingZh: "\u81EA\u5C01\u888B / PET \u7F50 250g\u3001500g / \u51FA\u53E3\u7EB8\u7BB1 10kg",
      certificationsZh: "ISO 22000:2018\u3001HACCP\u3001\u6E05\u6D01\u6807\u7B7E"
    }
  },
  "soft-dried-mango": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3 \uBCF4\uAD00 (20 - 25\xB0C), \uC9C1\uC0AC\uAD11\uC120 \uD68C\uD53C",
      ingredientsKo: "100% \uBA54\uCF69 \uB378\uD0C0\uC0B0 \uC2E0\uC120 \uB9DD\uACE0 (\uAE5F\uCD94 & \uD638\uC544\uB85D \uD488\uC885), \uC124\uD0D5 \uBB34\uCCA8\uAC00, \uBB34\uBC29\uBD80\uC81C",
      processKo: "\uC800\uC628 \uC21C\uD658 \uC5F4\uD48D \uAC74\uC870 (~60\xB0C)\uB85C \uD669\uAE08\uBE5B \uC0C9\uAC10, \uC2DD\uC774\uC12C\uC720 \uBC0F \uBE44\uD0C0\uBBFC A\xB7C \uC720\uC9C0",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 100g, 250g, 500g / \uC9C8\uC18C \uCDA9\uC804 \uB9C8\uC2A4\uD130 \uCE74\uD1A4 5kg, 10kg / OEM PB",
      certificationsKo: "\uBCA0\uD2B8\uB0A8 OCOP 3\uC131\uAE09, BRCGS Grade B \uC2DC\uC124, BSCI \uC0AC\uD68C\uC801 \uCC45\uC784 \uC900\uC218"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58\uFF0820 - 25\xB0C\uFF09\uFF0C\u907F\u514D\u9633\u5149\u76F4\u5C04",
      ingredientsZh: "100% \u6E44\u516C\u6CB3\u4E09\u89D2\u6D32\u65B0\u9C9C\u8292\u679C\uFF08Cat Chu & Hoa Loc\uFF09\uFF0C\u4E0D\u6DFB\u52A0\u8517\u7CD6\uFF0C\u65E0\u9632\u8150\u5242",
      processZh: "\u4F4E\u6E29\u70ED\u98CE\u5FAA\u73AF\u5E72\u71E5\uFF08\u7EA6 60\xB0C\uFF09\uFF0C\u4FDD\u7559\u5929\u7136\u91D1\u9EC4\u8272\u6CFD\u3001\u81B3\u98DF\u7EA4\u7EF4\u4E0E\u7EF4\u751F\u7D20 A\u3001C",
      packagingZh: "\u81EA\u5C01\u888B 100g\u3001250g\u3001500g / \u5145\u6C2E\u51FA\u53E3\u7EB8\u7BB1 5kg\u300110kg / OEM \u8D34\u724C",
      certificationsZh: "\u8D8A\u5357 OCOP \u4E09\u661F\u7EA7\u3001BRCGS B\u7EA7\u8BA4\u8BC1\u5DE5\u5382\u3001BSCI \u793E\u4F1A\u8D23\u4EFB\u5BA1\u6838"
    }
  },
  "jackfruit-chips": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3 \uBCF4\uAD00, \uAC1C\uBD09 \uD6C4 \uBC00\uBD09",
      ingredientsKo: "\uC2E0\uC120 \uC644\uC219 \uD0DC\uAD6D \uD488\uC885 \uC7AD\uD504\uB8E8\uD2B8 (98%), \uC815\uC81C \uC2DD\uBB3C\uC131 \uC720\uC9C0",
      processKo: "\uC800\uC628 \uC9C4\uACF5 \uAC74\uC870 \uBC0F \uACE0\uC18D \uC6D0\uC2EC \uC720\uBD84 \uBD84\uB9AC \uACF5\uC815",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 100g, 250g, 500g / \uBC8C\uD06C \uB9C8\uC2A4\uD130 \uCE74\uD1A4 10kg",
      certificationsKo: "BRCGS Grade B \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8, \uC218\uCD9C \uD45C\uC900"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58\uFF0C\u5F00\u5C01\u540E\u8BF7\u5BC6\u5C01",
      ingredientsZh: "\u65B0\u9C9C\u6811\u719F\u6CF0\u56FD\u79CD\u83E0\u841D\u871C\uFF0898%\uFF09\u3001\u7CBE\u70BC\u690D\u7269\u6CB9",
      processZh: "\u4F4E\u6E29\u771F\u7A7A\u5E72\u71E5\u53CA\u9AD8\u901F\u79BB\u5FC3\u8131\u6CB9\u5DE5\u827A",
      packagingZh: "\u81EA\u5C01\u888B 100g\u3001250g\u3001500g / \u51FA\u53E3\u5927\u7BB1 10kg",
      certificationsZh: "BRCGS B\u7EA7\u8BA4\u8BC1\u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E\u3001\u51FA\u53E3\u6807\u51C6"
    }
  },
  walnuts: {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3(15 - 20\xB0C) \uBCF4\uAD00; \uAC1C\uBD09 \uD6C4 \uB0C9\uC7A5 \uBCF4\uAD00 \uAD8C\uC7A5",
      ingredientsKo: "100% \uC5C4\uC120\uB41C \uD504\uB9AC\uBBF8\uC5C4 \uD638\uB450 \uCEE4\uB110 (\uB77C\uC774\uD2B8 \uD558\uD504 80%)",
      processKo: "\uC624\uBA54\uAC00 \uC9C0\uBC29\uC0B0 \uC0B0\uD328 \uBC29\uC9C0\uB97C \uC704\uD55C \uC800\uC628 \uC5F4\uD48D \uC21C\uD658 \uAC74\uC870",
      packagingKo: "\uC9C8\uC18C \uCDA9\uC804 \uD638\uC77C \uD30C\uC6B0\uCE58 / \uCE94 200g, 400g / \uB9C8\uC2A4\uD130 \uCE74\uD1A4 10kg",
      certificationsKo: "ISO 22000, HACCP, \uD074\uB9B0 \uB77C\uBCA8"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\uFF0815 - 20\xB0C\uFF09\u4FDD\u5B58\uFF1B\u5F00\u5C01\u540E\u5EFA\u8BAE\u51B7\u85CF\u4FDD\u9C9C",
      ingredientsZh: "100% \u7CBE\u9009\u4F18\u8D28\u6838\u6843\u4EC1\uFF08Light Halves 80%\uFF09",
      processZh: "\u4F4E\u6E29\u70ED\u5BF9\u6D41\u5E72\u71E5\u4EE5\u7A33\u5B9A Omega \u8102\u80AA\u9178\u6D3B\u6027",
      packagingZh: "\u5145\u6C2E\u94DD\u7B94\u888B / \u7F50\u88C5 200g\u3001400g / \u51FA\u53E3\u7EB8\u7BB1 10kg",
      certificationsZh: "ISO 22000\u3001HACCP\u3001\u6E05\u6D01\u6807\u7B7E"
    }
  },
  "soft-dried-papaya": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3 \uBCF4\uAD00 (20 - 25\xB0C), \uC9C1\uC0AC\uAD11\uC120 \uD68C\uD53C",
      ingredientsKo: "100% \uBA54\uCF69 \uB378\uD0C0\uC0B0 \uC644\uC219 \uD30C\uD30C\uC57C, \uC778\uACF5 \uC0C9\uC18C \uBB34\uCCA8\uAC00, \uBB34\uBC29\uBD80\uC81C",
      processKo: "\uBCA0\uD0C0\uCE74\uB85C\uD2F4\uACFC \uC2DD\uAC10\uC744 \uBCF4\uC874\uD558\uB294 \uC800\uC628 \uC21C\uD658 \uD788\uD2B8\uD38C\uD504 \uAC74\uC870",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 100g, 250g, 500g / \uC218\uCD9C \uB9C8\uC2A4\uD130 \uCE74\uD1A4 5kg, 10kg",
      certificationsKo: "BRCGS \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8, \uC218\uCD9C \uD45C\uC900"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58\uFF0820 - 25\xB0C\uFF09\uFF0C\u907F\u514D\u9633\u5149\u76F4\u5C04",
      ingredientsZh: "100% \u6E44\u516C\u6CB3\u4E09\u89D2\u6D32\u6210\u719F\u6728\u74DC\uFF0C\u65E0\u4EBA\u5DE5\u8272\u7D20\uFF0C\u65E0\u9632\u8150\u5242",
      processZh: "\u4F4E\u6E29\u70ED\u6CF5\u5FAA\u73AF\u5E72\u71E5\uFF0C\u4FDD\u7559 \u03B2-\u80E1\u841D\u535C\u7D20\u4E0E\u67D4\u97E7\u53E3\u611F",
      packagingZh: "\u81EA\u5C01\u888B 100g\u3001250g\u3001500g / \u51FA\u53E3\u7EB8\u7BB1 5kg\u300110kg",
      certificationsZh: "BRCGS \u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E\u3001\u51FA\u53E3\u6807\u51C6"
    }
  },
  "mix-fruits-and-vegetables": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3 \uBCF4\uAD00, \uAC1C\uBD09 \uD6C4 \uBC00\uBD09",
      ingredientsKo: "\uC7AD\uD504\uB8E8\uD2B8, \uBC14\uB098\uB098, \uACE0\uAD6C\uB9C8, \uC790\uC0C9\uACE0\uAD6C\uB9C8, \uD1A0\uB780, \uB2F9\uADFC, \uD48B\uAC15\uB0AD\uCF69, \uC2DD\uBB3C\uC131 \uC720\uC9C0",
      processKo: "\uC800\uC628 \uC9C4\uACF5 \uAC74\uC870 \uBC0F \uACE0\uC18D \uC6D0\uC2EC \uC720\uBD84 \uBD84\uB9AC \uACF5\uC815",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 150g, 250g, 500g / \uB9C8\uC2A4\uD130 \uCE74\uD1A4 10kg",
      certificationsKo: "BRCGS \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8, \uC218\uCD9C \uD45C\uC900"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9634\u51C9\u5E72\u71E5\u5904\u4FDD\u5B58\uFF0C\u5F00\u5C01\u540E\u8BF7\u5BC6\u5C01",
      ingredientsZh: "\u83E0\u841D\u871C\u3001\u9999\u8549\u3001\u7EA2\u85AF\u3001\u7D2B\u85AF\u3001\u828B\u5934\u3001\u80E1\u841D\u535C\u3001\u56DB\u5B63\u8C46\u3001\u690D\u7269\u6CB9",
      processZh: "\u4F4E\u6E29\u771F\u7A7A\u5E72\u71E5\u53CA\u9AD8\u901F\u79BB\u5FC3\u8131\u6CB9\u5DE5\u827A",
      packagingZh: "\u81EA\u5C01\u888B 150g\u3001250g\u3001500g / \u51FA\u53E3\u7EB8\u7BB1 10kg",
      certificationsZh: "BRCGS \u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E\u3001\u51FA\u53E3\u6807\u51C6"
    }
  },
  "lotus-seeds": {
    ko: {
      shelfLifeKo: "12\uAC1C\uC6D4",
      storageKo: "\uC2B5\uAE30\uC640 \uC9C1\uC0AC\uAD11\uC120\uC744 \uD53C\uD574 \uC11C\uB298\uD558\uACE0 \uAC74\uC870\uD55C \uACF3\uC5D0 \uBCF4\uAD00",
      ingredientsKo: "100% \uC5C4\uC120\uB41C \uB3D9\uD0D1\uC131 \uC5F0\uC790\uC721, \uC778\uACF5 \uBC29\uBD80\uC81C \uBB34\uCCA8\uAC00",
      processKo: "\uB2E4\uACF5\uC131 \uBC14\uC0AD\uD55C \uC2DD\uAC10\uACFC \uC544\uBBF8\uB178\uC0B0\uC744 \uC720\uC9C0\uD558\uB294 \uC800\uC628 \uC9C4\uACF5 \uAC74\uC870",
      packagingKo: "\uC9C0\uD37C \uD30C\uC6B0\uCE58 / \uCE94 150g, 250g, 500g / \uB9C8\uC2A4\uD130 \uCE74\uD1A4 10kg",
      certificationsKo: "\uB3D9\uD0D1\uC131 \uC9C0\uB9AC\uC801 \uD2B9\uC0B0\uBB3C, BRCGS \uC2DC\uC124, \uD074\uB9B0 \uB77C\uBCA8"
    },
    zh: {
      shelfLifeZh: "12\u4E2A\u6708",
      storageZh: "\u9632\u6F6E\u907F\u5149\uFF0C\u7F6E\u4E8E\u9634\u51C9\u5E72\u71E5\u5904\u50A8\u5B58",
      ingredientsZh: "100% \u7CBE\u9009\u540C\u5854\u7701\u83B2\u5B50\uFF0C\u65E0\u4EBA\u5DE5\u9632\u8150\u5242",
      processZh: "\u4F4E\u6E29\u771F\u7A7A\u5E72\u71E5\uFF0C\u4FDD\u7559\u9165\u677E\u591A\u5B54\u53E3\u611F\u4E0E\u5929\u7136\u6C28\u57FA\u9178",
      packagingZh: "\u81EA\u5C01\u888B / \u7F50\u88C5 150g\u3001250g\u3001500g / \u51FA\u53E3\u7EB8\u7BB1 10kg",
      certificationsZh: "\u540C\u5854\u7701\u5730\u7406\u7279\u8272\u4EA7\u54C1\u3001BRCGS \u5DE5\u5382\u3001\u6E05\u6D01\u6807\u7B7E"
    }
  }
};
var productCmsModules = {};
try {
  productCmsModules = import.meta.glob("/content/products/*.json", { eager: true });
} catch {
  productCmsModules = {};
}
var cmsProductMap = /* @__PURE__ */ new Map();
for (const mod of Object.values(productCmsModules)) {
  const p = mod.default || mod;
  if (p?.slug) cmsProductMap.set(p.slug, p);
  if (p?.id) cmsProductMap.set(p.id, p);
}
var productsData = BASE_PRODUCTS_DATA.map((base) => {
  const cms = cmsProductMap.get(base.slug) || cmsProductMap.get(base.id);
  const specI18n = PRODUCT_SPECS_I18N[base.slug];
  const baseCats = CATEGORY_LABELS[base.category];
  const baseWithKoZh = {
    ...base,
    categoryLabelKo: base.categoryLabelKo || baseCats?.ko || base.categoryLabelEn,
    categoryLabelZh: base.categoryLabelZh || baseCats?.zh || base.categoryLabelEn,
    specs: {
      ...base.specs,
      ...specI18n?.ko || {},
      ...specI18n?.zh || {}
    }
  };
  if (!cms) return baseWithKoZh;
  const nameVi = cms.name_vi || cms.nameVi || base.nameVi;
  const nameEn = cms.name_en || cms.name || base.name;
  const nameKo = cms.name_ko || cms.nameKo || cms.ko?.name || baseWithKoZh.nameKo || nameEn;
  const nameZh = cms.name_zh || cms.nameZh || cms.zh?.name || baseWithKoZh.nameZh || nameEn;
  const descVi = cms.description_vi || cms.descriptionVi || base.descriptionVi;
  const descEn = cms.description_en || cms.description || base.description;
  const descKo = cms.description_ko || cms.descriptionKo || cms.ko?.desc || baseWithKoZh.descriptionKo || descEn;
  const descZh = cms.description_zh || cms.descriptionZh || cms.zh?.desc || baseWithKoZh.descriptionZh || descEn;
  const originVi = cms.origin_vi || cms.originVi || base.originVi;
  const originEn = cms.origin_en || cms.origin || base.origin;
  const originKo = cms.origin_ko || cms.originKo || cms.ko?.origin || baseWithKoZh.originKo || originEn;
  const originZh = cms.origin_zh || cms.originZh || cms.zh?.origin || baseWithKoZh.originZh || originEn;
  const category = cms.category || base.category;
  const cats = CATEGORY_LABELS[category] || baseCats;
  const img = cms.image || cms.imageWebp || base.imageWebp || base.image;
  const imgWebp = cms.imageWebp || (img.endsWith(".webp") ? img : img.endsWith(".jpg") ? img.replace(/\.jpe?g$/, ".webp") : img);
  const imgJpg = cms.imageJpg || (img.endsWith(".webp") ? img.replace(/\.webp$/, ".jpg") : img);
  return {
    ...baseWithKoZh,
    nameVi,
    name: nameEn,
    nameKo,
    nameZh,
    category,
    categoryLabelEn: cats?.en || baseWithKoZh.categoryLabelEn,
    categoryLabelVi: cats?.vi || baseWithKoZh.categoryLabelVi,
    categoryLabelKo: cats?.ko || baseWithKoZh.categoryLabelKo,
    categoryLabelZh: cats?.zh || baseWithKoZh.categoryLabelZh,
    image: img,
    imageWebp: imgWebp,
    imageJpg: imgJpg,
    shortDescriptionVi: descVi,
    descriptionVi: descVi,
    shortDescription: descEn,
    description: descEn,
    shortDescriptionKo: cms.shortDescriptionKo || descKo,
    descriptionKo: descKo,
    shortDescriptionZh: cms.shortDescriptionZh || descZh,
    descriptionZh: descZh,
    originVi,
    origin: originEn,
    originKo,
    originZh,
    certifications: cms.certifications || base.certifications,
    specs: {
      ...baseWithKoZh.specs,
      ...cms.specs || {},
      shelfLifeVi: cms.shelf_life || cms.specs?.shelfLifeVi || base.specs.shelfLifeVi,
      shelfLifeKo: cms.shelf_life_ko || cms.specs?.shelfLifeKo || baseWithKoZh.specs.shelfLifeKo,
      shelfLifeZh: cms.shelf_life_zh || cms.specs?.shelfLifeZh || baseWithKoZh.specs.shelfLifeZh,
      packagingVi: cms.packaging || cms.specs?.packagingVi || base.specs.packagingVi,
      packagingKo: cms.packaging_ko || cms.specs?.packagingKo || baseWithKoZh.specs.packagingKo,
      packagingZh: cms.packaging_zh || cms.specs?.packagingZh || baseWithKoZh.specs.packagingZh
    },
    en: {
      ...base.en,
      name: nameEn,
      desc: descEn,
      origin: originEn || base.en.origin
    },
    vi: {
      ...base.vi,
      name: nameVi,
      desc: descVi,
      origin: originVi || base.vi.origin
    },
    ko: {
      name: nameKo,
      desc: descKo,
      origin: originKo || originEn || base.en.origin,
      features: cms.ko?.features || descKo
    },
    zh: {
      name: nameZh,
      desc: descZh,
      origin: originZh || originEn || base.en.origin,
      features: cms.zh?.features || descZh
    }
  };
});

// server/inquiry.ts
var EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var DEFAULT_RECIPIENT = "cuonghoang0710@gmail.com";
var INQUIRY_WINDOW_MS = 10 * 60 * 1e3;
var INQUIRY_MAX_PER_WINDOW = 5;
var DEDUP_WINDOW_MS = 60 * 1e3;
var ipRateStore = /* @__PURE__ */ new Map();
var recentSubmissionStore = /* @__PURE__ */ new Map();
function pruneStores(now) {
  if (ipRateStore.size > 500) {
    for (const [k, v] of ipRateStore.entries()) {
      if (now > v.resetAt) ipRateStore.delete(k);
    }
  }
  if (recentSubmissionStore.size > 500) {
    for (const [k, expiresAt] of recentSubmissionStore.entries()) {
      if (now > expiresAt) recentSubmissionStore.delete(k);
    }
  }
}
function checkInquiryRateLimit(ip, now) {
  const entry = ipRateStore.get(ip);
  if (!entry || now >= entry.resetAt) {
    ipRateStore.set(ip, { count: 1, resetAt: now + INQUIRY_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  entry.count += 1;
  ipRateStore.set(ip, entry);
  if (entry.count > INQUIRY_MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1e3))
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
function cleanText(val, maxLen) {
  if (typeof val !== "string") return "";
  return val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}
function stripHeaderBreaks(val) {
  return val.replace(/[\r\n]+/g, " ").trim();
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function isOriginAllowed(req) {
  const secFetchSite = String(req?.headers?.["sec-fetch-site"] || "").toLowerCase();
  if (secFetchSite === "cross-site") return false;
  const expectedHost = String(req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim().toLowerCase();
  const origin = req?.headers?.origin;
  if (!expectedHost || !origin || typeof origin !== "string") return true;
  try {
    return new URL(origin).host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}
function verifyCanonicalProduct(rawProductId, rawProductName) {
  const candidates = [rawProductId, rawProductName].map((s) => s.trim().toLowerCase()).filter(Boolean);
  for (const needle of candidates) {
    const matched = productsData.find(
      (p) => p.slug.toLowerCase() === needle || p.id.toLowerCase() === needle || p.name.toLowerCase() === needle || p.nameVi.toLowerCase() === needle || p.nameKo?.toLowerCase() === needle || p.nameZh?.toLowerCase() === needle || p.en?.name?.toLowerCase() === needle || p.vi?.name?.toLowerCase() === needle || p.ko?.name?.toLowerCase() === needle || p.zh?.name?.toLowerCase() === needle || p.aliases?.some((a) => a.toLowerCase() === needle)
    );
    if (matched) {
      return {
        verifiedId: matched.slug,
        verifiedLabel: `${matched.nameVi} / ${matched.name} (${matched.slug})`,
        isCatalogVerified: true
      };
    }
    if (needle === "value-added-lines") {
      return {
        verifiedId: "value-added-lines",
        verifiedLabel: "Honey-Infused / Chocolate-Dipped / Granola (OEM)",
        isCatalogVerified: true
      };
    }
    if (needle === "oem-private-label") {
      return {
        verifiedId: "oem-private-label",
        verifiedLabel: "OEM / ODM & Private Label Project",
        isCatalogVerified: true
      };
    }
  }
  return {
    verifiedId: rawProductId || "",
    verifiedLabel: rawProductName || "",
    isCatalogVerified: false
  };
}
var inquiry_default = wrapHandler(async (req, res) => {
  const method = (req?.method || "GET").toUpperCase();
  if (method !== "POST") {
    return sendJson(res, 405, { ok: false, delivered: false, code: "METHOD_NOT_ALLOWED", error: "Method Not Allowed" });
  }
  const contentType = String(req?.headers?.["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return sendJson(res, 415, {
      ok: false,
      delivered: false,
      code: "UNSUPPORTED_MEDIA_TYPE",
      error: "Content-Type must be application/json."
    });
  }
  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, {
      ok: false,
      delivered: false,
      code: "FORBIDDEN_ORIGIN",
      error: "Cross-origin request rejected."
    });
  }
  const rawBody = stripUnsafeKeys(await readJsonBody(req, 16384));
  const honeypot = cleanText(rawBody.hp_website || rawBody.company_website_hp || rawBody.quote_company_fax_hp, 200);
  if (honeypot) {
    return sendJson(res, 200, {
      ok: true,
      delivered: true,
      filtered: true,
      referenceId: `VNX-HP-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  const now = Date.now();
  pruneStores(now);
  const clientIp = getClientIp(req);
  const rate = checkInquiryRateLimit(clientIp, now);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSeconds));
    return sendJson(res, 429, {
      ok: false,
      delivered: false,
      code: "RATE_LIMITED",
      retryAfterSeconds: rate.retryAfterSeconds,
      error: "Too many requests. Please wait a few minutes before sending another inquiry."
    });
  }
  const rawLang = String(rawBody.locale || rawBody.language || "").trim();
  const language = rawLang === "en" ? "en" : rawLang === "ko" ? "ko" : rawLang === "zh-CN" || rawLang === "zh" ? "zh-CN" : "vi";
  const pickMsg = (m) => m[language];
  const requestType = rawBody.requestType === "quotation" || rawBody.formType === "quote" ? "quotation" : "contact";
  const fullName = stripHeaderBreaks(cleanText(rawBody.fullName || rawBody.name, 100));
  const rawEmailInput = String(rawBody.email || "");
  const hasEmailHeaderInjection = /[\r\n]/.test(rawEmailInput);
  const email = stripHeaderBreaks(cleanText(rawEmailInput, 120));
  const phone = stripHeaderBreaks(cleanText(rawBody.phone, 30));
  const company = cleanText(rawBody.company, 150);
  const country = cleanText(rawBody.country, 100);
  const inquiryType = cleanText(rawBody.inquiryType, 150);
  const rawProductId = cleanText(rawBody.productId, 120);
  const rawProductName = cleanText(rawBody.productName || rawBody.product, 200);
  const quantity = cleanText(rawBody.quantity || rawBody.volume, 200);
  const rawTradeTerm = cleanText(rawBody.tradeTerm, 20).toUpperCase();
  const rawShippingMode = cleanText(rawBody.shippingMode, 20).toUpperCase();
  const message = cleanText(rawBody.message, 3e3);
  const sourcePage = cleanText(rawBody.source || rawBody.sourcePage, 200) || (requestType === "quotation" ? "QuoteModal" : "/contact");
  const ALLOWED_TRADE_TERMS = /* @__PURE__ */ new Set(["FOB", "CIF", "CONSULT"]);
  const ALLOWED_SHIPPING_MODES = /* @__PURE__ */ new Set(["FCL", "LCL", "CONSULT"]);
  const errors = [];
  if (rawTradeTerm && !ALLOWED_TRADE_TERMS.has(rawTradeTerm)) {
    errors.push(pickMsg({
      vi: "\u0110i\u1EC1u ki\u1EC7n th\u01B0\u01A1ng m\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7 (ch\u1EC9 ch\u1EA5p nh\u1EADn FOB, CIF ho\u1EB7c CONSULT).",
      en: "Invalid trade term (only FOB, CIF, or CONSULT allowed).",
      ko: "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uBB34\uC5ED \uC870\uAC74\uC785\uB2C8\uB2E4 (FOB, CIF \uB610\uB294 CONSULT\uB9CC \uD5C8\uC6A9).",
      "zh-CN": "\u65E0\u6548\u7684\u8D38\u6613\u6761\u6B3E\uFF08\u4EC5\u652F\u6301 FOB\u3001CIF \u6216 CONSULT\uFF09\u3002"
    }));
  }
  if (rawShippingMode && !ALLOWED_SHIPPING_MODES.has(rawShippingMode)) {
    errors.push(pickMsg({
      vi: "H\xECnh th\u1EE9c v\u1EADn chuy\u1EC3n kh\xF4ng h\u1EE3p l\u1EC7 (ch\u1EC9 ch\u1EA5p nh\u1EADn FCL, LCL ho\u1EB7c CONSULT).",
      en: "Invalid shipping mode (only FCL, LCL, or CONSULT allowed).",
      ko: "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uC6B4\uC1A1 \uBC29\uC2DD\uC785\uB2C8\uB2E4 (FCL, LCL \uB610\uB294 CONSULT\uB9CC \uD5C8\uC6A9).",
      "zh-CN": "\u65E0\u6548\u7684\u8FD0\u8F93\u65B9\u5F0F\uFF08\u4EC5\u652F\u6301 FCL\u3001LCL \u6216 CONSULT\uFF09\u3002"
    }));
  }
  const tradeTerm = rawTradeTerm || "";
  const shippingMode = rawShippingMode || "";
  if (fullName.length < 2) {
    errors.push(pickMsg({
      vi: "Vui l\xF2ng nh\u1EADp h\u1ECD t\xEAn \u0111\u1EA7y \u0111\u1EE7 (t\u1ED1i thi\u1EC3u 2 k\xFD t\u1EF1).",
      en: "Full name must be at least 2 characters.",
      ko: "\uC131\uD568\uC740 2\uC790 \uC774\uC0C1 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
      "zh-CN": "\u59D3\u540D\u81F3\u5C11\u9700\u5305\u542B 2 \u4E2A\u5B57\u7B26\u3002"
    }));
  }
  if (hasEmailHeaderInjection || !EMAIL_REGEX.test(email)) {
    errors.push(pickMsg({
      vi: "Email kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng.",
      en: "Invalid email address.",
      ko: "\uC62C\uBC14\uB978 \uC774\uBA54\uC77C \uC8FC\uC18C\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
      "zh-CN": "\u7535\u5B50\u90AE\u7BB1\u683C\u5F0F\u65E0\u6548\u3002"
    }));
  }
  if (message.length < 5) {
    errors.push(pickMsg({
      vi: "Vui l\xF2ng nh\u1EADp n\u1ED9i dung y\xEAu c\u1EA7u chi ti\u1EBFt (t\u1ED1i thi\u1EC3u 5 k\xFD t\u1EF1).",
      en: "Please provide your inquiry details (at least 5 characters).",
      ko: "\uBB38\uC758 \uB0B4\uC6A9\uC744 \uCD5C\uC18C 5\uC790 \uC774\uC0C1 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
      "zh-CN": "\u8BF7\u586B\u5199\u81F3\u5C11 5 \u4E2A\u5B57\u7B26\u7684\u8BE6\u7EC6\u9700\u6C42\u8BF4\u660E\u3002"
    }));
  }
  if (errors.length > 0) {
    return sendJson(res, 400, {
      ok: false,
      delivered: false,
      code: "VALIDATION_ERROR",
      error: errors.join(" "),
      errors
    });
  }
  const verifiedProduct = verifyCanonicalProduct(rawProductId, rawProductName);
  const dedupHash = crypto.createHash("sha256").update(`${email.toLowerCase()}|${requestType}|${verifiedProduct.verifiedId || rawProductName}|${message}`).digest("hex");
  const existingExpiry = recentSubmissionStore.get(dedupHash);
  if (existingExpiry && now < existingExpiry) {
    return sendJson(res, 409, {
      ok: false,
      delivered: false,
      code: "DUPLICATE_SUBMISSION",
      error: pickMsg({
        vi: "Y\xEAu c\u1EA7u gi\u1ED1ng h\u1EC7t v\u1EEBa \u0111\u01B0\u1EE3c g\u1EEDi tr\u01B0\u1EDBc \u0111\xF3. Vui l\xF2ng \u0111\u1EE3i 1 ph\xFAt tr\u01B0\u1EDBc khi g\u1EEDi l\u1EA1i.",
        en: "An identical inquiry was just submitted. Please wait 1 minute before retrying.",
        ko: "\uB3D9\uC77C\uD55C \uBB38\uC758\uAC00 \uBC29\uAE08 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. 1\uBD84 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
        "zh-CN": "\u521A\u5DF2\u63D0\u4EA4\u76F8\u540C\u7684\u54A8\u8BE2\u5185\u5BB9\uFF0C\u8BF7\u7B49\u5F85 1 \u5206\u949F\u540E\u518D\u8BD5\u3002"
      })
    });
  }
  const recipientEmail = (process.env.CONTACT_TO_EMAIL || process.env.INQUIRY_TO_EMAIL || DEFAULT_RECIPIENT).trim();
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const brevoApiKey = (process.env.BREVO_API_KEY || "").trim();
  const webhookUrl = (process.env.INQUIRY_WEBHOOK_URL || "").trim();
  if (!resendApiKey && !brevoApiKey && !webhookUrl) {
    return sendJson(res, 503, {
      ok: false,
      delivered: false,
      code: "DELIVERY_NOT_CONFIGURED",
      recipient: recipientEmail,
      error: pickMsg({
        vi: "H\u1EC7 th\u1ED1ng g\u1EEDi th\u01B0 t\u1EF1 \u0111\u1ED9ng tr\xEAn m\xE1y ch\u1EE7 ch\u01B0a \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t (ch\u01B0a c\xF3 RESEND_API_KEY / BREVO_API_KEY). D\u1EEF li\u1EC7u b\u1EA1n nh\u1EADp v\u1EABn \u0111\u01B0\u1EE3c gi\u1EEF nguy\xEAn \u2014 vui l\xF2ng li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp qua Hotline, WhatsApp ho\u1EB7c Zalo b\xEAn d\u01B0\u1EDBi.",
        en: "Server email dispatch is not activated yet. Your entered information is preserved \u2014 please use Hotline, WhatsApp, or Zalo below.",
        ko: "\uC11C\uBC84 \uC790\uB3D9 \uC774\uBA54\uC77C \uBC1C\uC1A1 \uC124\uC815\uC774 \uC544\uC9C1 \uC644\uB8CC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC785\uB825 \uC815\uBCF4\uB294 \uC720\uC9C0\uB418\uC624\uB2C8 \uC544\uB798 \uD56B\uB77C\uC778, WhatsApp \uB610\uB294 Zalo\uB97C \uC774\uC6A9\uD574 \uC8FC\uC138\uC694.",
        "zh-CN": "\u670D\u52A1\u5668\u81EA\u52A8\u90AE\u4EF6\u53D1\u9001\u5C1A\u672A\u5B8C\u6210\u914D\u7F6E\uFF0C\u60A8\u586B\u5199\u7684\u4FE1\u606F\u5DF2\u4FDD\u7559\uFF0C\u8BF7\u901A\u8FC7\u4E0B\u65B9\u70ED\u7EBF\u3001WhatsApp \u6216 Zalo \u76F4\u63A5\u8054\u7CFB\u6211\u4EEC\u3002"
      })
    });
  }
  const referenceId = `VNX-${new Date(now).toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const submittedAt = new Date(now).toISOString();
  const productDisplayForEmail = verifiedProduct.verifiedLabel || "N/A (Li\xEAn h\u1EC7 chung)";
  const cleanSubjectProduct = stripHeaderBreaks(verifiedProduct.verifiedLabel || inquiryType || "");
  const subject = requestType === "quotation" && cleanSubjectProduct ? `[VINAXO] Y\xEAu c\u1EA7u b\xE1o gi\xE1 m\u1EDBi \u2013 ${cleanSubjectProduct} (${referenceId})` : `[VINAXO] Y\xEAu c\u1EA7u li\xEAn h\u1EC7 m\u1EDBi (${referenceId})`;
  const textSummary = [
    `VINAXO B2B REQUEST (${referenceId})`,
    `========================================`,
    `Request ID: ${referenceId}`,
    `Request Type: ${requestType}`,
    `Submitted At: ${submittedAt}`,
    `----------------------------------------`,
    `Full Name: ${fullName}`,
    `Email (Reply-To): ${email}`,
    `Phone / WhatsApp: ${phone || "N/A"}`,
    `Company: ${company || "N/A"}`,
    `Country / Market: ${country || "N/A"}`,
    `Inquiry Purpose: ${inquiryType || "N/A"}`,
    `Product ID: ${verifiedProduct.verifiedId || "N/A"}`,
    `Product (Verified): ${productDisplayForEmail}`,
    `Catalog Verified: ${verifiedProduct.isCatalogVerified ? "YES" : "NO / Custom"}`,
    `Estimated Quantity: ${quantity || "N/A"}`,
    `Trade Term (Incoterms): ${tradeTerm || "N/A"}`,
    `Shipping Mode (Container): ${shippingMode || "N/A"}`,
    `Customer Locale: ${language}`,
    `Source Page: ${sourcePage}`,
    `----------------------------------------`,
    `Message:`,
    message
  ].join("\n");
  const htmlSummary = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#291810;border:1px solid #eadcc8;border-radius:12px;overflow:hidden">
      <div style="background:#3A2417;color:#FFF7EC;padding:18px 24px">
        <h2 style="margin:0;font-size:18px">${escapeHtml(subject)}</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85">Ngu\u1ED3n: ${escapeHtml(sourcePage)} \u2022 Ng\xF4n ng\u1EEF: ${escapeHtml(language)} \u2022 ${escapeHtml(submittedAt)}</p>
      </div>
      <div style="padding:20px 24px;background:#FFFDF9">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;font-weight:bold;width:190px">M\xE3 y\xEAu c\u1EA7u:</td><td><strong>${escapeHtml(referenceId)}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Lo\u1EA1i y\xEAu c\u1EA7u:</td><td>${escapeHtml(requestType)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">H\u1ECD t\xEAn kh\xE1ch h\xE0ng:</td><td>${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email (Reply-To):</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:</td><td>${escapeHtml(phone || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Doanh nghi\u1EC7p:</td><td>${escapeHtml(company || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Qu\u1ED1c gia / Th\u1ECB tr\u01B0\u1EDDng:</td><td>${escapeHtml(country || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">S\u1EA3n ph\u1EA9m quan t\xE2m:</td><td><strong>${escapeHtml(productDisplayForEmail)}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">S\u1ED1 l\u01B0\u1EE3ng d\u1EF1 ki\u1EBFn:</td><td>${escapeHtml(quantity || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">\u0110i\u1EC1u ki\u1EC7n th\u01B0\u01A1ng m\u1EA1i (Incoterms):</td><td>${escapeHtml(tradeTerm || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">H\xECnh th\u1EE9c v\u1EADn chuy\u1EC3n:</td><td>${escapeHtml(shippingMode || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">M\u1EE5c \u0111\xEDch li\xEAn h\u1EC7:</td><td>${escapeHtml(inquiryType || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Ng\xF4n ng\u1EEF / Ngu\u1ED3n:</td><td>${escapeHtml(language)} (${escapeHtml(sourcePage)})</td></tr>
        </table>
        <div style="margin-top:16px;padding:14px;background:#FFF7EC;border-left:4px solid #F4A83A;border-radius:6px">
          <div style="font-weight:bold;margin-bottom:6px">N\u1ED9i dung y\xEAu c\u1EA7u:</div>
          <div style="white-space:pre-wrap;line-height:1.55">${escapeHtml(message)}</div>
        </div>
      </div>
    </div>
  `;
  const deliveredChannels = [];
  let providerMessageId;
  if (resendApiKey) {
    const fromAddress = stripHeaderBreaks(
      process.env.CONTACT_FROM_EMAIL || process.env.INQUIRY_FROM_EMAIL || "VINAXO B2B Portal <onboarding@resend.dev>"
    );
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipientEmail],
        reply_to: email,
        subject,
        text: textSummary,
        html: htmlSummary
      })
    });
    if (!resendRes.ok) {
      console.error(`[VINAXO Inquiry Resend Error] status=${resendRes.status} ref=${referenceId}`);
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: "DELIVERY_UPSTREAM_FAILED",
        recipient: recipientEmail,
        error: pickMsg({
          vi: "Kh\xF4ng th\u1EC3 chuy\u1EC3n email qua m\xE1y ch\u1EE7 g\u1EEDi th\u01B0 l\xFAc n\xE0y. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c d\xF9ng k\xEAnh Hotline/WhatsApp/Zalo b\xEAn d\u01B0\u1EDBi.",
          en: "Unable to dispatch via email relay right now. Please retry or use Hotline/WhatsApp/Zalo below.",
          ko: "\uD604\uC7AC \uBA54\uC77C \uC911\uACC4 \uC11C\uBC84 \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAC70\uB098 \uC544\uB798 \uD56B\uB77C\uC778/WhatsApp/Zalo\uB97C \uC774\uC6A9\uD574 \uC8FC\uC138\uC694.",
          "zh-CN": "\u90AE\u4EF6\u4E2D\u7EE7\u670D\u52A1\u6682\u65F6\u65E0\u6CD5\u53D1\u9001\u3002\u8BF7\u91CD\u8BD5\u6216\u901A\u8FC7\u4E0B\u65B9\u70ED\u7EBF/WhatsApp/Zalo \u8054\u7CFB\u6211\u4EEC\u3002"
        })
      });
    }
    const resendText = await resendRes.text().catch(() => "");
    try {
      const resendJson = JSON.parse(resendText || "{}");
      if (typeof resendJson?.id === "string") providerMessageId = resendJson.id;
    } catch {
    }
    deliveredChannels.push("resend");
  } else if (brevoApiKey) {
    const rawFrom = stripHeaderBreaks(
      process.env.CONTACT_FROM_EMAIL || process.env.INQUIRY_FROM_EMAIL || "no-reply@vinaxo.net"
    );
    const emailMatch = rawFrom.match(/^(?:(.+?)\s*)?<([^<>]+)>$/);
    const sender = emailMatch ? { name: (emailMatch[1] || "VINAXO B2B Portal").trim(), email: emailMatch[2].trim() } : { name: "VINAXO B2B Portal", email: rawFrom };
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        sender,
        to: [{ email: recipientEmail }],
        replyTo: { email, name: fullName },
        subject,
        textContent: textSummary,
        htmlContent: htmlSummary
      })
    });
    if (!brevoRes.ok) {
      console.error(`[VINAXO Inquiry Brevo Error] status=${brevoRes.status} ref=${referenceId}`);
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: "DELIVERY_UPSTREAM_FAILED",
        recipient: recipientEmail,
        error: pickMsg({
          vi: "Kh\xF4ng th\u1EC3 chuy\u1EC3n email qua m\xE1y ch\u1EE7 g\u1EEDi th\u01B0 l\xFAc n\xE0y. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c d\xF9ng k\xEAnh h\u1ED7 tr\u1EE3 b\xEAn d\u01B0\u1EDBi.",
          en: "Unable to dispatch via email relay right now. Please retry or use the direct channels below.",
          ko: "\uD604\uC7AC \uBA54\uC77C \uBC1C\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAC70\uB098 \uC544\uB798 \uC5F0\uB77D \uCC44\uB110\uC744 \uC774\uC6A9\uD574 \uC8FC\uC138\uC694.",
          "zh-CN": "\u90AE\u4EF6\u53D1\u9001\u670D\u52A1\u6682\u65F6\u5F02\u5E38\uFF0C\u8BF7\u91CD\u8BD5\u6216\u901A\u8FC7\u4E0B\u65B9\u76F4\u63A5\u8054\u7CFB\u65B9\u5F0F\u8054\u7CFB\u6211\u4EEC\u3002"
        })
      });
    }
    const brevoText = await brevoRes.text().catch(() => "");
    try {
      const brevoJson = JSON.parse(brevoText || "{}");
      if (typeof brevoJson?.messageId === "string") providerMessageId = brevoJson.messageId;
    } catch {
    }
    deliveredChannels.push("brevo");
  }
  if (webhookUrl) {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referenceId,
        submittedAt,
        requestType,
        sourcePage,
        locale: language,
        verifiedProductId: verifiedProduct.verifiedId,
        verifiedProductLabel: productDisplayForEmail,
        quantity,
        tradeTerm: tradeTerm || void 0,
        shippingMode: shippingMode || void 0,
        inquiryType,
        company,
        country
      })
    });
    if (!webhookRes.ok && deliveredChannels.length === 0) {
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: "DELIVERY_UPSTREAM_FAILED",
        recipient: recipientEmail,
        error: pickMsg({
          vi: "Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i c\u1ED5ng ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp.",
          en: "Unable to reach inquiry webhook. Please retry or use direct contact channels.",
          ko: "\uBB38\uC758 \uC811\uC218 \uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAC70\uB098 \uC9C1\uC811 \uC5F0\uB77D\uD574 \uC8FC\uC138\uC694.",
          "zh-CN": "\u65E0\u6CD5\u8FDE\u63A5\u8BE2\u76D8\u63A5\u6536\u63A5\u53E3\uFF0C\u8BF7\u91CD\u8BD5\u6216\u901A\u8FC7\u76F4\u63A5\u6E20\u9053\u8054\u7CFB\u3002"
        })
      });
    }
    if (webhookRes.ok) deliveredChannels.push("webhook");
  }
  recentSubmissionStore.set(dedupHash, now + DEDUP_WINDOW_MS);
  return sendJson(res, 200, {
    ok: true,
    delivered: true,
    channel: deliveredChannels.join("+"),
    ...providerMessageId ? { providerMessageId } : {},
    referenceId,
    timestamp: submittedAt,
    recipient: recipientEmail,
    verifiedProductId: verifiedProduct.verifiedId || void 0
  });
});
export {
  inquiry_default as default
};
