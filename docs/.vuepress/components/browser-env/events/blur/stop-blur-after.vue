<template>
    <div class="stop-blur">
        <input
            v-model="input"
            type="text"
            class="input"
            @blur="handleBlur"
            @focus="handleFocus"
        >
        <i
            v-show="isClearIconVisible"
            class="clear-icon"
            @mousedown.prevent
            @click="clear"
        >×</i>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
export default defineComponent({
    setup() {
        const input = ref('');
        const isInputFocus = ref(false);
        const isClearIconVisible = computed(() => {
            return isInputFocus.value && input.value.length > 0;
        });

        return {
            input,
            isClearIconVisible,
            handleBlur() {
                isInputFocus.value = false;
            },
            handleFocus() {
                console.log('focus');
                isInputFocus.value = true;
            },
            clear() {
                input.value = '';
            }
        };
    }
});
</script>

<style lang="less" scoped>
.stop-blur {
    position: relative;
    display: flex;
    width: 300px;
    font-size: 16px;
    line-height: 40px;
    input {
        flex: 1;
        height: 40px;
        padding: 0 45px 0 5px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        background-color: #FFF;
        box-sizing: border-box;
        outline: 0;
    }
    i {
        flex: none;
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        text-align: center;
        font-style: normal;
        cursor: pointer;
    }
}
</style>
