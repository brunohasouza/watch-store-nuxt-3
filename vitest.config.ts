import vue from '@vitejs/plugin-vue'
import { alias } from './alias'

export default {
  plugins: [vue()],
  root: '.',
  esbuild: {
    tsconfigRaw: '{}',
  },
  resolve: {
    alias,
  },
  test: {
    environment: 'happy-dom',
  },
}
