<template>
    <my-page title="我的位置" :page="page">
        <div class="common-container container">
            <div v-if="isAble">
                <div class="btns">
                    <ui-raised-button class="btn" primary label="获取我的位置" @click="getMyLocation" />
                    <br>
                    <ui-checkbox label="实时刷新" v-model="form.realTime" class="demo-checkbox" />
                </div>

                <div v-if="loading">正在获取位置</div>
                <div v-if="error">{{ error }}</div>
                <!-- <div v-if="result">{{ result.text }}</div> -->
                <!-- <div v-if="result">调试：{{ result.debug }}</div> -->

                <ui-article v-if="result">
                    <table>
                        <tr>
                            <th>经度</th>
                            <td>{{ result.longitude }}</td>
                        </tr>
                        <tr>
                            <th>纬度</th>
                            <td>{{ result.latitude }}</td>
                        </tr>
                        <tr>
                            <th>海拔</th>
                            <td>{{ result.altitude }}</td>
                        </tr>
                        <tr>
                            <th>定位精准度
                                <br>
                                （单位：米）</th>
                            <td>{{ result.accuracy }}</td>
                            <!-- 定位时以网络IP的位置为准。 -->
                        </tr>
                        <tr>
                            <th>海拔精准度
                                <br>
                                （单位：米）</th>
                            <td>{{ result.altitudeAccuracy }}</td>
                        </tr>
                        <tr>
                            <th>方向</th>
                            <td>{{ result.heading }}</td>
                        </tr>
                        <tr>
                            <th>速度</th>
                            <td>{{ result.speed }}</td>
                        </tr>
                    </table>
                </ui-article>
            </div>
            <div v-else>
                你的浏览器不支持这个功能
            </div>
        </div>
        <ui-float-button class="addBtn" secondary icon="add" @click="add" />
    </my-page>
</template>


<script>
    /* eslint-disable */
    import cvsExport from '../util/export-cvs'
    let coordtransform = require('coordtransform')

    export default {
        data () {
            return {
                form: {
                    realTime: false,
                },
                error: '',
                result: '',
                loading: false,
                isAble: false,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/dd4add10404a11ea8e2d9393e303cfd7',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            console.log('navigator.geolocation', navigator.geolocation)
            if (navigator.geolocation) {
                this.isAble = true
                // this.getMyLocation()
            } else {
                this.isAble = false
            }
            this.isAble === !!navigator.geolocation
            this.timer = setInterval(() => {
                if (this.form.realTime) {
                    this.getMyLocation()
                }
            }, 1000)
            this.debug()
        },
        destroyed() {
            clearInterval(this.timer)
        },
        methods: {
            debug() {
                this.result = {
                    longitude: 113,
                    latitude: 24,
                }
            },
            getMyLocation() {
                this.loading = true
                console.log('获取坐标')
                navigator.geolocation.getCurrentPosition(position => {
                    this.loading = false
                    console.log('获取坐标成功')
                    console.log('position', position)
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var address = "";

                    this.result = {
                        ...position.coords,
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        altitude: position.coords.altitude,
                        accuracy: position.coords.accuracy,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,

                        text: `你的坐标：${lng}, ${lat}`,
                        debug: JSON.stringify(position)
                    }
                }, error => {
                    console.log('error', error)
                    this.loading = false
                    this.error = '获取坐标失败'
                    console.log('')
                    switch(error.code){
                        case error.TIMEOUT:
                            this.error = '获取坐标失败，连接超时，请重试！'
                            // alert("连接超时，请重试！");
                            break
                        case error.PERMISSION_DENIED:
                            this.error = '获取坐标失败，没有权限，请开启权限！'
                            // alert("无法使用位置共享服务！");
                            break
                        case error.POSITION_UNAVAILABLE:
                            this.error = '获取坐标失败，位置超出地球？'
                            break
                    }
                })
            },
            add() {
                
            },
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
    .btn {
        margin-right: 8px;
        margin-bottom: 16px;
    }
}
.fixed-input {
    width: 148px;
}
.addBtn {
    position: fixed;
    right: 24px;
    bottom: 24px
}
</style>
