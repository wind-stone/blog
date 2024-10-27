<template>
  <div class="container">
    <div
      ref="ballRef"
      class="ball"
    />
    <input
      ref="rangeRef"
      type="range"
      max="1"
      min="0"
      step="0.01"
      :value="defaultValue"
      @input="onInputChange"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const ballRef = ref();
const rangeRef = ref(0);
const defaultValue = 0.5;

const onInputChange = (e) => {
    onRangeChange(e.target.value);
};

const onRangeChange = (value) => {
    ballRef.value.style.setProperty('--delay', `${-value}s`);
};

onMounted(() => {
    onRangeChange(defaultValue);
});
</script>

<style lang="less" scoped>
.container {
    width: 250px;
    padding: 20px;
    box-sizing: content-box;
    border: 1px #ccc solid;
    > .ball {
        --delay: 0s; // 通过 CSS 变量设置 animation-delay，后续动态修改该变量
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: red;
        margin-bottom: 20px;
        animation: ball-move 1s linear forwards paused;
        animation-delay: var(--delay);
    }

    > input {
        width: 100%;
    }

    @keyframes ball-move {
        to {
            transform: translateX(200px);
        }
    }
}
</style>
