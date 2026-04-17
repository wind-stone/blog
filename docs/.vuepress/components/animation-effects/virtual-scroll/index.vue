<template>
  <!-- 组件容器 -->
  <div class="view-container" :style="{ height: `${viewHeight}px` }" @scroll="handleScroll">
    <!-- 滚动条容器，其高度应该为没有虚拟列表时的实际高度 -->
    <div class="scrollbar-container" :style="{ height: `${itemHeight * list.length}px` }"></div>
    <!-- 实际渲染内容容器 -->
    <div class="content-container" :data-scrool="scrollTop" :style="{ transform: `translateY(${translateY}px)`}">
        <div v-for="item in displayedList" :key="item.id" class="item" :style="{ height: `${itemHeight}px` }">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface Item {
  id: number
  name: string
}

const props = withDefaults(defineProps<{
  list: Item[] // 数据源
  viewHeight?: number // 可视容器高度
  itemHeight?: number // 每一项的高度
  bufforCount?: number // 前后的缓冲区数量，解决快速滑动导致的看见空白的问题
}>(), {
  viewHeight: 400,
  itemHeight: 30,
  bufforCount: 5,
})

const renderCount = computed(() => {
  const countInView = Math.ceil(props.viewHeight / props.itemHeight)
  return countInView + props.bufforCount * 2;
})

const scrollTop = ref(0); // 初始滚动距离
const startIndex = computed(() => {
  // 滚动 bufforCount + 1 个 item 距离以内，都是从 0 开始
  return Math.max(Math.floor(scrollTop.value / props.itemHeight) - props.bufforCount, 0);
})
const endIndex = computed(() => {
  return Math.min(startIndex.value + renderCount.value, props.list.length);
})
const displayedList = computed(() => {
  return props.list.slice(startIndex.value, endIndex.value);
})
const handleScroll = (e: Event) => {
  // 获取滚动距离
  scrollTop.value = (e.target as HTMLElement).scrollTop;
};

const translateY= computed(() => {
  if (scrollTop.value < props.itemHeight * (props.bufforCount + 1)) {
    // 滚动 bufforCount + 1 个 item 距离以内，
    // 因为此时 startIndex 一直是 0（数组元素不变），为了看到滚动效果，都不需要 translateY（content-container 会跟着滚动）
    return 0;
  } else {
    // 先说现象：假设滚动了 100 个 元素距离，在虚拟列表里，我应该看到的是原数组下标 100 的元素（注意，下标是从 0 开始的）
    // 此时，因为新数组 displayedList 第一个元素即 displayedList[0]，实际上对应原数组 list 的 100 - bufforCount（即 startIndex）
    // 所以，原数组下标 100 的元素，在新数组 displayedList 的下标是 100 - (100 - bufforCount) = 
    return props.itemHeight * (startIndex.value);
  }
})
</script>

<style lang="less" scoped>
.view-container {
  width: 200px;
  border: 1px solid red;
  overflow-y: scroll;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.scrollbar-container {
  background-color: blue;
}

.content-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.item {
  background-color: yellow;
  border: 1px solid red;
  box-sizing: border-box;
  width: 100%;
}
</style>
