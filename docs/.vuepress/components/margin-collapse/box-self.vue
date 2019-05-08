<template>
  <div class="example">
      <div class="ctn">
          <div class="last"></div>
          <p>需要注意，该段落之前的 .last 元素的上下外边距实际上已经折叠了，但是通过 DevTools --> Elements --> Styles 查看外边距时，视觉显示的却是没折叠的情况，但是这段文字是位于 .last 元素上下外边距折叠之后的外边距之下的，可打开 DevTools 查看页面元素详细查看</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'margin-collapse-box-self'
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.example {
  margin-top: 10px;
  border: 1px solid red;
  > .ctn {
    > .last {
      margin: 50px 0;
    }
    > p {
      padding: 10px;
    }
  }
}
</style>
