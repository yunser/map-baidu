<template>
    <my-page title="求经纬度" :page="page">
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
            <ui-text-field class="fixed-input" type="number" label="距离（米）" v-model.number="form.distance" />
            <br>
            <ui-text-field class="fixed-input" type="number" label="方位角" v-model.number="form.angle" />
            <br>
            <!-- <div>用于求折线的距离、多边形的区域的面积、两点间的方位角。当然也支持两点之间点距离。注意理论距离和实际距离有误差。所谓方位角是与正北方向、顺时针之间的夹角。</div> -->
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
    
    const caculate = {
        VincentyConstants : {
            a: 6378137,
            b: 6356752.3142,
            f: 1/298.257223563
        },
        /** *Calculate destination point given start point lat/long (numeric degrees), * bearing (numeric degrees) & distance (in m). */
        destinationVincenty : function(lonlat, brng, dist) {
            var u = this;
            var ct = u.VincentyConstants;
            var a = ct.a, b = ct.b, f = ct.f;

            var lon1 = lonlat.lon;
            var lat1 = lonlat.lat;

            var s = dist;
            var alpha1 = u.rad(brng);
            var sinAlpha1 = Math.sin(alpha1);
            var cosAlpha1 = Math.cos(alpha1);

            var tanU1 = (1-f) * Math.tan(u.rad(lat1));
            var cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1*cosU1;
            var sigma1 = Math.atan2(tanU1, cosAlpha1);
            var sinAlpha = cosU1 * sinAlpha1;
            var cosSqAlpha = 1 - sinAlpha*sinAlpha;
            var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
            var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
            var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

            var sigma = s / (b*A), sigmaP = 2*Math.PI;
            while (Math.abs(sigma-sigmaP) > 1e-12) {
                var cos2SigmaM = Math.cos(2*sigma1 + sigma);
                var sinSigma = Math.sin(sigma);
                var cosSigma = Math.cos(sigma);
                var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
                    B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
                sigmaP = sigma;
                sigma = s / (b*A) + deltaSigma;
            }

            var tmp = sinU1*sinSigma - cosU1*cosSigma*cosAlpha1;
            var lat2 = Math.atan2(sinU1*cosSigma + cosU1*sinSigma*cosAlpha1,
                (1-f)*Math.sqrt(sinAlpha*sinAlpha + tmp*tmp));
            var lambda = Math.atan2(sinSigma*sinAlpha1, cosU1*cosSigma - sinU1*sinSigma*cosAlpha1);
            var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
            var L = lambda - (1-C) * f * sinAlpha *
                (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));

            var revAz = Math.atan2(sinAlpha, -tmp);  // final bearing

            return [lon1+u.deg(L), u.deg(lat2)]
        },

        /** * 度换成弧度 * @param {Float} d 度 * @return {[Float} 弧度 */
        rad:function(d)
        {
        return d * Math.PI / 180.0;
        },

        /** * 弧度换成度 * @param {Float} x 弧度 * @return {Float} 度 */
        deg:function(x) {
            return x*180/Math.PI;
        }   
    }

    let ok = caculate.destinationVincenty({lon: 113, lat: 24}, 90, 101590)
    console.log('ok', ok)

    export default {
        data () {
            return {
                form: {
                    distance: 101760,
                    angle: 90,
                },
                locations: `113, 24`,
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
            // this.locations = '121.62486, 29.87816'
            // this.calc()
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

                const { distance, angle } = this.form
                let coord = caculate.destinationVincenty({lon: rows[0].lng, lat: rows[0].lat}, angle, distance)
                this.result = `${coord[0]}, ${coord[1]}`
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
