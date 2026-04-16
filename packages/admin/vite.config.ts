import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 自定义 Vite 插件：构建完成后清理 dist/assets 中的过期旧文件。
 * Custom Vite plugin: after build, remove stale files in dist/assets.
 *
 * 工作原理 / How it works:
 *   1. generateBundle 钩子在 Rollup 生成产物时触发，把本次构建的所有输出文件名记录下来。
 *      generateBundle hook fires when Rollup writes output; we record every filename produced.
 *   2. closeBundle 钩子在整个构建流程结束时触发，扫描 dist/assets 目录，
 *      把不在记录集合中的文件（即上一次构建遗留的旧 chunk）删除。
 *      closeBundle hook fires after the build finishes; we scan dist/assets and
 *      delete any file that was NOT produced by the current build (i.e. stale old chunks).
 *
 * 为什么需要这个插件 / Why this plugin is needed:
 *   配置了 emptyOutDir: false 后，Vite 不再在构建前清空 dist 目录，
 *   这使得内容未变的文件可以直接复用（hash 不变 → 文件名不变 → 浏览器缓存命中）。
 *   但副作用是：某个文件内容改变后会产生一个新 hash 的新文件，而旧文件仍然残留在 dist 中。
 *   此插件负责在每次构建结束后把这些"僵尸文件"清理掉。
 *
 *   With emptyOutDir: false, Vite no longer wipes dist before building.
 *   This lets unchanged files be reused (same hash → same filename → browser cache hit).
 *   Side effect: when a file's content changes, a new-hash file is created but the old one
 *   remains on disk. This plugin cleans up those "zombie files" after every build.
 */
function cleanStaleChunks(): Plugin {
  // 用 Set 记录本次构建实际产出的所有文件路径（相对于 dist/）
  // A Set that will hold every output file path (relative to dist/) produced in this build
  const generated = new Set<string>()

  return {
    name: 'clean-stale-chunks',

    /**
     * generateBundle 是 Rollup 插件钩子，在所有 chunk 和 asset 生成完毕、
     * 即将写入磁盘时触发。参数 bundle 是一个对象，key 为输出文件的相对路径，
     * 例如 "assets/antd-vendor-BOdui319.js"。
     *
     * generateBundle is a Rollup plugin hook that fires after all chunks and assets
     * are generated, just before they are written to disk. The `bundle` parameter is
     * a map whose keys are the output file paths relative to outDir,
     * e.g. "assets/antd-vendor-BOdui319.js".
     */
    generateBundle(_, bundle) {
      for (const fileName of Object.keys(bundle)) {
        // 将每个产出文件的路径加入集合，供 closeBundle 阶段比对使用
        // Add each output file path to the set for comparison in closeBundle
        generated.add(fileName)
      }
    },

    /**
     * closeBundle 是 Rollup 插件钩子，在构建流程全部完成（文件已写入磁盘）后触发。
     * 此时 dist/assets 中同时存在：本次构建的新文件 + 上次构建遗留的旧文件。
     * 我们遍历目录，凡是不在 generated 集合中的文件，均视为旧文件予以删除。
     *
     * closeBundle fires after the entire build is done and all files have been written.
     * At this point dist/assets contains both the new files from this build and any
     * leftover files from previous builds. We iterate the directory and delete anything
     * that is NOT in the `generated` set — those are the stale files.
     */
    closeBundle() {
      // 将 import.meta.url 转换为文件系统路径，再拼接出 dist/assets 的绝对路径
      // Convert import.meta.url to a filesystem path, then resolve dist/assets absolute path
      const assetsDir = path.resolve(
        fileURLToPath(new URL('./dist/assets', import.meta.url))
      )

      // 如果 dist/assets 不存在（首次构建前），直接跳过，避免报错
      // Skip if dist/assets doesn't exist yet (e.g. very first build before dist is created)
      if (!fs.existsSync(assetsDir)) return

      let removed = 0

      // 读取 dist/assets 下的所有文件名，逐一检查
      // Read all filenames in dist/assets and check each one
      for (const file of fs.readdirSync(assetsDir)) {
        // 拼成与 bundle key 相同格式的相对路径，例如 "assets/old-chunk-Abc123.js"
        // Build the same relative path format as bundle keys, e.g. "assets/old-chunk-Abc123.js"
        const relative = `assets/${file}`

        if (!generated.has(relative)) {
          // 不在本次构建产物中 → 是上次遗留的旧文件，删除它
          // Not produced in this build → leftover from a previous build, delete it
          fs.unlinkSync(path.join(assetsDir, file))
          // \x1b[33m 黄色，\x1b[0m 重置颜色 / \x1b[33m yellow, \x1b[0m reset color
          console.log(`\x1b[33m[clean]\x1b[0m removed stale: ${relative}`)
          removed++
        }
      }

      if (removed === 0) {
        // 绿色提示：本次构建没有发现需要清理的旧文件
        // Green notice: no stale files were found this time
        console.log('\x1b[32m[clean]\x1b[0m no stale files found')
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 自动导入 Vue 3 Composition API / Auto-import Vue 3 Composition API
      imports: ['vue', 'vue-router', 'pinia'],
      // 生成类型声明文件，供 TypeScript 识别 / Generate type declaration file for TypeScript
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: true },
    }),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
      // 输出到 src/ 使 tsconfig 能扫描到 / Output to src/ so tsconfig can scan it
      dts: 'src/components.d.ts',
    }),
     legacy({
      targets: ['> 1%', 'last 2 versions', 'not dead'],
    }),
    // 打包分析，生成 dist/stats.html / Bundle analysis, generates dist/stats.html
    visualizer({ open: true, filename: 'dist/stats.html', gzipSize: true }),
    cleanStaleChunks()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/a/':fileURLToPath(new URL('./src/assets', import.meta.url))
    }
  },
  build:{
    // 不在构建前清空 dist，由 cleanStaleChunks 插件精确删除旧文件
    // Don't wipe dist before build; cleanStaleChunks handles precise removal
    emptyOutDir: false,
    rollupOptions:{
      output:{
        manualChunks:{
          'vue-vendor':['vue','vue-router','pinia'],
          'antd-vendor':['ant-design-vue'],
          'antd-icons':['@ant-design/icons-vue']
        }
      }
    }
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
