module.exports = {
    // 设计模式
    '/full-stack/design-patterns/': [
        {
            text: '设计模式',
            children: [
                '/full-stack/design-patterns/singleton-pattern',
            ]
        },
    ],

    // 数据管理
    '/full-stack/data-management': [
        {
            text: '数据生产和消费',
            children: [
                '/full-stack/data-management/kafka/',
            ]
        },
        {
            text: '数据查询与展示',
            children: [
                '/full-stack/data-management/data-observability/sql',
                '/full-stack/data-management/data-observability/grafana',
                '/full-stack/data-management/data-observability/clickhouse',
            ]
        },
        {
            text: '数据存储',
            children: [
                '/full-stack/data-management/mongodb',
            ]
        },
    ],

    // 操作系统相关
    '/full-stack/operating-system': [
        {
            text: 'Linux',
            children: [
                '/full-stack/operating-system/linux/',
                '/full-stack/operating-system/linux/shell',
                '/full-stack/operating-system/linux/linux-command',
                '/full-stack/operating-system/linux/environment-variables.md',
                '/full-stack/operating-system/linux/glob',
            ]
        },
        {
            text: 'Git',
            children: [
                '/full-stack/operating-system/git/',
                '/full-stack/operating-system/git/git-command',
                '/full-stack/operating-system/git/git-commit-guidelines',
                '/full-stack/operating-system/git/gitlab',
            ]
        },
        {
            text: 'Docker',
            children: [
                '/full-stack/operating-system/docker/',
            ]
        },
    ],

    // 开发相关的软件
    '/full-stack/software': [
        {
            text: 'Nginx',
            children: [
                '/full-stack/software/nginx/',
                '/full-stack/software/nginx/practices',
                '/full-stack/software/nginx/nginx-conf',
                '/full-stack/software/nginx/ngx_http_proxy_module',
                '/full-stack/software/nginx/ngx_http_upstream_module'
            ]
        },
    ],

    // 后端开发
    '/full-stack/backend': [
        {
            text: '后端',
            children: [
                '/full-stack/backend/nestjs/',
            ]
        },
    ],

    // 其他
    '/full-stack/others': [
        {
            text: '其他',
            children: [
                '/full-stack/others/google-cloud',
            ]
        },
    ]

};
