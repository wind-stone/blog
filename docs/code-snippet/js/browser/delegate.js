/**
 * 简单的事件代理实现
 * @param {*} element 作为代理的元素
 * @param {*} type 事件类型
 * @param {*} selector 被代理的选择器
 * @param {*} cb 事件处理函数
 */
function addEventDelegate(element, type, selector, cb) {
  element.addEventListener(type, evt => {
    let node = evt.target;
    const elements = element.querySelectorAll(selector);
    while (node && !contains(elements, node)) {
      node = node.parentNode;
      if (node === element) {
        return;
      }
    }
    node && cb(evt, node);
  });
}

// 判断祖先关系
function contains(container, contained) {
  if (contained) {
    while ((contained = contained.parentNode)) {
      if (contained === container) {
        return true;
      }
    }
  }
  return false;
}
