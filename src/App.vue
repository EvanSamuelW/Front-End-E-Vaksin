<template>
  <v-app id="app">
    <navbar-component />
  </v-app>
</template>


<script>
import NavbarComponent from "./components/NavbarComponent.vue";
export default {
  data: function () {
    return {
      token() {
        return localStorage.getItem("vuex.currentUser.isLogin");
      },
    };
  },
  components: {
    NavbarComponent,
  },
};
</script>


<style scoped>
#app {
  background-color: #e5e5e5;
}
.fullheight {
  min-height: 100vh !important;
}
</style>