<template>
    <div
        v-show="visible"
        class="old-c"
    >
        <span>这里是 C 组件的内容</span>
        <button @click="hideOldC">
            点击隐藏 C 组件
        </button>
    </div>
</template>

<script>
const EVENT_TOGGLE = 'toggle';

export default {
    name: 'OldC',
    model: {
        prop: 'visible',
        event: EVENT_TOGGLE
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hideOldC() {
            this.$emit(EVENT_TOGGLE, false);
        }
    }
};
</script>

<style lang="less" scoped>
.old-c {
    text-align: center;
}
button {
    padding: 10px;
    border: 1px solid red;
}
</style>
