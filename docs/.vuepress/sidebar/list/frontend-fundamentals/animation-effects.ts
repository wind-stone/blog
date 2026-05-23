import { text } from 'stream/consumers';

export default {
    // CSS/JS 动画效果
    '/frontend-fundamentals/animation-effects/': [
        '',
        'scroll-elements-fade-up',
        'complicated-animations-with-animation-delay',
        'gradient-shadows',
        {
            text: '文字效果',
            collapsable: false,
            prefix: 'text-effects',
            children: ['overlap-text', 'title-animations'],
        },
        'horizontal-slide-list',
        'virtual-scroll/',
    ],
};
