import Vue from 'vue'
import VueTofu from './components/vue-tofu'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: require('./main.html.tpl'),
  components: { VueBanner, VueTofu },
  data () {
    return {
        data3: [
            {
                "master_title": "汽车维6",
                "link_url": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "xxx"
            },
            {
                "master_title": "汽车维7",
                "link_url": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "xxx"
            },
            {
                "master_title": "汽车维8",
                "link_url": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "xxx"
            }
        ],
        data4: [
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            }

        ],
        data5: [
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            }
        ],
        data6: [
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
        ],
        data7: [
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },{
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
        ],
        data8: [
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维8",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维6",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            },
            {
                "masterTitle": "汽车维7",
                "linkUrl": "xxx",
                "imageUrlLarge": "xxx",
                "imageUrlMiddle": "xxx",
                "imageUrlTiny": "http://cp01-ocean-400.epc.baidu.com:8082/space/wh%3D150%2C150/sign=5f469a1f367adab43d851342bee49f2d/3ac79f3df8dcd1001dfed116728b4710b9122fa2.jpg",
                "slaveTitle": "维修50减4"
            }
        ],
        keys: {
            linkUrl: 'link_url',
            id:'id',
            masterTitle: 'master_title',
            imageUrlLarge: 'imageUrlLarge',
            slaveTitle: 'slave_title'
        }
    }
  }
})
