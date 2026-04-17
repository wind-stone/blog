import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vueParser from 'vue-eslint-parser';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// 兼容写法：手动从 import.meta.url 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
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
            semi: 'error',
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
            // 1. 使用 vue-eslint-parser 解析 .vue 文件
            parser: vueParser,
            parserOptions: {
                // 2. 告诉 vue-parser，脚本部分使用 ts 解析器
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                // 如果需要类型检查，可以加上 project: './tsconfig.json'
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            // 'vue': pluginVue, // 如果有使用 vue 插件
        },
        rules: {
            // 在这里定义 Vue 或 TS 相关的规则
            // 注意：关闭 JS 的 no-unused-vars，开启 TS 的版本以避免冲突
            // 'no-unused-vars': 'off',
            // '@typescript-eslint/no-unused-vars': ['error'],
        },
    },

    // 针对纯 TypeScript 文件 (.ts, .tsx) 的配置
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json', // 指向你的 tsconfig
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            // 'no-unused-vars': 'off',
            // '@typescript-eslint/no-unused-vars': ['error'],
        },
    },
];
