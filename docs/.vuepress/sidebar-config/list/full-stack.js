module.exports = {
    '/full-stack/': [
        {
            text: 'Linux',
            children: [
                '/full-stack/linux/',
                '/full-stack/linux/shell',
                '/full-stack/linux/linux-command',
                '/full-stack/linux/environment-variables.md',
                '/full-stack/linux/glob',
            ]
        },
        {
            text: 'Git',
            children: [
                '/full-stack/git/',
                '/full-stack/git/git-command',
                '/full-stack/git/git-commit-guidelines',
                '/full-stack/git/gitlab',
            ]
        },
        {
            text: 'Nginx',
            children: [
                '/full-stack/nginx/',
                '/full-stack/nginx/practices',
                '/full-stack/nginx/nginx-conf',
                '/full-stack/nginx/ngx_http_proxy_module',
                '/full-stack/nginx/ngx_http_upstream_module'
            ]
        },
        {
            text: '数据管理',
            children: [
                '/full-stack/data-management/kafka/',
                {
                    text: '数据查询与展示',
                    children: [
                        '/full-stack/data-management/data-observability/sql',
                        '/full-stack/data-management/data-observability/grafana',
                        '/full-stack/data-management/data-observability/clickhouse',
                    ]
                },
                '/full-stack/data-management/mongodb',
            ]
        },
        {
            text: '后端',
            children: [
                '/full-stack/backend/nestjs/',
            ]
        },
        {
            text: '其他',
            children: [
                '/full-stack/others/google-cloud'
            ]
        },
    ]
};
