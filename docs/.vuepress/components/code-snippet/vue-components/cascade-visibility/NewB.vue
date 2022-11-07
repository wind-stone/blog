<template>
    <OldC
        v-model="selfVisible"
    />
</template>

<script>
import CascadeVisibility from './cascade-visibility';
import OldC from './OldC.vue';

export default {
    name: 'OldB',
    components: {
        OldC
    },
    mixins: [
        CascadeVisibility
    ]
};
</script>
