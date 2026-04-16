import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'
import autoImportGlobals from './.eslintrc-auto-import.json' with { type: 'json' }

export default [
  // 忽略目录 / Ignored directories
  { ignores: ['dist/**', 'node_modules/**', 'src/auto-imports.d.ts', 'src/components.d.ts', 'components.d.ts', 'src/utils/test.js'] },

  // JS 基础规则 / Base JS rules
  js.configs.recommended,

  // TypeScript 规则 / TypeScript rules
  ...ts.configs.recommended,

  // Vue 3 规则 / Vue 3 rules
  ...pluginVue.configs['flat/recommended'],

  // 关闭与 Prettier 冲突的格式规则 / Disable rules that conflict with Prettier
  prettier,

  {
    plugins: { prettier: pluginPrettier },
    languageOptions: {
      parserOptions: {
        // Vue 文件用 vue-eslint-parser，TypeScript 由其内部处理
        // Vue files use vue-eslint-parser; TypeScript handled internally
        parser: ts.parser,
        extraFileExtensions: ['.vue'],
      },
      globals: {
        // 浏览器全局变量（console, window, document 等）/ Browser globals
        ...globals.browser,
        // unplugin-auto-import 自动生成的全局变量（ref, watch 等）/ Auto-import globals
        ...autoImportGlobals.globals,
      },
    },
    rules: {
      // Prettier 格式错误作为 ESLint 错误报出 / Report Prettier violations as ESLint errors
      'prettier/prettier': 'error',

      // Vue 相关 / Vue-specific
      'vue/multi-word-component-names': 'off',   // 单词组件名不强制 / Allow single-word names
      'vue/no-v-html': 'warn',                   // v-html 警告（XSS 风险）/ Warn on v-html (XSS)

      // TypeScript 相关 / TypeScript-specific
      '@typescript-eslint/no-explicit-any': 'warn',        // any 警告 / Warn on any
      '@typescript-eslint/no-unused-vars': ['warn', {      // 未使用变量 / Unused vars
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
]
