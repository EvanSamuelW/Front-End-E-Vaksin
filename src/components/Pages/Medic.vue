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
          + Tambah Data Medis Baru
        </v-btn>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="allAdminPartner"
          item-key="_id"
          class="content-user"
          :search="search"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              v-if="item.status == 'Deleted'"
              class="ma-2 white--text"
              label
              color="error"
              style="font-weight: bold"
            >
              Dihapus
            </v-chip>
            <v-chip
              v-if="item.status == 'Verified'"
              class="ma-2 white--text"
              label
              color="success"
              style="font-weight: bold"
            >
              Aktif
            </v-chip>
          </template>
          <template v-slot:[`item.join_date`]="{ item }">
            <p>{{ item.join_date.split("T")[0] }}</p>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="#138A36"
                  class="mr-2"
                  icon
                  @click="editHandler(item)"
                  v-show="item.status != 'Deleted'"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Ubah Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.status != 'Deleted'"
                  class="mr-2"
                  color="error"
                  icon
                  @click="deleteData(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </template>
              <span>Hapus Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.status == 'Deleted'"
                  color="primary"
                  icon
                  small
                  v-bind="attrs"
                  @click="enableData(item)"
                  v-on="on"
                >
                  <v-icon> mdi-database-check </v-icon>
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
          Tambah/Edit Data Medis
        </v-card-title>

        <div class="pa-5">
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
                  <v-text-field
                    v-model="formAdmin.education"
                    label="Pendidikan"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
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
                <v-col>
                  <v-text-field
                    v-model="formAdmin.email"
                    label="Email"
                    :rules="nameRules"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-if="inputType == 'Tambah'"
                    type="password"
                    v-model="formAdmin.password"
                    label="Kata Sandi"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-if="inputType == 'Tambah'"
                    type="password"
                    v-model="pass"
                    label=" Konfirmasi Kata Sandi"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </div>
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
  name: "Medic",
  components: { Snackbar },
  data() {
    return {
      search: "",
      snackbar: false,
      dialog: false,
      loading: true,
      inputType: "Tambah",
      pass: "",
      color: "",
      message: "",
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      editId: "",
      menu2: false,
      formAdmin: {
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        password: "",
        date: "",
        partner_id: "",
        education: "",
      },
      headers: [
        {
          text: "ID",
          value: "_id",
          width: "2%",
          divider: true,
        },
        {
          text: "Name",
          value: "user_id.full_name",
          width: "10%",
          divider: true,
        },
        {
          text: "Email",
          value: "user_id.email",
          width: "10%",
          divider: true,
        },
        {
          text: "Position",
          value: "position",
          width: "10%",
          divider: true,
        },
        {
          text: "Pendidikan",
          value: "education",
          width: "10%",
          divider: true,
        },
        {
          text: "Tanggal Bergabung",
          value: "join_date",
          width: "10%",
          divider: true,
        },

        {
          text: "Status",
          value: "status",
          width: "10%",
          divider: true,
        },
        {
          text: "Actions",
          value: "actions",
          width: "15%",
          divider: true,
          align: "center",
        },
      ],
    };
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    allAdminPartner: {
      get() {
        return this.$store.state.functionalApp.allMedics;
      },
    },
  },
  watch: {
    dialog(val) {
      !val && this.close();
    },
  },
  methods: {
    getAllMedics() {
      this.$store.dispatch(
        "functionalApp/getAllMedics",
        this.currentUser.partner_id._id
      );
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item._id;
      (this.formAdmin.first_name = item.user_id.first_name),
        (this.formAdmin.last_name = item.user_id.last_name),
        (this.formAdmin.email = item.user_id.email),
        (this.formAdmin.position = item.position),
        (this.formAdmin.user_id = item.user_id._id),
        (this.formAdmin.date = item.join_date.split("T")[0]),
        (this.formAdmin.education = item.education),
        (this.formAdmin.partner_id = this.currentUser.partner_id._id),
        (this.dialog = true);
    },
    save() {
      if (this.$refs.formAdmin.validate()) {
        if (this.inputType == "Tambah") {
          this.formAdmin.password == this.pass
            ? this.addMedic()
            : this.openSnackbar(
                "Password dan konfirmasi password harus sama",
                "success"
              );
        } else {
          this.update();
        }
      }
    },

    close() {
      this.dialog = false;
      this.getAllMedics();
      this.$refs.formAdmin.reset();
      this.formAdmin.password = "";
      this.pass = "";
      this.inputType = "Tambah";
    },

    addMedic() {
      this.formAdmin.partner_id = this.currentUser.partner_id._id;

      this.$http
        .post("/medics/", this.formAdmin)
        .then(() => {
          this.openSnackbar("Data tenaga medis berhasil ditambah", "success");
          this.close();
        })
        .catch((error) => {
          console.log(error.response.data.message);
          this.snackbarError = true;
          this.error = error.response.data.message;
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
    update() {
      this.$http
        .patch("/medics/" + this.editId, this.formAdmin)
        .then(() => {
          this.openSnackbar("Data tenaga medis berhasil diubah", "success");
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async deleteData(item) {
      await this.$http
        .delete("/medics/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dihapus", "success");
          this.getAllMedics();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async enableData(item) {
      await this.$http
        .patch("/medics/enable/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dipulihkan", "success");

          this.getAllMedics();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.getAllMedics();
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
