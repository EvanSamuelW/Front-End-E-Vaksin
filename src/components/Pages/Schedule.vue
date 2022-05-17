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
          + Tambah Data Jadwal
        </v-btn>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="allSchedule"
          item-key="_id"
          class="content-user"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="success"
                  icon
                  class="mr-2"
                  @click="edithandler(item)"
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
                  icon
                  color="error"
                  @click="
                    dialogDelete = true;
                    editId = item._id;
                  "
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
                  v-show="item.status != 'Deleted'"
                  class="mr-2"
                  color="secondary"
                  icon
                  @click="setQuestionDialog(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-file </v-icon>
                </v-btn>
              </template>
              <span>Tambah Form</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="item.status != 'Deleted'"
                  class="mr-2"
                  color="primary"
                  icon
                  @click="toParticipant(item)"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-account-group </v-icon>
                </v-btn>
              </template>
              <span>Tampilkan Peserta</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              v-if="item.status == 'Draft'"
              class="ma-2 white--text"
              label
              color="danger"
              style="font-weight: bold"
            >
              Draf
            </v-chip>
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
              v-if="item.status == 'Published'"
              class="ma-2 white--text"
              label
              color="primary"
              style="font-weight: bold"
            >
              Diterbitkan
            </v-chip>

            <v-chip
              v-if="item.status == 'Ended'"
              class="ma-2 white--text"
              label
              color="success"
              style="font-weight: bold"
            >
              Selesai
            </v-chip>
          </template>

          <template v-slot:[`item.category`]="{ item }">
            <v-chip
              v-if="item.is_lansia == true"
              label
              class="ma-2 white--text"
              color="primary"
              style="font-weight: bold"
            >
              Lansia
            </v-chip>
            <v-chip
              v-if="item.is_lansia == false"
              label
              class="ma-2 white--text"
              color="success"
              style="font-weight: bold"
            >
              Umum
            </v-chip>
          </template>
          <template v-slot:[`item.vaccines`]="{ item }">
            <v-chip
              v-for="x in item.vaccines"
              v-bind:key="String(x._id) + String(item._id)"
              class="ma-2"
              label
            >
              {{ x.vaccine.name }}
            </v-chip>
          </template>

          <template v-slot:[`item.creator`]="{ item }">
            <p>{{ item.creator.first_name + " " + item.creator.last_name }}</p>
          </template>

          <template v-slot:[`item.start`]="{ item }">
            <p>{{ formatDateTime(item.start) }}</p>
          </template>

          <template v-slot:[`item.end`]="{ item }">
            <p>{{ formatDateTime(item.end) }}</p>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title> Hapus Jadwal </v-card-title>
        <v-card-text> Anda yakin ingin menghapus jadwal ini?</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteData(editId)"> Ya </v-btn>
          <v-btn color="error" @click="dialogDelete = false"> Tidak </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="questionDialog" max-width="700px">
      <v-card>
        <v-card-title
          style="background: #22577e; font-weight: 600; color: white"
        >
          Data Form
        </v-card-title>
        <div class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="#22577e"
            class="mb-5"
            style="font-weight: 600; left: 68%"
            dark
            @click="formDialog = true"
          >
            + Tambah Data Form
          </v-btn>
          <v-card
            v-for="question in allQuestion"
            :key="question._id"
            class="mb-3"
          >
            <div class="pa-5">
              <v-row>
                <v-col cols="12" md="7" style="font-weiht: bolder">
                  <p style="font-weight: bold">
                    Question Id: {{ String(question._id) }}
                  </p>
                </v-col>
                <v-col cols="12" md="2">
                  <v-chip
                    v-if="question.is_lansia == true"
                    color="#cae6fc"
                    text-color="#4a729d"
                    style="font-weight: bolder"
                    label
                  >
                    Lansia
                  </v-chip>
                  <v-chip
                    v-else
                    color="#c3e3d4"
                    text-color="#446e49"
                    style="font-weight: bolder"
                    label
                  >
                    Umum
                  </v-chip>
                </v-col>
                <v-col cols="12" md="3" class="mt-2">
                  <v-row>
                    <v-btn
                      @click="
                        inputType2 = 'Ubah';
                        formDialog = true;
                        parse_csv = question.questions;
                        isLansia = question.is_lansia;
                        questionId = question._id;
                      "
                      icon
                      class="mr-3"
                      color="#248232 "
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn icon
                      ><v-icon
                        @click="deleteForm(question._id)"
                        color="#9E2B25 "
                        >mdi-trash-can</v-icon
                      ></v-btn
                    >
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#9E2B25 "
            class="white--text"
            style="font-weight: bold"
            @click="questionDialog = false"
          >
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formDialog" max-width="700px">
      <v-card>
        <v-card-title
          v-if="inputType2 == 'Tambah'"
          style="background: #22577e; font-weight: 600; color: white"
        >
          Tambah Form Skrining
        </v-card-title>
        <v-card-title
          v-else
          style="background: #22577e; font-weight: 600; color: white"
        >
          Ubah Form Skrining
        </v-card-title>
        <v-card-text>
          <div class="pa-5">
            <v-checkbox
              v-model="isLansia"
              label="Pertanyaan untuk lansia"
              color="success"
              hide-details
              class="mb-10"
            ></v-checkbox>

            <label for="csv_file">Impor File CSV</label>
            <div>
              <input
                type="file"
                id="csv_file"
                name="csv_file"
                class="form-control"
                @change="loadCSV($event)"
              />

              <v-btn
                outlined
                color="primary"
                style="font-weight: bolder"
                v-if="inputType2 != 'Tambah'"
                @click="parse_csv = []"
              >
                <v-icon left> close </v-icon>
                Hapus Pertanyaan
              </v-btn>
            </div>
          </div>

          <div class="pa-5" v-if="parse_csv">
            <div v-for="csv in parse_csv" :key="csv">
              <div>
                <p style="font-size: 20px; float: left" class="mr-4">
                  <b>{{ csv.No + "." + " " }}</b>
                </p>

                <p style="font-size: 20px">
                  <b> {{ csv.Soal }}</b>
                </p>
              </div>

              <v-radio-group v-model="row[csv.No - 1]" row disabled>
                <v-radio
                  v-if="csv.OptionA != 'Isi Sendiri'"
                  :label="csv.OptionA"
                  :value="csv.OptionA"
                ></v-radio>
                <v-radio v-else :value="csv.OptionA">
                  <template v-slot:label>
                    <v-text-field
                      label="Isi Sendiri"
                      v-model="fill"
                      @change="
                        fill == ''
                          ? (csv.OptionA = csv.OptionA)
                          : (csv.OptionA = fill)
                      "
                    ></v-text-field>
                  </template>
                </v-radio>
                <v-radio
                  v-if="csv.OptionB != 'Isi Sendiri'"
                  :label="csv.OptionB"
                  :value="csv.OptionB"
                ></v-radio>
                <v-radio v-else :value="csv.OptionB">
                  <template v-slot:label>
                    <v-text-field
                      label="Isi Sendiri"
                      v-model="fill"
                      @change="
                        fill == ''
                          ? (csv.OptionB = csv.OptionB)
                          : (csv.OptionB = fill)
                      "
                    ></v-text-field>
                  </template>
                </v-radio>
                <v-radio
                  v-if="csv.OptionC != 'Isi Sendiri'"
                  :label="csv.OptionC"
                  :value="csv.OptionC"
                ></v-radio>
                <v-radio v-else :value="csv.OptionC">
                  <template v-slot:label>
                    <v-text-field
                      label="Isi Sendiri"
                      v-model="fill[csv.No - 1]"
                    ></v-text-field>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#22577e" class="white--text" @click="saveQuestion">
            Simpan
          </v-btn>
          <v-btn
            color="#9E2B25"
            class="white--text"
            @click="
              formDialog = false;
              inputType2 = 'Tambah';
              parse_csv = [];
              isLansia = false;
              questionId = '';
            "
          >
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title
          style="background: #22577e; font-weight: 600; color: white"
        >
          Tambah/Ubah Jadwal
        </v-card-title>

        <div class="pa-5">
          <v-form ref="form">
            <v-row>
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
                    v-model="date"
                    label="Tanggal"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-row>

            <v-row>
              <v-col>
                <v-menu
                  ref="menu3"
                  v-model="menu3"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time1"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time1"
                      label="Waktu Mulai"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu3"
                    v-model="time1"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menu3.save(time1)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-menu
                  ref="menu4"
                  v-model="menu4"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time2"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time2"
                      label="Waktu Selesai"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu4"
                    v-model="time2"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menu4.save(time2)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>

            <div>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-btn
                    color="primary"
                    style="font-weight: bold"
                    outlined
                    @click="addRow"
                    >Tambah Vaksin</v-btn
                  >
                </v-col>

                <v-col cols="12" sm="6">
                  <v-slider
                    v-model="form.age"
                    color="orange"
                    label="Usia Minimum"
                    min="1"
                    max="100"
                    thumb-label
                  ></v-slider>
                </v-col>
              </v-row>
            </div>

            <v-row v-for="item in rows" v-bind:key="item.id">
              <v-col>
                <v-select
                  :items="allVaccine"
                  item-text="name"
                  item-value="_id"
                  placeholder="Vaksin"
                  v-model="item.vaccine"
                >
                </v-select>
              </v-col>
              <v-col>
                <v-text-field v-model="item.stok" label="Stok"></v-text-field>
              </v-col>
              <v-col>
                <v-btn class="mt-3" @click="removeRow" icon>
                  <v-icon color="error">mdi-window-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div class="pa-5" style="margin-top: -40px">
          <v-row>
            <v-col>
              <v-checkbox
                v-model="form.vaksin1"
                label="Vaksin 1"
                color="success"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="form.vaksin2"
                label="Vaksin 2"
                color="success"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="form.vaksinBooster"
                label="Vaksin Booster"
                color="success"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </div>

        <div class="pa-5" style="margin-top: -10px">
          <v-row>
            <v-col>
              <v-checkbox
                v-model="form.is_lansia"
                label="Vaksin Khsusus untuk lansia"
                color="indigo"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </div>

        <div class="pa-5" style="margin-top: -10px">
          <v-row>
            <v-col>
              <v-checkbox
                v-model="is_draft"
                label="Simpan sebagai draft"
                color="orange"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save"> Simpan </v-btn>
          <v-btn color="error" @click="close"> Tutup </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

  

<script>
import ScheduleStatus from "../../../_helpers/ScheduleStatus";
import Snackbar from "../Snackbar.vue";
export default {
  name: "Schedule",
  components: { Snackbar },
  data() {
    return {
      parse_csv: [],
      search: "",
      snackbar: false,
      rows: [],
      row: [],
      inputType2: "Tambah",
      is_draft: false,
      loading: true,
      inputType: "Tambah",
      menu: false,
      formDialog: false,
      menu2: false,
      menu3: false,
      menu4: false,
      questionId: "",
      time1: "",
      fill: [],
      isLansia: false,
      time2: "",
      date: "",
      scheduleId: "",
      message: "",
      dialogDelete: false,
      editId: "",
      color: "",
      allQuestion: [],
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      dialog: false,
      questionDialog: false,
      form: {
        start: "",
        end: "",
        is_lansia: false,
        location: "",
        vaccines: [],
        status: ScheduleStatus.Draft,
        vaksin1: false,
        vaksin2: false,
        vaksinBooster: false,
        age: 0,
      },
      headers: [
        {
          text: "Id",
          value: "_id",
          width: "1%",
          divider: true,
        },
        {
          text: "Waktu Mulai",
          value: "start",
          width: "10%",
          divider: true,
        },
        {
          text: "Waktu Selesai",
          value: "end",
          width: "10%",
          divider: true,
        },
        {
          text: "Status",
          value: "status",
          width: "5%",
          divider: true,
        },
        {
          text: "Vaksin",
          value: "vaccines",
          width: "15%",
          divider: true,
        },
        {
          text: "Pembuat",
          value: "creator",
          width: "10%",
          divider: true,
        },
        {
          text: "Kategori",
          value: "category",
          width: "5%",
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
    allVaccine: {
      get() {
        return this.$store.state.functionalApp.allVaccine;
      },
    },
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    allSchedule: {
      get() {
        return this.$store.state.functionalApp.allSchedule;
      },
    },
  },
  methods: {
    csvJSON(csv) {
      var arr = csv.split("\n");
      var jsonObj = [];
      var headers = arr[0].split(";");
      for (var i = 1; i < arr.length; i++) {
        var data = arr[i].split(";");
        var obj = {};
        for (var j = 0; j < data.length; j++) {
          obj[headers[j].trim()] = data[j].trim();
        }
        jsonObj.push(obj);
      }
      jsonObj.pop();
      return jsonObj;
    },
    toParticipant(item) {
      this.$store.dispatch("functionalApp/setVaccineSchedule", item.vaccines);
      this.$router.push({
        name: "Participant",
        params: {
          id: item._id,
        },
      });
    },
    loadCSV(e) {
      var vm = this;
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function (event) {
          var csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv);
        };
        reader.onerror = function (evt) {
          if (evt.target.error.name == "NotReadableError") {
            alert("Tidak bisa membaca file!");
          }
        };
      } else {
        alert("FileReader tidak didukung pada browser ini.");
      }
    },
    getAllSchedule() {
      this.$store.dispatch(
        "functionalApp/getAllSchedule",
        this.currentUser.partner_id._id
      );
    },
    getAllVaccine() {
      this.$store.dispatch("functionalApp/getAllVaccine");
    },
    updateQuestion() {
      let form = new FormData();
      (form = {
        schedule: this.scheduleId,
        is_lansia: this.isLansia,
        questions: this.parse_csv,
      }),
        this.$http
          .put("/question/" + this.questionId, form)
          .then(() => {
            this.openSnackbar("Form berhasil diperbarui", "success");
            this.formDialog = false;
            this.getQuestionList();
          })
          .catch((error) => {
            this.openSnackbar(error.response.data.message, "error");
          });
    },
    createQuestion() {
      let form = new FormData();
      (form = {
        schedule: this.scheduleId,
        is_lansia: this.isLansia,
        questions: this.parse_csv,
      }),
        this.$http
          .post("/question/", form)
          .then(() => {
            this.openSnackbar("Form berhasil dibuat", "success");
            this.formDialog = false;
            this.getQuestionList();
          })
          .catch((error) => {
            this.openSnackbar(error.response.data.message, "error");
          });
    },
    saveQuestion() {
      return this.inputType2 == "Ubah"
        ? this.updateQuestion()
        : this.createQuestion();
    },
    getQuestionList() {
      this.$http
        .get("/question/" + this.scheduleId)
        .then((response) => {
          this.allQuestion = response.data;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    setQuestionDialog(item) {
      this.questionDialog = true;
      this.scheduleId = item._id;
      this.getQuestionList();
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.inputType == "Tambah") {
          this.create();
        } else {
          this.update();
        }
      }
    },
    addRow() {
      if (this.rows.length == this.allVaccine.length) {
        this.openSnackbar("Tidak bisa menambah vaksin lagi", "error");
      } else {
        const num = Math.random();
        this.rows.push({ id: num, vaccine: "", stok: 0 });
      }
    },
    removeRow(index) {
      this.rows.splice(index, 1);
    },
    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },

    create() {
      this.rows.forEach(function (item) {
        delete item.id;
      });

      const startTime = this.time1.split(":");
      const endTime = this.time2.split(":");
      var timeString = startTime[0] + ":" + startTime[1] + ":00";
      var timeString2 = endTime[0] + ":" + endTime[1] + ":00";
      var dateObj1 = new Date(this.date + " " + timeString);
      var dateObj2 = new Date(this.date + " " + timeString2);
      this.form.location = this.currentUser.partner_id._id;
      this.form.start = dateObj1;
      this.form.end = dateObj2;
      this.form.vaccines = this.rows;
      this.form.status = this.is_draft
        ? ScheduleStatus.Draft
        : ScheduleStatus.Published;
      this.$http
        .post("/schedules", this.form)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Jadwal berhasil ditambahkan", "success");

          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    formatDateTime(date) {
      var m = new Date(date);
      var dateString =
        m.getUTCFullYear() +
        "/" +
        ("0" + (m.getUTCMonth() + 1)).slice(-2) +
        "/" +
        ("0" + m.getUTCDate()).slice(-2) +
        " " +
        ("0" + m.getUTCHours()).slice(-2) +
        ":" +
        ("0" + m.getUTCMinutes()).slice(-2) +
        ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

      return dateString;
    },
    deleteData(id) {
      this.$http
        .delete("/schedules/" + id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data jadwal berhasil dihapus", "success");

          this.getAllSchedule();
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    deleteForm(id) {
      this.$http
        .delete("/question/" + id)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Data Form berhasil dihapus", "success");
          this.getQuestionList();
          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    update() {
      this.rows.forEach(function (item) {
        delete item.id;
      });

      const startTime = this.time1.split(":");
      const endTime = this.time2.split(":");
      var timeString = startTime[0] + ":" + startTime[1] + ":00";
      var timeString2 = endTime[0] + ":" + endTime[1] + ":00";
      var dateObj1 = new Date(this.date + " " + timeString);
      var dateObj2 = new Date(this.date + " " + timeString2);
      this.form.location = this.currentUser.partner_id._id;
      this.form.start = dateObj1;
      this.form.end = dateObj2;
      this.form.vaccines = this.rows;
      this.form.status = this.is_draft
        ? ScheduleStatus.Draft
        : ScheduleStatus.Published;
      this.$http
        .put("/schedules/" + this.editId, this.form)
        .then((response) => {
          console.log(response.data.message);
          this.openSnackbar("Jadwal berhasil diperbarui", "success");

          this.close();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    close() {
      this.dialogDelete = false;
      this.form.start = "";
      this.form.end = "";
      this.form.is_lansia = false;
      this.form.vaksin1 = false;
      this.form.vaksin2 = false;
      this.form.vaksinBooster = false;
      this.form.age = 0;
      this.time1 = "";
      this.time2 = "";
      this.form.vaccines = [];
      this.is_draft = false;
      this.rows = [];
      (this.date = ""), (this.dialog = false);
      this.$refs.form.reset();
      this.inputType = "Tambah";

      this.editId = "";
      this.getAllSchedule();
    },

    edithandler(item) {
      this.inputType = "Ubah";
      this.editId = item._id;
      const startTime = item.start.split("T");
      const endTime = item.end.split("T");
      this.date = startTime[0];
      this.time1 = startTime[1].split(":00.000Z")[0];
      this.time2 = endTime[1].split(":00.000Z")[0];

      this.form.start = item.start;
      this.form.end = item.end;
      this.form.age = item.age;
      this.form.is_lansia = item.is_lansia;
      const rows = [];
      item.vaccines.forEach(function (x) {
        rows.push({
          id: Math.random(),
          vaccine: x.vaccine._id,
          stok: x.stok,
        });
      });
      this.rows = rows;
      this.form.is_lansia = item.is_lansia;
      this.is_draft = item.status == ScheduleStatus.Draft ? true : false;
      this.form.vaksin1 = item.vaksin1;
      this.form.vaksin2 = item.vaksin2;
      this.form.vaksinBooster = item.vaksinBooster;

      this.dialog = true;
    },
  },
  created() {
    this.getAllSchedule();
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
