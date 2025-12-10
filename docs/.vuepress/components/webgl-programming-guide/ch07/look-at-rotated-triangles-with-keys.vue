<template>
    <div class="look-at-rotated-triangles-with-keys">
        <canvas id="webgl" width="400" height="400">
            Please use a browser that supports "canvas"
        </canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4 } from '../lib/cuon-matrix';

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ViewMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

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

    // Set the vertex coordinates and color (the blue triangle is in the front)
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Get the storage location of u_ViewMatrix
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage locations of u_ViewMatrix');
        return;
    }

    // Create the view matrix
    var viewMatrix = new Matrix4();
    // Register the event handler to be called on key press
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    };

    draw(gl, n, u_ViewMatrix, viewMatrix); // Draw
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
        // 顶点一坐标
        0.0, 0.5, -0.4,

        // 顶点一颜色，整体成绿色
        0.4, 1.0, 0.4,

        // 顶点二坐标
        -0.5, -0.5, -0.4,

        // 顶点二颜色，整体成绿色
        0.4, 1.0, 0.4,

        // 顶点三坐标
        0.5, -0.5, -0.4,

        // 顶点三颜色，整体成绿色
        1.0, 0.4, 0.4,

        // 顶点四坐标
        0.5, 0.4, -0.2,

        // 顶点四颜色，整体成黄色
        1.0, 0.4, 0.4,

        // 顶点五坐标
        -0.5, 0.4, -0.2,

        // 顶点五颜色，整体成黄色
        1.0, 1.0, 0.4,

        // 顶点六坐标
        0.0, -0.6, -0.2,

        // 顶点六颜色，整体成黄色
        1.0, 1.0, 0.4,

        // 顶点七坐标
        0.0, 0.5, 0.0,

        // 顶点七颜色，整体成蓝色
        0.4, 0.4, 1.0,

        // 顶点八坐标
        -0.5, -0.5, 0.0,

        // 顶点八颜色，整体成蓝色
        0.4, 0.4, 1.0,

        // 顶点九坐标
        0.5, -0.5, 0.0,

        // 顶点九颜色，整体成蓝色
        1.0, 0.4, 0.4,
    ]);
    var n = 9;

    // Create a buffer object
    var vertexColorbuffer = gl.createBuffer();
    if (!vertexColorbuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Write the vertex information and enable it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    //Get the storage location of a_Position, assign and enable buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object

    // Get the storage location of a_Position, assign buffer and enable
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    // Assign the buffer object to a_Color variable
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color); // Enable the assignment of the buffer object

    return n;
}

var g_eyeX = 0.2,
    g_eyeY = 0.25,
    g_eyeZ = 0.25; // Eye position
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if (ev.keyCode == 39) {
        // The right arrow key was pressed
        g_eyeX += 0.01;
    } else if (ev.keyCode == 37) {
        // The left arrow key was pressed
        g_eyeX -= 0.01;
    } else {
        return;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix: Matrix4) {
    // Set the matrix to be used for to set the camera view
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

    // Pass the view projection matrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

    gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the rectangle
}

onMounted(() => {
    main();
});
</script>
