/**
 * @file 搜索框组件
 * @author wind-stone@qq.com
 * @date 2016-11-24 21:00
 */
'use strict';
import './index.less';
export default {
    template: require('./index.tpl.html'),
    data: function () {
        return {
            keyword: ''
        };
    },
    props: {
        placeholder: {
            type: String,
            require: false,
            default: function () {
                return '请搜索查询词';
            }
        },
        // 搜索按钮类型，文字为"text"、图标为"img"
        btnType: {
            type: String,
            require: false,
            default: 'text'
        }
    },
    ready: function () {

    },
    methods: {
        /**
         * 处理回车事件
         */
        handleEnterKey(event) {
            if(event.keyCode === 13) {
                this.search();
                event.target.blur();
            }
        },

        /**
         * 触发搜索事件
         */
        search() {
            this.$emit('vue-searchbox-search', this.keyword);
        }
    }
};