# Changelog

## conventional-changelog-cli 自动生成日志

[conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)

```json
{
    "scripts": {
        // -p: 即 --preset，预置模板，比如 angular/atom/codemirror/conventionalcommits/ember/eslint/express/jquery/jshint
        // -i: 即 --infile，读取 CHANGELOG 的文件路径
        // -s, 即 --same-file，设置输出 CHANGELOG 的文件路径与读取 CHANGELOG 的文件路径一致，设置了此项，就不需要设置输出文件了
        // --commit-path: 设置目录，将只基于该目录范围去生成日志
        // --tag-prefix: 标签前缀，在读标签时，只读取该前缀的标签
        "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s  --commit-path=./ --tag-prefix=@ks/sso/"
    }
}
```

monorepo 项目里，需要为不同的子项目生成不同的 changelog，要解决两个问题：

1. `conventional-changelog-cli`在读取标签时，需要区分当前子项目的标签，可以用`--tag-prefix`选项指定子项目的标签前缀。
2. 生成 changelog 时，只应该关注当前子项目目录内的提交，而其他目录的提交应该忽略，可以用`--commit-path`选项设置只基于给定目录去生成 changelog。

可通过`conventional-changelog --help`查看所有可用选项
