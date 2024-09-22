<template>
  <div class="dog-ear" />
</template>

<style lang="less" scoped>
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background: #58a;
    /* 多个背景图从上往下分布，第一个背景图处于最上方 */
    background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .4) 0) no-repeat 100% 0 / 29px 29px,
                linear-gradient(-135deg, transparent 20px, #58a 0);
}
</style>
