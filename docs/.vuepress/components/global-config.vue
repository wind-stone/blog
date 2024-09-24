<template>
  <div class="global-config">
    <div class="count">
      <span
        v-show="busuanziVisible"
        id="busuanzi_container_site_pv"
      >
        本站总访问量&nbsp;&nbsp;<span
          id="busuanzi_value_site_pv"
          ref="busuanziRef"
        />&nbsp;&nbsp;次
      </span>
    </div>
    <Giscus
      id="comments"
      repo="wind-stone/blog"
      repo-id="MDEwOlJlcG9zaXRvcnk4MzIwNDgwMw=="
      category="Announcements"
      category-id="DIC_kwDOBPWaw84Ciupj"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Giscus from '@giscus/vue';
const busuanziVisible = ref(false);

const initBusuanzi = () => {
    const script = document.createElement('script');
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.onload = () => {
        setTimeout(() => {
            busuanziVisible.value = true;
        }, 1000);
    };
    document.body.appendChild(script);
};

onMounted(() => {
    initBusuanzi();
});
</script>

<style lang="less" scoped>
.count {
    height: 22px;
    margin: 50px;
    text-align: center;
}
</style>
