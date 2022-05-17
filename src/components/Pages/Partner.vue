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
          v-on:keyup.enter="getAllPartner"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          v-model="filter"
          :items="allActiveCategory"
          item-text="name"
          item-value="_id"
          label="Filter Berdasarkan Kategori"
        ></v-select>
        <v-spacer></v-spacer>
      </v-card-title>
      <div class="content">
        <v-row>
          <v-col
            v-for="partner in allPartner.partner"
            :key="partner.name"
            md="4"
            cols="12"
          >
            <v-card class="partner-item" height="460px" min-width="270px">
              <v-img height="150" :src="imgPreUrl + partner.image"> </v-img>
              <v-row>
                <p
                  class="mt-5 ml-5 pb-5 pt-2"
                  style="font-size: 20px; font-weight: bold; color: #22577e"
                >
                  {{ partner.name }}
                </p>
              </v-row>
              <v-divider></v-divider>

              <v-card-text>
                <v-row class="mt-1 ml-1">
                  <v-icon class="mb-5"> mdi-phone-classic </v-icon>
                  <p class="ml-2">{{ partner.phone }}</p>
                </v-row>

                <v-row class="mt-1 ml-1">
                  <v-icon class="mb-5"> mdi-email </v-icon>
                  <p class="ml-2">{{ partner.email }}</p>
                </v-row>

                <v-col>
                  <div class="overflow" align="left">{{ partner.address }}</div>
                </v-col>

                <div align="center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="#ADC698"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        v-show="!partner.is_deleted"
                        v-on:click="edithandler(partner)"
                      >
                        <v-icon color="#248232"> mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Ubah Data</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-on:click="deleteHandler(partner)"
                        icon
                        v-show="!partner.is_deleted"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon color="#9E2B25"> mdi-trash-can</v-icon>
                      </v-btn>
                    </template>
                    <span>Hapus Data</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-2"
                        v-on:click="enableData(partner)"
                        variant="outline-primary"
                        small
                        icon
                        v-show="partner.is_deleted"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon color="#00B4D8"> mdi-database-check</v-icon>
                      </v-btn>
                    </template>
                    <span>Pulihkan Data</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-2"
                        v-on:click="verifyData(partner)"
                        small
                        icon
                        v-show="partner.status == 'Not Verified'"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon color="success"> mdi-check-circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Verifikasi Data</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        variant="outline-primary"
                        icon
                        small
                        class="mr-2"
                        v-bind="attrs"
                        v-on="on"
                        v-show="!partner.is_deleted"
                        v-on:click="infohandler(partner)"
                      >
                        <v-icon color="#124761"> mdi-information </v-icon>
                      </v-btn>
                    </template>
                    <span>Info partner</span>
                  </v-tooltip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-pagination
        class="mt-5 pb-3"
        v-model="page"
        :length="partnerPages"
        :total-visible="7"
        @input="next"
      ></v-pagination>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title> Hapus partner </v-card-title>
        <v-card-text> Anda yakin ingin menghapus data partner ini?</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteData(deleteId)"> Ya </v-btn>
          <v-btn color="error" @click="dialogDelete = false"> Tidak </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <map-dialog
      :visible="mapDialog"
      @cancelled="mapDialog = false"
      @changePlace="onChangePlace"
      @changeCoordinate="onChangeCoordinate"
    />
    <v-dialog @close="close" v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title
          style="background: #22577e; font-weight: 600; color: white"
          v-show="inputType != 'Info'"
        >
          Tambah/Ubah partner
        </v-card-title>

        <div class="pa-5">
          <v-form ref="form">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="form.name"
                  label="Nama"
                  :rules="nameRules"
                  :readonly="inputType == 'Info'"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  :items="allActiveCategory"
                  item-text="name"
                  item-value="_id"
                  placeholder="Kategori"
                  v-model="form.category"
                  :rules="nameRules"
                  :readonly="inputType == 'Info'"
                >
                </v-select>
              </v-col>
              <v-col>
                <v-text-field
                  type="number"
                  v-model="form.phone"
                  label="Nomor Handphone"
                  :readonly="inputType == 'Info'"
                  :rules="phoneRules"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  :readonly="inputType == 'Info'"
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="px-1">
              <v-textarea
                v-model="form.address"
                class="ml-2"
                label="Alamat"
                style="z-index: 1"
                :rules="nameRules"
                :readonly="inputType == 'Info'"
              ></v-textarea>
            </v-row>
            <v-btn
              @click="mapDialog = true"
              icon
              style="z-index: 1; bottom: 50px; left: 90%"
            >
              <v-icon color="orange darken-4">mdi-map-marker</v-icon>
            </v-btn>
          </v-form>

          <div id="preview">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              style="max-width: 200px; max-height: 200px"
            />
          </div>

          <input
            id="input-file"
            type="file"
            accept="image/*"
            @change="onChange"
          />
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-show="inputType != 'Info'" color="primary" @click="save">
            Simpan
          </v-btn>
          <v-btn color="error" @click="close"> Tutup </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import Snackbar from "../Snackbar.vue";
import MapDialog from "../MapDialog.vue";
export default {
  name: "Partner",
  components: { Snackbar, MapDialog },
  data() {
    return {
      nameRules: [(v) => !!v || "Area ini harus diisi"],
      phoneRules: [
        (v) =>
          /^08[0-9]{8,10}$/.test(v) || "Masukkan nomor handphone yang valid",
      ],
      page: 1,
      dialog: false,
      snackbar: false,
      dialogDelete: false,
      color: "",
      inputType: "",
      partnerPages: 0,
      mapDialog: false,
      allPartner: [],
      message: "",
      search: "",
      image: "",
      imgPreUrl: "https://e-vaksin.xyz/api/partner/",
      form: {
        name: "",
        phone: "",
        email: "",
        address: "",
        category: "",
        image: [],
        coordinate: [],
      },
      loading: true,
      editId: "",
      filter: "",
      imageLink: this.$imageLink,
      imageUrl: null,
    };
  },
  computed: {
    allActiveCategory: {
      get() {
        return this.$store.state.functionalApp.allActiveCategory;
      },
    },
  },
  watch: {
    dialog(val) {
      !val && this.close();
    },
    search(val) {
      this.search = val;
      this.getAllPartner("0");
    },
    filter(val) {
      this.filter = val;
      this.getAllPartner(this.filter);
    },
  },
  methods: {
    getAllActiveCategory() {
      this.$store.dispatch("functionalApp/getAllActiveCategory");
    },
    getAllPartner(filter) {
      filter == "0" ? (filter = "") : filter;
      this.$http
        .get(
          "/partners" +
            "/?page=" +
            this.page +
            "&search=" +
            this.search +
            "&category=" +
            filter
        )
        .then((response) => {
          this.allPartner = response.data;
          this.partnerPages = this.allPartner.pages;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    onChangePlace({ place }) {
      this.form.address = place;
    },
    onChangeCoordinate({ coordinate }) {
      this.form.coordinate = coordinate;
    },
    save() {
      this.$refs.form.validate()
        ? this.update()
        : this.openSnackbar("Lengkapi seluruh form", "error");
    },
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    edithandler(item) {
      this.inputType = "Ubah";
      this.editId = item._id;
      this.form.name = item.name;
      this.form.address = item.address;
      this.form.coordinate = item.coordinate;
      this.form.email = item.email;
      this.form.phone = item.phone;
      this.form.category = item.category._id;
      this.imageUrl = this.imgPreUrl + item.image;
      this.dialog = true;
    },
    next(page) {
      this.page = page;
      this.getAllPartner("0");
    },
    infohandler(item) {
      this.inputType = "Info";
      this.form.name = item.name;
      this.form.address = item.address;
      this.form.email = item.email;
      this.form.phone = item.phone;
      this.form.category = item.category._id;
      this.imageUrl = this.imgPreUrl + item.image;
      this.dialog = true;
    },
    close() {
      this.form.name = "";
      this.form.address = "";
      this.form.email = "";
      this.form.phone = "";
      this.form.category = "";
      this.form.coordinate = "";
      this.dialogDelete = false;
      this.dialog = false;
      this.getAllPartner("0");
      this.$refs.form.reset();
      this.imageUrl = null;
      document.getElementById("input-file").value = "";
    },
    deleteHandler(item) {
      this.dialogDelete = true;
      this.deleteId = item._id;
    },
    onChange(e) {
      const file = e.target.files[0];
      this.form.image = file;
      this.imageUrl = URL.createObjectURL(file);
    },
    update() {
      var formdata = new FormData();
      formdata.append("phone", this.form.phone);
      formdata.append("name", this.form.name);
      formdata.append("email", this.form.email);
      formdata.append("address", this.form.address);
      formdata.append("category", this.form.category);
      formdata.append("image", this.form.image);
      formdata.append("coordinate", this.form.coordinate);
      this.$http
        .put("/partners/" + this.editId, formdata)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data partner berhasil diubah", "success");
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async deleteData(deleteId) {
      await this.$http
        .delete("/partners/" + deleteId)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data partner berhasil dihapus", "success");
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    async enableData(item) {
      await this.$http
        .patch("/partners/enable/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data dipulihkan", "success");
          this.getAllPartner("0");
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },

    async verifyData(item) {
      await this.$http
        .patch("/partners/verify/" + item._id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data Berhasil Diverifikasi", "success");
          this.getAllPartner("0");
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.getAllActiveCategory();
    this.getAllPartner("0");
  },
};
</script>

<style scoped>
.partner-item {
  flex-basis: 25%;
  overflow: hidden;
  margin: 0 auto;
  margin-right: 10px;
  margin-left: 10px;
  box-sizing: border-box;
}

.content {
  width: 75%;
  overflow: visible;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.card-title {
  font-weight: bold;
  font-size: 24px;
}

.btn-addCart {
  margin: 0 auto;
}

.card-subtitle {
  font-size: 15px;
  color: black !important;
}
</style>


