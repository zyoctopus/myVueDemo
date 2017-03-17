// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueResourece from 'vue-resource'
import './common/less/iconfont.css'

Vue.use(vueResourece)

// 引入路由文件
import router from './router/index.js'
// 基础样式
import './common/less/index.less'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
