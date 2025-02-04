import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default {
  server: {
    port: 8080,
    proxy: {
      '/src/main.tsx': {
        target: 'https://abdeelfarouah.github.io',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    process.env.NODE_ENV === 'development' &&
    componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};