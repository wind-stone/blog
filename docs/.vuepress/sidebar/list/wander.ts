export default {
    // 随记
    '/wander/': [
        {
            text: '商品房',
            prefix: '/wander/house',
            children: [
                '',
                'tianya-post',
                'beijing/',
                'xishanjinxiufu/',
                'zhonghailichunhushu/',
                'wanxiangyuefu/',
                'comparison',
            ],
        },
        {
            text: '投资理财',
            prefix: '/wander/investment',
            children: ['stocks'],
        },
        {
            text: '汽车',
            prefix: '/wander/cars',
            children: ['bmw-x3-maintenances'],
        },
        {
            text: '户外',
            children: ['/wander/outdoor/'],
        },
        {
            text: '其他',
            prefix: '/wander/others',
            children: ['theories', 'quotes', 'ssr/'],
        },
        {
            text: 'AI',
            prefix: '/wander/ai',
            children: [''],
        },
    ],
};
