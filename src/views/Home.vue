<template>
    <my-page title="地图" :page="page">
        <div class="common-container container">
            <app-list :data="groups" />
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                groups: [
                    {
                        name: '基本',
                        apps: [
                            {
                                name: '地图',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: '/map'
                            },
                            {
                                name: '地图定位',
                                desc: '',
                                icon: '/static/img/map_location.svg',
                                to: '/location'
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
                            
                            // {
                            //     name: '广州新冠病例分布',
                            //     desc: '',
                            //     icon: '/static/img/map_area.svg',
                            //     to: '/locations/deving'
                            // },
                        ]
                    },
                    {
                        name: '转换',
                        apps: [
                            {
                                name: '坐标转换',
                                desc: '',
                                icon: '/static/img/map_location_convert.svg',
                                to: '/convert'
                            },
                            {
                                name: '地址解析',
                                desc: '',
                                icon: '/static/img/map_location_convert.svg',
                                to: '/address'
                            },
                            {
                                name: '经纬度解析',
                                desc: '',
                                icon: '/static/img/map_location_convert.svg',
                                to: '/convert/coord'
                            },
                            {
                                name: '经纬度计算',
                                desc: '',
                                icon: '/static/img/map_distance.svg',
                                to: '/distance/calc'
                            },
                            {
                                name: '求经纬度',
                                desc: '',
                                icon: '/static/img/map_distance.svg',
                                to: '/distance/calc2'
                            },
                        ]
                    },
                    {
                        name: '工具',
                        apps: [
                            {
                                name: '我的位置',
                                desc: '',
                                icon: '/static/img/map_area.svg',
                                to: '/myLocation'
                            },
                            {
                                name: '你在哪',
                                desc: '',
                                icon: '/static/img/map_area.svg',
                                to: '/whereAreYou'
                            },
                        ]
                    },
                    {
                        name: '测量',
                        apps: [
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
                            },
                        ]
                    },
                    {
                        name: '其他',
                        apps: [
                            {
                                name: 'GIS',
                                desc: '',
                                icon: '/static/img/map_area.svg',
                                to: 'xxx',
                                href: 'https://gis.yunser.com/',
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
