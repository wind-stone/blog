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
        visible: {
            handler(newVal) {
                newVal ? this.show() : this.hide();
            },
            immediate: true
        }
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
