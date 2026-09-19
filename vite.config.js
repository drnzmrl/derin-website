import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },

  build: {
    rollupOptions: {
      output: {
        // three.js ayrı parçaya çıksın — ilk açılış hafif kalsın
        manualChunks: { three: ['three'] },
      },
    },
  },
})
