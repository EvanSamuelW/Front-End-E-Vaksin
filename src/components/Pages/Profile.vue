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
        <v-row>
          <v-col>
            <h1>Profil Saya</h1>
          </v-col>
          <v-col>
            <v-row>
              <v-icon
                class="mt-2 mr-2"
                color="success"
                v-if="
                  currentUser.vaksin1 ||
                  currentUser.vaksin2 ||
                  currentUser.vaksinBooster
                "
                >mdi-check-circle</v-icon
              >
              <p
                class="mt-6"
                v-if="currentUser.vaksin1 && !currentUser.vaksin2"
              >
                Vaksin 1
              </p>
              <p
                class="mt-6"
                v-if="currentUser.vaksin2 && !currentUser.vaksinBooster"
              >
                Vaksin 2
              </p>
              <p
                class="mt-6"
                v-if="currentUser.vaksinBooster && currentUser.vaksin2"
              >
                Vaksin Booster
              </p>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <v-card-text>
        <v-row justify="center">
          <v-avatar size="140" v-if="imgrSrc == ' /profile.png'">
            <v-img v-bind:src="imageSrc" height="150px" width="200px"></v-img>
          </v-avatar>
          <v-img
            v-else
            v-bind:src="imageSrc"
            contain
            height="200px"
            width="400px"
          ></v-img>
        </v-row>

        <div class="pa-4">
          <v-row>
            <v-col>
              <v-text-field
                :value="
                  currentUser.user_id.first_name +
                  ' ' +
                  currentUser.user_id.last_name
                "
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
                v-model="currentUser.phone"
                label="Nomor Handphone"
                type="number"
                :rules="phoneRules"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="currentUser.nik"
                label="NIK"
                type="number"
                :rules="nikRules"
              ></v-text-field
            ></v-col>
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
                  :value="date"
                  label="Tanggal Lahir"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <v-row>
            <v-textarea
              style="z-index: 1"
              label="Alamat"
              rows="3"
              readonly
              v-model="currentUser.address"
            >
            </v-textarea>
          </v-row>

          <v-btn
            @click="mapDialog = true"
            icon
            style="z-index: 1; bottom: 50px; left: 90%"
          >
            <v-icon color="orange darken-4">mdi-map-marker</v-icon>
          </v-btn>
        </div>
        <v-row style="margin-top: -50px">
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

    <map-dialog
      :visible="mapDialog"
      @cancelled="mapDialog = false"
      @changePlace="onChangePlace"
      @changeCoordinate="onChangeCoordinate"
    />

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
import MapDialog from "../MapDialog.vue";
import ChangePassword from "../ChangePassword.vue";
export default {
  components: { MapDialog, ChangePassword, Snackbar },

  name: "Profile",
  data() {
    return {
      nameRules: [(v) => !!v || "This Field is Required"],
      nikRules: [
        (v) => !!v || "NIK wajib diisi",
        (v) => (v && v.length == 16) || "NIK terdiri dari 16 angka",
      ],
      phoneRules: [
        (v) =>
          /^08[0-9]{8,10}$/.test(v) || "Masukkan nomor handphone yang valid",
      ],
      dialog: false,
      formsEdit: "",
      color: "",
      message: "",
      imgPreUrl: this.$imageLink + "ktp/",
      dialogPassword: false,
      snackbar: false,
      photoBase64: [],
      menu2: false,
      mapDialog: false,
      dateformatted: "",
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
        return this.currentUser.birthday.split("T")[0];
      },
      set(value) {
        this.$store.commit("currentUser/setUserDate", value);
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
    imageSrc: {
      get() {
        var img =
          this.currentUser.ktp != null
            ? this.imgPreUrl + this.currentUser.ktp
            : "/profile.png";
        return img;
      },
    },
  },
  created() {
    this.$store.dispatch("currentUser/getUser");
  },
  methods: {
    onChangePlace({ place }) {
      this.currentUser.address = place;
    },
    onChangeCoordinate({ coordinate }) {
      this.currentUser.coordinate = coordinate;
    },
    onSuccess({ message }) {
      this.openSnackbar(message, "success");
    },
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    onError({ message }) {
      this.openSnackbar(message, "error");
    },
    editProfile() {
      this.dialog = true;
      this.formsEdit = {
        id: this.currentUser._id,
        address: this.currentUser.address,
        phone: this.currentUser.phone,
        nik: this.currentUser.nik,
        birthday: this.currentUser.birthday,
        coordinate: this.currentUser.coordinate,
      };
      this.$http
        .put("/detailUser/" + this.formsEdit.id, this.formsEdit)
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