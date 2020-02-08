<template>
    <my-page class="page-home" title="广州新冠病例分布" :page="page" :containerPadding="false">
        <div class="common-container container">
            <!-- <div class="input-box">
                <input class="input" v-model="location" placeholder="116.404,39.915">
                <ui-icon-button class="btn" icon="send" @click="gotoLocation" />
            </div> -->
            <div class="map" id="container"></div>
            <div class="infoBox" v-if="infoBox.visible">
                <div class="body">
                    <div class="areaBox">
                        <div class="item province">{{ infoBox.item.province }}</div>
                        <div class="item city">{{ infoBox.item.city }}</div>
                        <div class="item area">{{ infoBox.item.area }}</div>
                    </div>
                    <div class="detail">{{ infoBox.item.address }}</div>
                </div>
                <div class="close" @click="close">关闭</div>
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                infoBox: {
                    visible: true,
                    item: {
                        "address": "越秀区海珠广场侨光路万艺广场",
                        "longitude": 113.26190925238117,
                        "latitude": 23.118430370467536,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                },
                locations: [
                    {
                        "address": "越秀区海珠广场侨光路万艺广场",
                        "longitude": 113.26190925238117,
                        "latitude": 23.118430370467536,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区梅花村街杨箕村金羊花园",
                        "longitude": 113.3039449386385,
                        "latitude": 23.129323693440572,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区黄花岗街东风东路",
                        "longitude": 113.29006685185318,
                        "latitude": 23.133928814674302,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区农林下路",
                        "longitude": 113.2923870554936,
                        "latitude": 23.131763114496085,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区水均岗",
                        "longitude": 113.3015503182311,
                        "latitude": 23.132630574247017,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区水荫路",
                        "longitude": 113.30626731004514,
                        "latitude": 23.14533812492923,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区淘金路",
                        "longitude": 113.28488455286289,
                        "latitude": 23.14315963583088,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区淘金东路御龙庭",
                        "longitude": 113.29042149202684,
                        "latitude": 23.145255760618245,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    },
                    {
                        "address": "越秀区于华乐街华侨新村光明路",
                        "longitude": 113.28580031994446,
                        "latitude": 23.14039046007254,
                        "type": "WGS-84",
                        "province": "广东省",
                        "city": "广州市",
                        "area": "越秀区"
                    }
                ],
                location: '',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/fe3d77a045c011eab555973d75a6ca00',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.map = new AMap.Map('container', {
                zoom: 9,
                center: [113, 24],
            })
            this.markers = []
            this.init()
        },
        methods: {
            close() {
                this.infoBox.visible = false
            },
            init() {
                this.markers = []
                let idx = 0
                for (let item of this.locations) {
                    let coord = coordtransform.wgs84togcj02(item.longitude, item.latitude)
                    console.log('coord', coord)
                    // let coord = [lng, lat]
                    let marker = new AMap.Marker({
                        clickable: true,
                        position: new AMap.LngLat(coord[0], coord[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        extData: idx++
                        // title: '北京'
                    })
                    this.markers.push(marker)
                    let clickHandle = AMap.event.addListener(marker, 'click', e => {
                        let extData = e.target.getExtData()
                        console.log('extData', extData)
                        this.infoBox = {
                            visible: true,
                            item: this.locations[extData]
                        }
                    })
                    this.map.add(marker)
                }
                // let lng = this.location.split(/[,，]/)[0]
                // let lat = this.location.split(/[,，]/)[1]
                // let coord = coordtransform.wgs84togcj02(parseFloat(lng), parseFloat(lat))
                // // let coord = [lng, lat]
                // let marker = new AMap.Marker({
                //     position: new AMap.LngLat(coord[0], coord[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                //     // title: '北京'
                // })
                // this.markers.push(marker)
                // this.map.add(marker)
                // this.map.addMarkers(this.markers, true)
                // // map.remove(marker);
                this.map.setCenter(new AMap.LngLat(113, 24))
                var newCenter = this.map.setFitView()


                // let pt = new BMap.Point(coord[0], coord[1])
                // var mk = new BMap.Marker(pt)
                // this.map.addOverlay(mk)
                // this.map.panTo(pt)
                // this.map.centerAndZoom(pt, 13)
            }
        }
    }
</script>

<style lang="scss" scoped>
.infoBox {
    position: fixed;
    // top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 600px;
    z-index: 10000000;
    border-top: 1px solid #000;
    background: #fff;
    // background: rgba(0, 0, 0, .12);
    .body {
        padding: 16px;
    }
    .areaBox {
        display: flex;
        align-items: center;
        // justify-content: center;
        .item {
            padding: 4px 8px;
            margin-right: 6px;
            border: 1px solid #000;
            border-radius: 8px;
        }
    }
    .detail {
        padding: 16px 0;
        font-size: 24px;
    }
    .close {
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 16px;
    }
}
.container {
    // position: relative;
}
.infoBox {

}
.input-box {
    position: absolute;
    top: 80px;
    right: 16px;
    z-index: 100000;
    width: 240px;
    height: 48px;
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    .input {
        display: block;
        line-height: 46px;
        padding-left: 16px;
        outline: none;
        border: 0;
    }
    .btn {
        position: absolute;
        top: 0;
        right: 0;
    }
}
.map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin:0;
    font-family:"微软雅黑";
}
</style>
