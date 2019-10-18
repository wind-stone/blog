<template>
  <div class="fastclick-bug">
    <div
      class="div1"
      @click="clickDiv1"
    >
      div1，点击此处，将在 div1 的 click 回调里触发 div2.click()
    </div>
    <div
      ref="div2"
      class="div2"
      :class="{'div2-bg': div2Bg}"
      @click="clickDiv2"
    >
      div2，div2 的 click 回调里将 tootle 背景色
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueTapFastclickBug',
  data() {
    return {
      div2Bg: false
    };
  },
  mounted() {
        // 在浏览器端再执行 fastclick
        import('fastclick').then(Fastclick => {
          Fastclick.attach(document.body);
        });
  },
  methods: {
    clickDiv1() {
      this.$refs.div2.click();
    },
    clickDiv2() {
      this.div2Bg = !this.div2Bg;
    }
  }
};
</script>

<style lang="less" scoped>
.div1,
.div2 {
    margin: 20px;
    background: gray;
}
.div2-bg {
    background: red;
}
</style>
