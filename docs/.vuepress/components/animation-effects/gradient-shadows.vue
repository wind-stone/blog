<template>
  <div class="box">
    <img src="/images/logo.png">
  </div>
</template>

<style lang="less" scoped>
.box {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #000;
    box-sizing: border-box;
    margin: 2em auto;
    // 通过 CSS 变量，控制阴影的偏移
    --shadow-x: 10px;
    --shadow-y: 10px;
    > img {
        height: 100%;
        width: 100%;
    }
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: var(--shadow-x);
        top: var(--shadow-y);
        z-index: -1;

        filter: blur(10px);
        background: conic-gradient(red, orange, yellow, green, blue, red);

        // 裁剪，只有 .box 内容区域不显示，其他地方都显示
        // 注意，当有偏移时，裁剪也要考虑偏移，比如阴影偏移 10px 10px，则 after 伪类在裁剪时，就要向左和向上偏移 10px
        clip-path: polygon(
            -100vmax -100vmax,
            100vmax -100vmax,
            100vmax 100vmax,
            -100vmax 100vmax,
            -100vmax -100vmax,
            calc(0px - var(--shadow-x)) calc(0px - var(--shadow-y)),
            calc(0px - var(--shadow-x)) calc(100% - var(--shadow-y)),
            calc(100% - var(--shadow-x)) calc(100% - var(--shadow-y)),
            calc(100% - var(--shadow-x)) calc(0px - var(--shadow-y)),
            calc(0px - var(--shadow-x)) calc(0px - var(--shadow-y))
        );
    }
}

</style>
