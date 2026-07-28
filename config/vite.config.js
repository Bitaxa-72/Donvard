import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import injectHTML from 'vite-plugin-html-inject'

const projectRoot = fileURLToPath(
  new URL('.', import.meta.url)
)
const workspaceRoot = resolve(projectRoot, '..')

export default defineConfig({
  publicDir: resolve(workspaceRoot, 'public'),
  server: {
    port: 3030
  },
  plugins: [injectHTML()],
  build: {
    outDir: resolve(workspaceRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(workspaceRoot, 'index.html'),
        catalog: resolve(workspaceRoot, 'catalog.html'),
        category: resolve(workspaceRoot, 'category.html'),
        productPage: resolve(
          workspaceRoot,
          'product-page.html'
        ),
        productPageOutOfStock: resolve(
          workspaceRoot,
          'product-page-out-of-stock.html'
        ),
        cart: resolve(workspaceRoot, 'cart.html'),
        checkout: resolve(workspaceRoot, 'checkout.html'),
        account: resolve(workspaceRoot, 'lk.html'),
        notFound: resolve(workspaceRoot, '404.html')
      }
    }
  }
})
