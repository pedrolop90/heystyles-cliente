/*!

=========================================================
* Vue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import store from './store'
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(ArgonDashboard)
Vue.use(BootstrapVue)
Vue.use(VueLoaders);

var toastrConfigs = {
  position: 'top right',
  showDuration: 10
}
Vue.use(CxltToastr, toastrConfigs)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

