module.exports = {
    // ES6
    '/es6/': [
        {
            title: 'ES6+',
            collapsable: false,
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
                'promise/',
                'async-await/',
                'proxy-reflect/',
                'proxy-reflect/proxy-array'
            ]
        },
        {
            title: 'Babel',
            collapsable: false,
            children: [
                'babel/',
                'babel/babel-v7',
                'babel/@babel/preset-env',
                'babel/@babel/plugin-transform-runtime',
                'babel/@babel/runtime',
                'babel/@babel/runtime-corejs2'
            ]
        },
        {
            title: 'Polyfill',
            collapsable: false,
            children: [
                'polyfill/object/'
            ]
        }
    ]
};
