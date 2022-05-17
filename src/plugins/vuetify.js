import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'



Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'md', // default - only for display purposes
    },
    theme: {
        themes: {
            light: {
                primary: '#22577e',
                success: '#248232',
                error: '#9E2B25',
                danger: '#F7B801'
            },
        },
    },
})