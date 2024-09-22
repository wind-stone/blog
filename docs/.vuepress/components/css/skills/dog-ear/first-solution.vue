<template>
  <div class="dog-ear" />
</template>

<style lang="less" scoped>
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: #58a;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    border: 20px solid transparent;
    border-right-color: #47728f;
    transform: rotate(-45deg);
}
.dog-ear::after {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    border: 20px solid transparent;
    border-left-color: #fff;
    transform: rotate(-45deg);
}
</style>
