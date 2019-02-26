<template>
    <simple-marquee-index>
        <!-- 请确保此处的 slot 内容是个 v-for 循环的标签，且必须存在 key -->
        <div v-for="i in 10" :key="i" class="marquee-item">{{ new Array(10).fill(i).join(' ') }}</div>
    </simple-marquee-index>
</template>

<script>
export default {
    name: 'simple-marquee-example'
};
</script>

<style lang="less" scoped>
.marquee-item {
    line-height: 30px;
}
</style>
