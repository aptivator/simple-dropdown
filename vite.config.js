import path           from 'path';
import {defineConfig} from 'vite';
import {libraryName}  from './src/_lib/vars';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: libraryName,
      fileName: (format) => `${libraryName}.${format}.js`
    },
    rollupOptions: {
      external: ['var-trap'],
      output: {
        globals: {
          'var-trap': 'varTrap'
        }
      }
    }
  }
});
