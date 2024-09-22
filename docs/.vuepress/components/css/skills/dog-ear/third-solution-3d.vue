<template>
  <div class="dog-ear" />
</template>

<style lang="less" scoped>
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background: #58a;
    background: linear-gradient(-150deg, transparent 1.5em, #58a 0);
    /* 圆角 */
    border-radius: .5em;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 1.73em;
    width: 3em;
    background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .4)) 100% 0 no-repeat;

    /* 使用 3D 转换 */
    transform: rotate(-120deg) rotateX(180deg);
    transform-style: preserve-3d;

    border-bottom-left-radius: inherit;
    box-shadow: -.2em .2em .3em -.1em rgba(0, 0, 0, .15);
}
</style>
