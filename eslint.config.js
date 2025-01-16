import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  // Configuration for regular React files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      // Combine browser globals with custom test globals
      globals: {
        ...globals.browser,
        // Add our test globals here
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        render: 'readonly',
        screen: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
        userEvent: 'readonly',
        within: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Specific configuration for test files
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Test-specific globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        render: 'readonly',
        screen: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
        userEvent: 'readonly',
        within: 'readonly'
      }
    },
    // You can add test-specific rules here
    rules: {
      // Disable certain rules that might interfere with tests
      'react/display-name': 'off',
      'react/prop-types': 'off'
    }
  }
]