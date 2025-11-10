<template>
    <div class="drawing-rectangle">
        <canvas id="example" width="400" height="400">
            Please use a browser that supports "canvas"
        </canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

function main() {
    // Retrieve <canvas> element
    const canvas: HTMLCanvasElement = document.getElementById('example') as HTMLCanvasElement;
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    // Get the rendering context for 2DCG
    const ctx = canvas.getContext('2d');

    // Draw a blue rectangle
    ctx!.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set color to blue
    ctx!.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
}

onMounted(() => {
    main();
});
</script>
