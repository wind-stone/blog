/**
 * @file 多城市选择器组件
 * @author wind-stone@qq.com
 * @date 2017-02-23 16:00
 */
require('./index.less');
export default {
    props: {

        cityType: {
            type: [String, Number],
            require: false,
            default: 'none'
        },

        // 全部城市
        wholeCity: {
            type: Array,
            require: false,
            default: function () {
                return [];
            }
        },

        // 已选择的城市
        selectedCity: {
            type: Array,
            require: false,
            default: function () {
                return [];
            }
        },

        // 默认展示值
        placeholder: {
            type: String,
            require: false,
            default: '请选择'
        }
    },
    template: require('./index.tpl.html'),
    data: () => ({
        innerCityType: 'none',       // 城市类型，0 代表全部城市，1 代表部分城市
        ifShowCityContent: false,    // 是否展示城市选择内容区域
        ifShowInnerWarning: false,       // 是否显示没有选择城市的警告
        ifShowOutterWarning: false,      // 是否显示外部提示（没有通过组件进行选择时）
        innerUnselectedCity: [],     // 未选择的城市
        innerSelectedCity: []        // 已选择的城市
    }),
    ready: function () {

        if (this.cityType !== 'none') {
            this.innerCityType = this.cityType;
            if (this.innerCityType === 1) {
                this.initData();
            }
            this.submit();
        }

        // 添加 document 事件，点击组件之外的区域，则关闭下拉选择框
        document.addEventListener('click', this.getDocumentClickHandler(), false);
    },
    destroyed: function () {
        // 组件销毁之前，移除 docoment 上的 click 事件
        document.removeEventListener('click', this.getDocumentClickHandler());
    },
    watch: {
        wholeCity: {
            handler: function (newValue) {
                this.initData();
            },
            deep: true
        },
        selectedCity: {
            handler: function (newValue) {
                this.initData();
            },
            deep: true
        },
    },
    methods: {

        /**
         * 初始化已选择城市数据innerSelectedCity，未选择城市数据innerUnselectedCity
         */
        initData: function () {
            let vm = this;
            let wholeCity = this.wholeCity;
            let selectedCity = this.selectedCity;
            let innerUnselectedCity = this.innerUnselectedCity = [];
            let innerSelectedCity = this.innerSelectedCity = [];

            let i, primaryLen, primaryCity, newPrimaryCity;
            let j, secondaryLen, secondaryCity;

            // 将 selectedCity 数据复制到 innerSelectedCity
            for (i = 0, primaryLen = selectedCity.length; i < primaryLen; i++) {
                primaryCity = selectedCity[i];
                newPrimaryCity = {
                    areaId: primaryCity.areaId,
                    areaName: primaryCity.areaName,
                    citys: []
                };

                for (j = 0, secondaryLen = primaryCity.citys.length; j < secondaryLen; j++) {
                    secondaryCity = primaryCity.citys[j];
                    newPrimaryCity.citys.push({
                        areaId: secondaryCity.areaId,
                        areaName: secondaryCity.areaName
                    });
                }

                if (newPrimaryCity.citys.length) {
                    innerSelectedCity.push(newPrimaryCity);
                }
            }

            // 获取 innerUnselectedCity 数据，复制 wholeCity 数据但是剔除掉 selectedCity 的数据
            for (i = 0, primaryLen = wholeCity.length; i < primaryLen; i++) {
                primaryCity = wholeCity[i];
                newPrimaryCity = {
                    areaId: primaryCity.areaId,
                    areaName: primaryCity.areaName,
                    citys: []
                };

                for (j = 0, secondaryLen = primaryCity.citys.length; j < secondaryLen; j++) {
                    secondaryCity = primaryCity.citys[j];
                    if (!vm.containedInSelectedCity(secondaryCity.areaId)) {
                        newPrimaryCity.citys.push({
                            areaId: secondaryCity.areaId,
                            areaName: secondaryCity.areaName
                        });
                    }
                }

                if (newPrimaryCity.citys.length) {
                    innerUnselectedCity.push(newPrimaryCity);
                }
            }
        },

        /**
         * 判断给定的二级城市 id 是否包含在已选择城市里面
         * @param  {String} secondaryCityId 二级城市 id
         * @return {Boolean}                    是否包含
         */
        containedInSelectedCity: function (secondaryCityId) {
            let selectedCity = this.selectedCity;
            let i, j;
            let primaryCity, secondaryCity;
            for (i = 0; i < selectedCity.length; i++) {
                primaryCity = selectedCity[i];
                for (j = 0; j < primaryCity.citys.length; j++) {
                    secondaryCity = primaryCity.citys[j];
                    if (secondaryCityId === secondaryCity.areaId) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * 切换显示 城市选择内容区域
         */
        toggleCityContent: function () {
            this.ifShowCityContent = !this.ifShowCityContent;
            if (this.ifShowCityContent) {
                this.initData();

                // 清除内部和外部提示
                this.ifShowInnerWarning = false;
                this.ifShowOutterWarning = false;
            }
        },

        /**
         * 切换显示二级城市
         */
        toggleSecondaryList: (event) => {
            let primaryItem = event.target.parentNode;
            primaryItem.className = primaryItem.className.search('active') === -1 ? 'v-primary-item active' : 'v-primary-item';
        },

        /**
         * 添加一级城市到已选择城市
         * @param {[type]} primaryCityId 一级城市id
         */
        addPrimaryCity: function (primaryCityId) {
            let innerUnselectedCity = this.innerUnselectedCity;
            let innerSelectedCity = this.innerSelectedCity;

            let i, j;
            let unselectedPrimaryCity, selectedPrimaryCity;

            // 查找到未选择城市里对应的城市对象
            for (i = 0; i < innerUnselectedCity.length; i++) {
                if (innerUnselectedCity[i].areaId === primaryCityId) {
                    unselectedPrimaryCity = innerUnselectedCity[i];
                    break;
                }
            }

            // 查找到已选择城市里对应的城市对象
            for (j = 0; j < innerSelectedCity.length; j++) {
                if (innerSelectedCity[j].areaId === primaryCityId) {
                    selectedPrimaryCity = innerSelectedCity[j];
                    break;
                }
            }

            if (!selectedPrimaryCity) {
                // 如果已选择城市里不存在该一级城市，直接将一级城市对象加入已选择城市里
                innerSelectedCity.push.call(innerSelectedCity, unselectedPrimaryCity);
            } else {
                // 否则，将未选择城市里该一级城市的二级城市全部加入到已选择城市里
                innerSelectedCity.push.apply(selectedPrimaryCity.citys, unselectedPrimaryCity.citys);
            }

            // 将未选择城市里的该一级城市删除
            innerUnselectedCity.splice(i, 1);
        },

        /**
         * 添加二级城市到已选择城市
         * @param {[type]} primaryCity        一级城市对象
         * @param {[type]} secondaryCity      二级城市对象
         * @param {[type]} primaryCityIndex   一级城市未选择城市里的 index
         * @param {[type]} secondaryCityIndex 二级城市在一级城市 citys 里的 index
         */
        addSecondaryCity: function (primaryCity, secondaryCity, primaryCityIndex, secondaryCityIndex) {
            let innerUnselectedCity = this.innerUnselectedCity;
            let innerSelectedCity = this.innerSelectedCity;
            let selectedPrimaryCity;
            let newPrimaryCity;

            // 查看已选择城市里，是否有当前选择的一级城市，有则赋值给 selectedPrimaryCity
            for (let i = 0, len = innerSelectedCity.length; i < len; i++) {
                let primaryCityItem = innerSelectedCity[i];
                if (primaryCityItem.areaId === primaryCity.areaId) {
                    selectedPrimaryCity = primaryCityItem;
                    break;
                }
            }

            if (!selectedPrimaryCity) {
                // 如果已选择城市里不存在当前选择的一级城市
                newPrimaryCity = {
                    areaId: primaryCity.areaId,
                    areaName: primaryCity.areaName,
                    citys: [
                        secondaryCity
                    ]
                };
                innerSelectedCity.push.call(innerSelectedCity, newPrimaryCity);
            } else {
                innerSelectedCity.push.call(selectedPrimaryCity.citys, secondaryCity);
            }

            // 删除未选择城市里被选择的二级城市
            primaryCity.citys.splice(secondaryCityIndex, 1);

            // 判断被选择二级城市里所属的一级城市是否还有二级城市，没有的话删除一级城市
            if (!primaryCity.citys.length) {
                innerUnselectedCity.splice(primaryCityIndex, 1);
            }
        },

        /**
         * 从已选择城市里删除一级城市
         * @param {[type]} primaryCityId 一级城市id
         */
        deletePrimaryCity: function (primaryCityId) {
            let innerUnselectedCity = this.innerUnselectedCity;
            let innerSelectedCity = this.innerSelectedCity;

            let i, j;
            let unselectedPrimaryCity, selectedPrimaryCity;

            // 查找到未选择城市里对应的城市对象
            for (i = 0; i < innerUnselectedCity.length; i++) {
                if (innerUnselectedCity[i].areaId === primaryCityId) {
                    unselectedPrimaryCity = innerUnselectedCity[i];
                    break;
                }
            }

            // 查找到已选择城市里对应的城市对象
            for (j = 0; j < innerSelectedCity.length; j++) {
                if (innerSelectedCity[j].areaId === primaryCityId) {
                    selectedPrimaryCity = innerSelectedCity[j];
                    break;
                }
            }

            if (!unselectedPrimaryCity) {
                // 如果未选择城市里不存在该一级城市，直接将一级城市对象加入已选择城市里
                innerSelectedCity.push.call(innerUnselectedCity, selectedPrimaryCity);
            } else {
                // 否则，将已选择城市里该一级城市的二级城市全部加入到未选择城市里
                innerSelectedCity.push.apply(unselectedPrimaryCity.citys, selectedPrimaryCity.citys);
            }

            // 将未选择城市里的该一级城市删除
            innerSelectedCity.splice(j, 1);
        },

        /**
         * 将二级城市删除
         * @param {[type]} primaryCity        一级城市对象
         * @param {[type]} secondaryCity      二级城市对象
         * @param {[type]} primaryCityIndex   一级城市未选择城市里的 index
         * @param {[type]} secondaryCityIndex 二级城市在一级城市 citys 里的 index
         */
        deleteSecondaryCity: function (primaryCity, secondaryCity, primaryCityIndex, secondaryCityIndex) {
            let innerUnselectedCity = this.innerUnselectedCity;
            let innerSelectedCity = this.innerSelectedCity;
            let unselectedPrimaryCity;
            let newPrimaryCity;

            // 查看已选择城市里，是否有当前选择的一级城市，有则赋值给 unselectedPrimaryCity
            for (let i = 0, len = innerUnselectedCity.length; i < len; i++) {
                let primaryCityItem = innerUnselectedCity[i];
                if (primaryCityItem.areaId === primaryCity.areaId) {
                    unselectedPrimaryCity = primaryCityItem;
                    break;
                }
            }

            if (!unselectedPrimaryCity) {
                // 如果未选择城市里不存在当前选择的一级城市
                newPrimaryCity = {
                    areaId: primaryCity.areaId,
                    areaName: primaryCity.areaName,
                    citys: [
                        secondaryCity
                    ]
                };
                innerUnselectedCity.push.call(innerUnselectedCity, newPrimaryCity);
            } else {
                innerUnselectedCity.push.call(unselectedPrimaryCity.citys, secondaryCity);
            }

            // 删除未选择城市里被选择的二级城市
            primaryCity.citys.splice(secondaryCityIndex, 1);

            // 判断被选择二级城市里所属的一级城市是否还有二级城市，没有的话删除一级城市
            if (!primaryCity.citys.length) {
                innerSelectedCity.splice(primaryCityIndex, 1);
            }
        },

        /**
         * 提交选择的城市
         */
        submit: function () {
            var innerSelectedCity = this.innerSelectedCity;
            var innerCityType = this.innerCityType;

            if (innerCityType === 'none' || innerCityType === 1 && innerSelectedCity.length === 0) {
                this.ifShowInnerWarning = true;
                return;
            }
            if (this.innerCityType === 0) {
                this.$emit('vue-city-select', this.innerCityType, []);
                this.placeholder = '不限地区';
            } else {
                this.$emit('vue-city-select', this.innerCityType, JSON.parse(JSON.stringify(innerSelectedCity)));
                this.placeholder = innerSelectedCity[0].areaName + '-' + innerSelectedCity[0].citys[0].areaName;
                if (innerSelectedCity.length > 1 || innerSelectedCity[0].citys.length > 1) {
                    this.placeholder += '...';
                }
            }
            this.close();
        },

        /**
         * 取消城市选择
         */
        cancel: function () {
            this.close();
        },

        /**
         * 关闭城市选择器
         */
        close: function () {
            this.ifShowCityContent = false;
        },


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
                    vm.close();
                };
            }
            return this.clickDocumentHandler;
        },
    }
};
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