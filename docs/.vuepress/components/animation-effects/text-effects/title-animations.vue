<template>
  <div
    ref="dom"
    class="title-animations"
  >
    <p class="title first-line">
      这是
    </p>
    <p class="title second-line">
      风动之石
    </p>
    <p class="title third-line">
      的 blog
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const dom = ref();
onMounted(() => {
    if (dom.value) {
        let index = 0;
        [...dom.value.children].forEach((p) => {
            p.innerHTML = p.textContent
                .split('')
                .map((char) => {
                    const text = `<span style="animation-delay: ${index++ * 0.1}s">${char}</span>`;
                    return text;
                }).join('');
        });
    }
});

</script>

<style lang="less">
@keyframes upShow {
    0% {
        opacity: 0;
        transform: skew(-10deg) translateY(300%);
    }
    100% {
        opacity: 1;
        transform: skew(-10deg) translateY(0);
    }
}

.title-animations {
    padding: 100px;
    .title {
        display: flex;
        transform: rotate(-10deg);
        transform-origin: 0 0;
        span {
            font-size: 50px;
            text-shadow: 1px 1px #533d4a, 2px 2px #533d4a, 3px 3px #533d4a, 4px 4px #533d4a, 5px 5px #533d4a;
            opacity: 0;
            animation: upShow 1s cubic-bezier(.58, .11, .63, 1.62) forwards;
        }
        &.first-line {
            color: red;
        }
        &.second-line {
            color: green;
        }
        &.third-line {
            color: blue;
        }
    }
}
</style>
