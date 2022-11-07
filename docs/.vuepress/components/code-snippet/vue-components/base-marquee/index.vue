<template>
    <div
        ref="baseMarquee"
        class="base-marquee"
    >
        <div
            ref="marqueeList"
            class="marquee-list"
            :class="{'transition-top': transition}"
            @transitionend="transitionend"
        >
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timer: null,
            liHeight: 0,
            transition: false
        };
    },
    mounted() {
        this.initSize();
        this.timer = setInterval(this.showMarquee, 3000);
    },
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        initSize() {
            this.liHeight = this.$refs.marqueeList.firstElementChild.offsetHeight || 0;
            this.$refs.baseMarquee.style.height = this.liHeight + 'px';
        },
        setMarqueeUlMarginTop(height) {
            if (this.$refs.marqueeList) {
                this.$refs.marqueeList.style.marginTop = -height + 'px';
            }
        },
        showMarquee() {
            this.transition = true;
            this.setMarqueeUlMarginTop(this.liHeight);
        },
        transitionend() {
            this.transition = false;
            setTimeout(() => {
                // 放在异步操作里，防止闪跳（第一条滚动后，先闪现第三条，再稳定在第二条上）
                const marqueeList = this.$refs.marqueeList;
                marqueeList.appendChild(marqueeList.firstElementChild);
                this.setMarqueeUlMarginTop(0);
            }, 0);
        }
    }
};
</script>

<style lang="less" scoped>
.base-marquee {
    width: 100%;
    padding: 0 15px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.30);
    box-sizing: border-box;
    overflow: hidden;
    .marquee-list {
        &.transition-top {
            transition: all .5s;
        }
    }
}
</style>
