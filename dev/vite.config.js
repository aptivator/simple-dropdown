import path           from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: './dist',
    assetsDir: '',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
