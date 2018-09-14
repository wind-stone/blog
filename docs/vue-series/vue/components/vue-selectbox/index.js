/**
 * @file 下拉列表组件
 * @author wind-stone@qq.com
 * @date 2017-02-22 11:00
 */
require('./index.less');

/**
 * 检查一个DOM元素是另一个DOM元素的后代
 * @param  {Element} container DOM容器元素
 * @param  {Element} contained DOM元素
 * @return {Boolean}           是否是后代
 */
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
    template: require('./index.tpl.html'),
    props: {
        // 是否禁用组件
        disabled: {
            type: Boolean,
            require: false,
            default: false
        },
        // 下拉框选项数组
        options: {
            type: Array,
            require: false,
            default: function () {
                return [];
            }
        },
        // 下拉框默认展示文本
        placeholder: {
            type: String,
            require: false,
            default: '请选择'
        },
        // 默认 option 对应的 value 值
        value: {
            require: false
        },
        // 改写默认的显示值和 value
        keys: {
            type: Object,
            require: false,
            default: function () {
                return {
                    label: 'label',
                    value: 'value'
                };
            }
        }
    },
    data: function () {
        return {
            isShowOptionsArea: false,
            watchHandlers: []
        };
    },
    computed: {
        ifDisabled: function () {
            return this.disabled || this.options.length === 0;
        }
    },
    ready: function () {

        // 添加 document 事件，点击组件之外的区域，则关闭下拉选择框
        document.addEventListener('click', this.getDocumentClickHandler(), false);

        this.setDefaultOption('init');
    },
    destroyed: function () {
        // 组件销毁之前，移除 docoment 上的 click 事件
        document.removeEventListener('click', this.getDocumentClickHandler());
    },
    watch: {
        value: {
            handler: function () {
                this.addWathchHandler(this.setDefaultOption);
            },
            deep: true
        },
        options: {
            handler: function () {
                this.addWathchHandler(this.setDefaultOption);
            },
            deep: true
        }
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
                    vm.hideOptionsArea();
                };
            }
            return this.clickDocumentHandler;
        },

        /**
         * 添加数据监听事件
         * @param {Function} fn 数据监听事件
         */
        addWathchHandler: function (fn) {
            var vm = this;
            if (this.watchHandlers.indexOf(fn) === -1) {
                this.watchHandlers.push(fn);
            }
            // 在下一事件循环中执行数据监听事件
            this.$nextTick(function () {
                var i, len = vm.watchHandlers.length;
                for (i = 0; i < len; i++) {
                    vm.watchHandlers.shift().call(vm);
                }
            });
        },

        /**
         * 设置默认的 option
         */
        setDefaultOption: function () {
            var options = this.options,
                option,
                i, len;

            if (this.value && options.length) {
                for (i = 0, len = options.length; i < len; i++) {
                    if (options[i][this.keys.value] === this.value) {
                        option = options[i];
                        this.selectOption(option);
                        break;
                    }
                }
            }
        },

        /**
         * 隐藏下拉框列表
         */
        hideOptionsArea: function () {
            this.isShowOptionsArea = false;
        },

        /**
         * 切换显示下拉框列表
         */
        toggleOptionsArea: function () {
            if (this.ifDisabled) {
                return;
            }
            this.isShowOptionsArea = !this.isShowOptionsArea;
        },

        /**
         * 选择下拉项
         * @param  {Object}  option             下拉项对象
         */
        selectOption: function (option) {
            this.placeholder = option[this.keys.label];
            this.hideOptionsArea();
            this.$emit('vue-selectbox-select', option);
        }
    }
};