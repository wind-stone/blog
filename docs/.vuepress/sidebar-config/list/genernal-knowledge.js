module.exports = {
    // General Knowledge
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
            title: 'Nginx',
            collapsable: true,
            children: [
                'nginx/',
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
            title: 'Server',
            collapsable: true,
            children: [
                'server/'
            ]
        },
        {
            title: '其他',
            collapsable: true,
            children: [
                'others/glob',
                'others/google-cloud'
            ]
        }
    ]
}
