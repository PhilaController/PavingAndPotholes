<template>
  <vue-slider
    v-model="value"
    :data="data"
    :marks="true"
    :width="width"
    @change="onChange"
    :disabled="disabled"
    :contained="true"
  ></vue-slider>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  components: {
    VueSlider
  },
  props: ["values", "selected", "disabled", "width"],
  data: function() {
    return {
      value: this.selected,
      data: this.values
    };
  },
  methods: {
    onChange(value) {
      this.$emit("change", value);
    }
  },
  mounted() {
    // $(".vue-slider-mark-label")
    //   .last()
    //   .html("2018 (Planned)");
  }
};
</script>

<style>
.vue-slider-process {
  background-color: #ccc;
}
.vue-slider-dot-handle {
  background: #2176d2;
  box-shadow: none;
}
</style>

<style>
.vue-slider-mark-label-active,
.vue-slider-mark-label {
  font-size: 1rem !important;
}
</style>


