import Vue from 'vue'
import Vuex from 'vuex'
import currentUser from './modules/currentUser'
import functionalApp from './modules/functionalApp'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

const vuex = new Vuex.Store({
    modules: {
        currentUser,
        functionalApp

    },
    plugins: [createPersistedState()]
});


export default vuex