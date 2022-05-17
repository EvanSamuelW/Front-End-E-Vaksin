import Vue from "vue";
import VueRouter from "vue-router";
import Role from "../_helpers/role";

Vue.use(VueRouter);

function importComponent(name) {
    return () =>
        import (`./components/Pages/${name}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes: [

        {
            name: "Login",
            meta: { title: 'Masuk' },
            path: "/",
            component: importComponent("Login"),
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem("access_token") != null && localStorage.getItem('role') == Role.User) {
                    next("/Profile");
                } else if (localStorage.getItem("access_token") != null && localStorage.getItem('role') != Role.User) {
                    next('/Dashboard');
                } else {
                    next();
                }
            },
        },

        {
            name: "Category",
            meta: { title: 'Kategori' },
            path: "/Category",
            component: importComponent("Category"),
        },
        {
            name: "Partner",
            meta: { title: 'Partner' },
            path: "/Partner",
            component: importComponent("Partner"),
        },

        {
            name: "Vaccine",
            meta: { title: 'Vaksin' },
            path: "/Vaccine",
            component: importComponent("Vaccine"),
        },

        {
            name: "User",
            meta: { title: 'Pengguna' },
            path: "/User",
            component: importComponent("User"),
        },

        {
            name: "Profile",
            meta: { title: 'Profil' },
            path: "/Profile",
            component: importComponent("Profile"),
            beforeEnter: (to, from, next) => {

                if (localStorage.getItem("role") == Role.Partner) {
                    next("/ProfilePartner");
                } else if (localStorage.getItem('role') == Role.Admin) {
                    next("/ProfileAdmin");
                } else if (localStorage.getItem('role') == Role.Medic) {
                    next("/ProfileMedic");
                } else {
                    next();
                }
            },
        },

        {
            name: "Schedule",
            meta: { title: 'Jadwal' },
            path: "/Schedule",
            component: importComponent("Schedule"),
        },

        {
            name: "Dashboard",
            meta: { title: 'Dasbor' },
            path: "/Dashboard",
            component: importComponent("Dashboard"),
        },
        {
            name: "AdminPartner",
            meta: { title: 'Admin Partner' },
            path: "/AdminPartner",
            component: importComponent("AdminPartner"),
        },
        {
            name: "Medic",
            meta: { title: 'Medis' },
            path: "/Medic",
            component: importComponent("Medic"),
        },
        {
            name: "SuperAdmin",
            meta: { title: 'Super Admin' },
            path: "/SuperAdmin",
            component: importComponent("SuperAdmin"),
        },
        {
            name: "ProfilePartner",
            meta: { title: 'Profil' },
            path: "/ProfilePartner",
            component: importComponent("ProfilePartner"),
        },
        {
            name: "ProfileAdmin",
            meta: { title: 'Profil' },
            path: "/ProfileAdmin",
            component: importComponent("ProfileAdmin"),
        },
        {
            name: "ProfileMedic",
            meta: { title: 'Profil' },
            path: "/ProfileMedic",
            component: importComponent("ProfileMedic"),
        },
        {
            name: "Location",
            meta: { title: 'Temukan Lokasi Terdekat' },
            path: "/Location",
            component: importComponent("Location"),
        },

        {
            name: "Chat",
            meta: { title: 'Percakapan' },
            path: "/Chat",
            component: importComponent("Chat"),
        },

        {
            name: "Transaction",
            meta: { title: 'Vaksinasi Mendatang' },
            path: "/Transaction",
            component: importComponent("Transaction"),
        },
        {
            name: 'Participant',
            meta: { title: 'Peserta Vaksinasi' },
            path: "/Participant/:id",
            component: importComponent("Participant"),
        }

    ],

});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
});

export default router;