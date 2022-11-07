<template>
    <div class="new-a">
        <button @click="showNewB">
            显示 B 组件
        </button>
        <NewB
            v-model="proA"
        />
    </div>
</template>

<script>
import NewB from './NewB.vue';
export default {
    name: 'NewA',
    components: {
        NewB
    },
    data() {
        return {
            proA: false
        };
    },
    methods: {
        showNewB() {
            this.proA = true;
        }
    }
};
</script>

<style lang="less" scoped>
.new-a {
    text-align: center;
}
button {
    padding: 10px;
    border: 1px solid red;
}
</style>
