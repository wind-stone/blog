<template>
    <div class="border-image-linear-gradient">
        <h1>实现方式一：border-image</h1>
        <div class="background">
            <div class="example first-example" />
        </div>
        <h1>实现方式二：border-image*2</h1>
        <div class="background">
            <div class="example second-example">
                <div class="inner-second" />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.border-image-linear-gradient {
    h1 {
        font-size: 16px;
    }
    .background {
        padding: 20px;
        background: #1d0277;
        .example {
            width: 700px;
            height: 30px;

            &.first-example {
                border: 2px solid;
                border-radius: 16px;
                border-image: linear-gradient(180deg,#9a5eff 0%, #702ff3 100%) 2;
                background: blue;
            }
            &.second-example {
                padding: 2px;
                border-radius: 16px;
                background: linear-gradient(180deg,#9a5eff 0%, #702ff3 100%);
                .inner-second {
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    background: blue;
                }
            }
        }
    }
}
</style>
