<template>
    <ul v-if="len && len >= 3" class="vue-tofu">
        <li v-for="(item, index) in contents" class="tofu-item">
          <a :href="item[keys.linkUrl] ? item[keys.linkUrl] : 'javascript:;'" class="tofu-link">
            <div class="tofu-title-ctn">
                <div class="tofu-maintitle" >{{item[keys.masterTitle] | titleCut(6)}}</div>
                <div class="tofu-subtitle">{{item[keys.slaveTitle] | titleCut(8)}}</div>
            </div>
            <div class="tofu-img-ctn">
                <img v-if="item[keys.imageUrlLarge]" :src="item[keys.imageUrlLarge]" class="tofu-img">
            </div>
          </a>
        </li>
    </ul>
</template>

<script>
import './rem';
export default {
    props: {
        contents: {
            validator: function (arr) {
                if(arr && arr.length > 8){
                    arr = arr.slice(0,8);
                }
                return arr;
            }
        },
        keys: {
            type: Object,
            required: false,
            default: function () {
                return {
                    linkUrl: 'linkUrl',
                    id:'id',
                    masterTitle: 'masterTitle',
                    imageUrlLarge: 'imageUrlLarge',
                    slaveTitle: 'slaveTitle'
                };
            }
        },
        titlecolor: {
            type: Object,
            required: false
        },
        maintitle: ''
    },
    computed:{
        len () {
            return this.contents && this.contents.length;
        }
    },

    // 过滤器，待删除
    filters: {
        titleCut: function (value, num) {
            return value.substring(0, num);
        }
    },

    // 指令，待删除
    directives: {
        addlog: function () {

        }
    }

}
</script>

<style lang="less">
@import './rem/index.less';


@border-color: #e1e1e1;
@short-height: 140;
@tall-height: @short-height * 2;

.border-right(@border-color) {
    position: relative;
    &:before {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 100%;
        border-right: 1px solid @border-color;
        box-sizing: border-box;
    }
}
.border-bottom(@border-color) {
    position: relative;
    &:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
        border-bottom: 1px solid @border-color;
        box-sizing: border-box;
    }
}
.border-all {
    position: relative;
    &:before {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #fff;
        box-sizing: border-box;
        z-index: 100;
    }
}

// 第一种豆腐类型：又宽又高
.tall-fat-tofu {
    .rem(height, @tall-height);

    // 标题类型
    .tofu-title-ctn {
        position: absolute;
        top: 25%;
        transform: translateY(-50%);
        .rem(margin-left, 20);
    }

    .tofu-img-ctn {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: auto;
        text-align: center;
        .tofu-img {
            .rem(width, 176);
            .rem(height, 176);
        }
    }
    background: red;
}

// 第二种豆腐类型：矮、宽
.short-fat-tofu {
    .rem(height, @short-height);
    overflow: hidden;

    // 标题类型
    .tofu-title-ctn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .rem(margin-left, 20);
    }

    .tofu-img-ctn {
        width: 100%;
        height: 100%;
        text-align: right;
        .tofu-img {
            .rem(width, @short-height);
            .rem(height, @short-height);
            .rem(margin-right, 10);
        }
    }
    .border-right(@border-color);
    .border-bottom(@border-color);
    background: blue;
}

// 第三种豆腐类型：高、窄
.tall-thin-tofu {
    width: 25%;
    height: auto;

    // 标题类型
    .tofu-title-ctn {
        position: relative;
        top: 0;
        height: 44px;
        padding-top: 6px;
        transform: translateY(0);
    }

    .tofu-img-ctn {
        height: auto;
        text-align: center;
        .tofu-img {
            .rem(width, @short-height);
            .rem(height, @short-height);
            margin-right: 0;
        }
    }
    background: green;
}

.vue-tofu {
    position: relative;
    padding: 0;
    background-color: #fff;
    overflow: hidden;
    &:before {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 100%;
        border-right: 1px solid #fff;
        box-sizing: border-box;
        z-index: 100;
    }
    &:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
        border-bottom: 1px solid #fff;
        box-sizing: border-box;
        z-index: 100;
    }
}
.tofu-item {
    float: left;
    width: 50%;

    // 链接
    .tofu-link {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    // 标题
    .tofu-maintitle {
        font-size: 16px;
        line-height: 22px;
        color: #333;
    }
    .tofu-subtitle {
        font-size: 12px;
        line-height: 18px;
        color: #999;
    }

    // 默认是矮宽的豆腐
    .short-fat-tofu;

    // 将第一个豆腐变成 高宽 豆腐，当豆腐块数量为3/5/7时
    &:first-child:nth-last-child(2n+1) {
        .tall-fat-tofu;
    }

    // 当豆腐块数量为 >= 6时,设置最后四个豆腐为 高窄 豆腐
    &:nth-child(n+3):nth-last-child(4),
    &:nth-child(n+3):nth-last-child(4) ~ & {
        .tall-thin-tofu;
    }
}
</style>