module.exports = {
    // ES6
    '/es6/': [
        {
            text: 'ES6+',
            children: [
                '/es6/',
                '/es6/let-const/',
                '/es6/destructuring-assignment/',
                '/es6/function/',
                '/es6/array/',
                '/es6/class/',
                '/es6/module/',
                '/es6/iterator/',
                '/es6/generator/',
                '/es6/async-await/',
                '/es6/proxy-reflect/',
                '/es6/proxy-reflect/proxy-practice'
            ]
        },
        {
            text: 'Promise',
            children: [
                '/es6/promise/',
                '/es6/promise/promise-skills'
            ]
        },
        {
            text: 'Babel',
            children: [
                '/es6/babel/',
                '/es6/babel/babel-v7',
                '/es6/babel/@babel/preset-env',
                '/es6/babel/@babel/plugin-transform-runtime',
                '/es6/babel/@babel/runtime',
                '/es6/babel/@babel/runtime-corejs2'
            ]
        },
        {
            text: 'Polyfill',
            children: [
                {
                    text: 'String',
                    children: [
                        '/es6/polyfill/string/padStart',
                    ]
                },
                {
                    text: 'Array',
                    children: [
                        '/es6/polyfill/array/array-prototype-forEach',
                        '/es6/polyfill/array/array-prototype-reduce',
                    ]
                },
                {
                    text: 'Object',
                    children: [
                        '/es6/polyfill/object/new',
                        '/es6/polyfill/object/object-create',
                        '/es6/polyfill/object/object-assign',
                    ]
                },
                {
                    text: 'Promise',
                    children: [
                        '/es6/polyfill/promise/promise-allSettled',
                        '/es6/polyfill/promise/promise-race'
                    ]
                }
            ]
        }
    ]
};
