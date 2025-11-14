export default {
    // CSS/JS 动画效果
    '/webgl-programming-guide/examples/': [
        '',
        {
            text: '第 2 章：WebGL 入门',
            collapsable: false,
            prefix: 'ch02/',
            children: [
                'drawing-rectangle',
                'hello-canvas',
                'hello-point1',
                'hello-point2',
                'clicked-points',
                'colored-points',
            ],
        },
        {
            text: '第 3 章：绘制和变换三角形',
            collapsable: false,
            prefix: 'ch03/',
            children: [
                'multi-points',
                'hello-triangle',
                'hello-rectangle',
                'translated-triangle',
                'rotated-triangle',
                'rotated-triangle-matrix',
            ],
        },
        {
            text: '第 4 章：高级变化与动画基础',
            collapsable: false,
            prefix: 'ch04/',
            children: [
                'rotated-triangle-matrix4',
                'rotated-translated-triangle',
                'rotating-triangle',
                'rotating-translated-triangle',
                'rotating-triangle-with-button',
            ],
        },
        {
            text: '第 5 章：颜色与纹理',
            collapsable: false,
            prefix: 'ch05/',
            children: [
                'multi-attribute-size',
                'multi-attribute-size-interleaved',
                'multi-attribute-color',
                'colored-triangle',
                'hello-triangle-frag-coord',
                'textured-quad',
                'textured-quad-repeat',
                'multi-texture',
            ],
        },
        {
            text: '附录',
            collapsable: false,
            prefix: 'appendix/',
            children: ['matrix'],
        },
        {
            text: 'lib 里的文件',
            collapsable: false,
            prefix: 'lib/',
            children: ['webgl-utils', 'webgl-debug', 'cuon-matrix', 'cuon-utils'],
        },
    ],
};
