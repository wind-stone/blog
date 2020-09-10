# less

## 最佳实践

### Mixins

#### 创建

创建 Mixins 必须加上`()`。如此，若不使用该 Mixins，则不会产生任何无用的代码，可以尽量减少最终的产出文件大小。

```less
// 不建议
.my-mixin {
  color: black;
}
// 推荐
.my-other-mixin() {
  background: white;
}
.class {
  .my-mixin();
  .my-other-mixin();
}
```

产出：

```css
.my-mixin {
  color: black;
}
.class {
  color: black;
  background: white;
}
```

#### 使用

尽管在使用 Mixins 时`()`是可选的，但强烈建议必须携带`()`。按照官方的提示，

```less
.a();
.a;    // currently works, but deprecated; don't use
.a (); // white-space before parentheses is also deprecated
```

#### mixins.less 文件

项目里建议创建一个全局的`mixins.less`文件，该文件里所有的 Mixins 声明时必须携带`()`。这样的话，引入`mixins.less`的文件仅在使用到 Mixins 时才会生成 Mixins 相关的代码，不使用的话就不会产生 Mixins 相关的代码，有效地减少了最终产出的 CSS 文件大小。

```less
// mixins.less
.my-mixin() {
  color: black;
}

.my-other-mixin() {
  background: white;
}
```

若是想将 Mixinx 作为常规规则使用，可在 Mixinx 上再封装一层。

```less
@import '~@/style/mixins.less';

.my-rule {
    .my-mixin();
}
```
