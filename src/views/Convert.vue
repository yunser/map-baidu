<template>
    <my-page title="坐标转换" :page="page">
        <div class="common-container container">
            <!-- <ui-text-field v-model="location" label="坐标" hintText="xxx, xxx" /> -->
            <textarea class="form-control" v-model="locations" rows="6" placeholder="一行一个坐标，经度在前，纬度在后"></textarea>
            <br>
            <ui-select-field class="select" v-model="from">
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
            <br>
            <div class="btns">
                <ui-raised-button primary label="转换" @click="convert" />
            </div>
            <div class="result" v-if="result" v-html="result"></div>
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
        
    export default {
        data () {
            return {
                locations: `经度113.5 纬度24.5
经度114.5 纬度25.5`,
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
                            href: 'https://project.yunser.com/products/fdb129105dc411e99da1c5fddb71d576',
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
        },
        methods: {
            convert() {
                if (!this.locations) {
                    this.$message({
                        type: 'danger',
                        text: '请输入坐标'
                    })
                    return
                }
                let results = []
                let rows = this.locations.split('\n').filter(item => item)
                console.log('rows', rows)
                for (let row of rows) {
                    
                    let match = row.match(/[\d.]+/g)
                    console.log('match', match)
                    // let lng = match[0]
                    // let lat = match[1]
                    let lng = parseFloat(match[0])
                    let lat = parseFloat(match[1])
                    let oneResult = ''
                    // if (this.from === 'bd09' && this.to === 'gcj02') {
                    //     console.log('转换')
                    //     this.result = coordtransform[this.from + 'to' + this.to](lng, lat)
                    // }
                    // if (this.from === 'gcj02' && this.to === 'bd09') {
                    //     console.log('转换')
                    //     this.result = coordtransform[this.from + 'to' + this.to](lng, lat)
                    // }
                    if (this.from === 'bd09' && this.to === 'wgs84') {
                        console.log('转换')
                        let result = coordtransform.bd09togcj02(lng, lat)
                        oneResult = coordtransform.gcj02towgs84(result[0], result[1])
                    } else if (this.from === 'wgs84' && this.to === 'bd09') {
                        console.log('转换')
                        let result = coordtransform.wgs84togcj02(lng, lat)
                        oneResult = coordtransform.gcj02tobd09(result[0], result[1])
                    } else {
                        oneResult = coordtransform[this.from + 'to' + this.to](lng, lat)
                    }
                    // oneResult = [, ]
                    oneResult = row.replace(match[0], oneResult[0].toFixed(this.fixedNumber))
                        .replace(match[1], oneResult[1].toFixed(this.fixedNumber))
                    console.log('oneResult', oneResult)
                    results.push(oneResult)
                }

                this.result = results.join('<br>')
                console.log('result', this.result)
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
