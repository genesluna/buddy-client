import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import boundaries from 'eslint-plugin-boundaries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        // Foundation layer - pure utilities, no entity dependencies
        { type: 'lib', pattern: 'app/_lib/**', mode: 'folder' },
        { type: 'types', pattern: 'app/_types/**', mode: 'folder' },
        { type: 'assets', pattern: 'app/_assets/**', mode: 'folder' },

        // Entity layer - domain models and API
        { type: 'entities', pattern: 'app/_entities/**', mode: 'folder' },

        // Component layer - shared UI components
        { type: 'components', pattern: 'app/_components/**', mode: 'folder' },

        // Hooks layer - shared hooks
        { type: 'hooks', pattern: 'app/_hooks/**', mode: 'folder' },

        // Widget layer - composed UI blocks
        { type: 'widgets', pattern: 'app/_widgets/**', mode: 'folder' },

        // Feature routes - can import from all layers
        {
          type: 'features',
          pattern: [
            'app/pet/**',
            'app/auth/**',
            'app/contact/**',
            'app/about/**',
          ],
          mode: 'folder',
        },

        // App root files
        { type: 'app', pattern: 'app/*.{ts,tsx}', mode: 'file' },
      ],
      'boundaries/include': ['app/**/*.ts', 'app/**/*.tsx'],
    },
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',

      // Boundary rules for hybrid FSD architecture
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // lib can only import from types (no entity dependencies)
            { from: 'lib', allow: ['types'] },

            // types cannot import from internal layers
            { from: 'types', allow: [] },

            // assets cannot import from internal layers
            { from: 'assets', allow: [] },

            // entities can import from lib and types
            { from: 'entities', allow: ['lib', 'types'] },

            // components can import from lib, types, assets
            { from: 'components', allow: ['lib', 'types', 'assets'] },

            // hooks can import from lib, types, entities
            { from: 'hooks', allow: ['lib', 'types', 'entities'] },

            // widgets can import from entities, components, hooks, lib, types, assets
            {
              from: 'widgets',
              allow: [
                'entities',
                'components',
                'hooks',
                'lib',
                'types',
                'assets',
              ],
            },

            // features can import from all layers
            {
              from: 'features',
              allow: [
                'entities',
                'components',
                'hooks',
                'widgets',
                'lib',
                'types',
                'assets',
              ],
            },

            // app root can import from all layers
            {
              from: 'app',
              allow: [
                'entities',
                'components',
                'hooks',
                'widgets',
                'lib',
                'types',
                'assets',
                'features',
              ],
            },
          ],
        },
      ],
    },
  },
  // Disable boundary rules for test files (tests naturally import across layers)
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'boundaries/element-types': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/scripts/**',
    ],
  },
];

export default eslintConfig;
