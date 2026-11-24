#!/usr/bin/env node
/**
 * VINAXO CMS - Local Password Hash Generator
 * 
 * Sử dụng script này tại máy tính cá nhân để tạo chuỗi băm mật khẩu an toàn (scrypt).
 * Không chạy trên server công cộng, không chia sẻ mật khẩu gốc.
 * 
 * Cách dùng:
 *   node scripts/generate-password-hash.mjs "MatKhauCuaBan123@"
 * hoặc chạy không tham số để nhập mật khẩu tương tác:
 *   node scripts/generate-password-hash.mjs
 */

import crypto from 'crypto';
import readline from 'readline';

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`scrypt:${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

function generateRandomSecret() {
  return crypto.randomBytes(32).toString('hex');
}

async function run() {
  let password = process.argv[2];

  if (!password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    password = await new Promise((resolve) => {
      rl.question('Nhập mật khẩu quản trị muốn thiết lập: ', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    });
  }

  if (!password || password.length < 8) {
    console.error('\n❌ Lỗi: Mật khẩu phải có độ dài tối thiểu 8 ký tự!');
    process.exit(1);
  }

  const hash = await hashPassword(password);
  const sessionSecret = generateRandomSecret();

  console.log('\n============================================================');
  console.log('✅ ĐÃ TẠO MÃ BĂM MẬT KHẨU AN TOÀN CHO VINAXO CMS');
  console.log('============================================================');
  console.log('\nHãy sao chép 3 biến môi trường sau và dán vào Vercel Project Settings > Environment Variables:');
  console.log('------------------------------------------------------------');
  console.log(`ADMIN_USERNAME=admin`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`SESSION_SECRET=${sessionSecret}`);
  console.log('------------------------------------------------------------');
  console.log('\n🔒 Lưu ý bảo mật:');
  console.log('- Mật khẩu gốc KHÔNG được lưu trong mã nguồn.');
  console.log('- Chỉ sao chép giá trị băm (scrypt:...) lên Vercel.');
  console.log('============================================================\n');
}

export { hashPassword, generateRandomSecret };

if (process.argv[1] && process.argv[1].includes('generate-password-hash.mjs')) {
  run().catch(console.error);
}
