<template>
    <my-page title="坐标拾取">
        <div class="map" id="container"></div>
        <!-- <div class="location">{{ location }}</div> -->
        <div id="panel"></div>
        <div class="input-box">
            <input id="tipinput" class="input" placeholder="输入关键词搜索">
            <ui-icon-button class="btn" icon="search" @click="search" />
        </div>
    </my-page>
</template>


<script>
    /* eslint-disable */
    const AMap = window.AMap
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                keyword: '',
                location: '1,2',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com/',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        computed: {
        },
        mounted() {
            this.map = new AMap.Map('container', {
                zoom: 11,
                center: [116.397428, 39.90923],
                viewMode: '3D'
            })
            // 定位
            // 加载定位插件
            this.map.plugin('AMap.Geolocation', function() {
                // 初始化定位插件
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                // 把定位插件加入地图实例
                this.map.addControl(geolocation);

                // 添加地图全局定位事件
                AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
                AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息

                // 调用定位
                geolocation.getCurrentPosition();
            })
            this.map.on('click', e => {
                let longitude = e.lnglat.getLng()
                let latitude = e.lnglat.getLat()
                this.location = e.lnglat.getLng() + ', ' + e.lnglat.getLat()

                let wgs84 = coordtransform.gcj02towgs84(longitude, latitude)
                let baidu = coordtransform.gcj02tobd09(wgs84[0], wgs84[1])

                if (this.marker) {
                    this.map.remove(this.marker)
                }
                this.marker = new AMap.Marker({
                    position: new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat())
                    // title: '北京'
                })
                this.map.add(this.marker)

                var infoWindow = new AMap.InfoWindow({
                    isCustom: true,
                    content: `<div class="info-box">
<p>国测局坐标：${longitude}，${latitude}（火星坐标、腾讯地图坐标、高德地图坐标）</p>
<p>国际坐标：${wgs84[0]}，${wgs84[1]}（wgs84 坐标、谷歌地球坐标）</p>
<p>百度地图坐标：${baidu[0]}，${baidu[1]}（wgs84 坐标、谷歌地球坐标）</p>

<div class="close" onclick="window.infoWindow.close()">×</div>
</div>`,
                    offset: new AMap.Pixel(0, -50)
                })
                window.infoWindow = infoWindow
                infoWindow.open(this.map, new AMap.LngLat(longitude, latitude))
                window.closeInfoWindow = () => {
                    console.log('关闭')
                    infoWindow.close()
                }

                // AMap.service(['AMap.PlaceSearch'], () => {
                //     var placeSearch = new AMap.PlaceSearch({
                //         pageSize: 5,
                //         pageIndex: 1,
                //         map: this.map,
                //         panel: 'panel'
                //     })
                //     placeSearch.search('北京大学')
                // })
            })
            let auto = new AMap.Autocomplete({
                input: 'tipinput'
            })
            AMap.event.addListener(auto, 'select', e => {
                if (e.poi && e.poi.location) {
                    this.map.setZoom(15)
                    this.map.setCenter(e.poi.location)
                }
            })
        },
        destroyed() {
            this.map.destroy()
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
@import '../scss/var';

.map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.location {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px 16px;
    background-color: #fff;
}
.search {
    position: absolute;
    top: 0;
    left: 0;
    padding: 8px 16px;
    background-color: #fff;
}
 #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    bottom: 16px;
    right: 16px;
    width: 280px;
    z-index: 10000;
}
.input-box {
    position: absolute;
    top: 16px;
    left: 16px;
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
</style>
