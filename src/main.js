import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'

import './base/styles/global.scss'

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('./base/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
