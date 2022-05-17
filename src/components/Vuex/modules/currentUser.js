import axios from "axios";
import router from "../../../router";
import Role from '../../../../_helpers/role';

const state = {
    user: [],
    isLogin: false,
    role: '',
};
const getters = {};

const actions = {
    async loginUser({ commit }, user) {
        return await axios
            .post("/authentication", {
                email: user.email,
                password: user.password,
            })
            .then((response) => {
                if (response.data.token) {
                    console.log("Login Berhasil");
                    localStorage.setItem("access_token", response.data.token);
                    localStorage.setItem("role", response.data.data.role);
                    commit("setUserLogin", response.data.data);

                    if (response.data.data.role == Role.User) {

                        router.push({
                            name: "Profile",
                        });
                    } else {
                        router.push({
                            name: "Dashboard",
                        });
                    }
                }
            });
    },

    getUser({ commit }) {
        axios.get("/users").then((response) => {
            console.log("Get User Berhasil");
            commit("setUserLogin", response.data);
        });
    },
    logoutUser({ commit }) {
        axios.post("/authentication/logout").then((response) => {
            console.log(response.data.message);
            localStorage.removeItem("access_token");
            commit("setUserLogout");

            this.commit("functionalApp/clearAllData");
            router.push({
                name: "Login",
            });
        });
    },


};
const mutations = {
    setUserLogin(state, data) {
        state.user = data;
        state.isLogin = true;
        state.role = localStorage.getItem('role');
    },
    setUserLogout(state) {
        (state.user = []), (state.isLogin = false), (state.role = '');
    },
    setUser(state, data) {
        state.user = data;
    },
    setUserDate(state, date) {
        state.user.birthday = date;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
};