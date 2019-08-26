<template>
  <div class="control-panel d-flex align-items-center">
    <!-- Toggle Requests/Repairs -->
    <div class="radio-toggle">
      <template v-for="(layer, i) in layers">
        <div class="pretty p-default p-round" :key="i">
          <input
            type="radio"
            name="layer-toggle"
            :value="layer"
            @input="setActiveLayer"
            :checked="activeLayer == layer"
          >
          <div class="state">
            <label :class="{ 'font-weight-bold': activeLayer==layer }">{{ capitalize(layer) }}</label>
          </div>
        </div>
      </template>
    </div>

    <!-- dropdown for neighborhoods -->
    <div class="hood-dropdown mb-3 mt-3">
      <label class="mr-2 font-weight-bold">Zoom and center a neighborhood</label>
      <v-select
        ref="hoodDropdown"
        :options="uniqueHoods"
        placeholder="Select a neighborhood"
        @input="setSelectedHood"
      ></v-select>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";

export default {
  data() {
    return { uniqueHoods: [] };
  },
  props: ["layers", "selectedHood", "activeLayer"],
  components: { vSelect },
  computed: {
    neighborhoods() {
      return this.$store.state.neighborhoodsJSON;
    }
  },
  methods: {
    capitalize(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    setSelectedHood(val) {
      this.$store.commit("setValue", {
        key: "selectedHood",
        value: val
      });
    },
    setActiveLayer(event) {
      this.$emit("input", event.target.value);
    }
  },
  watch: {
    selectedHood: function(val) {
      this.$refs.hoodDropdown.updateValue(val);
    },
    neighborhoods: function(val) {
      if (val) {
        this.uniqueHoods = val.features.map(a => a.properties.hood);
      }
    }
  }
};
</script>

<style scoped>
.radio-toggle label {
  font-size: 1.3rem;
}

.control-panel {
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  justify-content: space-around;
}

@media only screen and (max-width: 600px) {
  .control-panel {
    flex-direction: column;
  }
  .radio-toggle {
    margin-top: 1.5rem;
  }
  .hood-dropdown {
    margin-bottom: 1.5rem !important;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
</style>