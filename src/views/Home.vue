<template>
    <my-page title="地图" :page="page">
        <app-list :data="groups" />
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                groups: [
                    {
                        name: '基本',
                        apps: [
                            {
                                name: '地图定位',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: '/location'
                            },
                            {
                                name: '坐标转换',
                                desc: '',
                                icon: '/static/img/map_location_convert.svg',
                                to: '/convert'
                            },
                            {
                                name: '地址解析',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: '/address'
                            },
                            {
                                name: '位置标记',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: '/marker'
                            },
                            // {
                            //     name: '经纬度解析',
                            //     desc: '',
                            //     icon: '/static/img/map_location.svg',
                            //     to: '/address'
                            // },
                            {
                                name: '坐标拾取',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: '/location_get'
                            },
                            {
                                name: '距离测量',
                                desc: '',
                                icon: '/static/img/map_distance.svg',
                                to: '/distance'
                            },
                            {
                                name: '面积测量',
                                desc: '',
                                icon: '/static/img/map_area.svg',
                                to: '/area'
                            }
                        ]
                    },
                    {
                        name: '没卵用',
                        apps: [
                            {
                                name: '百度地图坐标拾取',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: 'xxx',
                                href: 'https://demo2.yunser.com/map_baidu',
                                target: '_blank'
                            },
                            {
                                name: '腾讯地图坐标拾取',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: 'xxx',
                                href: 'https://demo2.yunser.com/getpoint/',
                                target: '_blank'
                            }
                        ]
                    }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'search',
                            href: 'https://search.yunser.com?utm_source=map',
                            target: '_blank',
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=map',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        computed: {
        },
        mounted() {
        },
        methods: {
        }
    }
</script>
