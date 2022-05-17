 <template>
  <v-dialog v-model="visibility" max-width="500px" @input="onCancel">
    <v-card style="overflow-y: hidden">
      <v-card-title style="background: #22577e; font-weight: 600; color: white">
        Ubah Kata Sandi
      </v-card-title>
      <div class="pa-5">
        <v-form ref="formPassword">
          <v-text-field
            v-model="oldPassword"
            type="password"
            label="Kata Sandi Lama"
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            type="password"
            label="Kata Sandi Baru"
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Konfirmasi Kata Sandi Baru"
            :rules="nameRules"
          ></v-text-field>
        </v-form>
      </div>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              class="white--text"
              width="100%"
              color="#9E2B25"
              @click="closeDialogPassword()"
            >
              Tutup
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="white--text"
              width="100%"
              color="#22577e"
              @click="changePassword()"
            >
              Ubah Kata Sandi
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
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
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visibility: false,
      nameRules: [(v) => !!v || "Area Ini Wajib Diisi"],
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },

  name: "ChangePasswordComponent",
  methods: {
    closeDialogPassword() {
      (this.newPassword = ""),
        (this.oldPassword = ""),
        (this.confirmPassword = "");
      this.$refs.formPassword.reset();
      this.$emit("cancelled");
    },
    changePassword() {
      if (this.$refs.formPassword.validate()) {
        if (this.newPassword == this.confirmPassword) {
          const forms = {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          };
          this.$http
            .patch("users/changePassword/" + this.id, forms)
            .then((response) => {
              console.log(response.data.message);

              this.$emit("success", {
                message: "Kata Sandi berhasil diubah",
              });
              this.closeDialogPassword();
            })
            .catch((error) => {
              this.$emit("error", {
                message: error.response.data.message,
              });
            });
        } else {
          this.$emit("error", {
            message: "Konfirmasi Kata Sandi berbeda",
          });
        }
      } else {
        this.$emit("error", {
          message: "Semua field wajib diisi",
        });
      }
    },
    onCancel() {
      this.$emit("cancelled");
    },
  },
  watch: {
    visible(newVal) {
      this.visibility = newVal;
    },
  },
};
</script>
 