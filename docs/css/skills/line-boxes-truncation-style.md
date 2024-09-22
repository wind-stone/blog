# 行盒的截断样式

## 目标效果

<div>
rocky sharp influence lower with fed sets nearest topic block keep attached row camera secret very means string bite swung favorite voyage include below.<span style="background: linear-gradient(#d5e8b7, #bad6b3); border: 2px solid #7e876b; padding: 0 0.5em; border-radius: 5px; line-height: 30px; box-decoration-break: clone; -webkit-box-decoration-break: clone;">planet transportation habit bent cheese customs can modern sometime hidden tent letter evidence golden log shake appearance law doll glass end officer stand basket.</span>push oxygen possibly find largest individual experience our spirit crew fruit flower real course driving mind recent hollow month ahead written store continued leave.outer guide move leaf disease opinion grandfather cloud three typical dinner therefore lot with grass nervous wrapped share cowboy friendly fifteen brain lose naturally.
</div>

## 实际效果

```css
.highlight {
    padding: 0 0.5em;
    border: 2px solid #7e876b;
    border-radius: 5px;
    background: linear-gradient(#d5e8b7, #bad6b3);
}
```

给需要高亮的文本添加以上样式，得到的效果是这样：

<div>
rocky sharp influence lower with fed sets nearest topic block keep attached row camera secret very means string bite swung favorite voyage include below.<span style="background: linear-gradient(#d5e8b7, #bad6b3); border: 2px solid #7e876b; padding: 0 0.5em; border-radius: 5px; line-height: 30px;">planet transportation habit bent cheese customs can modern sometime hidden tent letter evidence golden log shake appearance law doll glass end officer stand basket.</span>push oxygen possibly find largest individual experience our spirit crew fruit flower real course driving mind recent hollow month ahead written store continued leave.outer guide move leaf disease opinion grandfather cloud three typical dinner therefore lot with grass nervous wrapped share cowboy friendly fifteen brain lose naturally.
</div>

其原因是，行盒是随着文字走的，在文字换行的地方，行盒会被截断，导致高亮文本被截断。

## 最终实现

```css
.highlight {
    padding: 0 0.5em;
    border: 2px solid #7e876b;
    border-radius: 5px;
    background: linear-gradient(#d5e8b7, #bad6b3);

    /* 新增属性 */
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
```

详见：[MDN - box-decoration-break 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-decoration-break)
