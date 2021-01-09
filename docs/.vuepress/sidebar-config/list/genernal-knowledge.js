module.exports = {
    '/general-knowledge/': [
        {
            title: 'CLI',
            collapsable: true,
            children: [
                'cli/',
                'cli/command'
            ]
        },
        {
            title: 'Git',
            collapsable: true,
            children: [
                'git/git-command',
                'git/git-commit-guidelines',
                'git/gitlab',
                'git/'
            ]
        },
        {
            title: 'Node',
            collapsable: true,
            children: [
                'node/',
                'node/pm2',
                'node/koa/',
                'node/server',
                'node/commonjs',
                'node/third-party-package'
            ]
        },
        {
            title: 'NPM',
            collapsable: true,
            children: [
                'npm/',
                'npm/npm-command',
                'npm/npmrc',
                'npm/npm-config',
                'npm/npm-scripts',
                'npm/package.json',
                'npm/package-lock.json',
            ]
        },
        {
            title: 'Nginx',
            collapsable: true,
            children: [
                'nginx/',
                'nginx/practices',
                'nginx/nginx-conf',
                'nginx/ngx_http_proxy_module',
                'nginx/ngx_http_upstream_module'
            ]
        },
        {
            title: 'Network',
            collapsable: true,
            children: [
                'network/dns'
            ]
        },
        {
            title: '其他',
            collapsable: true,
            children: [
                'others/glob',
                'others/google-cloud',
                'others/kafka/',
                'others/translation'
            ]
        },
    ]
};
