<template>
    <my-page title="经纬度解析" :page="page">
        <div class="common-container container">
            <ui-text-field v-model="addresses" label="经纬度" multiLine :rows="3" :rowsMax="6" hintText="" />
            <br>
            <!-- <ui-select-field class="select" v-model="coordType" label="坐标系">
                <ui-menu-item value="wgs84" title="wgs84 坐标"/>
                <ui-menu-item value="gcj02" title="国测局坐标"/>
                <ui-menu-item value="bd09" title="百度坐标"/>
            </ui-select-field> -->
            <br>
            <!-- <span>四舍五入保留</span>
            <ui-text-field class="fixed-input" type="number" v-model.number="fixedNumber" />
            <span>位</span> -->
            <div class="btns">
                <ui-raised-button class="btn" primary label="解析" @click="convert" />
                <ui-raised-button class="btn" label="重置" @click="reset" />
                <ui-raised-button class="btn" label="清空结果" @click="clear" />
            </div>
            <ui-article class="result" v-if="results.length">
                <table>
                    <tr>
                        <th>地址</th>
                        <th>经度</th>
                        <th>纬度</th>
                        <!-- <th>坐标系</th> -->
                        <th>省</th>
                        <th>市</th>
                        <th>区</th>
                    </tr>
                    <tr v-for="item in results">
                        <td>{{ item.address }}</td>
                        <td>{{ item.longitude }}</td>
                        <td>{{ item.latitude }}</td>
                        <!-- <td>WGS-84</td> -->
                        <td>{{ item.province }}</td>
                        <td>{{ item.city }}</td>
                        <td>{{ item.district }}</td>
                    </tr>
                </table>
            </ui-article>
            <div class="btns" v-if="results.length">
                <ui-raised-button class="btn" primary label="导出为 CVS" @click="exportTable" />
                <ui-raised-button class="btn" primary label="导出为 JSON" @click="exportJson" />
                <ui-raised-button class="btn" secondary label="仅导出经纬度" @click="exportCoord" />
            </div>
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
                addresses: `113.3726231，23.12799871
115.512553,22.916544
`,
                coordType: 'wgs84',
                fixedNumber: 3,
                results: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/7e2100f048a411ea9312d1d89cc85282',
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
                if (!this.addresses) {
                    this.$message({
                        type: 'danger',
                        text: '请输入经纬度'
                    })
                    return
                }
                // this.results = []
                AMap.plugin('AMap.Geocoder', () => {
                    let geocoder = new AMap.Geocoder({
                        // city: '010'
                    })
                    let coords = this.addresses.split('\n').filter(item => item)
                    console.log('coords', coords)
                    coords = coords.map(item => {
                        console.log('item2', item)
                        let match = item.match(/[\d.]+/g)
                        console.log('match', match)
                        // let lng = match[0]
                        // let lat = match[1]
                        let lng = parseFloat(match[0])
                        let lat = parseFloat(match[1])
                        return {
                            longitude: lng,
                            latitude: lat,
                        }
                    })
                    let coordArr = coords.map(item => {
                        let ret = coordtransform.wgs84togcj02(item.longitude, item.latitude)
                        return ret
                    })
                    geocoder.getAddress(coordArr, (status, result) => {
                        let address = []
                        if (status === 'complete' && result.regeocodes.length) {
                            console.log('result', result)
                            let results = []
                            for (let i = 0; i < result.regeocodes.length; i++) {
                                let item = result.regeocodes[i]
                                console.log('coords[i]',coords, coords[0])
                                results.push({
                                    address: item.formattedAddress,
                                    ...coords[i],
                                    // longitude: coords[i][0],
                                    // latitude: coords[i][1],
                                    province: item.addressComponent.province,
                                    city: item.addressComponent.city,
                                    district: item.addressComponent.district,
                                })
                            }
                            console.log('results', results)
                            this.results = results
                            // for(var i=0;i< result.regeocodes.length;i+=1){
                            //     document.getElementById("address"+(i+1)).value = result.regeocodes[i].formattedAddress
                            // }
                        } else {
                            alert(JSON.stringify(result))
                        }
                    })
                    // for (let address of addresses) {
                    //     geocoder.getLocation(address, (status, result) => {
                    //         if (status === 'complete' && result.info === 'OK') {
                    //             console.log(result)
                    //             for (let item of result.geocodes) {
                    //                 let coord
                    //                 if (this.coordType === 'wgs84') {
                    //                     coord = coordtransform.gcj02towgs84(item.location.lng, item.location.lat)
                    //                 }
                    //                 if (this.coordType === 'gcj02') {
                    //                     coord = [item.location.lng, item.location.lat]
                    //                 }
                    //                 if (this.coordType === 'bd09') {
                    //                     coord = coordtransform.gcj02tobd09(item.location.lng, item.location.lat)
                    //                 }
                    //                 function findIndex(address) {
                    //                     for (let i = 0; i < addresses.length; i++) {
                    //                         if (addresses[i] === address) {
                    //                             return i
                    //                         }
                    //                     }
                    //                     return -1
                    //                 }
                    //                 this.results.push({
                    //                     address: address,
                    //                     longitude: coord[0],
                    //                     latitude: coord[1],
                    //                     province: item.addressComponent.province,
                    //                     city: item.addressComponent.city,
                    //                     district: item.addressComponent.district,
                    //                     formattedAddress: item.formattedAddress,
                    //                     index: findIndex(address)
                    //                 })
                    //                 this.sortByOld()
                    //             }
                    //         }
                    //     })
                    // }
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
    // max-width: 400px;
    max-width: 100%;
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
