export default {
    // 开发环境
    '/frontend-fundamentals/frontend-engineering/': [
        {
            text: '前端开发环境',
            prefix: '/frontend-fundamentals/frontend-engineering/environment',
            children: [
                {
                    text: 'IDE',
                    prefix: 'ide',
                    children: ['vscode', 'code-sandbox'],
                },
                {
                    text: '代码仓库',
                    prefix: 'repository',
                    children: ['monorepo'],
                },
                {
                    text: '包管理工具',
                    prefix: 'package-manager',
                    children: [
                        'semantic-version',
                        {
                            text: 'npm',
                            prefix: 'npm',
                            collapsable: true,
                            children: [
                                '',
                                'npm-command',
                                'npmrc',
                                'npm-config',
                                'npm-scripts',
                                'package.json',
                                'package-lock.json',
                            ],
                        },
                        'pnpm/',
                        'koa',
                        'package-manager-tools',
                        'nodejs-packages',
                    ],
                },
            ],
        },

        {
            text: '前端开发技能',
            prefix: '/frontend-fundamentals/frontend-engineering/development-skills',
            children: [
                {
                    text: 'H5 开发',
                    prefix: 'h5',
                    children: ['', 'css-style', 'local-mock'],
                },
                {
                    text: 'Node 开发',
                    prefix: 'nodejs',
                    children: ['', 'commonjs', 'koa/', 'server', 'api', 'pm2'],
                },
            ],
        },

        {
            text: '前端开发流程工具',
            prefix: '/frontend-fundamentals/frontend-engineering/tools',
            children: [
                {
                    text: '构建工具',
                    prefix: 'build',
                    children: [
                        'source-map',
                        'rollup',
                        {
                            text: 'Webpack',
                            prefix: 'webpack',
                            children: [
                                '',
                                'webpack-runtime',
                                {
                                    text: 'Webpack 配置',
                                    prefix: 'config',
                                    collapsable: true,
                                    children: ['whole-config', 'practical-config', 'config-tools', 'dead-code'],
                                },
                                'webpack4-import',
                                {
                                    text: 'Tapable',
                                    prefix: 'tapable',
                                    collapsable: true,
                                    children: ['', 'tapable-readme'],
                                },
                            ],
                        },
                    ],
                },
                {
                    text: '运行时工具',
                    prefix: 'runtime',
                    children: ['axios'],
                },
                {
                    text: '发布相关工具',
                    children: ['publish/changelog'],
                },
                {
                    text: '风格指南',
                    prefix: 'style-guide',
                    children: [
                        {
                            text: '命名规范',
                            prefix: 'naming-conventions',
                            children: ['naming-references.md', 'js.md'],
                        },
                        {
                            text: 'ESLint',
                            prefix: 'code-formatter/eslint',
                            collapsable: true,
                            children: [
                                '',
                                'eslint-vscode',
                                'eslint-vue',
                                'eslint-prettier',
                                'how-to-write-a-custom-eslint-rule',
                            ],
                        },
                    ],
                },
            ],
        },
        {
            text: '前端稳定性建设',
            prefix: '/frontend-fundamentals/frontend-engineering/frontend-stability-construction',
            children: [
                '',
                'observable-system/',
                'full-link-monitoring/',
                'high-availability-architecture/',
                'performance/',
                'risk-management/',
                'processs-mechanism/',
                'engineering-construction/',
                {
                    text: '',
                    prefix: 'engineering-construction',
                    children: ['automated-testing'],
                },
                'summary',
            ],
        },
    ],
};
