const defaultDesignWidth = 414;

/** 设置根元素的 font-size */
const setRootElementFontSize = (rootElement: HTMLElement, designWidth: number) => {
  designWidth = designWidth || defaultDesignWidth;
  const rootElementWidth = rootElement.getBoundingClientRect().width || rootElement.clientWidth;
  // 如果 designWidth 为 414，则整个屏幕宽度为 4.14 rem
  const pxPerRem = (100 * rootElementWidth) / designWidth;
  rootElement.style.fontSize = pxPerRem + 'px';
};

/** 设置 body 元素的 font-size（否则会继承 html 元素的 font-size） */
function setBodyFontSize(documentBody: HTMLElement) {
  documentBody.style.fontSize = '14px';
}

export default (function (window: Window) {
  const document = window.document;
  const rootElement = document.documentElement;

  return (designWidth: number) => {
    setBodyFontSize(document.body);
    setRootElementFontSize(rootElement, designWidth);

    const resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(
      resizeEvent,
      () => {
        setRootElementFontSize(rootElement, designWidth);
      },
      false,
    );
  };
})(window);

// 说明：除了调用上面的方法设置 html 的 font-size 外，还可以用一种简单的方式：直接将 html 的 font-size 设置为 4.14rem
// html {
//   font-size: calc(100vw / 4.14) !important;
// }

