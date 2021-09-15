module.exports = {
    '/full-stack/': [
        {
            title: 'Linux',
            collapsable: false,
            children: [
                'linux/',
                'linux/shell',
                'linux/linux-command',
                'linux/environment-variables.md',
                'linux/glob',
            ]
        },
        {
            title: 'Git',
            collapsable: false,
            children: [
                'git/',
                'git/git-command',
                'git/git-commit-guidelines',
                'git/gitlab',
            ]
        },
        {
            title: 'Nginx',
            collapsable: false,
            children: [
                'nginx/',
                'nginx/practices',
                'nginx/nginx-conf',
                'nginx/ngx_http_proxy_module',
                'nginx/ngx_http_upstream_module'
            ]
        },
        {
            title: '数据管理',
            collapsable: false,
            children: [
                'data-management/kafka/',
                'data-management/clickhouse',
                'data-management/mongodb',
            ]
        },
        {
            title: '后端',
            collapsable: false,
            children: [
                'backend/nestjs/',
            ]
        },

        {
            title: '基础算法',
            collapsable: false,
            children: [
                'algorithm/binary-search/',
                'algorithm/sorting-algorithm/bubble-sort/',
                'algorithm/sorting-algorithm/selection-sort/',
                'algorithm/sorting-algorithm/insertion-sort/',
                'algorithm/sorting-algorithm/merge-sort/',
                'algorithm/sorting-algorithm/quick-sort/'
            ]
        },
        {
            title: '其他',
            collapsable: false,
            children: [
                'others/google-cloud',
                'others/translation'
            ]
        },
    ]
};
