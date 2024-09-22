import js from "@eslint/js";
import pluginVue from 'eslint-plugin-vue';
import globals from "globals";

export default [
    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        // "extends": [
        //     "@vue/typescript"
        // ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            "no-console": "warn",
            "no-unused-vars": "warn",
            "semi": "error",
            "no-multiple-empty-lines": [
                "error",
                {
                    "max": 2,
                    "maxEOF": 0,
                    "maxBOF": 0
                }
            ],
            "indent": [
                "error",
                4
            ],
            "quotes": [
                "error",
                "single"
            ]
        },
        ignores: [
            '!/docs/.vuepress'
        ]
    }
]
