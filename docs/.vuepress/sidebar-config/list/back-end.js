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
        'npm/npm-scripts',
        'npm/package.json',
        'npm/package-lock.json',
      ]
    }
  ]
};
