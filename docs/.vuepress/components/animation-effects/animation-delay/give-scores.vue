<template>
  <div class="container">
    <div class="title">
      你对我们的印象是：
    </div>
    <div class="content">
      <div
        ref="faceRef"
        class="face"
      >
        <div class="eye left-eye" />
        <div class="eye right-eye" />
        <div class="mouse" />
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const faceRef = ref();
const rangeRef = ref(0);
const defaultValue = 0;

const onInputChange = (e) => {
    onRangeChange(e.target.value);
};

const onRangeChange = (value) => {
    faceRef.value.style.setProperty('--delay', `${-value}s`);
};

onMounted(() => {
    onRangeChange(defaultValue);
});
</script>

<style lang="less" scoped>
@keyframes faceChange {
    0% {
        background-color: red;
    }

    60% {
        background-color: yellowgreen;
    }

    100% {
        background-color: green;
    }
}

@keyframes leftEyeChange {
    0% {
        clip-path: polygon(0 70%, 100% 0, 100% 100%, 0 100%)
    }

    60% {
        clip-path: polygon(0 0%, 100% 0, 100% 100%, 0 100%)
    }

    100% {
        clip-path: polygon(0 0%, 100% 0, 100% 100%, 0 100%)
    }
}

@keyframes rightEyeChange {
    0% {
        clip-path: polygon(0 0%, 100% 70%, 100% 100%, 0 100%)
    }

    60% {
        clip-path: polygon(0 0%, 100% 0, 100% 100%, 0 100%)
    }

    100% {
        clip-path: polygon(0 0%, 100% 0, 100% 100%, 0 100%)
    }
}

@keyframes mouseChange {
    50% {
        height: 4px;
        box-shadow: inset 0 4px 0 #fff;
        transform: translateY(11px);
        clip-path: inset(0% 0% 0% 0%);
    }

    50.1% {
        height: 4px;
        box-shadow: inset 0 -4px 0 #fff;
        transform: translateY(11px);
        clip-path: inset(50% 0% 0% 0%);
    }

    100% {
        height: 30px;
        box-shadow: inset 0 -15px 0 #fff;
        transform: translateY(-10px);
        clip-path: inset(50% 0% 0% 0%);
    }
}

.container {
    > .content {
        > .face {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 20px;
            border-radius: 50%;
            --delay: 0s;
            animation: faceChange 1s linear forwards paused;
            animation-delay: var(--delay);

            > .eye {
                position: absolute;
                top: 20px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: white;

                &.left-eye {
                    left: 15px;
                    animation: leftEyeChange 1s linear forwards paused;
                    animation-delay: var(--delay);
                }
                &.right-eye {
                    right: 15px;
                    animation: rightEyeChange 1s linear forwards paused;
                    animation-delay: var(--delay);
                }
            }

            > .mouse {
                position: absolute;
                left: 34px;
                top: 65px;
                width: 32px;
                height: 30px;
                border-radius: 50%;
                animation: mouseChange 1s linear forwards paused;
                animation-delay: var(--delay);
                box-shadow: inset 0 2px 0 #fff;
                clip-path: inset(0% 0% 0% 0%);
            }
        }
        .input {
            width: 100%;
            margin-top: 200px;
        }
    }
}
</style>
