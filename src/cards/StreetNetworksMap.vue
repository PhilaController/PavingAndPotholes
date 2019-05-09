<template>
  <div>
    <div class="legend flex-column flex-centered">
      <!-- Network Checkboxes -->
      <div class="flex-centered network-checkbox">
        <label class="mr-3 mt-1 font-weight-bold">Network Type:</label>
        <div class="flex-centered">
          <template v-for="network in networks">
            <div class="pretty p-default p-round" :key="network">
              <input
                type="radio"
                v-model="activeNetwork"
                @change="toggleNetwork"
                :value="network"
                :disabled="isLoading"
              >
              <div class="state">
                <label
                  class="legend-label"
                  :style="{ color: colors[network] }"
                >{{ labels[network] }}</label>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Leaflet Map -->
    <div class="map-container" id="networkStreetMap">
      <l-map
        :options="mapOptions"
        :zoom="zoom"
        :bounds="bounds"
        ref="streetNetworkBasemap"
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
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import { LOCAL, FAM, STATE } from "@/colors";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";

const esri = require("esri-leaflet");

export default {
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    Loading
  },
  data() {
    return {
      mapOptions: { maxZoom: 17, minZoom: 11, updateInterval: 500 },
      zoom: 11,
      bounds: [[39.86747186, -75.28030675], [40.13793484, -74.95574856]],
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      layers: {},
      networks: ["Local", "FAM", "PennDOT"],
      activeNetwork: "Local",
      colors: { Local: LOCAL, FAM: FAM, PennDOT: STATE },
      labels: { Local: "City Local", FAM: "City FAM", PennDOT: "PennDOT" },
      isLoading: true,
      homeBounds: null
    };
  },
  computed: {
    featuresQuery() {
      return `network = '${this.activeNetwork}'`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      let map = this.$refs.streetNetworkBasemap.mapObject;

      // set zoom home bounds
      this.homeBounds = map.getBounds();

      // add a home button to the control bar
      let button = $(`<a class="leaflet-control-zoom-in" title="Recenter Map" role="button" aria-label="Recenter Map">
        <i class="fa fa-home" aria-hidden="true"></i>
        </a>`);
      button.on("click", this.zoomHome);
      $("#networkStreetMap .leaflet-control-zoom").append(button);

      // convert to svg
      if (window.FontAwesome) window.FontAwesome.dom.i2svg();

      // add labels tiles to their own pane
      let labelsPane = map.createPane("labels");
      labelsPane.style.zIndex = 650;
      labelsPane.style.pointerEvents = "none";
      this.layers.labels = L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        {
          attribution: "©OpenStreetMap, ©CartoDB",
          pane: "labels"
        }
      ).addTo(map);

      // add highway districts
      this.layers.city_limits = esri
        .featureLayer({
          url:
            "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Limits/FeatureServer/0",
          style: () => {
            return { fill: false, color: "#2c3e50", weight: 4 };
          }
        })
        .addTo(map);

      // add network layers
      this.layers.streets = esri
        .featureLayer({
          url:
            "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Philadelphia_Street_Networks/FeatureServer/0",
          precision: 5,
          simplifyFactor: 0.5,
          where: this.featuresQuery,
          onEachFeature: this.onEachFeatureFunction,
          style: feature => {
            return {
              weight: this.activeNetwork === "Local" ? 1.5 : 2.5,
              color: this.colors[feature.properties.network],
              opacity: 1.0
            };
          }
        })
        .addTo(map);

      // when done loading, hide the spinner
      this.layers.streets.on("loading", event => {
        this.isLoading = true;
      });
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
        if (this.activeNetwork === "Local") {
          if (currentZoom <= 12) weight = 1.5;
          else if (currentZoom == 13) weight = 2.5;
          else if (currentZoom > 13) weight = 5.5;
        } else {
          if (currentZoom < 12) weight = 2.5;
          else if (currentZoom < 14) weight = 3.5;
          else if (currentZoom > 13) weight = 5.5;
        }

        if (this.activeLayer === "Local") weight -= 1;

        this.layers.streets.setStyle(feature => {
          return {
            weight: weight,
            color: this.colors[feature.properties.network],
            opacity: 1.0
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
      this.$refs.streetNetworkBasemap.mapObject.flyToBounds(this.homeBounds);
    },
    toggleNetwork(value) {
      this.isLoading = true;
      this.layers.streets.setWhere(this.featuresQuery);
    },
    getTooltipText(data) {
      return `<div class="network-tooltip-title">${data.street_name}</div>`;
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
.network-tooltip-title {
  text-align: center;
  font-weight: bold;
}
#networkStreetMap {
  border: 3px solid #d4dadc;
}
.legend {
  font-size: 1.1rem;
  background-color: #fafaf8;
  border: 3px solid #d4dadc;
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>
