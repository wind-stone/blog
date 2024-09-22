export default {
    // Vue 源码学习
    '/vue/': [
        {
            text: 'Vue 2.x 源码分析',
            children: [
                '/vue/source-study/',
                '/vue/vue-series/vuejs/',
                '/vue/vue-series/vuejs/scoped-css',
                '/vue/vue-series/vue-router/'
            ]
        },
        {
            text: '实例化',
            children: [
                '/vue/source-study/vue-constructor',
                '/vue/source-study/instance/create',
                '/vue/source-study/instance/state/',
                '/vue/source-study/instance/state/props',
                '/vue/source-study/instance/state/methods',
                '/vue/source-study/instance/state/data',
                '/vue/source-study/instance/state/computed',
                '/vue/source-study/instance/state/watch',
                '/vue/source-study/instance/directives',
                '/vue/source-study/instance/events'
            ]
        },
        {
            text: '组件化',
            children: [
                '/vue/source-study/component/register',
                '/vue/source-study/component/options',
                '/vue/source-study/component/async-component',
                '/vue/source-study/component/functional-component',
                '/vue/source-study/component/extend'
            ]
        },
        {
            text: '响应式原理',
            children: [
                '/vue/source-study/observer/',
                '/vue/source-study/observer/dep-collection',
                '/vue/source-study/observer/notify-update',
                '/vue/source-study/observer/dep',
                '/vue/source-study/observer/watcher',
                '/vue/source-study/observer/scheduler',
                '/vue/source-study/observer/array-observe-limit',
            ]
        },
        {
            text: 'Virtual Dom',
            children: [
                '/vue/source-study/vdom/',
                '/vue/source-study/vdom/vnode-tree-create',
                '/vue/source-study/vdom/patch',
                '/vue/source-study/vdom/patch-vnode',
                '/vue/source-study/vdom/child-component-create',
                '/vue/source-study/vdom/patch-modules/',
                '/vue/source-study/vdom/patch-fn',
                '/vue/source-study/vdom/topics/dom-binding'
            ]
        },
        {
            text: '编译',
            children: [
                '/vue/source-study/compile/',
                '/vue/source-study/compile/compile-process',
                '/vue/source-study/compile/base-compile',
                '/vue/source-study/compile/parse',
                '/vue/source-study/compile/parse-html',
                '/vue/source-study/compile/optimize',
                '/vue/source-study/compile/codegen'
            ]
        },
        {
            text: '编译专题',
            children: [
                '/vue/source-study/compile/topics/event',
                '/vue/source-study/compile/topics/v-model',
                '/vue/source-study/compile/topics/slot'
            ]
        },
        {
            text: '全局 API',
            children: [
                '/vue/source-study/global-api/use'
            ]
        },
        {
            text: 'Util',
            children: [
                '/vue/source-study/util/next-tick',
                '/vue/source-study/util/lifecycle-hook-event',
            ]
        },
        {
            text: 'SSR',
            children: [
                '/vue/source-study/ssr/',
                '/vue/source-study/ssr/vue-server-renderer',
                '/vue/source-study/ssr/hydrate',
            ]
        },
        {
            text: 'Vuex',
            children: [
                '/vue/vue-series/vuex/',
                '/vue/vue-series/vuex/reset-child-module-state',
                '/vue/vue-series/vuex/register-module',
            ]
        },

        // 等待以后分离出去
        {
            text: 'Vue 3.x',
            children: [
                '/vue3/',
                '/vue3/composition-api',
                '/vue3/reactivity/use-difference'
            ]
        },
    ],
};
