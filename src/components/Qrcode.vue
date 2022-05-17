 <template>
  <v-dialog
    v-model="visibility"
    max-width="500px"
    @close="onCancel"
    @input="onCancel"
  >
    <v-card style="overflow-y: hidden">
      <v-card-title style="background: #22577e; font-weight: 600; color: white">
        QR Code
      </v-card-title>
      <div
        class="pa-5 text-xs-center"
        id="my-node"
        max-width="500px"
        style="background-color: white; margin: auto"
      >
        <qrcode-vue
          style="margin-left: 27%"
          :value="code"
          :size="200"
          level="H"
        />
        <div
          style="
            margin-top: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          "
        >
          <p>{{ new Date(start.split("T")[0]).toDateString() }}</p>
          <p style="line-height: -80px">
            {{
              start.split("T")[1].split(":00.000Z")[0] +
              " - " +
              end.split("T")[1].split(":00.000Z")[0]
            }}
          </p>
          <p style="line-height: -80px">{{ location }}</p>
        </div>
      </div>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              class="white--text"
              @click="onCancel"
              width="100%"
              color="#9E2B25"
            >
              Tutup
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              @click="print"
              class="white--text"
              width="100%"
              color="#22577e"
            >
              Unduh
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import * as htmlToImage from "html-to-image";
export default {
  components: {
    QrcodeVue,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
    start: {
      type: Date,
      default: Date.now(),
    },
    end: {
      type: Date,
      default: Date.now(),
    },
    location: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visibility: false,
    };
  },

  name: "QrCodeComponent",
  methods: {
    onCancel() {
      this.$emit("cancelled");
    },
    async print() {
      htmlToImage
        .toJpeg(document.getElementById("my-node"), { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "my-image-name.jpeg";
          link.href = dataUrl;
          link.click();
        });
    },
  },
  watch: {
    visible(newVal) {
      this.visibility = newVal;
    },
  },
};
</script>
 