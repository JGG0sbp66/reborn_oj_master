import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.vite/**',
      'public/**',
      'yao/**',
      '*.log',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // —— 逐步收紧策略：存量问题先 warn，新增代码不允许再犯 ——
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // 历史组件名（foot / login / rank 等单词组件）较多，先关闭
      'vue/multi-word-component-names': 'off',
      // 巨型组件的 v-html 渲染题库 markdown，属既有设计
      'vue/no-v-html': 'off',
    },
  },
  // 与 Prettier 冲突的规则一律关闭（必须放最后）
  eslintConfigPrettier,
)
