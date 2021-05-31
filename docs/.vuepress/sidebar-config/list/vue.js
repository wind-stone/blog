module.exports = {
    // Vue 源码学习
    '/vue/': [
        {
            title: 'Vue 应用',
            collapsable: false,
            children: [
                'vue-series/vuejs/',
                'vue-series/vuejs/scoped-css',
                'vue-series/vue-router/'
            ]
        },
        {
            title: '实例化',
            collapsable: false,
            children: [
                'source-study/vue-constructor',
                'source-study/instance/create',
                'source-study/instance/state/',
                'source-study/instance/state/props',
                'source-study/instance/state/methods',
                'source-study/instance/state/data',
                'source-study/instance/state/computed',
                'source-study/instance/state/watch',
                'source-study/instance/directives',
                'source-study/instance/events'
            ]
        },
        {
            title: '组件化',
            collapsable: false,
            children: [
                'source-study/component/register',
                'source-study/component/options',
                'source-study/component/async-component',
                'source-study/component/functional-component',
                'source-study/component/extend'
            ]
        },
        {
            title: '响应式原理',
            collapsable: false,
            children: [
                'source-study/observer/',
                'source-study/observer/dep-collection',
                'source-study/observer/notify-update',
                'source-study/observer/dep',
                'source-study/observer/watcher',
                'source-study/observer/scheduler',
                'source-study/observer/array-observe-limit',
            ]
        },
        {
            title: 'Virtual Dom',
            collapsable: false,
            children: [
                'source-study/vdom/',
                'source-study/vdom/vnode-tree-create',
                'source-study/vdom/patch',
                'source-study/vdom/patch-vnode',
                'source-study/vdom/child-component-create',
                'source-study/vdom/patch-modules/',
                'source-study/vdom/patch-fn',
                'source-study/vdom/topics/dom-binding'
            ]
        },
        {
            title: '编译',
            collapsable: false,
            children: [
                'source-study/compile/',
                'source-study/compile/compile-process',
                'source-study/compile/base-compile',
                'source-study/compile/parse',
                'source-study/compile/parse-html',
                'source-study/compile/optimize',
                'source-study/compile/codegen'
            ]
        },
        {
            title: '编译专题',
            collapsable: false,
            children: [
                'source-study/compile/topics/event',
                'source-study/compile/topics/v-model',
                'source-study/compile/topics/slot'
            ]
        },
        {
            title: '全局 API',
            collapsable: false,
            children: [
                'source-study/global-api/use'
            ]
        },
        {
            title: 'Util',
            collapsable: false,
            children: [
                'source-study/util/next-tick',
                'source-study/util/lifecycle-hook-event',
            ]
        },
        {
            title: 'Vuex',
            collapsable: false,
            children: [
                'vue-series/vuex/',
                'vue-series/vuex/reset-child-module-state',
                'vue-series/vuex/register-module',
            ]
        },
        {
            title: '其他',
            collapsable: false,
            children: [
                'vue-series/vue-ssr/'
            ]
        }
    ]
};
