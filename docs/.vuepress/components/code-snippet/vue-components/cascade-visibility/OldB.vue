<template>
    <OldC
        v-model="visible"
    />
</template>

<script>
import OldC from './OldC.vue';
const EVENT_TOGGLE = 'toggle';

export default {
    name: 'OldB',
    components: {
        OldC
    },
    model: {
        prop: 'visible',
        event: EVENT_TOGGLE
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    }
};
</script>
