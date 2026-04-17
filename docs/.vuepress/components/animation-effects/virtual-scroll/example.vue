<template>
  <div class="container">
    <VirtualScroll :list="list"></VirtualScroll>
  </div>
</template>

<script lang="ts" setup>
import VirtualScroll from './index.vue';

const list = new Array(1000).fill(0).map((_, index) => ({ id: index, name: `Item ${index}` }));
</script>

<style lang="less" scoped>
</style>
