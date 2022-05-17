<template>
  <v-main class="lists">
    <v-card>
      <snackbar
        :visible="snackbar"
        :color="color"
        :message="message"
        @cancelled="snackbar = false"
      />

      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Cari"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="#22577e"
          style="font-weight: 600"
          dark
          @click="dialog = true"
        >
          + Tambah Data Vaksin
        </v-btn>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="allVaccine"
          item-key="_id"
          class="content-user"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  class="mr-2"
                  icon
                  @click="edithandler(item)"
                  v-show="item.is_deleted == false"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon color="success">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Ubah Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.is_deleted == false"
                  class="mr-2"
                  icon
                  @click="deleteData(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon color="error"> mdi-delete </v-icon>
                </v-btn>
              </template>
              <span>Hapus Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.is_deleted == true"
                  icon
                  small
                  v-bind="attrs"
                  @click="enableData(item)"
                  v-on="on"
                >
                  <v-icon color="primary"> mdi-database-check </v-icon>
                </v-btn>
              </template>
              <span>Pulihkan Data</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title
          style="background: #22577e; font-weight: 600; color: white"
        >
          Tambah/Ubah Vaksin
        </v-card-title>

        <div class="pa-5">
          <v-form ref="form">
            <v-text-field
              v-model="form.name"
              label="Nama"
              :rules="nameRules"
            ></v-text-field>

            <v-text-field
              v-model="form.manufacturer"
              label="Pabrik"
              :rules="nameRules"
            ></v-text-field>

            <v-text-field
              type="number"
              v-model="form.dose"
              label="Dosis (dalam mL)"
              :rules="jumlahRules2"
            ></v-text-field>

            <v-text-field
              type="number"
              v-model="form.expire_month"
              label="Kadaluarsa (dalam bulan)"
              :rules="jumlahRules2"
            ></v-text-field>

            <v-textarea
              v-model="form.description"
              label="Deskripsi"
              :rules="nameRules"
            ></v-textarea>
          </v-form>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save"> Simpan </v-btn>
          <v-btn color="error" @click="close"> Batal </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

  

<script>
import Snackbar from "../Snackbar.vue";
export default {
  name: "Vaccine",
  components: { Snackbar },
  data() {
    return {
      search: "",
      snackbar: false,
      dialog: false,
      loading: true,
      inputType: "Tambah",
      menu: false,
      color: "",
      message: "",
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      jumlahRules2: [
        (v) => !!v || "Area ini tidak boleh kosong",
        (v) => v > 0 || "Inputan harus lebih dari 0",
      ],
      form: {
        name: "",
        description: "",
        manufacturer: "",
        dose: 0,
        expire_month: 0,
      },
      headers: [
        {
          text: "Id",
          value: "_id",
          width: "2%",
          divider: true,
        },
        {
          text: "Nama",
          value: "name",
          width: "5%",
          divider: true,
        },
        {
          text: "Deskripsi",
          value: "description",
          width: "10%",
          divider: true,
        },
        {
          text: "Pabrik",
          value: "manufacturer",
          width: "10%",
          divider: true,
        },
        {
          text: "Dosis(mL)",
          value: "dose",
          width: "2%",
          divider: true,
        },
        {
          text: "Kadaluarsa(Bulan)",
          value: "expire_month",
          width: "2%",
          divider: true,
        },
        {
          text: "Pembuat",
          value: "creator.full_name",
          width: "10%",
          divider: true,
        },
        {
          text: "Aksi",
          value: "actions",
          width: "10%",
          divider: true,
          align: "center",
        },
      ],
    };
  },
  computed: {
    allVaccine: {
      get() {
        return this.$store.state.functionalApp.allVaccine;
      },
    },

    loadingVaccine: {
      get() {
        return this.allVaccine.length == 0;
      },
    },
  },
  methods: {
    getAllVaccine() {
      this.$store.dispatch("functionalApp/getAllVaccine");
    },
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    save() {
      if (this.$refs.form.validate()) {
        console.log(this.inputType);
        if (this.inputType == "Tambah") {
          this.create();
        } else {
          this.update();
        }
      }
    },
    create() {
      this.$http
        .post("/vaccines", this.form)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data berhasil ditambahkan", "success");
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    close() {
      this.form.name = "";
      this.form.description = "";
      this.form.manufacturer = "";
      this.form.expire_month = 0;
      this.form.dose = 0;
      this.dialog = false;
      this.getAllVaccine();
      this.$refs.form.reset();
      this.inputType = "Tambah";
    },

    edithandler(item) {
      this.inputType = "Ubah";
      this.editId = item._id;
      this.form.name = item.name;
      this.form.description = item.description;
      this.form.manufacturer = item.manufacturer;
      this.form.expire_month = item.expire_month;
      this.form.dose = item.dose;
      this.dialog = true;
    },
    async update() {
      await this.$http
        .put("/vaccines/" + this.editId, this.form)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data vaksin berhasil diubah", "success");

          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async deleteData(item) {
      await this.$http
        .delete("/vaccines/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dihapus", "success");

          this.getAllVaccine();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async enableData(item) {
      await this.$http
        .patch("/vaccines/enable/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dipulihkan", "success");

          this.getAllVaccine();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.getAllVaccine();
  },
};
</script>

<style scoped>
.body {
  width: 100%;
  height: 100%;
}

.content-user {
  padding: 0px;
}
</style>
