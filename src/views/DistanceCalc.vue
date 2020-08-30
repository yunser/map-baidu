<template>
    <my-page title="经纬度计算" :page="page">
        <div class="common-container container">
            <!-- <ui-text-field v-model="location" label="坐标" hintText="xxx, xxx" /> -->
            <textarea class="form-control" v-model="locations" rows="6" placeholder="一行一个坐标，经度在前，纬度在后"></textarea>
            <br>
            <!-- <ui-select-field class="select" v-model="from">
                <ui-menu-item value="wgs84" title="WGS84 坐标"/>
                <ui-menu-item value="gcj02" title="GCJ-02 坐标"/>
                <ui-menu-item value="bd09" title="百度坐标"/>
            </ui-select-field>
            <span class="text">转</span>
            <ui-select-field class="select" v-model="to">
                <ui-menu-item value="wgs84" title="WGS84 坐标"/>
                <ui-menu-item value="gcj02" title="GCJ-02 坐标"/>
                <ui-menu-item value="bd09" title="百度坐标"/>
            </ui-select-field>
            <br>
            <span>四舍五入保留</span>
            <ui-text-field class="fixed-input" type="number" v-model.number="fixedNumber" />
            <span>位</span>
            <br> -->
            <div>用于求折线的距离、多边形的区域的面积、两点间的方位角。当然也支持两点之间点距离。注意理论距离和实际距离有误差。所谓方位角是与正北方向、顺时针之间的夹角。</div>
            <!-- 在计算几百公里的时候两者误差量级为几m；在计算1000公里级别是误差能到达几十m -->
            <div class="btns">
                <ui-raised-button primary label="计算" @click="calc" />
            </div>
            <pre class="result" v-if="result" v-html="result"></pre>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    let coordtransform = require('coordtransform')

 //墨卡托转经纬度
    function webMercator2lonLat(mercator) {
        var lonlat={x:0,y:0};
        var x=mercator.x/20037508.34*180;
        var y=mercator.y/20037508.34*180;
        y=180/Math.PI *(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
        lonlat.x=x;
        lonlat.y=parseFloat(y.toFixed(4));
        return lonlat;
    }
 
    //经纬度转墨卡托
    function lonlat2mercattor(lonlat) {
        var  mercator={x:0,y:0};
        var x = lonlat.x *20037508.34/180;
        var y = Math.log(Math.tan((90+lonlat.y)*Math.PI/360))/(Math.PI/180);
        y = y *20037508.34/180;
        mercator.x = x;
        mercator.y = y;
        return mercator ;
    }

    //调用方式
    var lonlat={x:114.1475,y: 22.6092};
        console.log(lonlat2mercattor(lonlat));
 
        var mercator={x:12706841.57355639,y:2584825.9064387};
        console.log(lonlat2mercattor({
            x: 112.968588,
            y: 22.520978
        }))
        
    //进行经纬度转换为距离的计算

    //  function Rad(d){
    //    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    // }
    // //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    // function GetDistance(lat1,lng1,lat2,lng2){
 
    //     var radLat1 = Rad(lat1);
    //     var radLat2 = Rad(lat2);
    //     var a = radLat1 - radLat2;
    //     var  b = Rad(lng1) - Rad(lng2);
    //     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    //     Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    //     s = s *6378.137 ;// EARTH_RADIUS;
    //     s = Math.round(s * 10000) / 10000; //输出为公里
    //     //s=s.toFixed(4);
    //     return s;
    // }


    function rad(d) {
		return d * Math.PI / 180.0;
	}

	/**
	 * 根据两点间经纬度坐标（double值），计算两点间距离，单位为米
	 */
    // const EARTH_RADIUS = 6378.137;
    const EARTH_RADIUS = 6371.393;
	function GetDistance(lat1, lng1, lat2, lng2) {
		let radLat1 = rad(lat1);
		let radLat2 = rad(lat2);
		let a = radLat1 - radLat2;
		let b = rad(lng1) - rad(lng2);
		let s = 2 * Math.asin(Math.sqrt(
				Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * EARTH_RADIUS;
		s = (s * 10000) / 10;
		return s;
	}

    console.log("距离差" + GetDistance(30.535275, 114.352175,30.5352806, 114.3521917) + "米");
	// public static void main(String[] args) {
	// }

    function computeSignedArea(path) {
    //传入path：{
        // [{lat:,lng:}],[{lat:,lng:}],[{lat:,lng:}]
    // }
        let radius= 6371009
        let len = path.length;
        if (len < 3) return 0; 
        let total = 0;
        let  prev = path[len - 1];
        let prevTanLat = Math.tan(((Math.PI / 2 - prev.lat/180*Math.PI) / 2));
        let prevLng = (prev.lng)/180*Math.PI;
        for (let i in path) {
            let tanLat = Math.tan((Math.PI / 2 -
                (path[i].lat)/180*Math.PI) / 2);
            let lng = (path[i].lng)/180*Math.PI;
            total += polarTriangleArea(tanLat, lng, prevTanLat, prevLng);
            prevTanLat = tanLat;
            prevLng = lng;
        }
        return Math.abs(total * (radius * radius));
    }
    function polarTriangleArea(tan1,lng1,tan2,lng2) {
            let deltaLng = lng1 - lng2;
            let t = tan1 * tan2;
            return 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
    }

    function calc_azimuth(lat1, lon1, lat2, lon2) {
        let lat1_rad = lat1 * Math.PI / 180
        let lon1_rad = lon1 * Math.PI / 180
        let lat2_rad = lat2 * Math.PI / 180
        let lon2_rad = lon2 * Math.PI / 180

        let y = Math.sin(lon2_rad - lon1_rad) * Math.cos(lat2_rad)
        let x = Math.cos(lat1_rad) * Math.sin(lat2_rad) -
            Math.sin(lat1_rad) * Math.cos(lat2_rad) * Math.cos(lon2_rad - lon1_rad)

        let brng = Math.atan2(y, x) * 180 / Math.PI

        return parseFloat((brng + 360.0) % 360.0)
    }
    

    export default {
        data () {
            return {
                locations: `113, 24
114, 24
113, 25`,
                location: '113.5, 24',
                from: 'gcj02',
                to: 'wgs84',
                fixedNumber: 3,
                result: null,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/cc680d70da0e11eabd36bd87ff5eff33',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            // this.from = 'bd09'
            // this.to = 'wgs84'
            // this.convert()
            this.locations = '121.62486, 29.87816'
            this.calc()
        },
        methods: {
            calc() {
                if (!this.locations) {
                    this.$message({
                        type: 'danger',
                        text: '请输入坐标'
                    })
                    return
                }
                let results = []
                let rows = this.locations.split('\n').filter(item => item)

                if (rows.length < 2) {
                    // this.$message({
                    //     type: 'danger',
                    //     text: '至少输入两个坐标'
                    // })
                    
                }
                
                rows = rows.map(row => {
                    let match = row.match(/-?[\d.]+/g)
                    console.log('match', match)
                    // let lng = match[0]
                    // let lat = match[1]
                    let lng = parseFloat(match[0])
                    let lat = parseFloat(match[1])
                    return {
                        lng,
                        lat,
                    }
                })

                if (rows.length === 1) {
                    console.log('rowssssss', rows)
                    let lng = Math.abs(rows[0].lng)
                    const lngD = parseInt(lng)
                    const lngMin = parseInt((lng - lngD) * 60)
                    console.log('>', (lng - lngD - lngMin / 60))
                    const lngS = ((lng - lngD - lngMin / 60) * 60 * 60).toFixed(2)
                    let lngText = ''
                    if (rows[0].lng > 0) {
                        lngText = '东经E'
                    } else {
                        lngText = '西经W'
                    }

                    let lat = Math.abs(rows[0].lat)
                    const latD = parseInt(lat)
                    const latMin = parseInt((lat - latD) * 60)
                    const latS = ((lat - latD - latMin / 60) * 60 * 60).toFixed(2)
                    let latText = ''
                    if (rows[0].lat > 0) {
                        latText = '北纬N'
                    } else {
                        latText = '南纬S'
                    }
                    this.result = `${latText}${latD}°${latMin}′${latS}〃 ${lngText} ${lngD}°${lngMin}′${lngS}〃`
                    return
                }
                console.log('rows', rows)

                const m = GetDistance(rows[0].lat, rows[0].lng, rows[1].lat, rows[1].lng)

                const mFormated = m.toFixed(2)

                const km = (m / 1000).toFixed(2)

                this.result = `长度：${mFormated}m
=${km}km`
                if (rows.length > 2) {
                    let area = computeSignedArea(rows)
                    let areaFormated = area.toFixed(2)
                    let km2 = (area / 1000000).toFixed(2)
                    this.result += `\n面积：${areaFormated}m^2
=${km2}km^2`
                }

                if (rows.length === 2) {
                    let angle = calc_azimuth(rows[0].lat, rows[0].lng, rows[1].lat, rows[1].lng)
                    this.result += `\n方位角：${angle}`
                }
                // console.log('result', this.result)
                return

                // let match = this.location.match(/([\d.]+)[,，]\s+([\d.]+)/)
                // if (!match) {
                //     this.$message({
                //         type: 'danger',
                //         text: '坐标输入不正确'
                //     })
                //     return
                // }
                // console.log(match, match[0], match[1])
                
            }
        }
    }
</script>

<style lang="scss" scoped>
textarea.form-control {
    height: auto;
}
.form-control {
    display: block;
    width: 100%;
    max-width: 400px;
    height: 33px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42;
    color: #55595c;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
}
.container {
    max-width: 400px;
}
.select {
    width: 130px;
}
.text {
    margin: 0 8px;
}
.btns {
    margin-bottom: 16px;
}
.fixed-input {
    width: 148px;
}
</style>
