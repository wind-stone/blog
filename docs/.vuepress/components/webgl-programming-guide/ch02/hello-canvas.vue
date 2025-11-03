<template>
    <div class="hello-canvas">
        <canvas id="webgl" width="400" height="400">
            Please use a browser that supports "canvas"
        </canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { getWebGLContext } from '../lib/cuon-utils';

function main() {
    // Retrieve <canvas> element
    const canvas: HTMLCanvasElement = document.getElementById('webgl') as HTMLCanvasElement;

    // Get the rendering context for WebGL
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

onMounted(() => {
    main();
});

// Get the rendering context for 2DCG
</script>
