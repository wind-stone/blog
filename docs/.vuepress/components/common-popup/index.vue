<template>
    <div ref="mask" v-show="visible" class="common-popup-mask">
        <div class="common-popup-content">
            <a v-if="showClose" class="close-btn" @click="close"></a>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { contains } from '../common/js/util';

const CLOSE = 'close';
export default {
    name: 'common-popup',
    model: {
        prop: 'visible',
        event: CLOSE,
    },
    props: {
        visible: {
            type: Boolean,
            required: false,
            default: false,
        },
        showClose: {
            type: Boolean,
            required: false,
            default: true,
        },
        // 禁止弹窗任何区域滚动
        forbidBgScroll: {
            type: Boolean,
            required: false,
            default: true,
        },
        // 滚动区域 DOM 元素的类名，仅在 forbidBgScroll 为真值时有效
        scrollAreaSelector: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            // 滚动区域 DOM 元素
            scrollArea: '',
            // 滚动开始时的 Y 坐标
            touchStartY: 0,
            // 滚动区域 offsetHeight、scrollHeight
            scrollAreaOffsetHeight: 0,
            scrollAreaScrollHeight: 0,
        };
    },
    mounted() {
        if (this.forbidBgScroll) {
            this.scrollArea = this.scrollAreaSelector && this.$refs.mask.querySelector(this.scrollAreaSelector);
            this.bindForbidBgScrollEvent();
        }
    },
    destroyed() {
        if (this.forbidBgScroll) {
            this.removeForbidBgScrollEvent();
        }
    },
    methods: {
        close() {
            this.$emit(CLOSE, false);
        },
        bindForbidBgScrollEvent() {
            this.$refs.mask && this.$refs.mask.addEventListener('touchmove', this.maskTouchMove);
            if (this.scrollArea) {
                this.scrollArea.addEventListener('touchstart', this.scrollAreaTouchStart);
                this.scrollArea.addEventListener('touchmove', this.scrollAreaTouchMove);
            }
        },
        removeForbidBgScrollEvent() {
            this.$refs.mask && this.$refs.mask.removeEventListener('touchmove', this.maskTouchMove);
            if (this.scrollArea) {
                this.scrollArea.removeEventListener('touchstart', this.scrollAreaTouchStart);
                this.scrollArea.removeEventListener('touchmove', this.scrollAreaTouchMove);
            }
        },
        maskTouchMove(evt) {
            const target = evt.target;
            if (!this.scrollArea || !contains(this.scrollArea, target)) {
                evt.preventDefault();
            }
        },
        scrollAreaTouchStart(evt) {
            const targetTouches = evt.targetTouches || [];
            if (targetTouches.length > 0) {
                const touch = targetTouches[0] || {};
                this.touchStartY = touch.clientY;
                this.scrollAreaOffsetHeight = this.scrollArea.offsetHeight;
                this.scrollAreaScrollHeight = this.scrollArea.scrollHeight;
            }
        },
        scrollAreaTouchMove(evt) {
            const changedTouches = evt.changedTouches;
            let canMove = false;
            const scrollTop = this.scrollArea.scrollTop;
            if (changedTouches.length > 0) {
                const touch = changedTouches[0] || {};
                const moveY = touch.clientY;

                if (moveY > this.touchStartY && scrollTop <= 0) {
                    canMove = false;
                } else if (
                    moveY < this.touchStartY
                    && scrollTop + this.scrollAreaOffsetHeight >= this.scrollAreaScrollHeight
                ) {
                    canMove = false;
                } else {
                    canMove = true;
                }
                if (!canMove) {
                    evt.preventDefault();
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.common-popup-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 1000;
    > .common-popup-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        > .close-btn {
            position: absolute;
            top: -54px;
            right: -26px;
            width: 34px;
            height: 34px;
            background: url('./popup-close-btn.png') top left/100% no-repeat;
        }
    }
}
</style>
