export default {
    // Vue 源码学习
    '/vue/': [
        {
            text: 'Vue 2.x 源码分析',
            prefix: '',
            children: [
                '/vue/source-study/',
            ]
        },
        {
            text: '实例化',
            prefix: '/vue/source-study',
            children: [
                'vue-constructor',
                'instance/create',
                'instance/state/',
                'instance/state/props',
                'instance/state/methods',
                'instance/state/data',
                'instance/state/computed',
                'instance/state/watch',
                'instance/directives',
                'instance/events'
            ]
        },
        {
            text: '组件化',
            prefix: '/vue/source-study/component',
            children: [
                'register',
                'options',
                'async-component',
                'functional-component',
                'extend'
            ]
        },
        {
            text: '响应式原理',
            prefix: '/vue/source-study/observer',
            children: [
                '',
                'dep-collection',
                'notify-update',
                'dep',
                'watcher',
                'scheduler',
                'array-observe-limit',
            ]
        },
        {
            text: 'Virtual Dom',
            prefix: '/vue/source-study/vdom',
            children: [
                '',
                'vnode-tree-create',
                'patch',
                'patch-vnode',
                'child-component-create',
                'patch-modules/',
                'patch-fn',
                'topics/dom-binding'
            ]
        },
        {
            text: '编译',
            prefix: '/vue/source-study/compile',
            children: [
                '',
                'compile-process',
                'base-compile',
                'parse',
                'parse-html',
                'optimize',
                'codegen'
            ]
        },
        {
            text: '编译专题',
            prefix: '/vue/source-study/compile/topics',
            children: [
                'event',
                'v-model',
                'slot'
            ]
        },
        {
            text: '全局 API',
            prefix: '/vue/source-study/global-api',
            children: [
                'use'
            ]
        },
        {
            text: 'Util',
            prefix: '/vue/source-study/util',
            children: [
                'next-tick',
                'lifecycle-hook-event',
            ]
        },
        {
            text: 'SSR',
            prefix: '/vue/source-study/ssr',
            children: [
                '',
                'vue-server-renderer',
                'hydrate',
            ]
        },
        {
            text: 'Vuex',
            prefix: '/vue/vue-series/vuex',
            children: [
                '',
                'reset-child-module-state',
                'register-module',
            ]
        },
        {
            text: 'vue-router',
            prefix: '/vue/vue-series/vue-router/',
            children: [
                '',
            ]
        },
        {
            text: '其他',
            prefix: '/vue/vue-series/vuejs',
            children: [
                'scoped-css',
            ]
        },

        // 等待以后分离出去
        {
            text: 'Vue 3.x',
            prefix: '/vue3',
            children: [
                '',
                'composition-api',
                'reactivity/use-difference'
            ]
        },
    ],
};
