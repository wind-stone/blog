# 【中级】有如下 DOM 结构，要求仅补充 style 中的部分实现布局要求

布局要求

- `img`与`p`是横向排列在`div`中，相距`10px`
- `p`的宽度随着`div`的宽度变化而自适应变化
- 要求给出至少两种实现

```html
<style>
    img {
        width: 100px;
        height: 100px;
    }
    div {
        border: 1px solid;
        margin: 10px;
        padding: 10px;
    }
</style>
<div>
    <img
        class="profile"
        src="https://ali.static.yximgs.com/udata/pkg/cloudcdn/i/logo.ade3814.svg"
    />
    <p class="content">此处有无数多的内容</p>
</div>
```

参考答案：

1、flex 实现

```css
img {
    flex: none;    // 新增
    width: 100px;
    height: 100px;
}
div {
    display: flex; // 新增
    border: 1px solid;
    margin: 10px;
    padding: 10px;
}
p {
    margin-left: 10px; // 新增
}
```

2、float 实现

```css
img {
    float: left; // 新增
    width: 100px;
    height: 100px;
}
div {
    border: 1px solid;
    margin: 10px;
    padding: 10px;
    overflow: hidden;
}
p {
    margin-left: 110px; // 新增
}
```

