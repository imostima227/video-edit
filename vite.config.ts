import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@data': path.resolve(__dirname, './src/data_manage'),
      '@type': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    }
  },
  server: {
    // 必须开启跨域隔离，否则 @ffmpeg/ffmpeg 运行时会报错
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  }
});