/**
 * @file vuejs 1.0 里，实现组件销毁时，删除初始化时添加的 文档点击事件
 * @author wind-stone@qq.com
 * @date 2017-02-22 11:00
 */

'use strict';

require('./index.less');

function contains (container, contained) {
    if (contained) {
        while (contained = contained.parentNode) {
            if (contained === container) {
                return true;
            }
        }
    }
    return false;
}

export default {
    ready: function () {

        // 添加 document 点击事件，点击组件之外的区域时执行某些操作
        document.addEventListener('click', this.getDocumentClickHandler(), false);
    },
    destroyed: function () {
        // 组件销毁之前，移除 docoment 上的 click 事件
        document.removeEventListener('click', this.getDocumentClickHandler());
    },
    methods: {
        /**
         * 获取文档点击处理程序
         * @return {Function} 文档点击处理程序
         */
        getDocumentClickHandler: function () {
            var vm = this;
            if (!this.clickDocumentHandler) {
                // 将文档点击处理函数挂载在组件实例上
                this.clickDocumentHandler = function clickDocumentHandler() {
                    // 如果点击组件内的元素，直接返回
                    if (!vm.$el || contains(vm.$el, event.target)) {
                        return;
                    }

                    // 执行某些操作
                    vm.doSomething();
                };
            }
            return this.clickDocumentHandler;
        }
    }
};