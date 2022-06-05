<template>
  <v-dialog v-model="visibility" max-width="700px" @input="close">
    <v-card style="overflow-x: hidden">
      <v-row>
        <v-col class="pa-8">
          <v-select
            v-model="dose"
            :items="vaccineDose"
            label="Filter Dosis Vaksin"
            outlined
          ></v-select>
        </v-col>
        <v-col> </v-col>
      </v-row>

      <div v-if="!isEmpty">
        <div
          class="pa-5 pl-10 pb-10"
          v-for="schedule in paginated"
          :key="String(schedule.schedule)"
        >
          <p style="font-size: 32px; font-weight: 600" class="mb-5">
            {{ new Date(schedule.start.split("T")[0]).toDateString() }}
          </p>
          <v-row>
            <v-col cols="12" md="9">
              <p style="font-size: 20px; color: #5b5a5a; margin-bottom: 30px">
                {{ schedule.start.split("T")[1].split(":00.000Z")[0] }} -
                {{ schedule.end.split("T")[1].split(":00.000Z")[0] }}
              </p>
              <v-row>
                <p style="font-size: 18px; color: #767272" class="ml-3">
                  Vaksin:
                </p>
                <v-chip
                  v-for="x in schedule.vaccines"
                  v-bind:key="String(x.vaccine._id) + String(schedule._id)"
                  class="mb-6 ml-3"
                  label
                >
                  {{ x.vaccine.name }}
                </v-chip>
              </v-row>
              <v-row>
                <v-chip
                  v-if="schedule.vaksin1"
                  tile
                  color="#248232"
                  class="white--text mr-2 ml-3"
                >
                  <v-icon left> mdi-check </v-icon>
                  Dosis 1
                </v-chip>
                <v-chip
                  v-if="schedule.vaksin2"
                  tile
                  color="#248232"
                  class="white--text mr-2"
                >
                  <v-icon left> mdi-check </v-icon>
                  Dosis 2
                </v-chip>
                <v-chip
                  v-if="schedule.vaksinBooster"
                  tile
                  color="#248232"
                  class="white--text"
                >
                  <v-icon left> mdi-check </v-icon>
                  Dosis Booster
                </v-chip>
              </v-row>
            </v-col>
            <v-col cols="12" md="3">
              <v-row>
                <p style="font-size: 20px" v-if="!schedule.isLansia">Lansia</p>
                <p style="font-size: 20px" v-if="schedule.isLansia">Umum</p>
              </v-row>
              <v-row style="margin-top: -10px">
                <p style="font-size: 20px">{{ schedule.age }} +</p>
              </v-row>
              <v-row style="margin-top: -15px"
                ><v-col>
                  <v-btn
                    @click="
                      chooseSchedule(
                        schedule._id,
                        schedule.vaksin1,
                        schedule.vaksin2,
                        schedule.vaksinBooster
                      )
                    "
                    style="font-weight: bolder; margin-left: -10px"
                    color="#22577E"
                    outlined
                  >
                    Daftar
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <v-pagination
          class="mt-5 pb-3"
          v-model="page"
          :length="schedulePages"
          v-if="paginated.length != 0"
          :total-visible="7"
        ></v-pagination>
      </div>
      <div v-if="paginated.length == 0" style="margin-left: 20%" class="pa-10">
        <v-img
          src="/data_empty.svg"
          contain
          height="150px"
          width="200px"
        ></v-img>
        <h1 style="color: #22577e">Jadwal Tidak Ditemukan</h1>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    partner_id: {
      type: String,
      default: "",
    },
    vaksin1: {
      type: Boolean,
      default: false,
    },
    vaksin2: {
      type: Boolean,
      default: false,
    },
    vaksinBooster: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visibility: false,
      allSchedule: [],
      page: 1,
      PerPages: 3,
      partner: "",
      isEmpty: false,
      schedulePages: 0,
      dose: "",
      vaccineDose: ["Dosis 1", "Dosis 2", "Dosis Booster"],
    };
  },
  name: "ScheduleComponent",
  computed: {
    paginated() {
      return this.allSchedule.slice(
        (this.page - 1) * this.PerPages,
        this.page * this.PerPages
      );
    },
  },
  methods: {
    getAllSchedule() {
      let params = "";
      params =
        this.vaksin1 == false
          ? "?vaksin=1"
          : this.vaksin2 == false
          ? "?vaksin=2"
          : "?vaksin=Booster";
      this.$http
        .get("/schedules/user/" + this.partner_id + params)
        .then((response) => {
          this.allSchedule = response.data;
          this.schedulePages = Math.ceil(
            this.allSchedule.length / this.PerPages
          );
          this.paginated == [] ? (this.isEmpty = true) : (this.isEmpty = false);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    chooseSchedule(id, vaksin1, vaksin2, vaksinBooster) {
      this.$emit("setSchedule", {
        id: id,
        vaksin1: vaksin1,
        vaksin2: vaksin2,
        vaksinBooster: vaksinBooster,
      });
    },

    close() {
      this.$emit("cancelled");
    },
  },

  watch: {
    visible(newVal) {
      this.visibility = newVal;
      this.getAllSchedule();
    },
    partner_id(newVal) {
      this.partner = newVal;
    },
    dose(newVal) {
      this.dose = newVal;
      if (this.dose == "Dosis 1") {
        this.vaksin1 = false;
        this.vaksin2 = true;
        this.vaksinBooster = true;
      } else if (this.dose == "Dosis 2") {
        this.vaksin2 = false;
        this.vaksin1 = true;
        this.vaksinBooster = true;
      } else {
        this.vaksinBooster = false;
        this.vaksin1 = true;
        this.vaksin2 = true;
      }
      this.getAllSchedule();
    },
  },
};
</script>

