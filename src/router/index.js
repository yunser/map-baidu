import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const Location = resolve => require(['@/views/Location'], resolve)
const LngLat = resolve => require(['@/views/LngLat'], resolve)
const Convert = resolve => require(['@/views/Convert'], resolve)
const LocationGet = resolve => require(['@/views/LocationGet'], resolve)
const Address = resolve => require(['@/views/Address'], resolve)
const Marker = resolve => require(['@/views/Marker'], resolve)
const Distance = resolve => require(['@/views/Distance'], resolve)
const Area = resolve => require(['@/views/Area'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    { path: '/map', component: resolve => require(['@/views/Map'], resolve) },
    { path: '/myLocation', component: resolve => require(['@/views/MyLocation'], resolve) },
    { path: '/whereAreYou', component: resolve => require(['@/views/WhereAreYou'], resolve) },
    { path: '/locations/deving', component: resolve => require(['@/views/Locations'], resolve) },
    { path: '/convert/coord', component: resolve => require(['@/views/CoordConvert'], resolve) },
    {
        path: '/location',
        component: Location
    },
    {
        path: '/distance',
        component: Distance
    },
    {
        path: '/area',
        component: Area
    },
    {
        path: '/lnglat',
        component: LngLat
    },
    {
        path: '/address',
        component: Address
    },
    {
        path: '/marker',
        component: Marker
    },
    {
        path: '/convert',
        component: Convert
    },
    {
        path: '/location_get',
        component: LocationGet
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
