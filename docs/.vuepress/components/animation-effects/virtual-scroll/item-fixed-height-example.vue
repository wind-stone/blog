<template>
    <div class="container">
        <VirtualScroll :list="list" v-slot="{ item }">
            <div class="item">{{ item.name }}</div>
        </VirtualScroll>
    </div>
</template>

<script lang="ts" setup>
import VirtualScroll from './item-fixed-height.vue';

const list = new Array(1000).fill(0).map((_, index) => ({ id: index, name: `Item ${index}` }));
</script>

<style lang="less" scoped>
.item {
    background-color: yellow;
    border: 1px solid red;
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    line-height: 28px;
}
</style>
