<template>
    <div class="horizontal-slide-list">
        <div
            ref="containerDom"
            class="slide-list-wrap"
            :style="{
                height: `${containerHeight}px`,
                transform: `translateX(${containerTranslateX}px)`,
            }"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
        >
            <ul class="left-area slide-list">
                <li
                    v-for="item in list.slice(0, 4)"
                    :key="item.id"
                    class="slide-item"
                    :style="{ width: `calc(100% / ${countPerRow})` }"
                >
                    <img :src="item.icon" class="image" />
                    <span class="title" v-text="item.title"></span>
                </li>
            </ul>
            <ul class="right-area slide-list">
                <li
                    v-for="item in list.slice(4)"
                    :key="item.id"
                    class="slide-item"
                    :style="{ width: `calc(100% / ${countPerRow})` }"
                >
                    <img :src="item.icon" class="image" />
                    <span class="title" v-text="item.title"></span>
                </li>
            </ul>
        </div>
        <div class="scrollbar">
            <div
                class="scroll-indicator"
                :style="{
                    transform: `translateX(${scrollIndicatorTranslateX})`,
                }"
            ></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';

const props = withDefaults(
    defineProps<{
        list: any[];
        countPerRow?: number;
    }>(),
    {
        countPerRow: 4,
    }
);

const containerDom = ref<HTMLElement | null>(null); // 包含块 DOM
const containerMinHeight = 69; // 包含块最小高度，单位 px
const rows = Math.ceil((props.list.length - props.countPerRow) / props.countPerRow);
const containerMaxHeight = containerMinHeight * rows + (rows - 1) * 8; // 包含块最大高度，单位 px；8px 是每行间的间距
const singleItemWidth = ref(0); // 单个 item 的宽度

// 触摸相关状态
const touchStartX = ref(0); // 触摸开始时的 X 坐标
const touchStartY = ref(0); // 触摸开始时的 Y 坐标
const scrollX = ref(0); // 滚动距离
const maxScrollDistance = ref(0); // 最大滚动距离
const isHorizontalScroll = ref(false); // 是否为横向滚动
const isTouching = ref(false); // 是否正在触摸
const isAnimating = ref(false); // 是否正在执行动画

// 速度追踪相关状态
const lastTouchX = ref(0);
const lastTouchTime = ref(0);
const velocityX = ref(0); // 水平方向滑动速度
const THRESHOLD = 0.5; // 滑动进度阈值：50%
const SWIPE_VELOCITY_THRESHOLD = 0.5; // 快速滑动速度阈值：0.5px/ms

// 滚动进度 (0-1)
const scrollProgress = computed(() => {
    if (maxScrollDistance.value <= 0) return 0;
    return Math.min(Math.max(scrollX.value / maxScrollDistance.value, 0), 1);
});

// 容器高度根据滚动进度动态变化
const containerHeight = computed(() => {
    return containerMinHeight + (containerMaxHeight - containerMinHeight) * scrollProgress.value;
});

// 整体内容的平移距离（负值，向左移动）
// scrollProgress = 0 → translateX = 0
// scrollProgress = 1 → translateX = -4 * singleItemWidth （向左移动 4 个 item 的宽度）
const containerTranslateX = computed(() => {
    return -scrollProgress.value * singleItemWidth.value * props.countPerRow;
});

// 滚动条平移距离
const scrollIndicatorTranslateX = computed(() => {
    return `${scrollProgress.value * 2 * 100}%`;
});

// 平滑动画到目标位置
const animateScrollTo = (targetX: number) => {
    if (isAnimating.value) return;

    isAnimating.value = true;
    const startX = scrollX.value;
    const distance = targetX - startX;
    const duration = 300;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        scrollX.value = startX + distance * easeProgress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimating.value = false;
        }
    };

    requestAnimationFrame(animate);
};

const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    touchStartY.value = e.touches[0].clientY;
    isHorizontalScroll.value = false;
    isTouching.value = true;

    // 初始化速度追踪
    lastTouchX.value = e.touches[0].clientX;
    lastTouchTime.value = performance.now();
    velocityX.value = 0;
};

const handleTouchMove = (e: TouchEvent) => {
    if (!isTouching.value) {
        return;
    }

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchStartX.value - touchX;
    const deltaY = Math.abs(touchStartY.value - touchY);

    if (!isHorizontalScroll.value && Math.abs(deltaX) > 5) {
        isHorizontalScroll.value = Math.abs(deltaX) > deltaY;
    }

    if (isHorizontalScroll.value) {
        e.preventDefault();

        const newScrollX = scrollX.value + deltaX;
        scrollX.value = Math.min(Math.max(newScrollX, 0), maxScrollDistance.value);

        touchStartX.value = touchX;
        touchStartY.value = touchY;

        // 计算滑动速度
        const currentTime = performance.now();
        const timeDelta = currentTime - lastTouchTime.value;

        if (timeDelta > 0) {
            const distance = lastTouchX.value - touchX;
            velocityX.value = distance / timeDelta; // px/ms

            lastTouchX.value = touchX;
            lastTouchTime.value = currentTime;
        }
    }
};

const handleTouchEnd = () => {
    isTouching.value = false;
    isHorizontalScroll.value = false;

    // 检测快速滑动（向左滑动速度超过阈值）
    if (velocityX.value > SWIPE_VELOCITY_THRESHOLD) {
        animateScrollTo(maxScrollDistance.value);
        return;
    }

    // 检测快速向右滑动（收起）
    if (velocityX.value < -SWIPE_VELOCITY_THRESHOLD) {
        animateScrollTo(0);
        return;
    }

    // 普通滑动：根据进度阈值判断
    const progress = scrollProgress.value;

    if (progress < THRESHOLD) {
        animateScrollTo(0);
    } else {
        animateScrollTo(maxScrollDistance.value);
    }
};

onMounted(() => {
    if (containerDom.value) {
        maxScrollDistance.value = containerDom.value.clientWidth;
        singleItemWidth.value = containerDom.value.clientWidth / props.countPerRow;
    }
});
</script>

<style lang="less" scoped>
ul,
li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.horizontal-slide-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 16px;
    overflow: hidden;

    .slide-list-wrap {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        will-change: height;

        &.transition {
            transition: height 0.15s ease-out;
        }

        &::-webkit-scrollbar {
            display: none;
        }

        .slide-list {
            display: flex;
            flex: none;
            flex-wrap: wrap;
            align-items: flex-start;
            width: 100%;

            .slide-item {
                display: flex;
                flex: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2px 0 9px;

                &:nth-of-type(n + 5) {
                    margin-top: 8px;
                }

                .image {
                    width: 35px;
                    height: 35px;
                }

                .title {
                    margin-top: 6px;
                    color: #222;
                    font-size: 12px;
                    line-height: 17px;
                }
            }
        }
    }

    .scrollbar {
        position: relative;
        width: 30px;
        height: 3px;
        background: #f5f5f5;
        border-radius: 15px;

        .scroll-indicator {
            position: absolute;
            left: 0;
            width: 10px;
            height: 100%;
            background: #222;
            border-radius: 15px;
            will-change: left;

            &.transition {
                transition: left 0.15s ease-out;
            }
        }
    }
}
</style>
