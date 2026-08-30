import fs from 'fs';
import path from 'path';

const srcPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\0d2c8a7f-a9e8-49d4-a6d9-f260aad88668\\.user_uploaded\\media__1788068156204.jpg';
const destPath = 'c:\\Users\\ADMIN\\Desktop\\spine surgens\\src\\assets\\images\\registration_qr_code.jpg';

try {
  fs.copyFileSync(srcPath, destPath);
  console.log('✅ QR code copied successfully!');
} catch (err) {
  console.error('❌ Error copying QR code:', err);
}
