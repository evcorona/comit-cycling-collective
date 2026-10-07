import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import preferArrow from 'eslint-plugin-prefer-arrow'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'prefer-arrow': preferArrow,
      prettier: prettierPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  // Prettier owns formatting; disable ESLint rules that conflict with it.
  prettierConfig,
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      curly: ['error', 'multi'],
      'arrow-body-style': ['error', 'as-needed'],
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-var-requires': 'off',
      'func-style': 'off',
      'no-magic-numbers': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: 'Use absolute imports instead of relative imports',
            },
          ],
        },
      ],
      'prettier/prettier': 'off',
      'prefer-arrow/prefer-arrow-functions': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/boolean-prop-naming': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },
]
