<template>
  <v-main>
    <div class="messaging">
      <body>
        <div class="container">
          <div class="messaging">
            <div class="inbox_msg">
              <div class="inbox_people">
                <div class="headind_srch">
                  <div class="srch_bar">
                    <div class="stylish-input-group"></div>
                  </div>
                </div>
                <div class="inbox_chat">
                  <div
                    @click="onClick(item)"
                    :class="{ active_chat: String(id) == String(item._id) }"
                    class="chat_list"
                    v-for="item in filteredRoom"
                    :key="String(item._id)"
                  >
                    <div class="chat_people">
                      <div
                        class="chat_img"
                        v-if="$vuetify.breakpoint.name == 'lg'"
                      >
                        <img src="/calendar.png" />
                      </div>
                      <div class="chat_ib">
                        <h5>
                          {{
                            currentUser.user_id.role == "Medic"
                              ? item.user.first_name + " " + item.user.last_name
                              : item.medicUser.first_name +
                                " " +
                                item.medicUser.last_name
                          }}
                          <span
                            class="chat_date"
                            v-if="$vuetify.breakpoint.name == 'lg'"
                            >{{ formatDate(item.schedule.start) }}</span
                          >
                        </h5>

                        <p
                          v-if="
                            currentUser.user_id.role == 'User' &&
                            $vuetify.breakpoint.name == 'lg'
                          "
                        >
                          {{ item.medic.education }}
                        </p>
                        <p v-if="currentUser.user_id.role == 'User'">
                          {{ item.medic.position }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mesgs">
                <div class="msg_history" ref="container">
                  <v-chip
                    v-if="schedule != '' && $vuetify.breakpoint.name == 'lg'"
                    color="#ebebeb"
                    class="mb-4"
                    label
                    style="left: 25%; color: #646464"
                    >Vaksinasi Dijadwalkan Untuk
                    {{ formatDate2(schedule) }}</v-chip
                  >

                  <div
                    v-for="message in messages"
                    :key="message.created"
                    :class="[
                      {
                        outgoing_msg:
                          String(currentUser.user_id._id) === message.sender,
                      },
                      '',
                    ]"
                  >
                    <div
                      :class="[
                        {
                          sent_msg:
                            String(currentUser.user_id._id) === message.sender,
                        },
                        ,
                        'received_msg',
                      ]"
                    >
                      <div class="received_withd_msg">
                        <p>{{ message.message }}</p>
                        <span class="time_date">{{
                          new Date(message.created).toLocaleString()
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="type_msg">
                  <div class="input_msg_write">
                    <input
                      type="text"
                      class="write_msg"
                      v-model="message"
                      placeholder="Type a message"
                      @keyup.enter="saveMessage"
                    />
                    <v-btn
                      fab
                      color="primary"
                      class="msg_send_btn"
                      @click="saveMessage"
                    >
                      <v-icon>mdi-send </v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  </v-main>
</template>


<script>
import { db } from "../../firebaseInit";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Role from "../../../_helpers/role";

export default {
  data() {
    return {
      message: "",
      messages: [],
      room: [],
      id: "",
      schedule: "",
    };
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser.user;
      },
    },
    filteredRoom: function () {
      return this.room.filter(function (item) {
        return item.transaction !== null && item.schedule != null;
      });
    },
  },
  methods: {
    onClick(item) {
      this.id = String(item._id);
      this.getMessage(item._id);
      this.schedule = item.schedule.start;
    },
    scrollToBottom() {
      const container = this.$refs.container;
      container.scrollTop = container.scrollHeight;
    },
    getData() {
      return this.currentUser.user_id.role == Role.User
        ? this.getAllData()
        : this.getAllMedicData();
    },
    getAllData() {
      this.$http
        .get("/chatRoom")
        .then((response) => {
          this.room = response.data;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },

    getAllMedicData() {
      this.$http
        .get("/chatRoom/medic")
        .then((response) => {
          this.room = response.data;
        })
        .catch((error) => {
          this.openSnackbar(error.response.data.message, "error");
        });
    },

    formatDate(dateData) {
      let date = new Date(dateData);
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let day = date.getDate();

      let monthIndex = date.getMonth();
      let monthName = monthNames[monthIndex];

      return `${day} ${monthName}`;
    },

    formatDate2(dateData) {
      let date = new Date(dateData);
      date = new Date(date.setHours(date.getHours() - 7));
      let datetext = date.toTimeString();

      let dayNames = [
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Minggu",
      ];
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agst",
        "Sep",
        "Oky",
        "Nov",
        "Des",
      ];

      let day = date.getDay();

      let monthIndex = date.getMonth();
      let monthName = monthNames[monthIndex];
      let dayName = dayNames[day];

      return `${dayName} ${date.getDate()} ${monthName} ${
        datetext.split(" ")[0]
      }`;
    },
    getName(item) {
      if (this.currentUser.role == Role.User) {
        return item.medicUser.first_name + " " + item.medicUser.last_name;
      } else if (this.currentUser.role == Role.Medic) {
        return item.user.first_name + " " + item.user.last_name;
      }
    },
    saveMessage() {
      if (this.message != "") {
        addDoc(collection(db, "chat"), {
          message: this.message,
          created: new Date().getTime(),
          sender: this.currentUser.user_id._id,
          room_id: this.id,
        }).catch((error) => {
          console.error(error);
        });
      }
      this.message = null;
      setTimeout(this.scrollToBottom, 100);
    },

    getMessage(id) {
      const q = query(
        collection(db, "chat"),
        where("room_id", "==", id),
        orderBy("created")
      );
      return onSnapshot(q, (querySnapshot) => {
        const arr = [];
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        this.messages = arr;
        setTimeout(this.scrollToBottom, 100);
      });
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.inbox_people {
  background: #ffffff none repeat scroll 0 0;
  float: left;
  overflow-y: auto;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}

.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat_ib h5 span {
  font-size: 13px;
  float: right;
}
.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto;
}
.chat_img {
  float: left;
  width: 40px;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}

.received_withd_msg {
  width: 57%;
}

.mesgs {
  background-color: white;

  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.sent_msg p {
  background: #22577e none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #22577e none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}

@media (max-width: 991px) {
  .received_withd_msg {
    width: 100%;
  }

  .sent_msg {
    float: right;
    width: 100%;
  }
}
</style>

