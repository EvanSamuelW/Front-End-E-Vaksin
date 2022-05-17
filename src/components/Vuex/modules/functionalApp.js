import axios from "axios";

const state = {
    allCategory: [],
    allActiveCategory: [],
    allPartner: [],
    allVaccine: [],
    allUser: [],
    allSchedule: [],
    dashboard: [],
    allAdminPartner: [],
    allMedics: [],
    partnerPages: 0
};

const getters = {};

const actions = {
    getAllCategory({ commit }) {
        axios.get("/categories").then((response) => {
            commit("setAllCategory", response.data);

        });
    },
    getAllActiveCategory({ commit }) {
        axios.get("/categories/active").then((response) => {
            commit("setAllActiveCategory", response.data);
        });
    },
    getAllPartner({ commit }, pages, search) {
        console.log(search);
        axios.get("/partners" + "/?page=" + pages + '/?search=' + search).then((response) => {
            commit("setAllPartner", response.data);
        });
    },
    getAllVaccine({ commit }) {
        axios.get("/vaccines").then((response) => {
            commit("setAllVaccine", response.data);
        })
    },
    getAllUser({ commit }) {
        axios.get("/detailUser").then((response) => {
            commit("setAllUser", response.data);
        })
    },
    getAllSchedule({ commit }, id) {
        axios.get("/schedules/" + id).then((response) => {
            commit("setAllSchedule", response.data);
        });

    },
    getAllAdminPartner({ commit }, id) {
        axios.get("/adminPartner/" + id).then((response) => {
            commit("setAllAdminPartner", response.data)
        })
    },
    getAllMedics({ commit }, id) {
        axios.get("/medics/" + id).then((response) => {
            commit("setAllMedics", response.data)
        })
    },
    getDashboard({ commit }) {
        axios.get("/dashboard").then((response) => {
            commit("setDashboard", response.data);
        })
    },
    setVaccineSchedule({ commit }, vaccines) {
        console.log(vaccines);
        commit('setAllVaccine', vaccines);
    }


};

const mutations = {
    setAllCategory(state, data) {
        state.allCategory = data;
        console.log(state.allCategory);
    },
    setAllActiveCategory(state, data) {
        state.allActiveCategory = data;
        state.allActiveCategory.push({ _id: "0", name: "All" });

    },
    setAllPartner(state, data) {
        state.allPartner = data.partner;
        state.partnerPages = data.pages;
    },
    setAllVaccine(state, data) {
        state.allVaccine = data;
    },
    setAllUser(state, data) {
        state.allUser = data;
    },
    setAllSchedule(state, data) {
        state.allSchedule = data;
    },
    setDashboard(state, data) {
        state.dashboard = data;
    },
    setAllAdminPartner(state, data) {
        state.allAdminPartner = data;
    },
    setAllMedics(state, data) {
        state.allMedics = data;
    },
    clearAllData(state) {
        state.allCategory = [];
        state.allActiveCategory = [];
        state.allPartner = [];
        state.allVaccine = [];
        state.allUser = [];
        state.allSchedule = [];
        state.partnerPages = 0;
        state.dashborad = [];
        state.allAdminPartner = [];
        state.allMedics = [];
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};