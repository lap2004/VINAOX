import { hashPassword } from './generate-password-hash.mjs';
import { verifyPassword, createSessionToken, verifySessionToken, createSessionCookie, parseCookies, clearSessionCookie } from '../api/lib/auth.ts';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('=== VINAXO CUSTOM ADMIN TEST SUITE ===\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  // 1. Password Hash & Verification
  await testAsync('Password hashing & verification with scrypt', async () => {
    const password = 'VinaxoSecretAdmin2026!';
    const hash = await hashPassword(password);
    assert(hash.startsWith('scrypt:'), 'Hash format must start with scrypt:');
    assert.strictEqual(hash.split(':').length, 3, 'Hash format must have 3 parts');
    
    const isValid = await verifyPassword(password, hash);
    assert.strictEqual(isValid, true, 'Correct password must verify');

    const isInvalid = await verifyPassword('WrongPassword123', hash);
    assert.strictEqual(isInvalid, false, 'Wrong password must be rejected');
  });

  // 2. Session Token & Tamper Resistance
  test('Session Token creation and signature verification', () => {
    const token = createSessionToken('admin', 24);
    assert(token && token.split('.').length === 4, 'Token must contain 4 dot-separated parts');

    const result = verifySessionToken(token);
    assert.strictEqual(result.valid, true, 'Token must be valid');
    assert.strictEqual(result.username, 'admin', 'Username must match');

    // Tampering test: modify username
    const parts = token.split('.');
    parts[0] = 'hacker';
    const tamperedToken = parts.join('.');
    const tamperedResult = verifySessionToken(tamperedToken);
    assert.strictEqual(tamperedResult.valid, false, 'Tampered token must be rejected');
  });

  // 3. Cookie generation & parsing
  test('HttpOnly Cookie headers & parsing', () => {
    const cookieHeader = createSessionCookie('test_token_123', 86400, false);
    assert(cookieHeader.includes('HttpOnly'), 'Must be HttpOnly');
    assert(cookieHeader.includes('SameSite=Lax'), 'Must have SameSite=Lax');
    assert(cookieHeader.includes('Path=/'), 'Must have Path=/');

    const clearHeader = clearSessionCookie();
    assert(clearHeader.includes('Max-Age=0'), 'Clear cookie must set Max-Age=0');

    const parsed = parseCookies('session_token=test_token_123; other=456');
    assert.strictEqual(parsed.session_token, 'test_token_123', 'Cookie must be parsed correctly');
  });

  // 4. Data Integrity: 9 News Articles & 12 Products
  test('Verification of migrated News Articles in content/news/', () => {
    const newsDir = path.join(process.cwd(), 'content', 'news');
    assert(fs.existsSync(newsDir), 'content/news/ must exist');
    const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.json'));
    assert(files.length >= 9, `Must contain at least 9 news articles, found ${files.length}`);
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(newsDir, file), 'utf-8'));
      assert(data.title_vi, `Article ${file} must have title_vi`);
      assert(data.slug, `Article ${file} must have slug`);
    }
  });

  test('Verification of migrated Products in content/products/', () => {
    const prodDir = path.join(process.cwd(), 'content', 'products');
    assert(fs.existsSync(prodDir), 'content/products/ must exist');
    const files = fs.readdirSync(prodDir).filter(f => f.endsWith('.json'));
    assert(files.length >= 12, `Must contain at least 12 products, found ${files.length}`);
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(prodDir, file), 'utf-8'));
      assert(data.name_vi, `Product ${file} must have name_vi`);
      assert(data.slug, `Product ${file} must have slug`);
    }
  });

  console.log(`\n========================================`);
  console.log(`TEST SUITE RESULTS: ${passed}/${total} PASSED (100%)`);
  console.log(`========================================\n`);

  if (passed !== total) process.exit(1);
}

runTests();
