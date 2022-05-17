<template>
  <v-main>
    <snackbar
      :visible="snackbar"
      :color="color"
      :message="message"
      @cancelled="snackbar = false"
    />
    <div class="pa-8" id="main">
      <v-card
        class="mb-6"
        style="width: 1000px; margin: auto"
        elevation="3"
        v-for="partner in paginated"
        :key="String(partner._id)"
      >
        <div class="pa-5 pl-10">
          <p
            style="font-size: 32px; font-weight: 600; color: #22577e"
            class="mb-5"
          >
            {{ partner.partner.name }}
          </p>
          <v-row>
            <v-col cols="12" md="3">
              <v-img height="150" width="200" :src="getImg(partner)"> </v-img>
            </v-col>
            <v-col cols="12" md="6">
              <p style="font-size: 20px">{{ partner.partner.address }}</p>
              <v-row class="mt-5">
                <v-col cols="12" md="5">
                  <v-row>
                    <v-icon class="mb-4 mr-2 ml-3">mdi-phone</v-icon>

                    <p style="font-size: 17px">{{ partner.partner.phone }}</p>
                  </v-row>
                </v-col>

                <v-col cols="12" md="7">
                  <v-row>
                    <v-icon class="mb-4 mr-2 ml-3">mdi-email</v-icon>
                    <p style="font-size: 17px">{{ partner.partner.email }}</p>
                  </v-row>
                </v-col></v-row
              >
            </v-col>
            <v-col cols="12" md="3">
              <p style="font-size: 18px; color: #767272">
                {{
                  haversineDistance(
                    currentUser.coordinate,
                    partner.partner.coordinate
                  ).toFixed(2) + " Km dari sini"
                }}
              </p>
              <v-row
                ><v-col>
                  <v-btn
                    @click="openSchedule(partner.partner)"
                    style="font-weight: bolder"
                    color="#22577E"
                    outlined
                  >
                    Info Jadwal
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <choose-schedule
        :visible="dialog"
        :partner_id="id"
        :vaksin1="currentUser.vaksin1"
        :vaksin2="currentUser.vaksin2"
        :vaksinBooster="currentUser.vaksinBooster"
        @setSchedule="setSchedule"
        @cancelled="dialog = false"
      />

      <register-vaccination
        :visible="dialog2"
        :location="location"
        :currentUser="currentUser"
        :id="id"
        :vaksin1="vaksin1"
        :vaksin2="vaksin2"
        :vaksinBooster="vaksinBooster"
        @cancelled="dialog2 = false"
        @success="onSuccess"
        @error="onError"
      />
      <v-pagination
        class="mt-5 pb-3"
        v-model="page"
        :length="locationPages"
        :total-visible="7"
      ></v-pagination>
    </div>
  </v-main>
</template>

<script>
import Snackbar from "../Snackbar.vue";
import chooseSchedule from "../ChooseSchedule.vue";
import RegisterVaccination from "../RegisterVaccination.vue";
export default {
  components: { Snackbar, chooseSchedule, RegisterVaccination },
  name: "Location",
  data() {
    return {
      sortedPartner: [],

      pageSize: 3,
      dialog: false,
      allPartner: [],
      dialog2: false,
      locationPages: 0,
      imgPreUrl: this.$imageLink + "partner/",

      location: "",
      id: "",
      vaksin1: false,
      vaksin2: false,
      vaksinBooster: false,
      selected: [],
      page: 1,
      length: 6,
      color: "",
      message: "",
      snackbar: false,
    };
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    paginated() {
      return this.allPartner.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize
      );
    },
  },

  methods: {
    getImg(item) {
      var img =
        item.partner.image != null
          ? this.imgPreUrl + item.partner.image
          : "https://d1ojs48v3n42tp.cloudfront.net/provider_location_banner/358256_25-4-2020_16-17-5.jpeg";
      return img;
    },

    getAllPartner() {
      this.$http
        .get("/partners/user")
        .then((response) => {
          this.allPartner = response.data;
          this.locationPages = Math.ceil(
            this.allPartner.length / this.pageSize
          );
          this.sortData();
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },

    sortByProperty(user, haversineDistance) {
      return function (a, b) {
        return (
          haversineDistance(user.coordinate, a.partner.coordinate) -
          haversineDistance(user.coordinate, b.partner.coordinate)
        );
      };
    },
    setSchedule({ id, vaksin1, vaksin2, vaksinBooster }) {
      this.id = id;
      this.dialog2 = true;
      this.dialog = false;
      this.vaksinBooster = vaksinBooster;
      this.vaksin2 = vaksin2;
      this.vaksin1 = vaksin1;
    },
    sortData() {
      this.sortedPartner = this.allPartner.sort(
        this.sortByProperty(this.currentUser, this.haversineDistance)
      );
    },

    toRad(x) {
      return (x * Math.PI) / 180;
    },

    openSnackbar(message, color) {
      this.message = message;
      this.color = color;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 4000);
    },
    onSuccess({ message }) {
      this.openSnackbar(message, "success");
    },
    onError({ message }) {
      this.openSnackbar(message, "error");
    },
    haversineDistance(coords1, coords2) {
      for (let i = 0; i < 2; i++) {
        coords1[i] = parseFloat(coords1[i]);
        coords2[i] = parseFloat(coords2[i]);
      }

      var lon1 = coords1[0];
      var lat1 = coords1[1];

      var lon2 = coords2[0];
      var lat2 = coords2[1];

      var R = 6371; // km

      var x1 = lat2 - lat1;
      var dLat = this.toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = this.toRad(x2);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) *
          Math.cos(this.toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    openSchedule(partner) {
      this.id = partner._id;
      this.location = partner.name;
      console.log(this.id);
      this.dialog = true;
    },
  },
  created() {
    this.getAllPartner();
  },
};
</script>
