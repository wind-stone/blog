<template>
    <div class="look-at-rotated-triangles-with-keys-view-volume">
        <canvas id="webgl" width="400" height="400">
            Please use a browser that supports "canvas"
        </canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4 } from '../lib/cuon-matrix';

// LookAtTrianglesWithKey_ViewVolume.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
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
        console.log('Failed to specify the vertex infromation');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Get the storage locations of u_ViewMatrix and u_ProjMatrix variables
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (!u_ViewMatrix || !u_ProjMatrix) {
        console.log('Failed to get u_ViewMatrix or u_ProjMatrix');
        return;
    }

    // Create the matrix to specify the view matrix
    var viewMatrix = new Matrix4();
    // Register the event handler to be called on key press
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    };

    // Create the matrix to specify the viewing volume and pass it to u_ProjMatrix
    var projMatrix = new Matrix4();
    projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    draw(gl, n, u_ViewMatrix, viewMatrix); // Draw the triangles
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

    // Write vertex information to buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

var g_EyeX = 0.2,
    g_EyeY = 0.25,
    g_EyeZ = 0.25; // Eye position
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if (ev.keyCode == 39) {
        // The right arrow key was pressed
        g_EyeX += 0.01;
    } else if (ev.keyCode == 37) {
        // The left arrow key was pressed
        g_EyeX -= 0.01;
    } else {
        return;
    } // Prevent the unnecessary drawing
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    // Set the matrix to be used for to set the camera view
    viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);

    // Pass the view projection matrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

onMounted(() => {
    main();
});
</script>
