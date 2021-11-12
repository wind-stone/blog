<template>
    <OldC
        v-model="selfVisible"
    />
</template>

<script>
import CascadeVisibility from './CascadeVisibility';
import OldC from './OldC';

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
