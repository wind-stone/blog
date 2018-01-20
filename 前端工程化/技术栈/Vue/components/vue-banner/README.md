# 轮播图组件

## 组件说明
移动端轮播图组件，一般用于顶部 banner

## 组件功能说明
- 支持异步修改 banner 数据
- 支持固定高度和自适应高度
- 支持自定义数据属性名称

## 技术依赖
- vuejs 2.0
- less
- ES2015

## 使用方式

```html
<vue-banner :banners="banners" :keys="keys" fixed-height="100px"></vue-banner>
```

```js
import VueBanner from 'vue-banner'

new Vue({
    el: '#j-example-ctn',
    components: {
        VueBanner
    },
    data: {
        banners: [
            {
                url: 'https://www.baidu.com',
                title: '1',
                img: 'http://xxx.com/baner2.jpg'
            },
            {
                url: 'https://www.baidu.com',
                title: '2',
                img: 'http://xxx.com/baner2.jpg'
            },
            {
                url: 'https://www.baidu.com',
                title: '3',
                img: 'http://xxx.com/baner2.jpg'
            },
            {
                url: 'https://www.baidu.com',
                title: '4',
                img: 'http://xxx.com/baner2.jpg'
            }
        ],
        keys: {
            url: 'url',      // 超链接 url
            title: 'title',  // 超链接的 title
            img: 'img'       // 图片 url
        }
    }
});

```

参数说明：
- banners：必需，Array，轮播图数据，数据结构见上方
- fixed-height: 可选，String，设置轮播图的固定高度，如“100px”，默认不设置即自适应宽度
- keys: 可选，Object，设置自定义 banners 里图片对象的属性名称，数据结构和默认值见上方

