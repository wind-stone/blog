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
    width: 1.73em;
    height: 3em;
    background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .4)) 100% 0 no-repeat;

    /* 2D 转换 */
    transform: translateY(-1.3em) rotate(-30deg);
    transform-origin: bottom right;

    border-bottom-left-radius: inherit;
    box-shadow: -.2em .2em .3em -.1em rgba(0, 0, 0, .15);
}
</style>
