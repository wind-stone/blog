<template>
    <!-- 组件容器 -->
    <div class="view-container" ref="viewContainer" @scroll="handleScroll">
        <!-- 滚动条容器，其高度应该为没有虚拟列表时的实际高度 -->
        <div class="scrollbar-container" :style="{ height: `${scrollBarContainerHeight}px` }"></div>
        <!-- 实际渲染内容容器 -->
        <div
            class="content-container"
            ref="contentContainer"
            :data-scroll="scrollTop"
            :style="{ transform: `translate3d(0, ${translateY}px, 0)` }"
        >
            <div v-for="item in displayedList" :key="item.id" :id="item.id" class="item">
                <slot :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';

interface IScrollItem {
    id: string;
    name: string;
}
interface IPosition {
    index: number; // 当前 pos 对应的元素的下标
    height: number; // 元素高度
    top: number; // 元素顶部距离（元素顶部与容器顶部的距离）
    bottom: number; // 元素底部距离（元素底部与容器顶部的距离）
    disHeight: number; // 实际高度与预估高度的差
}

const props = withDefaults(
    defineProps<{
        list: IScrollItem[]; // 数据源
        initItemHeight?: number; // 每一项的高度
        bufferCount?: number; // 前后的缓冲区数量，解决快速滑动导致的看见空白的问题
    }>(),
    {
        initItemHeight: 20,
        bufferCount: 2,
    }
);

// 元素位置列表
const positionList = ref<IPosition[]>(
    props.list.map((item, index) => {
        return {
            index,
            height: props.initItemHeight,
            top: index * props.initItemHeight,
            bottom: (index + 1) * props.initItemHeight,
            disHeight: 0,
        };
    })
);

const viewContainer = ref<HTMLDivElement>(); // 可视容器 DOM
const viewContainerHeight = ref(0); // 可视容器高度
const contentContainer = ref<HTMLDivElement>(); // 内容容器 DOM
const scrollBarContainerHeight = computed(() => {
    return positionList.value[positionList.value.length - 1].bottom;
}); // 滚动条容器高度

// startIndex 和 endIndex 要在滚动时动态改变
const startIndex = ref(0);
const renderCount = ref(0);
const endIndex = computed(() => {
    return Math.min(startIndex.value + renderCount.value + 1, props.list.length);
});
const displayedList = computed(() => {
    return props.list.slice(startIndex.value, endIndex.value);
});

// 计算实际渲染的元素信息
const setPosition = () => {
    if (!contentContainer.value) {
        return;
    }
    const itemList = [...(contentContainer.value.childNodes || [])].filter(item => {
        return item.nodeType === 1; // 元素节点
    }) as HTMLDivElement[];
    if (!itemList?.length) {
        return;
    }
    itemList.forEach(node => {
        const height = node.getBoundingClientRect().height;
        const index = +node.id;
        const item = positionList.value[index];
        const oldHeight = item.height; // 旧的高度
        const disHeight = oldHeight - height; // 高度差值
        if (disHeight) {
            item.height = height;
            item.bottom -= disHeight;
            item.disHeight = disHeight;
        }
    });
    // 重新计算所有节点的位置信息（从当前渲染的第一个节点之后开始）
    const startIndex = +itemList[0].id;
    const positionLen = positionList.value.length;
    let allDisHeight = positionList.value[startIndex].disHeight; // 所有的距离差值
    positionList.value[startIndex].disHeight = 0;
    for (let i = startIndex + 1; i < positionLen; i++) {
        const item = positionList.value[i];
        item.top = positionList.value[i - 1].bottom;
        // 这里只算 item 之前的元素造成的距离差值，item 元素本身的高度变化导致的差值已经在上一步 forEach 里处理过了
        item.bottom = item.bottom - allDisHeight;
        if (item.disHeight !== 0) {
            allDisHeight += item.disHeight;
            item.disHeight = 0;
        }
    }
};

// 监听外层容器的渲染完成
watch(
    viewContainer,
    dom => {
        if (dom) {
            // 确定外部容器高度
            viewContainerHeight.value = dom.offsetHeight;

            // 确定渲染数量，前后都加上 bufferCount 个元素
            renderCount.value = Math.ceil(viewContainerHeight.value / props.initItemHeight) + props.bufferCount * 2;

            nextTick(() => {
                setPosition();
            });
        }
    },
    {
        immediate: true,
    }
);

const scrollTop = ref(0); // 初始滚动距离

// （滚动时）二分搜索查找 startIndex，注意，这里要处理 renderCount
const getStartIndex = (scrollTop: number) => {
    if (scrollTop < positionList.value[props.bufferCount].bottom) {
        return 0;
    }

    if (scrollTop >= positionList.value[positionList.value.length - renderCount.value].bottom) {
        return positionList.value.length - renderCount.value;
    }
    let start = 0;
    let end = positionList.value.length - 1;

    while (start < end) {
        const middle = Math.floor((start + end) / 2);
        const middleTop = positionList.value[middle].top;
        const middleBottom = positionList.value[middle].bottom;

        if (scrollTop === middleBottom) {
            return middle + 1;
        } else if (scrollTop >= middleTop && scrollTop < middleBottom) {
            return middle;
        } else if (scrollTop > middleBottom) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }
    return start;
};

// 内容容器向下平移的距离
const translateY = ref(0);
const handleScroll = (e: Event) => {
    // 获取滚动距离
    scrollTop.value = (e.target as HTMLElement).scrollTop;

    if (scrollTop.value < positionList.value[props.bufferCount].bottom) {
        // 滚动 bufferCount + 1 个 item 距离以内，
        // 因为此时 startIndex 一直是 0（数组元素不变），
        startIndex.value = 0;
        translateY.value = 0;
    } else {
        startIndex.value = getStartIndex(scrollTop.value);
        translateY.value = positionList.value[startIndex.value].top;
    }
    nextTick(() => {
        setPosition();
    });
};
</script>

<style lang="less" scoped>
.view-container {
    position: relative;
    overflow-y: scroll;
    height: 100%;
    width: 100%;
    .content-container {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        .item {
            background: yellow;
        }
    }
}
</style>
