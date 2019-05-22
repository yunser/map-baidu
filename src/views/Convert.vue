<template>
    <my-page title="坐标转换" :page="page">
        <div class="common-container container">
            <ui-text-field v-model="location" label="坐标" hintText="xxx, xxx" />
            <br>
            <ui-select-field class="select" v-model="from">
                <ui-menu-item value="wgs84" title="wgs84 坐标"/>
                <ui-menu-item value="gcj02" title="国测局坐标"/>
                <ui-menu-item value="bd09" title="百度坐标"/>
            </ui-select-field>
            <span class="text">转</span>
            <ui-select-field class="select" v-model="to">
                <ui-menu-item value="wgs84" title="wgs84 坐标"/>
                <ui-menu-item value="gcj02" title="国测局坐标"/>
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
            <div class="result" v-if="result">{{ result[0] }}, {{ result[1] }}</div>
        </div>
    </my-page>
</template>

<script>
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                location: '',
                from: 'bd09',
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
                if (!this.location) {
                    this.$message({
                        type: 'danger',
                        text: '请输入坐标'
                    })
                    return
                }
                let match = this.location.match(/([\d.]+)[,，]\s+([\d.]+)/)
                if (!match) {
                    this.$message({
                        type: 'danger',
                        text: '坐标输入不正确'
                    })
                    return
                }
                console.log(match, match[1], match[2])
                let lng = parseFloat(match[1])
                let lat = parseFloat(match[2])
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
                    this.result = coordtransform.gcj02towgs84(result[0], result[1])
                } else if (this.from === 'wgs84' && this.to === 'bd09') {
                    console.log('转换')
                    let result = coordtransform.wgs84togcj02(lng, lat)
                    this.result = coordtransform.gcj02tobd09(result[0], result[1])
                } else {
                    this.result = coordtransform[this.from + 'to' + this.to](lng, lat)
                }
                this.result = [this.result[0].toFixed(this.fixedNumber), this.result[1].toFixed(this.fixedNumber)]
            }
        }
    }
</script>

<style lang="scss" scoped>
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
