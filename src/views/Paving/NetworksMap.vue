<template>
  <div>
    <!-- Control Panel -->
    <div class="control-panel-wrapper flex-column flex-centered">
      <NetworkToggle
        ref="networkToggle"
        type="radio"
        :isLoading="isLoading"
        :inColor="true"
        :boldLabels="true"
        :actives="options.network.active"
        @change="toggleNetwork"
      />
    </div>

    <!-- Leaflet BaseMap -->
    <BaseMap :isLoading="isLoading" :height="550" id="networkStreetMap" ref="baseMap"/>
  </div>
</template>

<script>
import BaseMap from "@/components/BaseMap.vue";
import ToggleableLayers from "@/mixins/ToggleableLayers.vue";
import NetworkToggle from "@/components/NetworkToggle.vue";

export default {
  components: {
    BaseMap,
    NetworkToggle
  },
  mixins: [ToggleableLayers],
  data() {
    return {
      optionNames: ["network"],
      options: {
        network: {
          all: ["Local", "FAM", "PennDOT"],
          active: ["Local"]
        }
      },
      layersURL:
        "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Philadelphia_Street_Networks/FeatureServer/0"
    };
  },
  computed: {
    activeNetwork() {
      return this.options.network.active[0];
    }
  },
  methods: {
    toggleNetwork(network, flag) {
      this.updateRadioState("network", network);
    },
    getColor(props) {
      let name = props.network;
      return this.$refs.networkToggle.networks[name].color;
    },
    getWeightBasedOnZoom() {
      let currentZoom = this.$refs.baseMap.mapObject.getZoom();
      let weight;

      if (currentZoom > 13) weight = 5.5;
      else if (currentZoom > 12) weight = 3.5;
      else weight = 2.5;
      if (this.activeNetwork === "Local") weight -= 1;
      return weight;
    },
    getTooltipText(data) {
      return `<div class="font-weight-bold">${data.street}</div>`;
    }
  }
};
</script>

<style scoped>
#networkStreetMap {
  border: 3px solid #d4dadc;
}
.control-panel-wrapper {
  font-size: 1.1rem;
  background-color: #fafaf8;
  border: 3px solid #d4dadc;
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>
