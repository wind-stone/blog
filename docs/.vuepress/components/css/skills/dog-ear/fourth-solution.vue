<template>
  <div class="dog-ear" />
</template>

<style lang="less" scoped>
.dog-ear {
    position: relative;
    width: 20px;
    height: 20px;
    border: 180px solid #58a;
    border-width: 0 0 180px 180px;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: #58a;
    background: linear-gradient(to left bottom, transparent 50%, #47728f 0);
}
</style>
