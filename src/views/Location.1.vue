<template>
    <my-page class="page-home" title="地图定位" :containerPadding="false">
        <div class="input-box">
            <input class="input" v-model="location" placeholder="116.404,39.915">
            <ui-icon-button class="btn" icon="send" @click="gotoLocation" />
        </div>
        <div id="allmap"></div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                location: '',
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
            var map = new BMap.Map('allmap')
            this.map = map
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
            // map.addControl(new BMap.MapTypeControl({
            //     mapTypes: [
            //         BMAP_NORMAL_MAP,
            //         BMAP_HYBRID_MAP
            //     ]}
            // ))	  
            map.setCurrentCity('北京')
            map.enableScrollWheelZoom(true)

            // 定位
            let location = this.$route.query.location
            if (location) {
                this.location = location
                this.gotoLocation()
                // let lng = location.split(',')[0]
                // let lat = location.split(',')[1]
                // console.log(`(${lng}, ${lat})`)
                // map.centerAndZoom(new BMap.Point(lng, lat), 13)
            } else {
                console.log('自动定位')
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS){
                        // var mk = new BMap.Marker(r.point);
                        // map.addOverlay(mk);
                        // map.panTo(r.point);
                        // alert('您的位置：'+r.point.lng+','+r.point.lat);
                        map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 13);
                    }
                    else {
                        alert('failed'+this.getStatus());
                    }
                }, {enableHighAccuracy: true})
            }
        },
        methods: {
            gotoLocation() {
                if (!this.location) {
                    return
                }
                let lng = this.location.split(/[,，]/)[0]
                let lat = this.location.split(/[,，]/)[1]
                // let coord = coordtransform.wgs84togcj02(lng, lat)
                let coord = [lng, lat]
                let pt = new BMap.Point(coord[0], coord[1])
                var mk = new BMap.Marker(pt)
                this.map.addOverlay(mk)
                this.map.panTo(pt)
                this.map.centerAndZoom(pt, 13)
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
#allmap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin:0;
    font-family:"微软雅黑";
}
</style>
