<template>
  <div
    ref="dom"
    class="overlap-text"
  >
    CROSS OVER
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const dom = ref();

onMounted(() => {
    if (dom.value) {
        const len = dom.value.textContent.length;
        dom.value.innerHTML =  dom.value.textContent
            .split('')
            .map((text, index) => `<span style="z-index: ${len - index}">${text}</span>`)
            .join('');
    }
});
</script>

<style lang="less" scoped>
@font-face {
    font-family: 'Luckiest Guy';
    src: url('/font/LuckiestGuy.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
.overlap-text {
    padding: 20px;
    font-size: 100px;
    line-height: 150px;
    font-family: 'Luckiest Guy';
    letter-spacing: -10px;
    background-color: #000;;
    :deep(span) {
        position: relative;
        color: #fff;
        text-shadow: 10px 0 10px #000;
    }
}
</style>
