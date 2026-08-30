import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Automatic QR code sync plugin
const syncQrPlugin = () => ({
  name: 'sync-qr',
  buildStart() {
    const srcQr = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\0d2c8a7f-a9e8-49d4-a6d9-f260aad88668\\.user_uploaded\\media__1788068156204.jpg';
    const destQr = path.resolve(__dirname, 'src/assets/images/registration_qr_code.jpg');
    if (fs.existsSync(srcQr)) {
      try {
        fs.copyFileSync(srcQr, destQr);
        console.log('✅ QR Code synced successfully to src/assets/images/registration_qr_code.jpg!');
      } catch (err) {
        console.error('Error syncing QR code:', err);
      }
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    syncQrPlugin(),
    react(),
    tailwindcss()
  ],
})
