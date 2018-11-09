# display 属性

## inline-block

### baseline 的确定

> The baseline of an 'inline-block' is the baseline of its last line box in the normal flow, unless it has either no in-flow line boxes or if its 'overflow' property has a computed value other than 'visible', in which case the baseline is the bottom margin edge. -- [https://www.w3.org/TR/CSS21/visudet.html#line-height](https://www.w3.org/TR/CSS21/visudet.html#line-height)

翻译成中文：

> ‘inline-block’的基线是正常流中最后一个line box的基线, 除非，这个line box里面既没有line boxes或者本身’overflow’属性的计算值而不是’visible’, 这种情况下基线是margin底边缘。

简单说就是：一个`inline-block`元素，如果里面没有`inline`内联元素，或者`overflow`不是`visible`，则该元素的基线就是其`margin`底边缘，否则，其基线就是元素里面最后一行内联元素的基线。
