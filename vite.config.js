import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        open: true
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                register: resolve(__dirname, 'register.html'),
                checkout: resolve(__dirname, 'checkout.html'),
                success: resolve(__dirname, 'success.html')
            }
        }
    }
});
