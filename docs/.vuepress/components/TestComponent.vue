<template>
    <div class="root" @click="showAlert">测试-文案</div>
</template>

<script>
export default {
    name: 'TestComponent',
    methods: {
        showAlert() {
            alert('用户点击');
        }
    },
}
</script>

<style scoped>
.root {
    color: red;
}
</style>

