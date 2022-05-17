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
          + Tambah Data Kategori
        </v-btn>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="allCategory"
          item-key="_id"
          class="content-user"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="#138A36"
                  class="mr-2"
                  @click="edithandler(item)"
                  v-show="item.is_deleted == false"
                  v-bind="attrs"
                  icon
                  v-on="on"
                >
                  <v-icon color="#248232">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Ubah Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.is_deleted == false"
                  class="mr-2"
                  color="#A24936"
                  @click="deleteData(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                >
                  <v-icon color="#9E2B25"> mdi-delete </v-icon>
                </v-btn>
              </template>
              <span>Hapus Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.is_deleted == true"
                  color="primary"
                  small
                  v-bind="attrs"
                  @click="enableData(item)"
                  v-on="on"
                >
                  <v-icon color="white"> mdi-database-check </v-icon>
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
          Tambah/Ubah Kategori
        </v-card-title>

        <div class="pa-5">
          <v-form ref="form">
            <v-text-field
              v-model="form.name"
              label="Nama"
              :rules="nameRules"
            ></v-text-field>

            <v-text-field
              v-model="form.description"
              label="Deskripsi"
              :rules="nameRules"
            ></v-text-field>
          </v-form>
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
            @click="close"
          >
            Batal
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

  

<script>
import Snackbar from "../Snackbar.vue";

export default {
  components: { Snackbar },
  name: "Category",
  data() {
    return {
      search: "",
      snackbar: false,
      dialog: false,
      loading: true,
      inputType: "Tambah",
      menu: false,
      message: "",
      color: "",
      nameRules: [(v) => !!v || "Area ini wajib diisi"],

      form: {
        name: "",
        description: "",
      },
      headers: [
        {
          text: "ID",
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
          text: "Pembuat",
          value: "creator.full_name",
          width: "10%",
          divider: true,
        },
        {
          text: "Aksi",
          value: "actions",
          width: "5%",
          divider: true,
          align: "center",
        },
      ],
    };
  },
  computed: {
    allCategory: {
      get() {
        return this.$store.state.functionalApp.allCategory;
      },
    },
  },
  methods: {
    getAllCategory() {
      this.$store.dispatch("functionalApp/getAllCategory");
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
      var formdata = new FormData();
      formdata = {
        name: this.form.name,
        description: this.form.description,
      };

      this.$http
        .post("/categories", formdata)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data Berhasil Ditambahkan", "success");
          this.close();
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    close() {
      this.form.name = "";
      this.form.description = "";
      this.form.icon = "";
      this.dialog = false;
      this.getAllCategory();
      this.$refs.form.reset();
      this.inputType = "Tambah";
      this.imageUrl = null;
      document.getElementById("input-file").value = "";
    },

    edithandler(item) {
      this.inputType = "Ubah";
      this.editId = item._id;
      this.form.name = item.name;
      this.form.description = item.description;
      this.form.icon = item.icon;
      this.dialog = true;
    },
    update() {
      this.$http
        .put("/categories/" + this.editId, this.form)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data kategori berhasil diubah", "success");
          this.close();
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    deleteData(item) {
      this.$http
        .delete("/categories/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data berhasil dihapus", "success");
          this.getAllCategory();
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    enableData(item) {
      this.$http
        .patch("/categories/enable/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data berhasil dipulihkan", "success");
          this.getAllCategory();
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
  },
  created() {
    this.getAllCategory();
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
