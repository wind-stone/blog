/**
 * @file 下拉列表组件
 * @author wind-stone@qq.com
 * @date 2017-01-11 21:00
 */

import vueSelectboxComponent from '../vue-selectbox';
import './index.less';

export default {
    template: require('./index.tpl.html'),
    components: {
        'vue-selectbox': vueSelectboxComponent
    },
    props: {

        // 级联选择数据
        cascadeOptions: {
            type: Array,
            require: true
        },

        // 默认展示文本对象
        placeholder: {
            type: Object,
            require: false,
            default: function () {
                return {
                    primaryPlaceholder: '请选择1',
                    secondaryPlaceholder: '请选择2'
                };
            }
        },

        // 默认选择对象
        value: {
            type: Object,
            require: false,
            default: function () {
                return {
                    primaryValue: '',
                    secondaryValue: ''
                };
            }
        },

        // 改写默认的显示值和 value
        keys: {
            type: Object,
            require: false,
            default: function () {
                return {
                    label: 'label',
                    value: 'value',
                    subType: 'subType'
                };
            }
        },
    },
    data: function () {
        return {
            // 一级类型，供输出用
            primaryType: {},

            // 二级类型列表
            secondaryTypeList: [
            ]
        };
    },
    ready: function () {
        // this.setDefaultType();
    },
    watch: {
    },
    methods: {
        /**
         * 选择一级类型
         * @param  {Object} primaryType        一级类型对象
         */
        selectPrimaryType: function (primaryType, type) {
            this.primaryType = primaryType;
            this.secondaryTypeList = primaryType[this.keys.subType];

            var secondaryType;
            var i, len, secondaryTypeItem;
            var secondaryValue = this.value.secondaryValue;

            if (this.secondaryTypeList.length) {
                // 如果存在默认二级类型，且二级类型存在，选在该二级类型
                if (secondaryValue) {
                    for (i = 0, len = primaryType[this.keys.subType].length; i < len; i++) {
                        secondaryTypeItem = primaryType[this.keys.subType][i];
                        if (secondaryTypeItem[this.keys.value] === secondaryValue) {
                            secondaryType = secondaryTypeItem;
                            break;
                        }
                    }
                    if (secondaryType) {
                        this.$refs.secondarySelectbox.selectOption(secondaryType, type);
                        return;
                    }
                }
                // 其他情况，选择第一个二级类型
                this.$refs.secondarySelectbox.selectOption(primaryType[this.keys.subType][0], type);
            }
        },

        /**
         * 选择二级类型
         * @param  {Object} secondaryType        二级类型对象
         */
        selectSecondaryType: function (secondaryType, type) {
            // 触发‘选择’事件
            this.$emit('vue-cascade-selectbox-select', JSON.parse(JSON.stringify(this.primaryType)), JSON.parse(JSON.stringify(secondaryType)), type);
        }
    }
};