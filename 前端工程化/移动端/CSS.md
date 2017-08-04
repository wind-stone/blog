# 属性篇

## pointer-events: none
设置元素不成为鼠标事件的target


## -webkit-overflow-scrolling: touch

取值 | 说明
-- | --
auto | Use "regular" scrolling, where the content immediately ceases to scroll when you remove your finger from the touchscreen.
touch | Use momentum-based scrolling, where the content continues to scroll for a while after finishing the scroll gesture and removing your finger from the touchscreen. The speed and duration of the continued scrolling is proportional to how vigorous the scroll gesture was. Also creates a new stacking context.