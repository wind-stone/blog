
<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
  </header>
  <!-- <RouterView /> -->
</template>

<script setup lang="ts">
import request from '@/libs/request';

(async function getSuccessData() {
  const res = await request.get('/api/a');
  console.log('+++ 请求成功：', res);
})();

(async function getFailedData() {
  try {
    const res = await request.post('/api/b');
  } catch (err) {
    console.log('+++ 请求失败', err);
  }
})()
</script>

<style lang="less" scoped>
header {
  > img {
    // 直接写 px，postcss-plugin-px2rem 会自动转成 rem
    width: 207px;
    height: 207px;


    // 直接使用 mixin 里函数，postcss 会自动在每个 less 文件上方添加 @import "@/styles/mixins";
    .one-line-ellipsis()
  }
}
</style>
