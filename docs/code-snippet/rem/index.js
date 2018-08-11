/**
 * @file 初始化页面时设置 html 元素的 font-size 为屏幕宽度的 1/10
 *       即屏幕宽度 = 10rem
 * @author: wind-stone<wind-stone@qq.com>
 */
;(function (window) {
    var document = window.document;
    var rootElement = document.documentElement;

    if (document.readyState === 'complete') {
        setBodyFontSize();
    } else {
        document.addEventListener('DOMContentLoaded', completed, false);
        document.addEventListener('load', completed, false);
    }

    setRootElementFontSize();

    /**
     * 设置 html 根元素的 font-size
     */
    function setRootElementFontSize() {
        var rootElementWidth = rootElement.getBoundingClientRect().width;
        var pxPerRem = rootElementWidth / 10;
        rootElement.style.fontSize = pxPerRem + 'px';
    }

    /**
     * 设置 body 元素的 font-size（以便继承 font-size）
     */
    function setBodyFontSize() {
        document.body.style.fontSize = '12px';
    }

    /**
     * DOMContentLoaded/load 完成之后执行
     */
    function completed() {
        document.removeEventListener("DOMContentLoaded", completed);
        document.removeEventListener("load", completed);
        setBodyFontSize();
    }
})(window);