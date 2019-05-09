<template>
  <div>
    <div class="paving-legend flex-column flex-centered">
      <!-- Network Checkboxes -->
      <div class="flex-centered network-checkbox">
        <label class="mr-3 mt-2 font-weight-bold">Network Type:</label>
        <div class="flex-centered">
          <template v-for="(network, i) in networks">
            <div class="pretty p-default p-round" :key="i">
              <input
                type="checkbox"
                v-model="network.active"
                @change="toggleNetwork"
                :disabled="isLoading"
              >
              <div class="state">
                <label class="legend-label" :style="{ color: network.color }">{{ network.name }}</label>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- Year Slider -->
      <div class="flex-centered">
        <label class="mb-1 mr-3 font-weight-bold">Paving Calendar Year:</label>
        <Slider
          :values="years"
          :selected="activeYear"
          @change="setActiveYear"
          :disabled="isLoading"
        />
      </div>
    </div>

    <!-- Leaflet Map -->
    <div class="map-container" id="pavingMap">
      <l-map
        :options="mapOptions"
        :zoom="zoom"
        :bounds="bounds"
        ref="pavingBasemap"
        style="height: 550px; z-index: 1"
      >
        <loading
          :active.sync="isLoading"
          :is-full-page="false"
          :opacity="0.7"
          :z-index="999999"
          color="#2c3e50"
        ></loading>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";
import { LOCAL, FAM, STATE } from "@/colors";
import Slider from "@/components/Slider.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";

const esri = require("esri-leaflet");

export default {
  components: {
    LMap,
    LTileLayer,
    Slider,
    Loading
  },
  data() {
    return {
      mapOptions: { maxZoom: 17, minZoom: 11 },
      zoom: 11,
      bounds: [[39.86747186, -75.28030675], [40.13793484, -74.95574856]],
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      layers: {},
      years: [2013, 2014, 2015, 2016, 2017, 2018],
      activeYear: 2018,
      networks: {
        Local: { active: true, color: LOCAL, name: "City Local" },
        FAM: { active: true, color: FAM, name: "City FAM" }
        // PennDOT: { active: true, color: STATE, name: "PennDOT" }
      },
      isLoading: true,
      homeBounds: null
    };
  },
  computed: {
    featuresQuery() {
      let x,
        y = [];
      if (this.activeYear === 2018) x = "planned_2018 > 0 AND work_year = 0";
      else x = `work_year = ${this.activeYear}`;
      for (let name in this.networks) {
        if (this.networks[name].active) y.push(`network = '${name}'`);
      }
      return `${x} AND (${y.join(" OR ")})`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      let map = this.$refs.pavingBasemap.mapObject;

      // set zoom home bounds
      this.homeBounds = map.getBounds();

      // add a home button to the control bar
      let button = $(`<a class="leaflet-control-zoom-in" title="Recenter Map" role="button" aria-label="Recenter Map">
        <i class="fa fa-home" aria-hidden="true"></i>
        </a>`);
      button.on("click", this.zoomHome);
      $("#pavingMap .leaflet-control-zoom").append(button);

      // convert to svg
      if (window.FontAwesome) window.FontAwesome.dom.i2svg();

      // add labels tiles to their own pane
      map.createPane("labels");
      map.getPane("labels").style.zIndex = 650;
      map.getPane("labels").style.pointerEvents = "none";

      this.layers.labels = L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        {
          pane: "labels",
          updateWhenZooming: false
        }
      ).addTo(map);

      // add city limits
      this.layers.city_limits = esri
        .featureLayer({
          url:
            "http://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Limits/FeatureServer/0",
          style: () => {
            return { fill: false, color: "#2c3e50", weight: 4 };
          }
        })
        .addTo(map);

      // add network layers
      this.layers.streets = esri
        .featureLayer({
          url:
            "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Philadelphia_Paved_Streets/FeatureServer/0",
          precision: 5,
          simplifyFactor: 0.5,
          where: this.featuresQuery,
          onEachFeature: this.onEachFeatureFunction,
          style: feature => {
            return {
              weight: 2.5,
              color: this.networks[feature.properties.network].color
            };
          }
        })
        .addTo(map);

      // when done loading, hide the spinner
      this.layers.streets.on("load", event => {
        this.isLoading = false;
      });

      // remove labels while zooming
      map.on("zoomstart", () => {
        this.isLoading = true;
        map.removeLayer(this.layers.labels);
      });

      //  change stroke weight on zoom
      map.on("zoomend", () => {
        let currentZoom = map.getZoom();
        let weight;
        if (currentZoom < 12) weight = 2.5;
        else if (currentZoom < 14) weight = 3.5;
        else if (currentZoom > 13) weight = 5;

        this.layers.streets.setStyle(feature => {
          return {
            weight: weight,
            color: this.networks[feature.properties.network].color
          };
        });

        // add labels back
        map.addLayer(this.layers.labels);
        this.isLoading = false;
      });
    });
  },
  methods: {
    zoomHome() {
      this.$refs.pavingBasemap.mapObject.flyToBounds(this.homeBounds);
    },
    setActiveYear(year) {
      if (this.isLoading) return;
      this.activeYear = year;
      this.isLoading = true;
      this.layers.streets.setWhere(this.featuresQuery);
    },
    toggleNetwork(value) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.layers.streets.setWhere(this.featuresQuery);
    },
    getTooltipText(data) {
      let out = [];
      let keys = ["block_number", "work_year", "network", "planned_2018"];
      let key, value;

      let text = `<div class="tooltip-title">${data.street_name}</div>
                  <table class="w-100">
                  <tbody>`;
      for (let i = 0; i < keys.length; i++) {
        key = null;
        if (keys[i] === "work_year") {
          key = "Last Paved:";
          if (data.work_year > 0) value = data.work_year;
          else value = "Before 2013";
        } else if (keys[i] === "network") {
          key = "Network:";
          value = data.network;
        } else if (keys[i] === "planned_2018") {
          if (data.planned_2018 > 0) {
            key = "Planned for 2018?";
            value = "Yes";
          }
        } else if (keys[i] === "block_number" && data.block_number >= 0) {
          key = "Block";
          value = data.block_number;
        }
        if (key) {
          text += ` <tr class="tooltip-line">
                    <td class="line-header">${key}</td>
                    <td>${value}</td>
                  </tr>`;
        }
      }
      text += `</tbody>
              </table>`;
      return text;
    },
    onEachFeatureFunction(feature, layer) {
      layer.bindTooltip(this.getTooltipText(layer.feature.properties), {
        permanent: false,
        sticky: true,
        opacity: 1.0
      });
    },
    getLabel(value) {
      if (value === "FAM") return "FAM";
      else if (value === "STATE") return "PennDOT";
      else return "Local";
    }
  }
};
</script>

<style>
td {
  padding: 0 7px 0 7px;
}

.tooltip-line {
  border-bottom: 1px solid #f0f0f0;
}

.line-header {
  font-weight: bold;
  text-align: left;
}

.leaflet-tooltip {
  padding: 10px;
  font: 1rem sans-serif;
  background: #ffffff;
  border-radius: 8px;
  pointer-events: none;
  border: 1px solid #cdcdcd;
  opacity: 1;
  display: block;
  max-width: 300px;
}
.tooltip-title {
  margin-bottom: 5px;
  border-bottom: 1px solid #cdcdcd;
  text-align: center;
  font-weight: bold;
  padding-bottom: 5px;
}
.leaflet-tooltip-pane {
  z-index: 750 !important;
}

.paving-legend {
  font-size: 1.1rem;
  background-color: #fafaf8;
  border: 3px solid #d4dadc;
  padding-top: 1em;
  padding-bottom: 2em;
}
.legend-label {
  font-weight: bold !important;
}
#pavingMap,
.map-footer {
  border: 3px solid #d4dadc;
  font-size: 0.9rem;
}
</style>
