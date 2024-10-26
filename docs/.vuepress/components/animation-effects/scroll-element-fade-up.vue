<template>
    <div class="container">
        <div v-slide-in v-for="n in 10" :class="['item', `item-${n}`]">{{ n }}</div>
    </div>
</template>

<script lang="ts" setup>
const DISTANCE = 100;
const DURATION = 500;
const weakMap = new WeakMap();

const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
        const el = entry.target;
        if (entry.isIntersecting) {
            const animation = weakMap.get(el);
            animation && animation.play();
            // 动画播放之后，不再观察元素
            observer.unobserve(el);
        }
    }
})

const isBelowViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top > window.innerHeight;
}

/**
 * 自定义指令，平滑上移
 */
const vSlideIn = {
    mounted(el) {
        if (!isBelowViewport(el)) {
            return;
        }
        // 当元素在视口以下时，才添加动画
        const animation = el.animate([
            {
                transform: `translateY(${DISTANCE}px)`,
                opacity: 0.5
            },
            {
                transform: `translateY(0px)`,
                opacity: 1
            }
        ], {
            duration: DURATION,
            easeing: 'ease-out',
            fill: 'forwards'
        })

        animation.pause();
        weakMap.set(el, animation);
        observer.observe(el);
    },
    unmounted(el) {
        observer.unobserve(el);
    },
}
</script>

<style lang="less" scoped>
.container {
    margin: 1em auto;
    margin-bottom: 50px;
    width: 80%;
    > .item {
        width: 100%;
        height: 200px;
        margin: 2vw 0;

        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 5vw;
        color: #fff;

        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background: red;

        // 循环给每个元素添加背景颜色，并添加 hover 和 active 时的背景颜色
        @colors: red, orange, yellow, green, cyan, blue, purple, gray, black, gold;
        each(@colors, {
            &.item-@{index} {
                background: @value;

                &:hover {
                    background: lighten(@value, 10%);
                }
                &:active {
                    background: darken(@value, 10%);
                }
            }
        });
    }
}
</style>
