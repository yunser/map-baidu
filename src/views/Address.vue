<template>
    <my-page title="地址解析">
        <ui-text-field v-model="addresses" label="地址" multiLine :rows="3" :rowsMax="6" hintText="" />
        <br>
        <ui-select-field class="select" v-model="coordType" label="坐标系">
            <ui-menu-item value="wgs84" title="wgs84 坐标"/>
            <ui-menu-item value="gcj02" title="国测局坐标"/>
            <ui-menu-item value="bd09" title="百度坐标"/>
        </ui-select-field>
        <br>
        <!-- <span>四舍五入保留</span>
        <ui-text-field class="fixed-input" type="number" v-model.number="fixedNumber" />
        <span>位</span> -->
        <div class="btns">
            <ui-raised-button class="btn" primary label="解析" @click="convert" />
            <ui-raised-button class="btn" label="清空" @click="clear" />
        </div>
        <ui-article class="result" v-if="results.length">
            <table>
                <tr>
                    <th>地址</th>
                    <th>经度</th>
                    <th>纬度</th>
                    <th>坐标系</th>
                    <th>省</th>
                    <th>市</th>
                    <th>区</th>
                </tr>
                <tr v-for="item in results">
                    <td>{{ item.address }}</td>
                    <td>{{ item.longitude }}</td>
                    <td>{{ item.latitude }}</td>
                    <td>WGS-84</td>
                    <td>{{ item.province }}</td>
                    <td>{{ item.city }}</td>
                    <td>{{ item.district }}</td>
                </tr>
            </table>
        </ui-article>
        <div class="btns" v-if="results.length">
            <ui-raised-button class="btn" primary label="导出为 CVS" @click="exportTable" />
            <ui-raised-button class="btn" secondary label="仅导出经纬度" @click="exportCoord" />
        </div>
    </my-page>
</template>


<script>
    /* eslint-disable */
    import cvsExport from '../util/export-cvs'
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                addresses: '天河棠下\n广州天河公园',
                coordType: 'wgs84',
                fixedNumber: 3,
                results: [],
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
            // this.from = 'bd09'
            // this.to = 'wgs84'
            // this.convert()
        },
        methods: {
            convert() {
                if (!this.addresses) {
                    this.$message({
                        type: 'danger',
                        text: '请输入地址'
                    })
                    return
                }
                // this.results = []
                AMap.plugin('AMap.Geocoder', () => {
                    let geocoder = new AMap.Geocoder({
                        // city: '010'
                    })
                    let addresses = this.addresses.split('\n')
                    for (let address of addresses) {
                        geocoder.getLocation(address, (status, result) => {
                            if (status === 'complete' && result.info === 'OK') {
                                console.log(result)
                                for (let item of result.geocodes) {
                                    let coord
                                    if (this.coordType === 'wgs84') {
                                        coord = coordtransform.gcj02towgs84(item.location.lng, item.location.lat)
                                    }
                                    if (this.coordType === 'gcj02') {
                                        coord = [item.location.lng, item.location.lat]
                                    }
                                    if (this.coordType === 'bd09') {
                                        coord = coordtransform.gcj02tobd09(item.location.lng, item.location.lat)
                                    }
                                    this.results.push({
                                        address: address,
                                        longitude: coord[0],
                                        latitude: coord[1],
                                        province: item.addressComponent.province,
                                        city: item.addressComponent.city,
                                        district: item.addressComponent.district,
                                        formattedAddress: item.formattedAddress,
                                    })
                                }
                            }
                        })
                    }
                })
            },
            clear() {
                this.results = []
            },
            getDataArr() {
                let data = []
                data[0] = ['地址', '经度', '纬度', '坐标系', '省', '市', '区']
                for (let item of this.results) {
                    data.push([item.address, item.longitude, item.latitude, 'WGS-84', item.province,
                        item.city, item.district])
                }
                return data
            },
            exportTable() {
                let data = this.getDataArr()
                let blob = new Blob([cvsExport(data)], {type: 'text/plain;charset=utf-8'})
                saveAs(blob, 'data.csv')
            },
            exportCoord() {
                let data = this.getDataArr()
                data = data.slice(1).map(item => {
                    return item[1] + ',' + item[2]
                })
                let blob = new Blob([data.join('\n')], {type: 'text/plain;charset=utf-8'})
                saveAs(blob, 'data.txt')
            }
        }
    }
</script>

<style lang="scss" scoped>
.select {
    width: 130px;
}
.text {
    margin: 0 8px;
}
.btns {
    margin-bottom: 16px;
    .btn {
        margin-right: 8px;
    }
}
.fixed-input {
    width: 148px;
}
</style>
