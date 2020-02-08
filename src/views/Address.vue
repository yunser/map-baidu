<template>
    <my-page title="地址解析" :page="page">
        <div class="common-container container">
            <ui-text-field v-model="addresses" label="地址" multiLine :rows="3" :rowsMax="6" hintText="" />
            <br>
            <ui-select-field class="select" v-model="coordType" label="导出数据的坐标系">
                <ui-menu-item value="wgs84" title="WGS-84"/>
                <ui-menu-item value="gcj02" title="GCJ-02"/>
                <ui-menu-item value="bd09" title="BD-09"/>
            </ui-select-field>
            <br>
            <!-- <span>四舍五入保留</span>
            <ui-text-field class="fixed-input" type="number" v-model.number="fixedNumber" />
            <span>位</span> -->
            <div class="btns">
                <ui-raised-button class="btn" primary label="解析" @click="convert" />
                <ui-raised-button class="btn" label="重置" @click="reset" />
                <ui-raised-button class="btn" label="清空结果" @click="clear" />
            </div>
            <div class="btns" v-if="results.length">
                <ui-raised-button class="btn" label="导出为 CVS" @click="exportTable" />
                <ui-raised-button class="btn" label="导出为 JSON" @click="exportJson" />
                <ui-raised-button class="btn" label="仅导出经纬度" @click="exportCoord" />
            </div>
            <ui-article class="result" v-if="results.length">
                <div class="tableBox">
                    <table class="table">
                        <tr>
                            <th>地址</th>
                            <th>经度</th>
                            <th>纬度</th>
                            <th>坐标系</th>
                            <th>省</th>
                            <th>市</th>
                            <th>区</th>
                            <th>省代码</th>
                            <th>市代码</th>
                            <th>区代码</th>
                            <th>完整地址</th>
                        </tr>
                        <tr v-for="item in results">
                            <td>{{ item.address }}</td>
                            <td>{{ item.longitude }}</td>
                            <td>{{ item.latitude }}</td>
                            <td>{{ item.coordType }}</td>
                            <td>{{ item.province }}</td>
                            <td>{{ item.city }}</td>
                            <td>{{ item.district }}</td>
                            <td>{{ item.provinceCode }}</td>
                            <td>{{ item.cityCode }}</td>
                            <td>{{ item.areaCode }}</td>
                            <td>{{ item.formattedAddress }}</td>
                        </tr>
                    </table>
                </div>
            </ui-article>
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
                        // {
                        //     type: 'icon',
                        //     icon: 'settings',
                        //     href: 'https://project.yunser.com/products/0f6d4d405dc611e99da1c5fddb71d576',
                        //     target: '_blank',
                        //     title: '帮助'
                        // },
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/0f6d4d405dc611e99da1c5fddb71d576',
                            target: '_blank',
                            title: '帮助'
                        },
                    ]
                }
            }
        },
        mounted() {
            // this.from = 'bd09'
            // this.to = 'wgs84'
            // this.convert()
            this.debug()
        },
        methods: {
            debug() {
                this.convert()
            },
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
                    let addresses = this.addresses.split('\n').reverse()
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
                                    function findIndex(address) {
                                        for (let i = 0; i < addresses.length; i++) {
                                            if (addresses[i] === address) {
                                                return i
                                            }
                                        }
                                        return -1
                                    }
                                    let coordTypes = {
                                        'wgs84': 'WGS-84',
                                        'gcj02': 'GCJ-02',
                                        'bd09': 'BD-09',
                                    }
                                    this.results.push({
                                        coordType: coordTypes[this.coordType],
                                        address: address,
                                        longitude: coord[0],
                                        latitude: coord[1],
                                        province: item.addressComponent.province,
                                        city: item.addressComponent.city,
                                        district: item.addressComponent.district,
                                        formattedAddress: item.formattedAddress,
                                        areaCode: item.adcode,
                                        cityCode: item.adcode.substring(0, 4) + '00',
                                        provinceCode: item.adcode.substring(0, 2) + '0000',
                                        index: findIndex(address)
                                    })
                                    this.sortByOld()
                                }
                            }
                        })
                    }
                })
            },
            sortByOld() {
                console.log('this.results', this.results)
                this.results = this.results.sort((a, b) => {
                    return b.index - a.index
                })
            },
            reset() {
                this.addresses = ''
                // this.coordType = 'wgs84'
            },
            clear() {
                this.results = []
            },
            getDataArr() {
                let data = []
                data[0] = ['地址', '经度', '纬度', '坐标系', '省', '市', '区', '省代码', '市代码', '区代码', '完整地址']
                for (let item of this.results) {
                    data.push([
                        item.address,
                        item.longitude, item.latitude, item.coordType,
                        item.province, item.city, item.district,
                        item.provinceCode, item.cityCode, item.areaCode,
                        item.formattedAddress
                    ])
                }
                return data
            },
            exportTable() {
                let data = this.getDataArr()
                let blob = new Blob([cvsExport(data)], {type: 'text/plain;charset=utf-8'})
                saveAs(blob, 'data.csv')
            },
            exportJson() {
                let data = this.getDataArr()
                let arr = []
                for (let i = 0; i < data.length; i++) {
                    if (i === 0) {
                        continue
                    }
                    let item = data[i]
                   arr.push({
                       address: item[0],
                       longitude: item[1],
                       latitude: item[2],
                       type: item[3],
                       province: item[4],
                       city: item[5],
                       area: item[6],
                   })
                   console.log('arr', arr)
                }
                console.log('JSON', JSON.stringify(arr, null, 4))
                let json = JSON.stringify(arr, null, 4)
                let blob = new Blob([json], {type: 'text/plain;charset=utf-8'})
                saveAs(blob, 'data.json')
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
.container {
    max-width: 100%;
    // max-width: 400px;
}
.tableBox {
    border: 1px solid #000;
    overflow: auto;
    .table {
        margin-bottom: 0;
        width: 1400px;
    }
}
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
