<template>
  <div>
    <!-- Control Panel -->
    <div class="control-panel-wrapper flex-column flex-centered" id="pavingControlPanel">
      <NetworkToggle
        ref="networkToggle"
        type="checkbox"
        :isLoading="isLoading"
        :inColor="true"
        :boldLabels="true"
        :exclude="['PennDOT']"
        :actives="options.network.active"
        @change="toggleNetwork"
      />

      <!-- Year Slider -->
      <div class="flex-centered paving-slider mb-2">
        <label class="mb-1 mr-3 font-weight-bold paving-slider-label">Paving Calendar Year</label>
        <Slider
          :values="options.year.all"
          :selected="activeYear"
          @change="setActiveYear"
          :disabled="isLoading"
          :width="sliderWidth"
        />
      </div>
    </div>

    <!-- Leaflet BaseMap -->
    <BaseMap :isLoading="isLoading" :height="550" id="pavingMap" ref="baseMap"/>
  </div>
</template>

<script>
import BaseMap from "@/components/BaseMap.vue";
import ToggleableLayers from "@/mixins/ToggleableLayers.vue";
import NetworkToggle from "@/components/NetworkToggle.vue";
import Slider from "@/components/Slider.vue";

const esri = require("esri-leaflet");

export default {
  components: {
    Slider,
    NetworkToggle,
    BaseMap
  },
  mixins: [ToggleableLayers],
  data() {
    return {
      sliderWidth: null,
      optionNames: ["network", "year"],
      options: {
        network: {
          all: ["Local", "FAM"],
          active: ["Local", "FAM"]
        },
        year: {
          all: [2013, 2014, 2015, 2016, 2017, 2018, "All"],
          active: ["All"]
        }
      },
      layersURL:
        "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Philadelphia_Paved_Streets/FeatureServer/0"
    };
  },
  computed: {
    activeYear() {
      return this.options.year.active[0];
    }
  },
  mounted() {
    this.$nextTick(() => {
      // set the width of the slider in the control panel
      let width = $("#pavingControlPanel")
        .parent()
        .width();
      if (width < 650) this.sliderWidth = 0.7 * width;
      else this.sliderWidth = Math.min(0.5 * width, 500);
    });
  },
  methods: {
    toggleNetwork(network, flag) {
      this.updateCheckboxState("network", network, flag);
    },
    setActiveYear(year, flag) {
      this.updateRadioState("year", year);
    },
    getWeightBasedOnZoom() {
      let currentZoom = this.$refs.baseMap.mapObject.getZoom();
      let weight;

      if (currentZoom > 13) weight = 5.5;
      else if (currentZoom > 12) weight = 3.5;
      else if (currentZoom > 11) weight = 3;
      else weight = 2.5;
      return weight;
    },
    getColor(props) {
      let name = props.network;
      return this.$refs.networkToggle.networks[name].color;
    },
    getTooltipText(data) {
      let out = [];
      let keys = ["network", "year"];
      let key, value;

      let text = `<div class="tooltip-title">${data.street}</div>
                  <table class="w-100">
                  <tbody>`;
      for (let i = 0; i < keys.length; i++) {
        key = null;

        if (keys[i] === "year") {
          key = "Year Paved";
          if (data.year > 0) value = data.year;
          else value = "Before 2013";
        } else if (keys[i] === "network") {
          key = "Network";
          value = data.network;
        } else if (keys[i] == "defects") {
          key = "Repairs Since 2013";
          value = data.defects || 0;
        }
        if (key) {
          text += ` <tr class="tooltip-line">
                    <td class="tooltip-line-header">${key}</td>
                    <td>${value}</td>
                  </tr>`;
        }
      }
      text += `</tbody>
              </table>`;
      return text;
    }
  }
};
</script>

<style scoped>
.control-panel-wrapper {
  font-size: 1.1rem;
  background-color: #fafaf8;
  border: 3px solid #d4dadc;
  padding-top: 1em;
  padding-bottom: 2em;
}

#pavingMap,
.map-footer {
  border: 3px solid #d4dadc;
  font-size: 0.9rem;
}

@media only screen and (max-width: 600px) {
  .paving-slider {
    flex-wrap: wrap;
  }
  .paving-slider-label {
    margin-top: 1rem;
  }
}
</style>
