<template>
    <my-page title="距离测量" :page="page">
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
                            icon: 'help',
                            href: 'https://project.yunser.com/products/04221b905dc711e99da1c5fddb71d576',
                            target: '_blank',
                            title: '帮助'
                        }
                        // {
                        //     type: 'icon',
                        //     icon: 'clear_all',
                        //     click: this.clear,
                        //     title: '清空'
                        // }
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
            //自定义样式
            var startMarkerOptions= {
                icon: new AMap.Icon({
                    size: new AMap.Size(19, 31),//图标大小
                    imageSize:new AMap.Size(19, 31),
                    image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
                })
            };
            var endMarkerOptions = {
                icon: new AMap.Icon({
                    size: new AMap.Size(19, 31),//图标大小
                    imageSize:new AMap.Size(19, 31),
                    image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
                }),
                offset: new AMap.Pixel(-9, -31)
            };
            var midMarkerOptions = {
                icon: new AMap.Icon({
                    size: new AMap.Size(19, 31),//图标大小
                    imageSize:new AMap.Size(19, 31),
                    image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
                }),
                offset: new AMap.Pixel(-9, -31)
            };
            var lineOptions = {
                strokeStyle: "solid",
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 2
            };
            var rulerOptions = {
                startMarkerOptions: startMarkerOptions,
                midMarkerOptions:midMarkerOptions,
                endMarkerOptions: endMarkerOptions,
                lineOptions: lineOptions
            };
            let ruler2 = new AMap.RangingTool(this.map, rulerOptions)

            ruler2.turnOn();
        },
        destroyed() {
            this.map.destroy()
        },
        methods: {
            clear() {
                this.mouseTool.close(true)
                this.initTool()
            }
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
</style>
