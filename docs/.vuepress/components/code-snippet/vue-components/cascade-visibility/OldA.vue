<template>
    <div class="old-a">
        <button @click="showOldB">
            显示 B 组件
        </button>
        <OldB
            v-model="proA"
        />
    </div>
</template>

<script>
import OldB from './OldB.vue';
export default {
    name: 'OldA',
    components: {
        OldB
    },
    data() {
        return {
            proA: false
        };
    },
    methods: {
        showOldB() {
            this.proA = true;
        }
    }
};
</script>

<style lang="less" scoped>
.old-a {
    text-align: center;
}
button {
    padding: 10px;
    border: 1px solid red;
}
</style>
