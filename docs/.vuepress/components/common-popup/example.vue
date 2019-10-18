<template>
  <div class="common-popup-example">
    <button @click="show">
      打开弹窗
    </button>
    <common-popup-index
      v-model="isShow"
      :forbid-bg-scroll="forbidBgScroll"
      scroll-area-selector=".scroll-area"
      :show-close="true"
      @close="hide"
    >
      <div class="common-popup-slot">
        <h1 class="title">
          弹窗标题
        </h1>
        <ul class="scroll-area">
          <li
            v-for="i in 30"
            :key="i"
          >
            {{ i }}、这里是列表项
          </li>
        </ul>
      </div>
    </common-popup-index>
  </div>
</template>

<script>
export default {
  name: 'CommonPopupExample',
  props: {
    forbidBgScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="less">
.common-popup-slot {
    h1,
    ul,
    li {
        margin: 0;
        padding: 0;
    }
}
</style>
<style lang="less" scoped>
.common-popup-slot {
    width: 300px;
    background-color: #ffe5ae;
    > .title {
        font-weight: bold;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
    }
    > .scroll-area {
        height: 280px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
}
</style>
