<template>
  <div class="card">
    <!-- header -->
    <div class="card-header">
      <div class="title-wrapper d-flex justify-content-between align-items-center">
        <div class="my-card-title text-left">Street Defect {{title}} by Neighborhood</div>
        <div class="filter-reset" v-if="showFilterReset" @click="resetFilter">[Reset Filter]</div>
      </div>
      <div class="card-instructions text-left font-italic mt-2">
        <span class="font-weight-bold">Instructions:</span> Use the toggle below
        to view data for street defect requests or repairs. Data for individual
        neighborhoods can be selected using the dropdown menu, or by clicking on
        individual bars of the chart or specific areas of the map.
      </div>
    </div>

    <!--  legend -->
    <div class="defects-map-legend d-flex align-items-center pt-3 pb-3">
      <!-- Toggle Requests/Repairs -->
      <div class="defects-map-toggle">
        <label class="mr-2">Show:</label>
        <template v-for="(layer, i) in layers">
          <div class="pretty p-default p-round" :key="i">
            <input type="radio" name="layer-toggle" v-model="activeLayer" :value="layer">
            <div class="state">
              <label class="defects-map-toggle-label">{{ capitalize(layer) }}</label>
            </div>
          </div>
        </template>
      </div>

      <!-- dropdown for neighborhoods -->
      <div class="hood-dropdown">
        <label class="mr-2">Zoom and center a neighborhood</label>
        <v-select
          id="hood-dropdown-select"
          class="hood-dropdown-select"
          ref="hoodDropdown"
          :options="uniqueHoods"
          placeholder="Select a neighborhood"
          @input="setSelectedHood"
        ></v-select>
      </div>
    </div>
    <!-- card body -->
    <div class="card-body">
      <div class="row">
        <!-- Repairs by Neighborhood -->
        <div class="col-md-4 col-sm-12">
          <RepairsByHood class="h-100" height="1100" :data="data"/>
        </div>

        <!-- Streets Defects Map + Top Streets Table -->
        <div class="col-md-8 col-sm-12 d-flex flex-column">
          <StreetDefectsMap
            class="hex-map-component"
            height="600"
            :data="data"
            :activeLayer="activeLayer"
          />
          <TopStreetsTable class="mt-3 top-streets-component" :data="data"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopStreetsTable from "@/cards/TopStreetsTable.vue";
import RepairsByHood from "@/cards/RepairsByHood.vue";
import StreetDefectsMap from "@/cards/StreetDefectsMap.vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";

export default {
  props: ["data", "height"],
  components: {
    RepairsByHood,
    StreetDefectsMap,
    TopStreetsTable,
    vSelect
  },
  data() {
    return {
      activeLayer: "repairs",
      layers: ["repairs", "requests"]
    };
  },
  computed: {
    showFilterReset() {
      return this.selectedHood !== null;
    },
    uniqueHoods() {
      let hoods = [];
      if (this.neighborhoods) {
        hoods = this.neighborhoods.features.map(a => a.properties.hood);
      }
      return hoods;
    },
    neighborhoods() {
      return this.$store.state.features;
    },
    title() {
      return this.capitalize(this.activeLayer);
    },
    selectedHood() {
      return this.$store.state.selectedHood;
    }
  },
  watch: {
    selectedHood: function(val) {
      this.$refs.hoodDropdown.updateValue(val);
    }
  },
  methods: {
    resetFilter(val) {
      this.$refs.hoodDropdown.updateValue(null);
    },
    capitalize(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    setSelectedHood(val) {
      this.$store.commit("setValue", {
        key: "selectedHood",
        value: val
      });
    }
  }
};
</script>


<style>
.hood-dropdown input {
  line-height: 1.4 !important;
  font-size: 1em !important;
  border: 1px solid transparent !important;
  border-left: none !important;
  outline: none !important;
  margin: 4px 0 0 !important;
  padding: 0 7px !important;
  background: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  width: 0 !important;
  max-width: 100% !important;
  -webkit-box-flex: 1 !important;
  -ms-flex-positive: 1 !important;
  flex-grow: 1 !important;
}
.defects-map-toggle {
  font-size: 1.3rem;
}
.defects-map-toggle-label {
  color: #2176d2;
  font-size: 1.3rem;
}

.defects-map-legend {
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  justify-content: space-evenly;
}
</style>
