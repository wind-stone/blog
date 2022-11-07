<template>
    <BaseMarquee>
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
.marquee-item {
    line-height: 30px;
}
</style>
