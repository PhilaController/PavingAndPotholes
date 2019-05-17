<template>
  <div class="map-container" ref="mapContainer">
    <l-map
      :options="mapOptions"
      :bounds="bounds"
      ref="baseMap"
      :style="`height: ${height}px; z-index: 1`"
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
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
const esri = require("esri-leaflet");

export default {
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    Loading
  },
  props: ["isLoading", "height"],
  data() {
    return {
      mapOptions: { maxZoom: 17, minZoom: 10, scrollWheelZoom: false },
      bounds: [[39.86747186, -75.28030675], [40.13793484, -74.95574856]],
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      homeBounds: null,
      layers: {}
    };
  },
  computed: {
    mapObject() {
      return this.$refs.baseMap.mapObject;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // set zoom home bounds
      this.homeBounds = this.mapObject.getBounds();

      // create a zoom to home button
      let zoomButton = $(`<a class="leaflet-control-zoom-in" title="Recenter Map" role="button" aria-label="Recenter Map">
        <i class="fa fa-home" aria-hidden="true"></i>
        </a>`);
      zoomButton.on("click", this.zoomHome);

      // add the button to the control
      let controlZoom = $(this.$refs.mapContainer).find(
        ".leaflet-control-zoom"
      );
      controlZoom.append(zoomButton);

      // convert home icon to svg
      if (window.FontAwesome) window.FontAwesome.dom.i2svg();

      // create a labels pane
      let labelsPane = this.mapObject.createPane("labels");
      labelsPane.style.zIndex = 650;
      labelsPane.style.pointerEvents = "none";

      // add labels
      this.layers.labels = L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        {
          pane: "labels"
        }
      ).addTo(this.mapObject);

      // add city limits
      this.layers.cityLimits = esri.featureLayer({
        url:
          "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Limits/FeatureServer/0",
        style: () => {
          return { fill: false, color: "#2c3e50", weight: 4 };
        },
        useCors: false
      });

      this.mapObject.addLayer(this.layers.cityLimits);
    });
  },
  methods: {
    zoomHome() {
      this.mapObject.flyToBounds(this.homeBounds);
    }
  }
};
</script>


