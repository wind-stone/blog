import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import * as tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vueParser from 'vue-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        ignores: ['docs/.vuepress/dist/**', 'node_modules/**', 'docs/.vuepress/components/webgl-programming-guide/lib/**'],
    },
    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'warn',
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 2,
                    maxEOF: 0,
                    maxBOF: 0,
                },
            ],
        },
        ignores: ['!/docs/.vuepress'],
    },

    // 针对 Vue 文件 (.vue) 的配置
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            'vue/multi-word-component-names': [
                'error',
                {
                    ignores: ['index', 'example', 'simple'],
                },
            ],
        },
    },

    // 针对纯 TypeScript 文件 (.ts, .tsx) 的配置
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
    },

    // components 目录是 demo 代码，允许 console.log
    {
        files: ['docs/.vuepress/components/**/*.{js,ts,vue}'],
        rules: {
            'no-console': 'off',
        },
    },

    // Prettier 配置放在最后，关闭与 Prettier 冲突的 ESLint 规则
    eslintConfigPrettier,
];
