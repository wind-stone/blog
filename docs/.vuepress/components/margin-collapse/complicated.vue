<template>
  <div class="example">
    <div class="ctn">
      <div class="float">
        浮动元素
      </div>
      <div class="clear-float" />
      <div class="last" />
      <div>这是 .ctn 元素的最后一个子元素</div>
    </div>
    <p>这是 .ctn 元素的兄弟元素</p>
  </div>
</template>

<script>
export default {
  name: 'MarginCollapseComplicated'
};
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
        margin: 0 0 50px;
        > .float {
            float: left;
            height: 50px;
            background: blue;
        }
        > .clear-float {
            margin: 25px 0 50px;
            clear: left;
        }
        > .last {
            margin: 50px 0;
        }
    }
}
</style>
