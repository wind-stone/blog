module.exports = {
  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended' // eslint-plugin-vue
  ],
  parser: 'vue-eslint-parser',
  // If you want to use custom parsers such as babel-eslint or @typescript-eslint/parser, you have to use parserOptions.parser option instead of parser option. Because the eslint-plugin-vue plugin requires vue-eslint-parser to parse .vue files, so the eslint-plugin-vue plugin doesn't work if you overwrote parser option.
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 0,
    'semi': 2,
    'no-multiple-empty-lines': [2, {
        'max': 2,
        'maxEOF': 0,
        'maxBOF': 0
    }],
    'indent': [2, 2],
    'quotes': [2, 'single'],

    // eslint-plugin-vue
    'vue/html-indent': [2, 4],
    'vue/singleline-html-element-content-newline': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    'vue/this-in-template': [2, 'never'],
    'vue/html-self-closing': 0,
    'vue/attribute-hyphenation': 0
  }
};
