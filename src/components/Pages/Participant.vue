<template>
  <v-main class="lists">
    <div
      v-for="item in schedule.vaccines"
      :key="String(item.vaccine)"
      class="mb-3 mr-2"
      style="
        background-color: #22577e;
        color: white;
        display: inline-block;
        border-radius: 10px;
        width: 200px;
      "
    >
      <div class="pa-4">
        <p style="font-size: 36px">{{ item.stok }}</p>
        <p style="font-size: 14px; margin-top: -20px">
          Sisa Stok
          {{ getVaccineName(item.vaccine) }}
        </p>
      </div>
    </div>

    <v-btn
      @click="scanner = true"
      class="mb-9 mr-2"
      style="
        background-color: #22577e;
        color: white;
        border-radius: 10px;
        display: inline-block;
        height: 119px;
      "
    >
      <div class="pa-4">
        <v-row>
          <v-icon class="mb-1" style="font-size: 22px" color="white"
            >mdi-face-recognition</v-icon
          >

          <p class="ml-2" style="font-size: 18px; margin-top: 10px">
            Verifikasi Peserta
          </p>
        </v-row>
      </div>
    </v-btn>
    <v-btn
      class="mb-9 mr-2"
      @click="exportData()"
      style="
        background-color: #22577e;
        color: white;
        border-radius: 10px;
        display: inline-block;
        height: 119px;
      "
    >
      <div class="pa-4">
        <v-row>
          <v-icon class="mb-1" style="font-size: 22px" color="white"
            >mdi-table-arrow-right</v-icon
          >

          <p class="ml-2" style="font-size: 18px; margin-top: 10px">
            Ekspor Data
          </p>
        </v-row>
      </div>
    </v-btn>
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
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="allParticipant"
          item-key="_id"
          class="content-user"
          :search="search"
        >
          <template v-slot:[`item.full_name`]="{ item }">
            <p>{{ item.user.first_name + " " + item.user.last_name }}</p>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              v-if="item.status == 'Cancelled'"
              class="ma-2 white--text"
              label
              color="error"
              style="font-weight: bold"
            >
              Dibatalkan
            </v-chip>
            <v-chip
              v-if="item.status == 'Postponed'"
              class="ma-2 white--text"
              label
              color="danger"
              style="font-weight: bold"
            >
              Ditunda
            </v-chip>
            <v-chip
              v-if="item.status == 'Vaccinated'"
              class="ma-2 white--text"
              label
              color="success"
              style="font-weight: bold"
            >
              Divaksinasi
            </v-chip>

            <v-chip
              v-if="item.status == 'Verified'"
              class="ma-2 white--text"
              label
              color="primary"
              style="font-weight: bold"
            >
              Diverifikasi
            </v-chip>

            <v-chip
              v-if="item.status == 'Active'"
              class="ma-2 white--text"
              label
              color="secondary"
              style="font-weight: bold"
            >
              Belum Diverifikasi
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="success"
                  icon
                  class="mr-2"
                  @click="
                    verifDialog = true;

                    getQuestion(item);
                    editHandler(item);
                  "
                  v-show="item.status != 'Active'"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-check-circle</v-icon>
                </v-btn>
              </template>
              <span>Verify Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="
                    testDialog = true;
                    transactionId = item._id;
                  "
                  color="primary"
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                >
                  <v-icon> mdi-file-plus </v-icon>
                </v-btn>
              </template>
              <span>Add Test Data</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <v-dialog v-model="scanner" max-width="700px" @input="user = {}">
      <v-stepper v-model="el">
        <v-stepper-header>
          <v-stepper-step :complete="el > 1" step="1">
            Pindai QR Code
          </v-stepper-step>

          <v-divider></v-divider>
          <v-stepper-step :complete="el > 2" step="2">
            Verifikasi Wajah
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="el > 3" step="3">
            Pengecekan Wajah
          </v-stepper-step>

          <v-divider></v-divider>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <h2>Letakkan QR Code anda di depan kamera</h2>
            <qrcode-stream @decode="scanQR"></qrcode-stream>
          </v-stepper-content>

          <v-stepper-content step="2">
            <web-cam
              style="margin-top: -50px"
              ref="webcam"
              :device-id="deviceId"
              width="80%"
              @started="onStarted"
              @stopped="onStopped"
              @error="onError"
              @cameras="onCameras"
              @camera-change="onCameraChange"
            />
            <v-row style="margin-top: -50px">
              <v-col>
                <v-select
                  v-model="camera"
                  :items="devices"
                  item-text="label"
                  item-value="deviceId"
                  label="Select Device"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="pb-3">
              <v-col>
                <v-btn @click="onCapture">
                  <v-icon left>mdi-camera</v-icon>
                  Ambil Foto
                </v-btn>
              </v-col>
              <v-col>
                <v-btn @click="onStop">
                  <v-icon left>mdi-stop</v-icon>
                  Hentikan Kamera
                </v-btn>
              </v-col>
              <v-col>
                <v-btn @click="onStart">
                  <v-icon left>mdi-play</v-icon>
                  Hidupkan Kamera
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="3">
            <h2>Gambar Tertangkap</h2>
            <figure class="figure"></figure>
            <img
              id="img"
              height="300"
              width="300"
              :src="imgKTP"
              crossorigin="anonymous"
              class="mr-2"
            /><img
              id="img2"
              crossorigin="anonymous"
              height="300"
              width="300"
              :src="img"
              class="img-responsive"
            />
            <v-row>
              <v-col></v-col>
              <v-col>
                <v-btn
                  style="margin: auto"
                  class="mt-2"
                  :disabled="loading"
                  color="primary"
                  @click="compareFace"
                >
                  <template v-if="loading">
                    <icon name="loader" />
                    Loading...
                  </template>
                  <template v-else>Verifikasi</template></v-btn
                >
                <div class="loading" v-if="loading">Loading....</div></v-col
              >
              <v-col></v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

    <v-dialog v-model="verifDialog" max-width="900px">
      <v-card>
        <div class="pa-9">
          <v-row>
            <p>Nama&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ user.first_name + " " + user.last_name }}
            </p>
          </v-row>
          <v-row>
            <p>NIK&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ user.nik }}
            </p>
          </v-row>
          <v-row>
            <p>Tanggal lahir&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ user.birthday }}
            </p>
          </v-row>
          <v-row>
            <p>Nomor HP&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ user.phone }}
            </p>
          </v-row>
          <v-row class="mb-4">
            <p>Alamat&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">
              {{ user.address }}
            </p>
          </v-row>

          <v-row class="mb-4" v-if="test != {}">
            <p>Tekanan Darah&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">{{ test.blood }} mmHg</p>
          </v-row>
          <v-row class="mb-4">
            <p>Suhu Tubuh&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="font-weight: bold">{{ test.temp }}&#8451;</p>
          </v-row>

          <div v-if="allQuestion != {}">
            <h2 class="mb-5">Form Skrining</h2>
            <v-row v-for="(answer, index) in allQuestion.answer" :key="answer">
              <p>{{ index + 1 + "." }} &nbsp;</p>
              <p>
                {{ allQuestion.question.questions[index].Soal }} &nbsp;&nbsp;
              </p>
              <p style="font-weight: bold">{{ answer }}</p>
            </v-row>
          </div>

          <v-row>
            <v-col>
              <v-select
                :items="items"
                label="Status"
                v-model="statusChoice"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-if="statusChoice == 'Vaccinated'"
                :items="allVaccine"
                item-text="vaccine.name"
                item-value="vaccine._id"
                placeholder="Vaccine"
                v-model="vaccine"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-spacer></v-spacer>
            <v-btn @click="update(transactionId, user)" color="primary"
              >Simpan</v-btn
            >
          </v-row>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="testDialog" max-width="500px">
      <v-card>
        <v-card-title
          style="background: #22577e; font-weight: 600; color: white"
        >
          Tambahkan Hasil Pengujian
        </v-card-title>

        <div class="pa-5">
          <v-form ref="form">
            <v-text-field
              v-model="form.temp"
              label="Suhu Tubuh"
              :rules="nameRules"
            >
              <template slot="append">
                <span v-html="bloodSuffix"></span>
              </template>
            </v-text-field>

            <v-text-field
              v-model="form.blood"
              label="Tekanan Darah"
              suffix="mmHg"
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
            @click="addTest(transactionId)"
          >
            Save
          </v-btn>
          <v-btn
            color="#9E2B25"
            style="font-weight: 500"
            class="white--text"
            @click="
              testDialog = false;
              form.blood = '';
              form.temp = 0;
            "
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <choose-schedule
      :visible="scheduleDialog"
      :partner_id="currentUser.partner_id._id"
      :vaksin1="user.vaksin1"
      :vaksin2="user.vaksin2"
      :vaksinBooster="user.vaksinBooster"
      @setSchedule="dialog2 = true"
      @cancelled="scheduleDialog = false"
      @success="onSuccess"
      @error="onError2"
    />

    <register-vaccination
      :visible="dialog2"
      :location="currentUser.partner_id.name"
      :currentUser="currentParticipant"
      :id="$route.params.id"
      :vaksin1="vaksin1"
      :vaksin2="vaksin2"
      :vaksinBooster="vaksinBooster"
      @cancelled="dialog2 = false"
      @success="
        onSuccess;
        scheduleDialog = false;
        getAllData();
      "
      @error="onError2"
    />
  </v-main>
</template>



<script>
import Snackbar from "../Snackbar.vue";
import { WebCam } from "vue-web-cam";
import { find, head } from "lodash";
import * as faceapi from "face-api.js";
import Status from "../../../_helpers/TransactionStatus";
import TransactionStatus from "../../../_helpers/TransactionStatus";
import ChooseSchedule from "../ChooseSchedule.vue";
import RegisterVaccination from "../RegisterVaccination.vue";
export default {
  name: "Participant",
  components: { Snackbar, WebCam, ChooseSchedule, RegisterVaccination },
  data() {
    return {
      search: "",
      snackbar: false,
      dialog: false,
      loading: false,
      color: "",

      items: [Status.Vaccinated, Status.Cancelled, Status.Postponed],
      file: [],
      user: {},
      currentParticipant: {},
      schedule: {},
      allQuestion: {},
      testDialog: false,
      bloodSuffix: "<span>&#8451;</span>",
      scheduleDialog: false,
      transactionId: "",
      statusChoice: "",
      camera: null,
      deviceId: null,
      test: {},
      verifDialog: false,
      form: {
        blood: "",
        temp: 0,
        transaction: "",
      },
      devices: [],
      dialog2: false,
      el: 2,
      imgPreUrl: this.$imageLink + "ktp/",
      img: "",
      imgKTP: "",
      scanner: false,
      vaccine: "",
      vaksin1: false,
      vaksin2: false,
      vaksinBooster: false,
      message: "",
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      editId: "",
      allParticipant: [],
      headers: [
        {
          text: "ID",
          value: "_id",
          width: "2%",
          divider: true,
        },
        {
          text: "Nama",
          value: "full_name",
          width: "10%",
          divider: true,
        },
        {
          text: "Email",
          value: "user.email",
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
    device() {
      return find(this.devices, (n) => n.deviceId == this.deviceId);
    },
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    allVaccine: {
      get() {
        return this.$store.state.functionalApp.allVaccine;
      },
    },
    allAdminPartner: {
      get() {
        return this.$store.state.functionalApp.allAdminPartner;
      },
    },
  },
  watch: {
    camera: function (id) {
      this.deviceId = id;
    },
    verifDialog(val) {
      !val && this.close();
    },

    devices: function () {
      let first = head(this.devices);
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },
  methods: {
    setSchedule({ vaksin1, vaksin2, vaksinBooster }) {
      this.dialog2 = true;
      this.scheduleDialog = false;
      this.vaksinBooster = vaksinBooster;
      this.vaksin2 = vaksin2;
      this.vaksin1 = vaksin1;
    },
    onCapture() {
      this.img = this.$refs.webcam.capture();
      this.el = 3;
    },
    close() {
      this.user = {};
      this.allQuestion = {};
      this.editId = "";
      this.transactionId = "";
      this.status = "";
      this.vaccine = "";
      this.test = {};
    },
    getVaccineName(id) {
      return this.allVaccine[
        this.allVaccine.findIndex((data) => data.vaccine._id === id)
      ].vaccine.name;
    },
    scanQR(decodedString) {
      this.$http
        .post("/transaction/scan/" + decodedString)
        .then((response) => {
          this.openSnackbar("Berhasil verifikasi QR Code", "success");
          this.transactionId = response.data._id;
          this.imgKTP = this.$imageLink + "ktp/" + response.data.detailUser.ktp;
          this.el = 2;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    addTest(id) {
      this.form.transaction = id;
      this.$http
        .post("/testResult", this.form)
        .then(() => {
          this.openSnackbar("Berhasil menambahkan data test", "success");
          this.getAllData();
          this.testDialog = false;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    getSchedule() {
      this.$http
        .get("/schedules/count/" + this.$route.params.id)
        .then((response) => {
          this.schedule = response.data[0];
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    update(id, user) {
      this.status == TransactionStatus.Postponed
        ? this.openSchedule(user, id)
        : this.updateData(id);
    },
    openSchedule(user, id) {
      this.updateData(id);
      this.currentParticipant = user;
      this.currentParticipant.user_id = {
        id: this.editId,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      this.scheduleDialog = true;
    },
    verifyData() {
      let form = new FormData();
      form = {
        status: TransactionStatus.Verified,
      };
      this.$http
        .patch("/transaction/update/" + this.transactionId, form)
        .then(() => {
          this.openSnackbar("Data diperbarui", "success");
          this.getAllData();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    updateData(id) {
      let form = new FormData();
      form = {
        status: this.statusChoice,
        vaccine: this.vaccine,
        vaksin1: this.user.vaksin1 == true ? true : false,
        vaksin2: this.user.vaksin2 == true ? true : false,
        vaksinBooster: this.user.vaksinBooster == true ? true : false,
        userId: this.user.id,
      };
      this.$http
        .patch("/transaction/update/" + id, form)
        .then(() => {
          this.openSnackbar("Data diperbarui", "success");
          this.verifDialog = false;
          this.getAllData();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    compareFace() {
      this.loading = true;
      // this.a = performance.now();
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ]).then(this.compare);
    },

    async compare() {
      const input1 = document.getElementById("img");
      const input2 = document.getElementById("img2");

      const fullFaceDescriptions = await faceapi
        .detectSingleFace(input1)
        .withFaceLandmarks()
        .withFaceDescriptor();
      const fullFaceDescriptions2 = await faceapi
        .detectSingleFace(input2)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const dist = faceapi.euclideanDistance(
        fullFaceDescriptions.descriptor,
        fullFaceDescriptions2.descriptor,
        0.6
      );
      // this.b = performance.now();
      // console.log("It took " + (this.b - this.a) + " ms.");

      if (dist > 0.5) {
        // alert(
        //   "It took " + (this.b - this.a) / 1000 + " s and face not match" + dist
        // );

        this.openSnackbar("Wajah tidak cocok", "error");
      } else {
        // alert(
        //   "It took " + (this.b - this.a) / 1000 + " s and face matched" + dist
        // );

        this.verifyData();
        this.openSnackbar("Verifikasi berhasil", "success");
      }
      this.loading = false;
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    },
    onChange(e) {
      this.file = e.target.files[0];
    },
    getAllData() {
      this.$http
        .get("/transaction/participant/" + this.$route.params.id)
        .then((response) => {
          response == []
            ? console.log("error")
            : (this.allParticipant = response.data);
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    exportData() {
      this.$http
        .get("/transaction/participant/export/" + this.$route.params.id, {
          responseType: "blob",
        })
        .then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${this.$route.params.id}-${new Date().toLocaleDateString()}.xlsx`
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },

    getQuestion(item) {
      let form = new FormData();
      form = {
        id: item.user._id,
        transaction: item._id,
      };

      this.$http
        .post("/question/admin/answer/" + this.$route.params.id, form)
        .then((response) => {
          if (response.data != null) {
            this.allQuestion = response.data;
          }
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    editHandler(item) {
      this.user.first_name = item.user.first_name;
      this.user.last_name = item.user.last_name;
      this.user.email = item.user.email;
      this.user.nik = item.detailUser.nik;
      this.user.birthday = new Date(
        item.detailUser.birthday.split("T")[0]
      ).toDateString();
      this.user.address = item.detailUser.address;
      this.user.ktp = item.detailUser.ktp;
      this.editId = item.user._id;
      this.transactionId = item._id;
      this.user.phone = item.detailUser.phone;
      this.user.id = item.detailUser._id;
      this.user.vaksin1 = item.vaksin1;
      this.user.vaksin2 = item.vaksin2;
      this.user.vaksinBooster = item.vaksinBooster;
      if (item.testresult != null) {
        this.test = item.testresult;
      }
    },

    onSuccess({ message }) {
      this.openSnackbar(message, "success");
    },
    onError2({ message }) {
      this.openSnackbar(message, "error");
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
    this.getSchedule();
    this.getAllData();
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
