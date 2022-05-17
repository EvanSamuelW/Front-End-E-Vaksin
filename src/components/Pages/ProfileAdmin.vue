<template>
  <div class="body-profile">
    <snackbar
      :visible="snackbar"
      :color="color"
      :message="message"
      @cancelled="snackbar = false"
    />
    <v-card class="round-card mx-auto ma-10" width="500">
      <div
        style="
          padding-top: 20px;
          margin-left: 30px;
          color: #22577e;
          font-weight: bolder;
        "
      >
        <h1>Profil Saya</h1>
      </div>

      <v-card-text>
        <v-row justify="center">
          <v-avatar size="140">
            <v-img src="/profile.png" height="150px" width="200px"></v-img>
          </v-avatar>
        </v-row>

        <div class="pa-4">
          <v-row>
            <v-col>
              <v-text-field
                v-model="fullName"
                label="Nama"
                readonly
              ></v-text-field
            ></v-col>
            <v-col>
              <v-text-field
                v-model="currentUser.user_id.email"
                label="Email"
                readonly
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="currentUser.position"
                label="Posisi"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Tanggal Bergabung"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date"></v-date-picker>
            </v-menu>
          </v-row>
        </div>
        <v-row>
          <v-col>
            <div>
              <v-btn
                style="color: white"
                width="100%"
                color="#124761 "
                @click="dialogPassword = true"
                >Ubah Kata Sandi</v-btn
              >
            </div>
          </v-col>
          <v-col>
            <div>
              <v-btn
                style="color: white"
                width="100%"
                color="#248232 "
                @click="editProfile"
                >Ubah Profil</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <change-password
      :visible="dialogPassword"
      :id="currentUser.user_id._id"
      @cancelled="dialogPassword = false"
      @success="onSuccess"
      @error="onError"
    />
  </div>
</template>

<script>
import Snackbar from "../Snackbar.vue";
import ChangePassword from "../ChangePassword.vue";
export default {
  components: { ChangePassword, Snackbar },

  name: "ProfileMedic",
  data() {
    return {
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      dialog: false,
      formsEdit: "",
      color: "",
      message: "",
      dialogPassword: false,
      snackbar: false,
      menu2: false,
    };
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    date: {
      get() {
        return this.currentUser.join_date.split("T")[0];
      },
    },
    fullName: {
      get() {
        return (
          this.currentUser.user_id.first_name +
          " " +
          this.currentUser.user_id.last_name
        );
      },
    },
  },

  methods: {
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    onSuccess({ message }) {
      this.openSnackbar(message, "success");
    },
    onError({ message }) {
      this.openSnackbar(message, "error");
    },

    editProfile() {
      this.dialog = true;
      this.formsEdit = {
        id: this.currentUser._id,
        position: this.currentUser.position,
        join_date: this.currentUser.join_date,
      };
      this.$http
        .patch("/superAdmin/" + this.formsEdit.id, this.formsEdit)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Profil berhasil diubah", "success");
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
};
</script>

<style scoped>
.body-profile {
  height: 100%;
  display: flex;
  align-items: center;
  margin-top: 50px;
}
</style>