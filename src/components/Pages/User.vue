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
          + Tambah Data Pengguna
        </v-btn>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="allUser"
          item-key="_id"
          class="content-user"
          :search="search"
        >
          <template v-slot:[`item.name`]="{ item }">
            <p>{{ item.user_id.first_name + " " + item.user_id.last_name }}</p>
          </template>

          <template v-slot:[`item.is_deleted`]="{ item }">
            <v-chip
              v-show="item.is_deleted"
              class="ma-2 white--text"
              color="error"
              style="font-weight: bold"
              label
            >
              Dihapus
            </v-chip>
            <v-chip
              v-show="!item.is_deleted"
              class="ma-2 white--text"
              color="success"
              style="font-weight: bold"
              label
            >
              Aktif
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-2"
                  icon
                  v-show="item.is_deleted == false"
                  @click="showInfo(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon color="success"> mdi-pencil </v-icon>
                </v-btn>
              </template>
              <span>Ubah Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-show="item.is_deleted == false"
                  class="mr-2"
                  color="error"
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
    <user-form
      :visible="dialog"
      :formUser="form"
      :address="address"
      :coordinate="coordinate"
      :inputType="inputType"
      @cancelled="dialog = false"
      @success="onSuccess"
      @error="onError"
      @openMap="dialogMap = true"
    />
    <map-dialog
      :visible="dialogMap"
      @cancelled="dialogMap = false"
      @changePlace="onChangePlace"
      @changeCoordinate="onChangeCoordinate"
    />
  </v-main>
</template>

  

<script>
import MapDialog from "../MapDialog.vue";
import Snackbar from "../Snackbar.vue";
import UserForm from "../UserForm.vue";
export default {
  components: { MapDialog, Snackbar, UserForm },
  name: "user",
  data() {
    return {
      search: "",
      snackbar: false,
      dialog: false,
      dialogMap: false,
      inputType: "Tambah",
      loading: true,
      address: "",
      coordinate: [],
      menu: false,
      color: "",
      message: "",
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      jumlahRules2: [
        (v) => !!v || "Area ini tidak boleh kosong",
        (v) => v > 0 || "Inputan harus lebih dari 0",
      ],
      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        nik: "",
        address: "",
        password: "",
        date: "",
        ktp: [],
        coordinate: [],
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
          text: "Alamat",
          value: "address",
          width: "10%",
          divider: true,
        },
        {
          text: "NIK",
          value: "nik",
          width: "5%",
          divider: true,
        },
        {
          text: "Nomor Handphone",
          value: "phone",
          width: "2%",
          divider: true,
        },
        {
          text: "Status",
          value: "is_deleted",
          width: "2%",
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
    allUser: {
      get() {
        return this.$store.state.functionalApp.allUser;
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
    getAllUser() {
      this.$store.dispatch("functionalApp/getAllUser");
    },
    onChangePlace({ place }) {
      this.address = place;
    },
    onChangeCoordinate({ coordinate }) {
      this.coordinate = coordinate;
    },
    onSuccess({ message }) {
      this.openSnackbar(message, "success");
      this.getAllUser();
    },
    onError({ message }) {
      this.openSnackbar(message, "error");
    },

    showInfo(item) {
      this.form.first_name = item.user_id.first_name;
      this.form.last_name = item.user_id.last_name;
      this.form.nik = item.nik;
      this.form.email = item.user_id.email;
      this.form.phone = item.phone;
      this.form.birthday = item.birthday;
      this.inputType = "Ubah";
      this.form.id = item._id;
      this.form.ktp = item.ktp;
      this.form.user_id = item.user_id._id;
      this.address = item.address;
      this.coordinate = item.coordinate;
      this.form.date = item.birthday.split("T")[0];

      this.dialog = true;
    },

    async deleteData(item) {
      await this.$http
        .delete("/detailUser/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dihapus", "success");
          this.getAllUser();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async enableData(item) {
      await this.$http
        .patch("/detailUser/enable/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dipulihkan", "success");
          this.getAllUser();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.getAllUser();
  },
};
</script>

<style scoped>
</style>
