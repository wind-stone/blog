<template>
    <div v-if="banners.length > 0" class="vue-banner">
        <ul class="banner-list">
            <li v-for="(banner, index) in banners">
                <a :href="banner[keys.url] ? banner[keys.url] : 'javascript:;'"  :title="banner[keys.title]">
                    <img :src="banner[keys.img]" :style="fixedHeight ? {height: fixedHeight} : 0" />
                </a>
            </li>
        </ul>
        <ul v-show="banners.length > 1" class="banner-pagination">
            <li v-for="(banner, index) in banners" :data-index="index" :class="{active: index === activeIndex}"></li>
        </ul>
    </div>
</template>

<script>
    /**
     * @File 轮播图组件
     * @Author wind-stone(wind-stone@qq.com)
     * @Date 2016-12-06 14：00
     */
    'use strict';
    import Swipe from './swipe';
    export default {
        name: 'vue-banner',
        data: () => ({
            // 默认激活显示的 index
            activeIndex: 0
        }),
        props: {
            // banner 数据，如果传入 undefined，会调用 default 函数
            banners: {
                type: Array,
                required: true,
                default: () => []
            },
            // 自定义属性名称
            keys: {
                type: Object,
                required: false,
                default: () => (
                    {
                        id: 'id',
                        url: 'url',      // 超链接 url
                        title: 'title',  // 超链接的 title
                        img: 'img'       // 图片 url
                    }
                )
            },
            // 设置固定高度，示例：100px
            fixedHeight: {
                type: String,
                required: false
            }
        },
        watch: {
            /**
             * banner 数据有变化，重新初始化
             */
            banners: function (val, oldVal) {
                this.initBanner();
            }
        },
        mounted : function () {
            this.initBanner();
        },
        methods: {
            initBanner: function () {
                let vm = this;

                // 重新初始化之前，先 kill 之前存在的 swipe 实例
                vm.swipe && (vm.swipe.kill());

                if (this.banners.length) {
                    this.$nextTick(() => {
                        let root = this.$el;
                        let pagination = root.querySelector('.banner-pagination');
                        let paginationDots = pagination.querySelectorAll('li');
                        let len = paginationDots.length;

                        /**
                         * 注意：
                         * https://github.com/thebird/Swipe 上的 swipe 文件存在 bug，滑动后不能自动播放
                         * 此处使用的由 逍客磊 修复的版本，且当 banner 的数量为 2 时仍存在 bug，需手动在代码里修复
                         */
                        vm.swipe = Swipe(root, {
                            // startSlide: 1,
                            auto: 2000,
                            // continuous: true,
                            // disableScroll: false,
                            // stopPropagation: true,
                            callback: (index) => {
                                vm.activeIndex = len === 2 ? index % 2 : index;
                            }
                        });

                        // 导航切换
                        pagination.addEventListener('touchstart', function (event) {
                            let target = event.target;
                            let targetNodeName = target.nodeName.toLowerCase();
                            if (targetNodeName === 'li') {
                                vm.swipe.slide(+target.getAttribute('data-index'));
                            }
                        }, false);
                    });
                }
            }
        }
    }
</script>

<style lang="less">

    .vue-banner {
        position: relative;
        font-size: 0;
        overflow: hidden;
        .banner-list {
            padding: 0;
            overflow: hidden;
            li {
                position: relative;
                float: left;
                width: 100%;
                a {
                    display: inline-block;
                    width: 100%;
                    img {
                        width: 100%;
                    }
                }
            }
        }
        .banner-pagination {
            position: absolute;
            left: 50%;
            bottom: 0;
            padding: 0;
            margin-bottom: 6px;
            transform: translateX(-50%);
            overflow: hidden;
            li {
                float: left;
                width: 6px;
                height: 6px;
                border-radius: 4px;
                border: 1px solid #fff;
                margin-right: 5px;
                &:last-of-type {
                    margin-right: 0;
                }
                &.active {
                    background-color: #fff;
                }
            }
        }
    }
</style>