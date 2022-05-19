<template>
  <v-main>
    <snackbar
      :visible="snackbar"
      :color="color"
      :message="message"
      @cancelled="snackbar = false"
    />
    <div>
      <v-card
        class="mb-6 container"
        style="width: 900px; margin: auto"
        elevation="3"
        v-for="transaction in paginated"
        :key="String(transaction._id)"
      >
        <div class="corner">
          <span>
            {{ transaction.schedule.age }}+
            {{ transaction.schedule.is_lansia ? "Lansia" : "Umum" }}</span
          >
        </div>

        <div :class="padding">
          <v-row>
            <v-col cols="10" md="10">
              <p style="font-size: 32px; font-weight: 600; color: #22577e">
                {{ transaction.location.name }}
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-row>
                <v-icon class="mb-4 mr-2 ml-3" color="black"
                  >mdi-calendar</v-icon
                >
                <p style="color: #808080">
                  {{
                    new Date(
                      transaction.schedule.start.split("T")[0]
                    ).toDateString() +
                    " " +
                    transaction.schedule.start
                      .split("T")[1]
                      .split(":00.000Z")[0] +
                    " - " +
                    transaction.schedule.end.split("T")[1].split(":00.000Z")[0]
                  }}
                </p>
              </v-row>
            </v-col>
            <v-col cols="12" md="2">
              <v-row>
                <v-icon class="mb-4 mr-2 ml-3" color="black">mdi-needle</v-icon>
                <p style="color: #808080">
                  {{ getVaccine(transaction) }}
                </p>
              </v-row>
            </v-col>
            <v-col>
              <v-row v-if="$vuetify.breakpoint.name == 'lg'">
                <p style="color: #808080">
                  Vaccination Id: {{ transaction.uniqueCode }}
                </p>
              </v-row>
            </v-col>
          </v-row>
          <v-row :style="marginTop">
            <v-col cols="12" sm="9">
              <v-row>
                <v-col cols="12" sm="1">
                  <v-icon class="mb-4" color="black">mdi-map-marker</v-icon>
                </v-col>
                <v-col cols="12" sm="11" :style="margin">
                  <p style="color: #808080; font-size: 14px">
                    {{ transaction.location.address }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="mt-3">
            <v-spacer></v-spacer>
            <v-btn
              v-if="
                transaction.status != 'Vaccinated' &&
                transaction.status != 'Postponed' &&
                transaction.status != 'Cancelled'
              "
              @click="
                qr = true;
                qrcode = transaction.uniqueCode;
                start = transaction.schedule.start;
                end = transaction.schedule.end;
                location = transaction.location.name;
              "
              icon
              color="#22577e"
            >
              <v-icon>mdi-qrcode</v-icon>
            </v-btn>
            <v-btn
              v-if="
                transaction.status != 'Vaccinated' &&
                transaction.status != 'Postponed' &&
                transaction.status != 'Cancelled'
              "
              @click="toChat(transaction._id, transaction.location._id)"
              icon
              color="#22577e"
            >
              <v-icon>mdi-chat</v-icon>
            </v-btn>
            <v-btn
              v-if="
                transaction.status != 'Vaccinated' &&
                transaction.status != 'Postponed' &&
                transaction.status != 'Cancelled' &&
                transaction.answer == null
              "
              icon
              color="#22577e"
              @click="
                formDialog = true;
                transactionId = transaction._id;
                getQuestion(transaction.schedule._id);
              "
            >
              <v-icon>mdi-file</v-icon>
            </v-btn>

            <v-btn
              v-if="
                transaction.status == 'Vaccinated' &&
                transaction.complain == null
              "
              icon
              color="#22577e"
              @click="
                complainDialog = true;
                transactionId = transaction._id;
              "
            >
              <v-icon>mdi-file-plus</v-icon>
            </v-btn>
          </v-row>
        </div>
      </v-card>
      <qrcode
        :visible="qr"
        :code="qrcode"
        :start="start"
        :end="end"
        :location="location"
        @cancelled="
          qr = false;
          qrcode = '';
        "
      />
      <v-dialog v-model="formDialog" max-width="800px">
        <v-card>
          <v-card-title
            style="background: #22577e; font-weight: 600; color: white"
          >
            Isi Form Skrining
          </v-card-title>
          <div class="pa-5">
            <div v-for="csv in allQuestion.questions" :key="csv.No">
              <div>
                <p style="font-size: 20px; float: left" class="mr-4">
                  <b>{{ csv.No + "." + " " }}</b>
                </p>

                <p style="font-size: 20px">
                  <b> {{ csv.Soal }}</b>
                </p>
              </div>

              <v-radio-group v-model="row[csv.No - 1]" row>
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

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#22577e"
              style="font-weight: 500"
              class="white--text"
              @click="answerQuestion(id, transactionId)"
            >
              Simpan
            </v-btn>
            <v-btn
              color="#9E2B25"
              style="font-weight: 500"
              class="white--text"
              @click="formDialog = false"
            >
              Batal
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-pagination
        class="mt-5 pb-3"
        v-model="page"
        v-if="!paginated.length == 0"
        :length="transactionPages"
        :total-visible="7"
      ></v-pagination>
    </div>
    <div v-if="paginated.length == 0" style="margin-left: 30%" class="pa-10">
      <v-img src="/data_empty.svg" contain height="350px" width="350px"></v-img>
      <h1 style="color: #22577e">Belum ada Vaksinasi Terdaftar</h1>
    </div>
    <v-dialog v-model="complainDialog" max-width="500px">
      <v-card>
        <v-card-title
          style="background: #22577e; font-weight: 600; color: white"
        >
          Tambahkan Keluhan
        </v-card-title>

        <div class="pa-5">
          <v-form ref="formComplain">
            <v-textarea
              v-model="complain"
              label="Tuliskan Keluhan Anda disini"
              :rules="nameRules"
            ></v-textarea>
          </v-form>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#22577e"
            style="font-weight: 500"
            class="white--text"
            @click="
              $refs.formComplain.validate()
                ? addComplain(transactionId)
                : openSnackbar('Isi form dengan benar', 'error')
            "
          >
            Simpan
          </v-btn>
          <v-btn
            color="#9E2B25"
            style="font-weight: 500"
            class="white--text"
            @click="closeFormComplain"
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
import qrcode from "../Qrcode.vue";
export default {
  components: { Snackbar, qrcode },
  name: "Transaction",
  data() {
    return {
      page: 1,
      pageSize: 3,
      formDialog: false,
      complainDialog: false,
      qrcode: "",
      row: [],
      nameRules: [(v) => !!v || "Area ini wajib diisi"],
      start: "",
      end: "",
      location: "",

      complain: "",
      transactionId: "",
      fill: [],
      id: "",
      qr: false,
      allTransaction: [],
      allQuestion: [],
      color: "",
      message: "",
      transactionPages: 0,
      snackbar: false,
    };
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    padding: {
      get() {
        if (
          this.$vuetify.breakpoint.name == "xs" ||
          this.$vuetify.breakpoint.name == "sm"
        ) {
          return "pa-5";
        } else {
          return "pa-5 pl-10";
        }
      },
    },
    marginTop: {
      get() {
        if (
          this.$vuetify.breakpoint.name == "xs" ||
          this.$vuetify.breakpoint.name == "sm"
        ) {
          return "margin-top: -40px";
        } else {
          return "margin-top: -10px";
        }
      },
    },
    margin: {
      get() {
        if (
          this.$vuetify.breakpoint.name == "xs" ||
          this.$vuetify.breakpoint.name == "sm"
        ) {
          return "margin-top: -60px; margin-left: 33px";
        } else {
          return "margin-left:-15px;";
        }
      },
    },

    paginated() {
      return this.allTransaction.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize
      );
    },
  },
  watch: {
    complainDialog(val) {
      !val && this.closeFormComplain();
    },
  },
  methods: {
    getAllData() {
      this.$http
        .get("/transaction")
        .then((response) => {
          this.allTransaction = response.data;
          this.transactionPages = Math.ceil(
            this.allTransaction.length / this.pageSize
          );
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    closeFormComplain() {
      this.$refs.formComplain.reset();
      this.complainDialog = false;
      this.complain = "";
    },
    getQuestion(id) {
      this.$http
        .get("/question/user/" + id)
        .then((response) => {
          this.allQuestion = response.data;
          this.id = this.allQuestion._id;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    toChat(id, partner) {
      let form = new FormData();
      form = {
        partner: partner,
      };
      this.$http
        .post("/chatRoom/" + id, form)
        .then(() => {
          this.$router.push({
            name: "Chat",
          });
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
    answerQuestion(id, transaction) {
      const length = this.fill.length;
      for (let i = 0; i < length; i++) {
        if (this.fill[i] == null) {
          this.fill[i] = "";
        }
      }

      const rowLength = this.row.length;
      for (let i = 0; i < rowLength; i++) {
        if (this.row[i] == "Isi Sendiri") {
          this.row[i] = this.fill[i];
        }
      }
      const form = { answer: this.row, transaction: transaction };
      this.$http
        .post("/question/answer/" + id, form)
        .then(() => {
          this.openSnackbar("Jawaban berhasil dikumpul", "success");
          this.formDialog = false;
          this.getAllData();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },

    addComplain(id) {
      const form = { complain: this.complain, transaction: id };
      this.$http
        .post("/complain/", form)
        .then(() => {
          this.openSnackbar("Keluhan berhasil ditambahkan", "success");
          this.complainDialog = false;
          this.getAllData();
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
    getVaccine(transaction) {
      if (transaction.vaksin1) {
        return "Vaksin 1";
      } else if (transaction.vaksin2) {
        return "Vaksin 2";
      } else if (transaction.vaksinBooster) {
        return "Booster";
      }
    },
  },
  created() {
    this.getAllData();
  },
};
</script>
<style scoped>
.container {
  position: relative;

  border-radius: 12px;
  overflow: hidden;
}

.container:after {
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 170px 100px 0;
  border-color: transparent #9e2b25 transparent transparent;
  right: 0;
  top: 0;
  position: absolute;
}

.corner span {
  color: white;
  position: absolute;
  font-weight: bold;
  top: 20px;
  width: 100px;
  right: 5px;
  text-align: center;
  font-size: 16px;
  font-family: arial;
  z-index: 1;
  display: block;
}
</style>