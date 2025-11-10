<template>
    <div class="hello-triangle">
        <canvas id="webgl" width="400" height="400">
            Please use a browser that supports "canvas"
        </canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { getWebGLContext, initShaders } from '../lib/cuon-utils';

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' + 'void main() {\n' + '  gl_Position = a_Position;\n' + '}\n';

// Fragment shader program
var FSHADER_SOURCE = 'void main() {\n' + '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + '}\n';

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.LINES, 0, n); // 线段，V1-V2，V3 被省略
    // gl.drawArrays(gl.LINE_STRIP, 0, n); // 连续的线段，V1-V2，V2-V3
    gl.drawArrays(gl.LINE_LOOP, 0, n); // 连续、闭合的线段，V1-V2，V2-V3，V3-V1
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}

onMounted(() => {
    main();
});
</script>
