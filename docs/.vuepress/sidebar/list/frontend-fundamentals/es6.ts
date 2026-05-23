export default {
    // ES6
    '/frontend-fundamentals/es6/': [
        {
            text: 'ES6+',
            prefix: '/frontend-fundamentals/es6',
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
                'proxy-reflect/proxy-practice',
            ],
        },
        {
            text: 'Promise',
            prefix: '/frontend-fundamentals/es6/promise',
            children: ['', 'promise-skills'],
        },
        {
            text: 'Babel',
            prefix: '/frontend-fundamentals/es6/babel',
            children: [
                '',
                'babel-v7',
                '@babel/preset-env',
                '@babel/plugin-transform-runtime',
                '@babel/runtime',
                '@babel/runtime-corejs2',
            ],
        },
        {
            text: 'Polyfill',
            prefix: '/frontend-fundamentals/es6/polyfill',
            children: [
                {
                    text: 'String',
                    children: ['string/padStart'],
                },
                {
                    text: 'Array',
                    prefix: 'array',
                    children: ['array-prototype-forEach', 'array-prototype-reduce'],
                },
                {
                    text: 'Object',
                    prefix: 'object',
                    children: ['new', 'object-create', 'object-assign'],
                },
                {
                    text: 'Promise',
                    prefix: 'promise',
                    children: ['promise-allSettled', 'promise-race'],
                },
            ],
        },
    ],
};
