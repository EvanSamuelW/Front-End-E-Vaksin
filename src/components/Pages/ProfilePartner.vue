<template>
  <div class="body-profile">
    <snackbar
      :visible="snackbar"
      :color="color"
      :message="message"
      @cancelled="snackbar = false"
    />
    <v-main>
      <v-row>
        <v-col cols="12" md="6"
          ><v-card
            style="border-radius: 20px"
            class="round-card mx-auto ma-10 pa-5"
            width="600"
            elevation="4"
          >
            <div
              style="
                padding-top: 20px;
                margin-left: 30px;
                color: #22577e;
                font-weight: bold;
              "
            >
              <h1>Profil Saya</h1>
            </div>
            <v-card-text>
              <v-row justify="center">
                <v-col>
                  <v-row justify="center">
                    <v-avatar size="140">
                      <v-img
                        v-bind:src="imageSrc"
                        height="150px"
                        width="200px"
                      ></v-img>
                    </v-avatar>
                  </v-row>
                </v-col>
                <div class="ml-20 pa-5">
                  <v-row>
                    <v-text-field
                      outlined
                      label="Nama"
                      prepend-inner-icon="mdi-account"
                      :value="
                        currentUser.user_id.first_name +
                        ' ' +
                        currentUser.user_id.last_name
                      "
                      readonly
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      outlined
                      label="Email"
                      prepend-inner-icon="mdi-email"
                      v-model="currentUser.user_id.email"
                      readonly
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      outlined
                      label="Posisi"
                      prepend-inner-icon="mdi-email"
                      v-model="currentUser.position"
                    ></v-text-field>
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
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          outlined
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
                </div>

                <v-col class="text-right"> </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                style="color: white"
                color="#22577e"
                @click="dialogPassword = true"
                >Ubah Kata Sandi</v-btn
              >
              <v-btn
                color="#248232 "
                class="white--text"
                @click="editProfileAdmin"
                >Ubah Profil</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="6"
          ><v-card
            style="border-radius: 20px"
            class="round-card mx-auto ma-10 pa-5"
            width="900"
            elevation="4"
          >
            <div
              style="
                padding-top: 10px;
                margin-left: 20px;
                color: #22577e;
                font-weight: bold;
              "
            >
              <h1>Profil Partner</h1>
            </div>
            <v-card-text>
              <v-row justify="center">
                <v-col cols="12" md="4">
                  <v-row justify="center">
                    <v-img :src="imageSrc"></v-img>
                    <v-btn
                      style="margin-left: 200px; margin-top: -20px"
                      fab
                      dark
                      small
                      color="#22577e"
                      :loading="isSelecting"
                      @click="onButtonClick"
                    >
                      <v-icon dark>mdi-pencil </v-icon>
                    </v-btn>

                    <input
                      id="input-file"
                      type="file"
                      accept="image/*"
                      ref="uploader"
                      class="d-none"
                      @change="onChange"
                    />
                  </v-row>
                </v-col>
                <v-col style="margin-left: 30px" cols="12" md="6">
                  <v-row>
                    <v-text-field
                      outlined
                      label="Nama Lokasi"
                      v-model="formLocation.name"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-select
                      :items="allActiveCategory"
                      item-text="name"
                      item-value="_id"
                      placeholder="Kategori"
                      prepend-inner-icon="mdi-office-building"
                      v-model="formLocation.category._id"
                      :rules="nameRules"
                      outlined
                    >
                    </v-select>
                  </v-row>
                  <v-row class="mb-2">
                    <v-text-field
                      outlined
                      label="Nomor Handphone"
                      prepend-inner-icon="mdi-phone"
                      v-model="formLocation.phone"
                    ></v-text-field>
                  </v-row>
                  <v-row class="mb-2">
                    <v-text-field
                      outlined
                      label="Email"
                      prepend-inner-icon="mdi-email"
                      v-model="formLocation.email"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-textarea
                      v-model="formLocation.address"
                      label="Alamat"
                      :rules="nameRules"
                      outlined
                    ></v-textarea>
                  </v-row>
                  <v-btn
                    @click="mapDialog = true"
                    icon
                    style="z-index: 1; bottom: 60px; left: 90%"
                  >
                    <v-icon color="orange darken-4">mdi-map-marker</v-icon>
                  </v-btn>
                </v-col>

                <v-col class="text-right"> </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                style="margin-top: -40px"
                class="white--text"
                color="#248232 "
                @click="editProfile"
                >Ubah Profil</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-main>

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
import MapDialog from "../MapDialog.vue";
import ChangePassword from "../ChangePassword.vue";
import Snackbar from "../Snackbar.vue";

export default {
  components: { MapDialog, ChangePassword, Snackbar },
  name: "ProfilePartner",

  data() {
    return {
      nameRules: [(v) => !!v || "Area Ini Wajib Diisi"],
      formsEdit: "",
      message: "",
      color: "",
      dialogPassword: false,
      snackbar: false,
      image: [],
      imageUrl: "",
      imgPreUrl: this.$imageLink + "partner/",
      coordinate: [],
      menu2: false,
      mapDialog: false,
      formLocation: {
        name: "",
        category: "",
        phone: "",
        email: "",
        address: "",
        coordinate: [],
      },
      selectedFile: null,
      isSelecting: false,
    };
  },
  computed: {
    allActiveCategory: {
      get() {
        return this.$store.state.functionalApp.allActiveCategory;
      },
    },
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    date: {
      get() {
        return this.currentUser.join_date.split("T")[0];
      },
      set(value) {
        this.currentUser.join_date = value;
      },
    },

    imageSrc: {
      get() {
        var img =
          this.currentUser.partner_id.image != null
            ? this.imgPreUrl + this.currentUser.partner_id.image
            : "/profile.png";
        return img;
      },
    },
  },
  methods: {
    getAllActiveCategory() {
      this.$store.dispatch("functionalApp/getAllActiveCategory");
    },
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      this.$refs.uploader.click();
    },
    onChangePlace({ place }) {
      this.formLocation.address = place;
    },
    onChangeCoordinate({ coordinate }) {
      this.coordinate = coordinate;
    },
    onSuccess({ message }) {
      this.openSnackbar(message, "success");
    },
    onError({ message }) {
      this.openSnackbar(message, "error");
    },
    onChange(e) {
      const file = e.target.files[0];
      this.image = file;
      this.imageUrl = URL.createObjectURL(file);
    },

    editProfile() {
      let formsEdit = new FormData();
      formsEdit.append("phone", this.formLocation.phone);
      formsEdit.append("name", this.formLocation.name);
      formsEdit.append("email", this.formLocation.email);
      formsEdit.append("address", this.formLocation.address);
      formsEdit.append("category", this.formLocation.category._id);
      formsEdit.append("image", this.image == [] ? null : this.image);
      for (var i = 0; i < 2; i++) {
        formsEdit.append(
          "coordinate[]",
          this.coordinate.length != 2 ? [] : parseFloat(this.coordinate[i])
        );
      }
      this.$http
        .put("/partners/" + this.currentUser.partner_id._id, formsEdit)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Profil partner berhasil diubah", "success");
          this.formsEdit = "";
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    initVar() {
      this.formLocation.name = this.currentUser.partner_id.name;
      this.formLocation.phone = this.currentUser.partner_id.phone;
      this.formLocation.email = this.currentUser.partner_id.email;
      this.formLocation.address = this.currentUser.partner_id.address;
      this.formLocation.category = this.currentUser.partner_id.category;
    },
    editProfileAdmin() {
      this.formsEdit = {
        id: this.currentUser._id,
        date: this.date,
        position: this.currentUser.position,
      };

      this.$http
        .patch("/adminPartner/" + this.formsEdit.id, this.formsEdit)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Profil admin berhasil diubah", "success");
          this.formsEdit = "";
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.initVar();
    this.getAllActiveCategory();
  },
};
</script>

<style scoped>
.body-profile {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>