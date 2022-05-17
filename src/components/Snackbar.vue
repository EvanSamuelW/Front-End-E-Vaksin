<template>
  <div>
    <v-snackbar v-model="visibility" top :color="color">
      <span>{{ message }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="onCancel">
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visibility: false,
    };
  },

  name: "snackbarComponent",
  methods: {
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
 