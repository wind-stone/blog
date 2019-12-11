const EVENT_TOGGLE = 'toggle';

export default {
    model: {
        prop: 'visible',
        event: EVENT_TOGGLE
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selfVisible: false
        };
    },
    watch: {
        selfVisible(newVal) {
            this.$emit(EVENT_TOGGLE, newVal);
        },
    },
    mounted() {
        // 放在此处而不是跟 selfVisible 一起放在 watch 选项里，是为了实现动画效果
        // 若是放在 watch 选项里，就不会产生动画，因为 selfVisible 一创建组件是就是 true，没有一个从 false --> true 的过程
        this.$watch('visible', (newVal) => {
            newVal ? this.show() : this.hide();
        }, {
            immediate: true
        });
    },
    methods: {
        show() {
            this.selfVisible = true;
        },
        hide() {
            this.selfVisible = false;
        }
    }
};
