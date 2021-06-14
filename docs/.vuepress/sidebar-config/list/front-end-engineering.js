module.exports = {
    // MVVM
    '/front-end-engineering/': [
        {
            title: '项目工程',
            collapsable: false,
            children: [
                'project/init',
                'project/naming-convention/js-naming',
                'project/h5-project',
            ]
        },
        {
            title: 'HTTP Clients',
            collapsable: false,
            children: [
                'http-clients/axios'
            ]
        },
        {
            title: '构建',
            collapsable: false,
            children: [
                'build/webpack/',
                'build/webpack/config',
                'build/webpack/webpack-runtime',
                'build/webpack/webpack4-import',
                'build/webpack/practices',
                'build/webpack/tapable/',
                'build/webpack/tapable/tapable-readme',
                'build/rollup',
                'build/source-map',
            ]
        },
        {
            title: 'MVVM',
            collapsable: false,
            children: [
                'mvvm/virtual-dom/'
            ]
        },
        {
            title: 'Node',
            collapsable: false,
            children: [
                'node/',
                'node/commonjs',
                'node/koa/',
                'node/server',
                'node/pm2',
            ]
        },
        {
            title: 'NPM',
            collapsable: false,
            children: [
                'npm/',
                'npm/npm-command',
                'npm/npmrc',
                'npm/npm-config',
                'npm/npm-scripts',
                'npm/package.json',
                'npm/package-lock.json',
                'npm/third-party-package'
            ]
        },
        {
            title: '代码格式化',
            collapsable: false,
            children: [
                'code-formatter/eslint/',
                'code-formatter/eslint/eslint-vscode',
                'code-formatter/eslint/eslint-vue',
                'code-formatter/eslint/eslint-prettier'
            ]
        },
        {
            title: '代码编辑器',
            collapsable: false,
            children: [
                'code-editors/vscode',
            ]
        }
    ]
};
