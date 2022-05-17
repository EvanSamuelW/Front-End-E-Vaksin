<template>
  <v-dialog
    v-model="visibility"
    max-width="900px"
    @close="onCancel"
    @input="onCancel"
  >
    <v-card>
      <div class="pa-6">
        <p style="font-size: 32px; font-weight: 600; color: #22577e">
          Daftar Vaksinasi
        </p>
        <p style="font-size: 20px; font-weight: 600">
          Pendaftaran Anda akan diproses dan vaksinasi Anda akan dipesan.
        </p>
        <p style="font-size: 16px; padding-bottom: 40px">
          Harap periksa kembali data Anda di bawah ini sebelum mendaftar.
        </p>
        <p style="font-size: 16px; font-weight: 600">
          {{ location }}
        </p>
        <div
          v-if="
            $vuetify.breakpoint.name == 'sm' || $vuetify.breakpoint.name == 'xs'
          "
        >
          <v-row>
            <p>Nama&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{
                currentUser.user_id.first_name +
                " " +
                currentUser.user_id.last_name
              }}
            </p>
          </v-row>
          <v-row>
            <p>NIK&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ currentUser.nik }}
            </p>
          </v-row>
          <v-row>
            <p>Alamat&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ currentUser.address }}
            </p>
          </v-row>
          <v-row class="mb-4">
            <p>Usia&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ getAge(String(currentUser.birthday.split("T")[0])) }}
            </p>
          </v-row>
        </div>

        <table v-else>
          <tr>
            <th>Nama</th>
            <th>NIK</th>
            <th>Alamat</th>
            <th>Usia</th>
          </tr>
          <tr>
            <td>
              {{
                currentUser.user_id.first_name +
                " " +
                currentUser.user_id.last_name
              }}
            </td>
            <td>{{ currentUser.nik }}</td>
            <td>{{ currentUser.address }}</td>
            <td>
              {{ getAge(String(currentUser.birthday.split("T")[0])) }}
            </td>
          </tr>
        </table>
        <div class="mt-10">
          <p style="font-size: 16px; font-weight: 600; line-height: 10px">
            Instruksi
          </p>
          <p style="font-size: 16px">
            1. Isi formulir skrining sebelum pendaftaran
          </p>
          <p style="font-size: 16px">
            2. Tunjukkan kode QR Anda kepada staf di lokasi
          </p>
          <p style="font-size: 16px">3. Verifikasi wajah anda</p>
          <p style="font-size: 16px">4. Ikuti prosedur pemeriksaan kesehatan</p>
        </div>
        <div class="pa-5" style="margin-top: -40px">
          <p
            class="mt-10"
            style="font-size: 16px; font-weight: 600; line-height: 10px"
          >
            Pilih Dosis Anda
          </p>
          <v-row style="margin-top: -30px">
            <v-col>
              <v-checkbox
                v-if="vaksin1"
                v-model="selected[0]"
                label="Vaksin 1"
                color="#22577e"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-if="vaksin2 && currentUser.vaksin1"
                v-model="selected[1]"
                label="Vaksin 2"
                color="#22577e"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-if="vaksinBooster && currentUser.vaksin2"
                v-model="selected[2]"
                label="Vaksin Booster"
                color="#22577e"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#22577e"
          style="font-weight: 500"
          class="white--text"
          @click="save"
        >
          Simpan
        </v-btn>
        <v-btn
          color="#9E2B25"
          style="font-weight: 500"
          class="white--text"
          @click="onCancel"
        >
          Batal
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
    },

    visible: {
      type: Boolean,
      default: false,
    },
    vaksin1: {
      type: Boolean,
      default: false,
    },
    vaksin2: {
      type: Boolean,
      default: false,
    },
    vaksinBooster: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "",
    },
    currentUser: {
      type: Object,
    },
  },
  data() {
    return {
      visibility: false,
      selected: [],
    };
  },

  name: "RegisterVaccinationComponent",
  methods: {
    onCancel() {
      this.$emit("cancelled");
    },
    onSuccess(messageSuccess) {
      this.$emit("success", {
        message: messageSuccess,
      });
    },
    onError(messageError) {
      this.$emit("error", {
        message: messageError,
      });
    },
    getAge(dateString) {
      var ageInMilliseconds = new Date() - new Date(dateString);
      return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
    },
    save() {
      if (!this.selected.filter((s) => s === true).length > 0) {
        this.onError("Pilih Dosis Anda");
      } else {
        this.register();
      }
    },
    register() {
      let form = new FormData();
      form = {
        user: this.currentUser.user_id.id,
        schedule: this.id,
        vaksin1: this.selected[0] ? true : false,
        vaksin2: this.selected[1] ? true : false,
        vaksinBooster: this.selected[2] ? true : false,
      };
      this.$http
        .post("/transaction/", form)
        .then(() => {
          this.onSuccess("Registrasi berhasil");
          this.onCancel();
        })
        .catch((error) => {
          this.onError(error.response.data.message);
        });
    },
  },
  watch: {
    visible(newVal) {
      this.visibility = newVal;
    },
  },
};
</script>
 
<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  border-right: 1px solid transparent;

  text-align: left;
  padding: 8px;
}

tr:nth-child(odd) {
  background-color: #dddddd;
}
</style>