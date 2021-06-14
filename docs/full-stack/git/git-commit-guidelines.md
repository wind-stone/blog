# Git commit 规范

[[toc]]

Copy from [颜海镜 - 我的提交信息规范](https://yanhaijing.com/git/2016/02/17/my-commit-message/)

## 格式

提交信息包括三个部分：Header，Body 和 Footer。

```html
<Header>

<Body>

<Footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。

### Header

Header部分只有一行，包括两个字段：`type`（必需）和`subject`（必需）。

```html
<type>: <subject>
```

#### type

`type`用于说明`commit`的类别，可以使用如下类别：

- `feat`：新功能（`feature`）
- `fix`：修补 bug
- `doc`：文档（`documentation`）
- `style`：格式（不影响代码运行的变动）
- `refactor`：重构（即不是新增功能，也不是修改 bug 的代码变动）
- `test`：增加测试
- `chore`：构建过程或辅助工具的变动

#### subject

`subject`是`commit`目的的简短描述。

- 以动词开头，使用第一人称现在时，比如`change`，而不是`changed`或`changes`
- 第一个字母小写
- 结尾不加句号（。）

### Body

Body 部分是对本次`commit`的详细描述，可以分成多行。下面是一个范例。

```html
More detailed explanatory text, if necessary.  Wrap it to
about 72 characters or so.

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```

注意：应该说明代码变动的动机，以及与以前行为的对比。

### Footer

Footer 部分只用于两种情况：

- 关联 Issue
- 关闭 Issue

#### 关联 Issue

本次提交如果和摸个issue有关系则需要写上这个，格式如下：

```html
Issue #1, #2, #3
```

#### 关闭 Issue

如果当前提交信息解决了某个issue，那么可以在 Footer 部分关闭这个 issue，关闭的格式如下：

```html
Close #1, #2, #3
```

Reference: [Angular 团队提交规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

## 自动化验证提交信息

- `commit-msg`: 通过此钩子实现在`git commit`时去校验提交信息
- `commitlint`: 实际校验提交信息的工具，可自定义提交信息模板
- `husky`: 更加方便地使用 git hooks

Reference:

- [优雅的提交你的 Git Commit Message](https://juejin.im/post/5afc5242f265da0b7f44bee4)
- [github - commitlint](https://github.com/marionebl/commitlint)
- [github - husky](https://github.com/typicode/husky)
