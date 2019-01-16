<template>
    <my-page class="page-home" title="位置标记" :containerPadding="false">
        <div class="input-box">
            <div v-if="mode">
                <ui-text-field v-model="longitude" label="经度" />
                <br>
                <ui-text-field v-model="latitude" label="纬度" />
                <br>
                <ui-raised-button class="btn" primary label="添加" @click="add" />
                <a href="#" @click.prevent="changeMode">批量添加</a>
            </div>
            <div v-if="!mode">
                <ui-text-field v-model="locations" hintText="多行输入" label="经纬度" multiLine :rows="3" :rowsMax="6" />
                <br>
                <ui-raised-button class="btn" primary label="批量添加" @click="addMuch" />
                <a href="#" @click.prevent="changeMode">单个添加</a>
            </div>
        </div>
        <div class="map" id="container"></div>
        <!-- <ui-float-button class="float-button" icon="add"/> -->
        <!-- <a href="#" @click.prevent="changeMode">批量添加</a> -->
    </my-page>
</template>

<script>
    /* eslint-disable */
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                mode: true,
                longitude: '',
                latitude: '',
                location: '113.36140811375323，23.132723789655863',
                locations: '113,23\n113,24',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.map = new AMap.Map('container', {
                zoom: 11,
                center: [116.404, 39.915],
            })
            // AMap.plugin(['AMap.ToolBar', 'AMap.Driving'], () => {
            //     var toolbar = new AMap.ToolBar()
            //     this.map.addControl(toolbar)
            // })
            
            // var map = new BMap.Map('allmap')
            // this.map = map
            // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
            // // map.addControl(new BMap.MapTypeControl({
            // //     mapTypes: [
            // //         BMAP_NORMAL_MAP,
            // //         BMAP_HYBRID_MAP
            // //     ]}
            // // ))	  
            // map.setCurrentCity('北京')
            // map.enableScrollWheelZoom(true)

            // 定位
            // let location = this.$route.query.location
            // if (location) {
            //     this.location = location
            //     this.gotoLocation()
            //     // let lng = location.split(',')[0]
            //     // let lat = location.split(',')[1]
            //     // console.log(`(${lng}, ${lat})`)
            //     // map.centerAndZoom(new BMap.Point(lng, lat), 13)
            // } else {
            //     console.log('自动定位')
            //     var geolocation = new BMap.Geolocation();
            //     geolocation.getCurrentPosition(function(r) {
            //         if (this.getStatus() == BMAP_STATUS_SUCCESS){
            //             // var mk = new BMap.Marker(r.point);
            //             // map.addOverlay(mk);
            //             // map.panTo(r.point);
            //             // alert('您的位置：'+r.point.lng+','+r.point.lat);
            //             map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 13);
            //         }
            //         else {
            //             alert('failed'+this.getStatus());
            //         }
            //     }, {enableHighAccuracy: true})
            // }
            this.markers = []
        },
        methods: {
            add() {
                if (!this.longitude) {
                    this.$message({
                        type: 'error',
                        text: '请输入经度'
                    })
                    return
                }
                if (!this.latitude) {
                    this.$message({
                        type: 'error',
                        text: '请输入纬度'
                    })
                    return
                }
                let lng = this.location.split(/[,，]/)[0]
                let lat = this.location.split(/[,，]/)[1]
                this._add(this.longitude, this.latitude)
            },
            _add(lng, lat) {
                let coord = coordtransform.wgs84togcj02(parseFloat(lng), parseFloat(lat))
                // let coord = [lng, lat]
                let marker = new AMap.Marker({
                    position: new AMap.LngLat(coord[0], coord[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    // title: '北京'
                })
                this.markers.push(marker)
                this.map.add(marker)
                // map.remove(marker);
                this.map.setCenter(new AMap.LngLat(coord[0], coord[1]))


                // let pt = new BMap.Point(coord[0], coord[1])
                // var mk = new BMap.Marker(pt)
                // this.map.addOverlay(mk)
                // this.map.panTo(pt)
                // this.map.centerAndZoom(pt, 13)
            },
            addMuch() {
                let arr = this.locations.split('\n')
                for (let item of arr) {
                    this._add(item.split(',')[0], item.split(',')[1])
                }
            },
            changeMode() {
                console.log('changeMode')
                this.mode = !this.mode
            }
        }
    }
</script>

<style lang="scss" scoped>
.input-box {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 100000;
    // width: 240px;
    // height: 48px;
    padding: 16px;
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
        margin-right: 16px;
    }
}
.map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin:0;
    font-family:"微软雅黑";
}
.float-button {
    position: fixed;
    right: 24px;
    bottom: 24px;
}
</style>
