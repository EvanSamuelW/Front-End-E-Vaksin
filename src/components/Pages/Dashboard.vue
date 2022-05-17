<template>
  <v-main>
    <v-card>
      <div class="pa-5">
        <v-row>
          <v-col cols="12" md="4">
            <v-card
              class="mx-auto text-center"
              color="#1976D2"
              dark
              max-width="600"
            >
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <template>
                    <div id="app">
                      <GChart
                        type="ColumnChart"
                        :data="chartDataPie.result3"
                        :options="chartOptions"
                      />
                    </div>
                  </template>
                </v-sheet>
              </v-card-text>

              <v-card-text>
                <div class="text-h5 font-weight-bold">Vaksinasi Partner</div>
              </v-card-text>

              <v-divider></v-divider>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card
              class="mx-auto text-center"
              color="green"
              dark
              max-width="600"
            >
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <v-sparkline
                    :value="chartDataPie.result2"
                    color="rgba(255, 255, 255, .7)"
                    height="100"
                    padding="24"
                    stroke-linecap="round"
                    smooth
                  >
                    <template v-slot:label="item"> {{ item.value }} </template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>

              <v-card-text>
                <div class="text-h5 font-weight-bold">
                  Pengguna Terdaftar Minggu Ini
                </div>
              </v-card-text>

              <v-divider></v-divider>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card
              class="mx-auto text-center"
              color="indigo"
              dark
              max-width="600"
            >
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <v-sparkline
                    :value="chartDataPie.result"
                    color="rgba(255, 255, 255, .7)"
                    height="100"
                    padding="24"
                    stroke-linecap="round"
                    smooth
                  >
                    <template v-slot:label="item"> {{ item.value }} </template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>

              <v-card-text>
                <div class="text-h5 font-weight-bold">
                  Partner Terdaftar Minggu Ini
                </div>
              </v-card-text>

              <v-divider></v-divider>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card>
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
                  @click="exportData"
                  style="font-weight: bold"
                  color="primary"
                  outlined
                >
                  <v-icon left> mdi-download </v-icon>
                  Unduh sebagai CSV
                </v-btn>
              </v-card-title>
              <div>
                <v-data-table
                  :headers="headers"
                  :items="allComplain"
                  item-key="_id"
                  :items-per-page="5"
                  class="elevation-1"
                  :search="search"
                >
                  <template v-slot:[`item.created`]="{ item }">
                    <p>{{ formatDateTime(item.created) }}</p>
                  </template>

                  <template v-slot:[`item.name`]="{ item }">
                    <p>
                      {{ item.user.first_name + " " + item.user.last_name }}
                    </p>
                  </template>
                </v-data-table>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="mx-auto text-center" max-width="600">
              <h1
                style="text-align: center"
                class="headline mb-2 grey--text pt-4"
              >
                Ketersediaan Vaksin
              </h1>
              <template>
                <div id="app">
                  <GChart
                    type="PieChart"
                    :settings="{ packages: ['corechart'] }"
                    :data="chartDataPie.vaccinationResult"
                    :options="chartOptions.chart"
                  />
                </div>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-main>
</template>

<script>
import { GChart } from "vue-google-charts";
import Role from "../../../_helpers/role";
const gradients = [
  ["#111"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd2020", "#1feaea"],
];
export default {
  data() {
    return {
      chartOptions: {
        chart: {
          title: "Ketersediaan Vaksin (dalam dosis)",
          pieHole: 0.4,
          height: 380,
        },
        backgroundColor: "#1668b8",
        height: 160,
        colors: ["lightgray"],
        hAxis: {
          color: "#c7e1c8",

          textStyle: {
            color: "transparent", //ubah jadi warna #c7e1c8 kalau mau keliatan
          },
        },
        vAxis: {
          textStyle: {
            color: "#c7e1c8",
          },
          gridlines: {
            color: "transparent",
          },
        },
        legend: { position: "none" },
      },
      showLabels: false,
      lineWidth: 2,
      labelSize: 7,
      allComplain: [],
      radius: 10,
      padding: 8,
      lineCap: "round",

      gradients,
      fill: false,
      type: "trend",
      autoLineWidth: false,
      search: "",
      calories: "",
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
          width: "10%",
          divider: true,
        },
        {
          text: "Nomor Handphone",
          value: "detailUser.phone",
          width: "10%",
          divider: true,
        },
        {
          text: "Keluhan",
          value: "complain",
          width: "10%",
          divider: true,
        },
        {
          text: "Dibuat pada",
          value: "created",
          width: "10%",
          divider: true,
        },
      ],
    };
  },
  computed: {
    chartDataPie: {
      get() {
        return this.$store.state.functionalApp.dashboard;
      },
    },
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
  },
  components: {
    GChart,
  },
  methods: {
    getDashboard() {
      this.$store.dispatch("functionalApp/getDashboard");
    },
    getComplain(partner) {
      this.$http
        .get("/complain/" + partner)
        .then((response) => {
          this.allComplain = response.data;
        })
        .catch((error) => {
          console.log(error.response.data.message);
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
    exportData() {
      this.$http
        .get("/complain/export/" + this.currentUser.partner_id._id, {
          responseType: "blob",
        })
        .then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `complain-${new Date().toLocaleDateString()}.xlsx`
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },
  },
  created() {
    this.getDashboard();
    this.$store.dispatch("currentUser/getUser");
    const partner =
      localStorage.getItem("role") == Role.Partner
        ? this.currentUser.partner_id._id
        : null;
    this.getComplain(partner);
  },
};
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>