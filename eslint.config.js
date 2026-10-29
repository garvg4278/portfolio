import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser } },
    rules: { eqeqeq: 'error', 'prefer-const': 'error', 'no-var': 'error', 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', 'astro.config.mjs', 'eslint.config.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node } },
    rules: { eqeqeq: 'error', 'prefer-const': 'error', 'no-var': 'error', 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
];
