<template>
    <div class="container">
        <VirtualScroll v-slot="{ item }" :list="list" :buffer-count="5">
            <div class="item">{{ item.name }}</div>
        </VirtualScroll>
    </div>
</template>

<script lang="ts" setup>
import VirtualScroll from './item-dynamic-height.vue';

const list = new Array(100).fill(0).map((_, index) => {
    const lines = (index % 3) + 1;

    return {
        id: String(index),
        name: `${index}、${new Array(lines)
            .fill(0)
            .map(() => '虚拟列表元素占满')
            .join('\n')}`,
    };
});
</script>

<style lang="less" scoped>
.container {
    height: 400px;
    width: 200px;

    .item {
        line-height: 20px;
        border: 1px solid red;
        box-sizing: border-box;
    }
}
</style>
