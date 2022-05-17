<template>
  <v-dialog
    @close="onCancel"
    v-model="visibility"
    max-width="700px"
    @input="onCancel"
  >
    <v-card>
      <v-card-title
        v-if="inputType == 'Tambah'"
        style="background: #22577e; font-weight: 600; color: white"
      >
        Tambah Peserta Baru
      </v-card-title>
      <v-card-title
        v-else
        style="background: #22577e; font-weight: 600; color: white"
      >
        Ubah Data Peserta
      </v-card-title>
      <div class="pa-5">
        <v-form ref="formUser">
          <v-row>
            <v-col>
              <v-text-field
                v-model="formUser.first_name"
                label="Nama Depan"
                :rules="nameRules"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="formUser.last_name"
                label="Nama Belakang"
                :rules="nameRules"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                type="number"
                v-model="formUser.nik"
                label="NIK"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="formUser.phone"
                label="Nomor Handphone"
                :rules="phoneRules"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model="formUser.email"
                label="Email"
                :rules="emailRules"
              ></v-text-field>
            </v-col>
            <v-col>
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
                      v-model="formUser.date"
                      label="Tanggal Lahir"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formUser.date"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-if="inputType == 'Tambah'"
                type="password"
                v-model="formUser.password"
                label="Kata Sandi"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-if="inputType == 'Tambah'"
                type="password"
                v-model="pass"
                label="Konfirmasi Kata Sandi"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="px-3">
            <v-textarea
              readonly
              v-model="address"
              label="Alamat"
              :rules="nameRules"
            ></v-textarea
          ></v-row>
          <v-btn
            @click="onMap"
            icon
            style="z-index: 1; bottom: 50px; left: 90%"
          >
            <v-icon color="orange darken-4">mdi-map-marker</v-icon>
          </v-btn>
          <div id="preview">
            <img
              :src="
                inputType == 'Tambah' && imageUrl2 != ''
                  ? imageUrl2
                  : 'https://e-vaksin.xyz/api/ktp/' + formUser.ktp
              "
              style="max-width: 200px; max-height: 200px"
            />
          </div>

          <v-row class="mt-2">
            <label for="input-file">Unggah KTP</label>
          </v-row>
          <v-row class="mt-10">
            <input
              id="input-file"
              type="file"
              accept="image/*"
              @change="onChange2"
            />
          </v-row>
        </v-form>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="onClick"> Simpan </v-btn>
        <v-btn color="error" @click="onCancel"> Tutup </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    inputType: {
      type: String,
      default: "Tambah",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "",
    },
    coordinate: {
      type: Array,
      default() {
        return [];
      },
    },
    formUser: {
      type: Object,
      default() {
        return {
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          nik: "",
          address: "",
          password: "",
          date: "",
          user_id: "",
          ktp: "",
          coordinate: [],
        };
      },
    },
  },
  data() {
    return {
      visibility: false,
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      pass: "",
      imageUrl2: "",
      menu2: false,
      passwordRules: [(v) => !!v || "Kata Sandi wajib diisi"],
      phoneRules: [
        (v) =>
          /^08[0-9]{8,10}$/.test(v) || "Masukkan nomor handphone yang valid",
      ],
      emailRules: [
        (v) => /.+@.+\..+/.test(v) || "Masukkan alamat Email yang valid",
      ],
    };
  },

  name: "UserFormComponent",

  methods: {
    onClick() {
      return this.$refs.formUser.validate()
        ? this.pass == this.formUser.password
          ? this.inputType == "Tambah"
            ? this.saveUser()
            : this.updateUser()
          : this.onError("Kata sandi and konfirmasi kata sandi tidak sama")
        : this.onError("Lengkapi form ini");
    },
    saveUser() {
      let formdata = new FormData();
      formdata.append("first_name", this.formUser.first_name);
      formdata.append("last_name", this.formUser.last_name);
      formdata.append("phone", this.formUser.phone);
      formdata.append("email", this.formUser.email);
      formdata.append("address", this.address);
      formdata.append("password", this.formUser.password);
      formdata.append("nik", this.formUser.nik);
      formdata.append("date", this.formUser.date);
      formdata.append("ktp", this.formUser.ktp);
      for (var i = 0; i < 2; i++) {
        formdata.append(
          "coordinate[]",
          this.coordinate.length != 2 ? [] : parseFloat(this.coordinate[i])
        );
      }
      this.$http
        .post("/users/", formdata)
        .then(() => {
          this.onSuccess("Data pengguna berhasil ditambah");
          this.onCancel();
        })
        .catch((error) => {
          this.onError(error.response.data.message);
        });
    },

    updateUser() {
      let formdata = new FormData();
      formdata.append("first_name", this.formUser.first_name);
      formdata.append("last_name", this.formUser.last_name);
      formdata.append("phone", this.formUser.phone);
      formdata.append("email", this.formUser.email);
      formdata.append("address", this.address);
      formdata.append("password", this.formUser.password);
      formdata.append("nik", this.formUser.nik);
      formdata.append("date", this.formUser.date);
      formdata.append("ktp", this.formUser.ktp);
      formdata.append("user_id", this.formUser.user_id);
      for (var i = 0; i < 2; i++) {
        formdata.append(
          "coordinate[]",
          this.coordinate.length != 2 ? [] : parseFloat(this.coordinate[i])
        );
      }

      this.$http
        .put("/detailUser/" + this.formUser.id, formdata)
        .then(() => {
          this.onSuccess("Data pengguna berhasil diperbarui");
          this.onCancel();
        })
        .catch((error) => {
          this.onError(error.response.data.message);
        });
    },
    onCancel() {
      this.close();
      this.$emit("cancelled");
    },
    onMap() {
      this.$emit("openMap");
    },
    onSuccess(messageSuccess) {
      this.close();
      this.$emit("success", {
        message: messageSuccess,
      });
    },
    onError(messageError) {
      this.$emit("error", {
        message: messageError,
      });
    },
    close() {
      (this.formUser.first_name = ""),
        (this.formUser.last_name = ""),
        (this.formUser.email = ""),
        (this.formUser.phone = ""),
        (this.formUser.nik = ""),
        (this.formUser.address = ""),
        (this.formUser.password = ""),
        (this.formUser.date = ""),
        (this.formUser.ktp = ""),
        (this.formUser.coordinate = "");
      this.$refs.formUser.reset();
      this.pass = "";
      this.imageUrl2 = null;
      this.menu2 = false;
      document.getElementById("input-file").value = "";
    },
    onChange2(e) {
      const file = e.target.files[0];
      this.formUser.ktp = file;
      this.imageUrl2 = URL.createObjectURL(file);
    },
  },
  watch: {
    visible(newVal) {
      this.visibility = newVal;
    },
  },
};
</script>
 
