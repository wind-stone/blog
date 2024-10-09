export default {
    // ES6
    '/es6/': [
        {
            text: 'ES6+',
            prefix: '/es6',
            children: [
                '',
                'let-const/',
                'destructuring-assignment/',
                'function/',
                'array/',
                'class/',
                'module/',
                'iterator/',
                'generator/',
                'async-await/',
                'proxy-reflect/',
                'proxy-reflect/proxy-practice'
            ]
        },
        {
            text: 'Promise',
            prefix: '/es6/promise',
            children: [
                '',
                'promise-skills'
            ]
        },
        {
            text: 'Babel',
            prefix: '/es6/babel',
            children: [
                '',
                'babel-v7',
                '@babel/preset-env',
                '@babel/plugin-transform-runtime',
                '@babel/runtime',
                '@babel/runtime-corejs2'
            ]
        },
        {
            text: 'Polyfill',
            prefix: '/es6/polyfill',
            children: [
                {
                    text: 'String',
                    children: [
                        'string/padStart',
                    ]
                },
                {
                    text: 'Array',
                    prefix: 'array',
                    children: [
                        'array-prototype-forEach',
                        'array-prototype-reduce',
                    ]
                },
                {
                    text: 'Object',
                    prefix: 'object',
                    children: [
                        'new',
                        'object-create',
                        'object-assign',
                    ]
                },
                {
                    text: 'Promise',
                    prefix: 'promise',
                    children: [
                        'promise-allSettled',
                        'promise-race'
                    ]
                }
            ]
        }
    ]
};
