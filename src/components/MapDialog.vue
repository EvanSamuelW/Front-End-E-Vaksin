 <template>
  <v-dialog v-model="visibility" max-width="700px" @input="$emit('cancelled')">
    <v-card>
      <div class="pa-5">
        <div>
          <h2 class="ml-2">Cari Lokasi dan Letakkan Pin</h2>
          <GmapAutocomplete
            class="mr-5 ml-2 input"
            @place_changed="setPlace"
            :options="{
              fields: ['geometry', 'formatted_address', 'address_components'],
            }"
          />
          <v-btn color="primary" @click="addMarker"
            ><v-icon left>mdi-map-marker</v-icon> Pilih Lokasi</v-btn
          >
        </div>
        <br />

        <GmapMap :center="center" :zoom="12" style="width: 100%; height: 400px">
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="center = m.position"
          />
        </GmapMap>
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
  },
  data() {
    return {
      visibility: false,
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null,
      markers: [],
      places: [],
    };
  },
  mounted() {
    this.geolocate();
  },
  name: "MapComponent",
  methods: {
    setPlace(place) {
      this.currentPlace = place;
      this.$emit("changePlace", {
        place: place.formatted_address,
      });
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.$emit("changeCoordinate", {
          coordinate: [marker.lat, marker.lng],
        });
        this.currentPlace = null;
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
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
<style scoped>
.input {
  border: 2px solid #aaa;
  border-radius: 4px;
  margin: 8px 0;
  outline: none;
  padding: 5px;
  box-sizing: border-box;
}
</style>