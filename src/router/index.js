import Vue from 'vue'
import Router from 'vue-router'
import douban from '../components/douban.vue'
import relax from '../components/relax.vue'
import 'mint-ui/lib/style.css'
import { Spinner } from 'mint-ui'

Vue.component(Spinner.name, Spinner)
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        redirect: '/douban'
    }, {
        path: '/douban',
        component: douban
    }, {
        path: '/relax',
        component: relax
    }],
    linkActiveClass: 'active'
})
