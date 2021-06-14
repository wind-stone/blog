# 事件

## mouseover/mouseout 与 mouseenter/mouseleave 的区别

- `mouseover`/`mouseout`
  - 指针移动到/离开元素或离开元素的后代（即使指针仍在元素内）会触发。
  - 当指针从它的子元素上移动到它上时会触发。
  - 事件被发送到 DOM 树的最深层元素，然后它将层次结构向上冒泡，直到它被处理程序取消或到达根目录。
- `mouseenter`/`mouseleave`
  - 指针移动到/离开元素及其所有后代时触发。
  - 不会冒泡，即当指针从它的子元素上移动到它上时不会触发。
  - 会向层次结构的每个元素发送一个`mouseenter`/`mouseleave`事件，无论各层级元素的事件处理程序是否取消。
