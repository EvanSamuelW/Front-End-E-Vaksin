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
          + Tambah Data Admin Partner
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
              color="error"
              style="font-weight: bold"
              label
            >
              Dihapus
            </v-chip>
            <v-chip
              v-if="item.status == 'Verified'"
              class="ma-2 white--text"
              color="success"
              style="font-weight: bold"
              label
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
                  icon
                  class="mr-2"
                  @click="editHandler(item)"
                  v-show="item.status != 'Deleted'"
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
                  v-show="item.status != 'Deleted'"
                  class="mr-2"
                  @click="deleteData(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                >
                  <v-icon color="error"> mdi-delete </v-icon>
                </v-btn>
              </template>
              <span>Hapus Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.status == 'Deleted'"
                  icon
                  small
                  v-bind="attrs"
                  @click="enableData(item)"
                  v-on="on"
                >
                  <v-icon color="primary"> mdi-database-check </v-icon>
                </v-btn>
              </template>
              <span>Kembalikan Data</span>
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
          Tambah/Ubah Admin Partner
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
                    v-model="formAdmin.password"
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
import Status from "../../../_helpers/AdminPartnerStatus";
import Snackbar from "../Snackbar.vue";

export default {
  name: "AdminPartner",
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
      editId: "",

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
      headers: [
        {
          text: "ID",
          value: "_id",
          width: "2%",
          divider: true,
        },
        {
          text: "Nama",
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
          text: "Posisi",
          value: "position",
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
          text: "Aksi",
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
        return this.$store.state.functionalApp.allAdminPartner;
      },
    },
  },
  methods: {
    getAllAdminPartner() {
      console.log(this.currentUser.partner_id._id);

      this.$store.dispatch(
        "functionalApp/getAllAdminPartner",
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
        (this.formAdmin.partner_id = this.currentUser.partner_id._id),
        (this.dialog = true);
    },
    save() {
      if (this.$refs.formAdmin.validate()) {
        console.log(this.inputType);
        if (this.inputType == "Tambah") {
          this.addAdmin();
        } else {
          this.update();
        }
      }
    },

    close() {
      this.dialog = false;
      this.getAllAdminPartner();
      this.$refs.formAdmin.reset();
      this.inputType = "Tambah";
    },

    addAdmin() {
      this.formAdmin.partner_id = this.currentUser.partner_id._id;
      this.formAdmin.status = Status.Verified;
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
        .patch("/adminPartner/" + this.editId, this.formAdmin)
        .then(() => {
          this.openSnackbar("Data partner berhasil diubah", "success");
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async deleteData(item) {
      await this.$http
        .delete("/adminPartner/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data berhasil dihapus", "success");
          this.getAllAdminPartner();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async enableData(item) {
      await this.$http
        .patch("/adminPartner/enable/" + item._id)
        .then(() => {
          this.openSnackbar("Data berhasil dipulihkan", "success");
          this.getAllAdminPartner();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.getAllAdminPartner();
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
