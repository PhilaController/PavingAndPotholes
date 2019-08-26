<template>
  <div>
    <!-- Colorbar Legend -->
    <Legend/>

    <!-- Control Panel -->
    <div class="control-panel-wrapper flex-column flex-centered">
      <NetworkToggle
        ref="networkToggle"
        type="checkbox"
        :isLoading="isLoading"
        :inColor="false"
        :boldLabels="false"
        :actives="options.network.active"
        @change="toggleNetwork"
      />
    </div>

    <!-- Leaflet BaseMap -->
    <BaseMap :isLoading="isLoading" :height="550" id="defectRatingMap" ref="baseMap"/>
  </div>
</template>

<script>
import Legend from "./Legend.vue";
import NetworkToggle from "@/components/NetworkToggle.vue";
import BaseMap from "@/components/BaseMap.vue";
import ToggleableLayers from "@/mixins/ToggleableLayers.vue";
import * as d3 from "d3";

export default {
  components: {
    BaseMap,
    Legend,
    NetworkToggle
  },
  mixins: [ToggleableLayers],
  data() {
    return {
      optionNames: ["network"],
      options: {
        network: {
          all: ["Local", "FAM", "PennDOT"],
          active: ["Local", "FAM", "PennDOT"]
        }
      },
      layersURL:
        "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Street_Defect_Rating/FeatureServer/0"
    };
  },
  computed: {
    scale() {
      return d3
        .scaleLinear()
        .domain([100, 0])
        .range([0, 1]);
    }
  },
  methods: {
    toggleNetwork(network, flag) {
      this.updateCheckboxState("network", network, flag);
    },
    getWeightBasedOnZoom() {
      let currentZoom = this.$refs.baseMap.mapObject.getZoom();
      if (currentZoom > 13) return 4;
      else if (currentZoom > 12) return 2.5;
      else return 2;
    },
    getColor(props) {
      return d3.interpolateRdYlGn(this.scale(props.rating));
    },

    getTooltipText(data) {
      let out = [];
      let keys = {
        network: { label: "Network", format: null },
        count_: { label: "Repairs Since 2013", format: d3.format(",.0f") },
        rating: {
          label: "Rating",
          format: x => d3.format(".0f")(x) + "%"
        }
      };
      let key, value, fmt;

      let text = `<div class="tooltip-title">${data.street}</div>
                  <table class="w-100">
                  <tbody>`;
      for (let key in keys) {
        fmt = keys[key].format;
        if (fmt) value = fmt(data[key]);
        else value = data[key];

        text += ` <tr class="tooltip-line">
                  <td class="tooltip-line-header">${keys[key].label}</td>
                <td>${value}</td>
                </tr>`;
      }
      text += `</tbody>
              </table>`;
      return text;
    }
  }
};
</script>

<style scoped>
#defectRatingMap {
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
