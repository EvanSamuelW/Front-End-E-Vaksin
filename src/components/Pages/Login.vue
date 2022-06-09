<template>
  <div id="app">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <snackbar
            :visible="snackbar"
            :color="color"
            :message="message"
            @cancelled="snackbar = false"
          />
          <v-flex xs12 md4>
            <v-card class="elevation-12">
              <div
                style="
                  padding-top: 20px;
                  margin: auto;
                  max-width: 120px;
                  color: #22577e;
                  font-weight: bold;
                "
              >
                <h1>Masuk</h1>
              </div>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    name="username"
                    type="email"
                    required
                    :rules="emailRules"
                    @keyup.enter="submit"
                    hide-details="auto"
                    prepend-icon="mdi-account"
                  ></v-text-field>

                  <v-text-field
                    class="mt-2"
                    type="password"
                    v-model="form.password"
                    label="Kata Sandi"
                    required
                    :rules="passwordRules"
                    @keyup.enter="submit"
                    hide-details="auto"
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="submit"
                  style="margin: auto; padding: 20px"
                  class="white--text"
                  color="#22577E"
                  center
                  >Masuk
                </v-btn>
              </v-card-actions>
              <v-row style="margin-top: 10px">
                <v-btn
                  @click="dialog2 = true"
                  text
                  color="primary"
                  center
                  style="margin: auto"
                  >Daftar</v-btn
                >
              </v-row>
              <v-row style="margin-bottom: 10px">
                <v-btn
                  @click="forgotPassword = true"
                  text
                  color="primary"
                  center
                  style="margin: auto"
                  >Lupa Password?</v-btn
                >
              </v-row>
            </v-card>
            <v-dialog @close="close" v-model="dialog2" max-width="700px">
              <v-card height="350px" style="overflow-x: hidden">
                <div
                  style="
                    padding-top: 20px;
                    margin: auto;
                    color: #22577e;
                    font-weight: bold;
                  "
                >
                  <h1 style="max-width: 300px; margin: auto">Pilih Peranmu</h1>
                </div>
                <v-row>
                  <v-hover v-slot="{ hover }">
                    <v-card
                      :elevation="hover ? 12 : 0"
                      :class="{ 'on-hover': hover }"
                      outlined
                      color="transparent"
                      @click="
                        dialog = true;
                        dialog2 = false;
                        isUser = false;
                      "
                      class="mx-auto pa-5 mt-5"
                      justify="center"
                      max-width="300px"
                      style="border-radius: 10px"
                    >
                      <v-img
                        src="/medic.svg"
                        height="150px"
                        width="200px"
                      ></v-img>

                      <v-card-title
                        class="justify-center"
                        style="
                          background: white;
                          font-weight: 600;
                          color: #22577e;
                        "
                      >
                        Penyedia Vaksin
                      </v-card-title>
                    </v-card>
                  </v-hover>

                  <v-hover v-slot="{ hover }">
                    <v-card
                      :elevation="hover ? 12 : 0"
                      :class="{ 'on-hover': hover }"
                      outlined
                      color="transparent"
                      @click="
                        dialog3 = true;
                        dialog2 = false;
                        isUser = true;
                      "
                      class="mx-auto mt-5 pa-5"
                      justify="center"
                      max-width="300px"
                      style="border-radius: 10px"
                    >
                      <v-img
                        src="/user.svg"
                        height="150px"
                        width="200px"
                      ></v-img>

                      <v-card-title
                        class="justify-center"
                        style="
                          background: white;
                          font-weight: 600;
                          color: #22577e;
                        "
                      >
                        Peserta Vaksinasi
                      </v-card-title>
                    </v-card>
                  </v-hover>
                </v-row>
              </v-card>
            </v-dialog>
            <user-form
              :visible="dialog3"
              :formUser="formUser"
              :address="address"
              :coordinate="coordinate"
              @cancelled="dialog3 = false"
              @success="onSuccess"
              @error="onError"
              @openMap="mapDialog = true"
            />
            <v-dialog @close="close" v-model="dialog" max-width="700px">
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    Daftar Lokasi
                  </v-stepper-step>

                  <v-divider></v-divider>
                  <v-stepper-step :complete="e1 > 2" step="2">
                    Tambah Admin
                  </v-stepper-step>

                  <v-divider></v-divider>
                </v-stepper-header>
                <v-stepper-items>
                  <v-stepper-content step="1">
                    <div class="pa-5">
                      <v-form ref="formLocation">
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="formLocation.name"
                              label="Nama"
                              :rules="nameRules"
                              hide-details="auto"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="formLocation.email"
                              label="Email"
                              :rules="emailRules"
                              hide-details="auto"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <v-select
                              :items="allCategory"
                              item-text="name"
                              item-value="_id"
                              placeholder="Kategori"
                              v-model="formLocation.category"
                              :rules="nameRules"
                            >
                            </v-select>
                          </v-col>
                          <v-col>
                            <v-text-field
                              type="number"
                              v-model="formLocation.phone"
                              label="Nomor Handphone"
                              :rules="phoneRules"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-textarea
                            v-model="formLocation.address"
                            label="Alamat"
                            :rules="nameRules"
                            style="z-index: 1"
                            class="pa-2"
                          ></v-textarea
                        ></v-row>

                        <v-btn
                          @click="mapDialog = true"
                          icon
                          style="z-index: 1; bottom: 50px; left: 90%"
                        >
                          <v-icon color="orange darken-4"
                            >mdi-map-marker</v-icon
                          >
                        </v-btn>
                        <div id="preview">
                          <img
                            v-if="imageUrl"
                            :src="imageUrl"
                            style="max-width: 200px; max-height: 200px"
                          />
                        </div>
                        <label for="input-file2">Unggah Gambar Lokasi</label>

                        <input
                          id="input-file2"
                          type="file"
                          accept="image/*"
                          @change="onChange"
                        />
                      </v-form>
                    </div>
                    <div class="d-flex justify-end">
                      <v-btn color="error" class="mr-2" @click="dialog = false">
                        Batal
                      </v-btn>
                      <v-btn
                        color="primary"
                        @click="
                          $refs.formLocation.validate()
                            ? (e1 = 2)
                            : openSnackbar('Please fill the form', 'error')
                        "
                      >
                        Lanjut
                      </v-btn>
                    </div>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <div class="pa-5">
                      <v-form ref="formAdmin">
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="formAdmin.first_name"
                              label="Nama Depan"
                              :rules="nameRules"
                              hide-details="auto"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="formAdmin.last_name"
                              label="Nama Belakang"
                              :rules="nameRules"
                              hide-details="auto"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="formAdmin.position"
                              label="Posisi"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                          <v-col>
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
                                  v-model="formAdmin.date"
                                  label="Tanggal Bergabung"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="formAdmin.date"
                                @input="menu2 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="formAdmin.email"
                              label="Email"
                              :rules="emailRules"
                              hide-details="auto"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <v-text-field
                              type="password"
                              v-model="formAdmin.password"
                              label="Kata Sandi"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              type="password"
                              v-model="pass"
                              label=" Konfirmasi Kata Sandi"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </div>
                    <div class="d-flex justify-end">
                      <v-btn color="error" class="mr-2" @click="e1 = 1">
                        Kembali
                      </v-btn>
                      <v-btn color="primary" @click="save()"> Simpan </v-btn>
                    </div>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-dialog>
            <v-dialog v-model="forgotPassword" max-width="500px">
              <v-card style="overflow-y: hidden">
                <v-card-title
                  style="background: #22577e; font-weight: 600; color: white"
                >
                  Reset Kata Sandi
                </v-card-title>
                <div class="pa-5">
                  <v-form ref="formEmail">
                    <v-text-field
                      v-model="email"
                      prepend-inner-icon="mail"
                      label="Email"
                      :rules="emailRules"
                    ></v-text-field>
                  </v-form>
                </div>
                <v-card-actions class="justify-end">
                  <v-btn
                    @click="sendEmail()"
                    class="white--text"
                    color="#22577E"
                  >
                    Kirim Email
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <map-dialog
              :visible="mapDialog"
              @cancelled="mapDialog = false"
              @changePlace="onChangePlace"
              @changeCoordinate="onChangeCoordinate"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>
<script>
import MapDialog from "../MapDialog.vue";
import Snackbar from "../Snackbar.vue";
import UserForm from "../UserForm.vue";
import AdminPartnerStatus from "../../../_helpers/AdminPartnerStatus";

export default {
  components: { MapDialog, Snackbar, UserForm },

  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      partnerId: "",
      menu2: false,
      mapDialog: false,
      pass: "",
      formUser: {},
      email: "",
      forgotPassword: false,
      nameRules: [(v) => !!v || "Bagian ini wajib diisi"],
      passwordRules: [(v) => !!v || "Kata sandi wajib diisi"],
      phoneRules: [
        (v) =>
          /^08[0-9]{8,10}$/.test(v) || "Masukkan nomor handphone yang valid",
      ],
      emailRules: [
        (v) => /.+@.+\..+/.test(v) || "Masukkan alamat Email yang valid",
      ],
      color: "",
      message: "",
      snackbar: false,
      dialog: false,
      dialog2: false,
      dialog3: false,
      isUser: false,
      address: "",
      coordinate: [],
      formLocation: {
        name: "",
        phone: "",
        email: "",
        address: "",
        category: "",
        image: [],
        coordinate: [],
      },
      formAdmin: {
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        password: "",
        date: "",
        partner_id: "",
        status: "",
      },
      e1: 1,
      imageUrl: "",
    };
  },
  watch: {
    dialog(val) {
      !val && this.close();
    },
  },
  computed: {
    allCategory: {
      get() {
        return this.$store.state.functionalApp.allCategory;
      },
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("currentUser/loginUser", this.form)
          .then((response) => {
            console.log(response);
            this.$store.dispatch("currentUser/getUser");
            this.$http.defaults.headers.common["Authorization"] =
              "JWT " + localStorage.getItem("access_token");
          })
          .catch((e) => {
            this.openSnackbar(e.response.data.message, "error");
          });
      }
    },

    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    onChange(e) {
      const file = e.target.files[0];
      this.formLocation.image = file;
      console.log(this.formLocation.image);
      this.imageUrl = URL.createObjectURL(file);
    },
    onChangePlace({ place }) {
      this.isUser
        ? (this.address = place)
        : (this.formLocation.address = place);
    },
    onChangeCoordinate({ coordinate }) {
      this.coordinate = coordinate;
      this.isUser
        ? (this.coordinate = coordinate)
        : (this.formLocation.coordinate = this.coordinate);
    },
    getAllCategory() {
      this.$store.dispatch("functionalApp/getAllCategory");
    },
    onSuccess({ message }) {
      this.openSnackbar(message, "success");
    },
    onError({ message }) {
      this.openSnackbar(message, "error");
    },
    addPartner() {
      let formdata = new FormData();
      formdata.append("phone", this.formLocation.phone);
      formdata.append("name", this.formLocation.name);
      formdata.append("email", this.formLocation.email);
      formdata.append("address", this.formLocation.address);
      formdata.append("category", this.formLocation.category);
      formdata.append("image", this.formLocation.image);
      for (var i = 0; i < 2; i++) {
        formdata.append(
          "coordinate[]",
          this.formLocation.coordinate.length != 2
            ? []
            : parseFloat(this.formLocation.coordinate[i])
        );
      }

      this.$http
        .post("/partners/", formdata)
        .then((response) => {
          this.partnerId = response.data._id;
          this.addAdmin();
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    addAdmin() {
      this.formAdmin.partner_id = this.partnerId;
      this.formAdmin.status = AdminPartnerStatus.Not_Verified;
      this.$http
        .post("/adminPartner/", this.formAdmin)
        .then(() => {
          this.openSnackbar("Data partner berhasil ditambah", "success");
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    save() {
      return this.$refs.formAdmin.validate()
        ? this.pass == this.formAdmin.password
          ? this.addPartner()
          : this.openSnackbar(
              "Kata sandi and konfirmasi kata sandi tidak sama",
              "error"
            )
        : this.openSnackbar("Lengkapi seluruh form", "error");
    },
    sendEmail() {
      const form = {};
      form.email = this.email;
      if (this.$refs.formEmail.validate()) {
        this.$http
          .post("/users/forgotPassword", form)
          .then(() => {
            this.openSnackbar("Email berhasil dikirim", "success");
            this.email = "";
            this.forgotPassword = false;
          })
          .catch((error) => {
            this.openSnackbar(error.response.data.message, "error");
          });
      } else {
        this.openSnackbar("Masukkan email", "error");
      }
    },
    close() {
      (this.formLocation.name = ""),
        (this.formLocation.phone = ""),
        (this.formLocation.email = ""),
        (this.formLocation.address = ""),
        (this.formLocation.category = ""),
        (this.formLocation.image = []),
        (this.dialog2 = false);
      (this.formAdmin.first_name = ""),
        (this.formAdmin.last_name = ""),
        (this.formAdmin.email = ""),
        (this.formAdmin.position = ""),
        (this.formAdmin.password = ""),
        (this.formAdmin.date = ""),
        (this.formAdmin.partner_id = ""),
        (this.dialog = false);
      this.pass = "";
      this.$refs.form.reset();
      this.$refs.formLocation.reset();
      this.$refs.formAdmin.reset();
      this.imageUrl = null;
      this.menu2 = false;
      document.getElementById("input-file").value = "";
    },
  },
  created() {
    this.getAllCategory();
  },
};
</script>

<style scoped>
div #app {
  height: 100%;
  margin-top: 50px;
}
label {
  display: block;
}

input,
label {
  margin: 0.4rem 0;
}
</style>

