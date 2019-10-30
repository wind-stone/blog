<template>
    <div>
        <p class="ctn">
            <span class="a">Ba</span>
            <span class="b">Ba</span>
            <span class="c">Ba</span>
        </p>
        <p>译者注：这几款字体你的设备上可能没有，导致显示的结果与图 1 略有区别</p>
    </div>
</template>

<script>
export default {
    name: 'DifferentFonFamily'
};
</script>

<style lang="less" scoped>
.ctn {
    margin: 0;
    padding: 0;
    font-size: 100px;
    color: #f03e37;
    > span {
        background-color: #851e1f;
    }
}
.a {
    font-family: Helvetica;
}
.b {
    font-family: Gruppo;
}
.c {
    font-family: Catamaran;
}
</style>
