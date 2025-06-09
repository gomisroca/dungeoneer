// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import vitest from 'eslint-plugin-vitest-globals';
import next from '@next/eslint-plugin-next';

export default [
  eslint.configs.recommended,

  {
    files: ['*.config.{js,cjs,mjs}', '**/*.config.{js,cjs,mjs}', '**/*.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
    plugins: { '@typescript-eslint': tseslint.plugin, prettier, vitest, next: next },
    rules: {
      // TypeScript rules
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',

      // General rules
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      'no-console': 'warn',
      'no-undef': 'off',

      // Next.js specific
      ...next.configs['core-web-vitals'].rules,
    },
  },

  { ignores: ['dist'] },
];
