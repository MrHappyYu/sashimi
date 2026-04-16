import { createRequire } from 'module'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'

const require = createRequire(import.meta.url)
const uni = require('@dcloudio/vite-plugin-uni').default

// Copy static directory to dist after build
function copyStatic() {
  return {
    name: 'copy-static',
    closeBundle() {
      const src = resolve('./src/static')
      const dest = resolve('./dist/static')
      copyDir(src, dest)
    }
  }

  function copyDir(src, dest) {
    mkdirSync(dest, { recursive: true })
    for (const item of readdirSync(src)) {
      const srcPath = `${src}/${item}`
      const destPath = `${dest}/${item}`
      if (statSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath)
      } else {
        copyFileSync(srcPath, destPath)
      }
    }
  }
}

export default defineConfig({
  plugins: [uni(), copyStatic()]
})
