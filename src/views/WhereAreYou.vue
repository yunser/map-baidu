<template>
    <my-page title="你在哪" :page="page">
        <div class="common-container container">
            开发中...

            <br>
            <ui-raised-button class="btn" primary label="创建链接" @click="create" />

            <!-- <div v-if="isAble">
                <ui-raised-button class="btn" primary label="获取我的位置" @click="getMyLocation" />

                <div v-if="loading">正在获取位置</div>
                <div v-if="error">{{ error }}</div>
                <div v-if="result">{{ result }}</div>
            </div>
            <div v-else>
                你的浏览器不支持这个功能
            </div> -->
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
                error: '',
                result: '',
                loading: false,
                isAble: false,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/a6cb86b0405711ea8e2d9393e303cfd7',
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
                /***用户定位成功**/
                function getPositionSuccess(position) {
                    
                }

                /**用户定位失败**/
                function getPositionError(error){
                    
                }
                
            } else {
                this.isAble = false
                // alert("您的浏览器不支持自动定位!");
            }
            this.isAble === !!navigator.geolocation
        },
        methods: {
            create() {
                
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

                    this.result = `你的坐标：${lng}, ${lat}`
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
    .btn {
        margin-right: 8px;
    }
}
.fixed-input {
    width: 148px;
}
</style>
