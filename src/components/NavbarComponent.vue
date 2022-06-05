
 <template>
  <div class="dashboard">
    <v-navigation-drawer
      v-if="currentUser.isLogin"
      v-model="drawer"
      class="fullheight"
      width="256"
      app
      color="#124761"
    >
      <template v-slot:prepend> </template>

      <v-list-item>
        <v-list-item-avatar size="60">
          <v-img src="https://e-vaksin.xyz/api/logo.png" />
        </v-list-item-avatar>
        <v-list-item-title style="color: #ffffff; font-weight: bold">
          E-Vaksin.Com
        </v-list-item-title>
      </v-list-item>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          :to="link.route"
          v-show="checkItem(link)"
        >
          <v-list-item-action>
            <v-icon style="color: #2b2b2b" class="white--text">
              {{ link.icon }}</v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-btn
          style="width: 80%; margin: auto; margin-top: 30px; font-weight: bold"
          color="error"
          class="ml-5"
          @click="logoutUser"
          >Logout</v-btn
        >
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      fixed
      color="#22577E"
      height="75px"
      v-show="currentUser.isLogin"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon color="#FFFFFF"> menu </v-icon></v-app-bar-nav-icon
      >

      <div style="text-align: center">
        <h2 class="white--text ml-3">{{ currentRouteName }}</h2>
      </div>
      <div class="ml-auto mt-3" v-if="currentUser.isLogin">
        <h4 class="white--text" style="text-align: center">
          {{
            currentUser.user.user_id.first_name +
            " " +
            currentUser.user.user_id.last_name
          }}
        </h4>
        <p class="white--text">
          {{ getText() }}
        </p>
      </div>
    </v-app-bar>
    <div
      class="fullheight"
      v-bind:style="[
        $route.meta.padding ? { padding: 0 + 'px' } : { padding: 20 + 'px' },
      ]"
    >
      <router-view></router-view>
    </div>
  </div>
</template> 

<script>
import role from "../../_helpers/role";
export default {
  data() {
    return {
      drawer: false,
      links: [
        {
          icon: "mdi-account",
          text: "Profil",
          route: "/Profile",
        },
        { icon: "mdi-view-dashboard", text: "Dasbor", route: "/Dashboard" },
        { icon: "domain", text: "Kategori", route: "/Category" },
        { icon: "mdi-hospital-building", text: "Partner", route: "/Partner" },
        { icon: "mdi-needle", text: "Vaksin", route: "/Vaccine" },
        { icon: "mdi-account-group", text: "Pengguna", route: "/User" },
        { icon: "mdi-account-cog", text: "Admin", route: "/SuperAdmin" },
        { icon: "mdi-doctor", text: "Medis", route: "/Medic" },
        { icon: "mdi-calendar", text: "Jadwal", route: "/Schedule" },
        {
          icon: "mdi-account-tie",
          text: "Admin Partner",
          route: "/AdminPartner",
        },
        {
          icon: "mdi-calendar",
          text: "Vaksinasi Mendatang",
          route: "/Transaction",
        },
        { icon: "mdi-chat", text: "Percakapan", route: "/Chat" },
        {
          icon: "mdi-map-marker",
          text: "Temukan Lokasi Terdekat",
          route: "/Location",
        },
      ],
    };
  },
  name: "NavbarComponent",
  methods: {
    logoutUser() {
      this.$store.dispatch("currentUser/logoutUser");
    },
    getText() {
      return this.currentUser.role == role.Partner
        ? "Admin" + " " + this.currentUser.user.partner_id.name
        : this.currentUser.role == role.Admin
        ? "Super Admin"
        : this.currentUser.role == role.Medic
        ? "Medic" + " " + this.currentUser.user.partner_id.name
        : "";
    },
    checkItem(link) {
      if (link.text == "Dasbor" && this.currentUser.role == role.User) {
        return false;
      } else if (
        link.text == "Kategori" &&
        this.currentUser.role != role.Admin
      ) {
        return false;
      } else if (
        link.text == "Partner" &&
        this.currentUser.role != role.Admin
      ) {
        return false;
      } else if (link.text == "Vaksin" && this.currentUser.role != role.Admin) {
        return false;
      } else if (
        link.text == "Pengguna" &&
        this.currentUser.role != role.Admin
      ) {
        return false;
      } else if (link.text == "Admin" && this.currentUser.role != role.Admin) {
        return false;
      } else if (
        link.text == "Medis" &&
        this.currentUser.role != role.Partner
      ) {
        return false;
      } else if (
        link.text == "Admin Partner" &&
        this.currentUser.role != role.Partner
      ) {
        return false;
      } else if (
        link.text == "Jadwal" &&
        this.currentUser.role != role.Partner
      ) {
        return false;
      } else if (
        link.text == "Vaksinasi Mendatang" &&
        this.currentUser.role != role.User
      ) {
        return false;
      } else if (
        link.text == "Temukan Lokasi Terdekat" &&
        this.currentUser.role != role.User
      ) {
        return false;
      } else if (
        link.text == "Percakapan" &&
        this.currentUser.role != role.User &&
        this.currentUser.role != role.Medic
      ) {
        return false;
      } else {
        return true;
      }
    },
  },

  created() {
    if (this.currentUser.isLogin) {
      this.$http.defaults.headers.common["Authorization"] =
        "JWT " + localStorage.getItem("access_token");
      this.$store.dispatch("currentUser/getUser");
    }
  },

  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser;
      },
    },
    currentRouteName() {
      return this.$route.meta.title;
    },
  },
};
</script>
<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.dashboard {
  background-color: #e5e5e5;
}
</style>