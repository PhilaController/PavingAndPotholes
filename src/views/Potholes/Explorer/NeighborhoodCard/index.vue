<template>
  <div class="card">
    <!-- The Card Title -->
    <CardHeader
      :title="cardTitle"
      :helpMessage="helpMessage"
      :onReset="resetFilter"
      :showReset="showReset"
    />

    <!-- Control Panel -->
    <ControlPanel
      ref="controlPanel"
      :activeLayer="activeLayer"
      :layers="layers"
      :selectedHood="selectedHood"
      @input="setActiveLayer"
    />

    <!-- card body -->
    <div class="card-body">
      <div class="row">
        <!-- Bar Chart of Repairs by Neighborhood -->
        <div class="col-md-4 col-sm-12">
          <BarChart :data="data"/>
        </div>

        <!-- Streets Defects Map + Top Streets Table -->
        <div class="col-md-8 col-sm-12 d-flex flex-column justify-content-between mt-3">
          <Map :height="600" :data="data" :activeLayer="activeLayer"/>
          <TopStreetsTable class="mt-3" :data="data"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopStreetsTable from "./TopStreetsTable.vue";
import BarChart from "./BarChart.vue";
import Map from "./Map.vue";
import ControlPanel from "./ControlPanel.vue";
import CardHeader from "@/components/CardHeader.vue";

export default {
  props: ["data", "height"],
  components: {
    Map,
    BarChart,
    TopStreetsTable,
    CardHeader,
    ControlPanel
  },
  data() {
    return {
      activeLayer: "repairs",
      layers: ["repairs", "requests"],
      helpMessage: `Select data for street defect requests or repairs using the toggle button. 
      Data for individual neighborhoods can be selected using the dropdown menu, or by 
      clicking on individual bars of the chart or specific areas of the map.`
    };
  },
  computed: {
    showReset() {
      return this.selectedHood !== null;
    },
    cardTitle() {
      let kind = this.capitalize(this.activeLayer);
      return `Street Defect ${kind} by Neighborhood`;
    },
    selectedHood() {
      return this.$store.state.selectedHood;
    }
  },
  methods: {
    resetFilter(val) {
      this.$refs.controlPanel.$refs.hoodDropdown.updateValue(null);
    },
    capitalize(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    setActiveLayer(val) {
      this.activeLayer = val;
    }
  }
};
</script>




