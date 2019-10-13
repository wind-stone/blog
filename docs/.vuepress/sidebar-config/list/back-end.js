module.exports = {
    // Back End
    '/back-end/': [
        {
            title: 'Node',
            collapsable: false,
            children: [
                'node/',
                'node/pm2',
                'node/koa/',
                'node/commonjs',
                'node/package.json',
                'node/package-lock.json',
                'node/third-party-package'
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
                'npm/npm-scripts'
            ]
        }
    ]
}
