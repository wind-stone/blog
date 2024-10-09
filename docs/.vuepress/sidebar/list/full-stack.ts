export default {
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
            prefix: '/full-stack/data-management/data-observability',
            children: [
                'sql',
                'clickhouse',
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
            prefix: '/full-stack/operating-system/linux',
            children: [
                '',
                'shell',
                'linux-command',
                'environment-variables.md',
                'glob',
            ]
        },
        {
            text: 'Git',
            prefix: '/full-stack/operating-system/git',
            children: [
                '',
                'git-command',
                'git-commit-guidelines',
                'gitlab',
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
            prefix: '/full-stack/software/nginx',
            children: [
                '',
                'practices',
                'nginx-conf',
                'ngx_http_proxy_module',
                'ngx_http_upstream_module'
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
