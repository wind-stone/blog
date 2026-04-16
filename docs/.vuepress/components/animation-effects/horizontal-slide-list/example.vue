<template>
    <div class="horizontal-slide-list-example">
        <HorizontalSlideList :list="list" />
    </div>
</template>

<script lang="ts" setup>
import HorizontalSlideList from './index.vue'
import Icon from './icon.png';

const list = new Array(26).fill(1).map((item, index) => {
    return {
        id: index,
        title: `菜单名称${index}`,
        icon: Icon
    }
})
console.log('+++ list', list)
</script>

<style lang="less" scoped>
.horizontal-slide-list-example {
    width: 360px;
    margin: 0 auto;
    background-color: #eaeaea;
    padding: 20px 0;
}
</style>
