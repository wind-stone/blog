<template>
    <BaseMarquee class="base-marquee">
        <!-- 请确保此处的 slot 内容是个 v-for 循环的标签，且必须存在 key -->
        <div
            v-for="i in 10"
            :key="i"
            class="marquee-item"
        >
            {{ new Array(10).fill(i).join(' ') }}
        </div>
    </BaseMarquee>
</template>

<script>
import BaseMarquee from './index.vue';
export default {
    name: 'SimpleMarqueeExample',
    components: {
        BaseMarquee
    }
};
</script>

<style lang="less" scoped>
.base-marquee {
    height: 30px;
    border-radius: 15px;
}
.marquee-item {
    line-height: 30px;
}
</style>
