import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './components/Vuex'
import router from './router'
import axios from 'axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueQrcodeReader from "vue-qrcode-reader";
import WebCam from 'vue-web-cam';
import '@mdi/font/css/materialdesignicons.css';


Vue.config.productionTip = false
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'https://e-vaksin.xyz/api';
Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.VUE_APP_MAP_ACCESS_TOKEN,
        libraries: 'places',
    }
});
Vue.prototype.$imageLink = 'https://e-vaksin.xyz/api/';

Vue.use(VueQrcodeReader);
Vue.use(WebCam);

new Vue({
    vuetify,
    router,
    store,
    axios,
    render: h => h(App),
}).$mount('#app')