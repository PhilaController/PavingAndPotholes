<template>
  <!-- card body -->
  <div class="defects-map-body">
    <!-- basemap -->
    <l-map
      :options="mapOptions"
      :zoom="zoom"
      :bounds="bounds"
      ref="basemap"
      :style="`height: ${this.height}px; z-index: 1`"
      @click="selectNeighborhood"
    >
      <!-- tile layer -->
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

      <!-- neighborhoods -->
      <l-geo-json
        :geojson="geojson"
        ref="neighborhoods"
        :options-style="styleOptions"
        @mouseover="highlightFeature"
        @mouseout="resetStyle"
      ></l-geo-json>
    </l-map>
  </div>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import leafletPip from "@mapbox/leaflet-pip";
import * as d3 from "d3";

require("d3-hexbin");
require("@asymmetrik/leaflet-d3");

// Style the map when selecting specific zip codes
const highlightedStyle = {
  weight: 5,
  color: "#666",
  dashArray: "",
  opacity: 1,
  fillOpacity: 0
};
const unhighlightedStyle = {
  weight: 1,
  opacity: 0.5,
  color: "#666",
  dashArray: "",
  fillOpacity: 0
};

export default {
  name: "StreetDefectsMap",
  props: ["data", "height", "activeLayer"],
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data() {
    return {
      mapOptions: { minZoom: 11, maxZoom: 16 },
      zoom: 11,
      bounds: [[39.86747186, -75.28030675], [40.13793484, -74.95574856]],
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}@2x.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      styleOptions: () => {
        return unhighlightedStyle;
      },
      hexLayer: null,
      geojson: null,
      layerIDs: {},
      info: null,
      coords: { requests: null, repairs: null },
      homeBounds: null
    };
  },
  computed: {
    addHexBins() {
      return this.geojson && this.data;
    },
    title() {
      return this.capitalize(this.activeLayer);
    },
    dataSize() {
      return this.$store.state.dataSize;
    },
    highlightedHood() {
      return this.$store.state.highlightedHood;
    },
    selectedHood() {
      return this.$store.state.selectedHood;
    }
  },
  created() {
    // load the neighborhoods GeoJSON
    this.$store.dispatch("fetchFeatures").then(data => {
      this.geojson = data;
    });
    let vueComponent = this;

    // The tooltip for the map to show total count per hex bin
    function tooltip() {
      // Generate the tooltip
      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "hexbin-tooltip")
        .style("z-index", 9999)
        .style("pointer-events", "none")
        .style("visibility", "hidden")
        .style("position", "absolute");

      tooltip.append("div").attr("class", "tooltip-content");

      // Return the handler instance
      return {
        mouseover: function(hexLayer, data) {
          tooltip
            .style("visibility", "visible")
            .html(
              `${vueComponent.title}: ` +
                d3.format(",")(vueComponent.hexbinFunction(data))
            );

          tooltip
            .style("top", d3.event.pageY + 10 + "px")
            .style("left", d3.event.pageX + 10 + "px");
        },

        mouseout: function(hexLayer, data) {
          tooltip.style("visibility", "hidden").html();
        }
      };
    }

    // initialize the hexbin layer
    this.hexLayer = L.hexbinLayer({
      radius: 12,
      opacity: 0.8
    }).hoverHandler(
      L.HexbinHoverHandler.compound({
        handlers: [L.HexbinHoverHandler.resizeFill(), tooltip()]
      })
    );

    // set the colors cale
    let colorRange = [
      d3.interpolateReds(0.1),
      d3.interpolateReds(0.5),
      d3.interpolateReds(0.75),
      d3.interpolateReds(1)
    ];
    this.hexLayer.colorScale().range(colorRange);
    this.hexLayer
      .radiusRange([5, 10])
      .lng(function(d) {
        return d[0];
      })
      .lat(function(d) {
        return d[1];
      })
      .colorValue(function(d) {
        return vueComponent.hexbinFunction(d);
      })
      .radiusValue(function(d) {
        return vueComponent.hexbinFunction(d);
      });
  },
  mounted() {
    this.$nextTick(() => {
      // Control that shows state info on hover
      this.info = L.control();

      // Create info div to show selected zip code
      this.info.onAdd = function(map) {
        this._div = L.DomUtil.create("div", "info");
        this.update();
        return this._div;
      };

      // Specify update for info legend
      this.info.update = function(props) {
        if (props) {
          this._div.style.visibility = "visible";
          this._div.innerHTML =
            "<h4>Neighborhood</h4>" + "<b>" + props.hood + "</b>";
        } else {
          this._div.style.visibility = "hidden";
        }
      };
      this.info.addTo(this.$refs.basemap.mapObject);

      // set zoom home bounds
      this.homeBounds = this.$refs.basemap.mapObject.getBounds();

      // add a home button to the control bar
      let button = $(`<a class="leaflet-control-zoom-in" title="Reset Filters" role="button" aria-label="Reset Filters">
        <i class="fa fa-home" aria-hidden="true"></i>
        </a>`);
      button.on("click", () => {
        if (this.selectedHood)
          this.$store.commit("setValue", { key: "selectedHood", value: null });
        else this.zoomHome();
      });
      $(".defects-map-body .leaflet-control-zoom").append(button);

      // convert to svg
      if (window.FontAwesome) window.FontAwesome.dom.i2svg();

      // disable events when interacting with the control bar
      L.DomEvent.disableClickPropagation($(".leaflet-control-zoom")[0]);
      L.DomEvent.on($(".leaflet-control-zoom")[0], "mousemove", function(ev) {
        L.DomEvent.stopPropagation(ev);
      });
    });
  },
  watch: {
    activeLayer: function(val) {
      this.toggleHexbins();
    },
    addHexBins: function(val) {
      if (val) {
        this.$nextTick(() => {
          this.addHexLayer();
        });
      }
    },
    highlightedHood: function(val) {
      let geojson = this.$refs.neighborhoods.mapObject;
      geojson.eachLayer(layer => layer.setStyle(unhighlightedStyle));
      if (val) {
        var layer = geojson.getLayer(this.layerIDs[val]);
        layer.setStyle(highlightedStyle);
      }
    },
    geojson: function(val) {
      if (val) {
        let layerIDs = this.layerIDs;
        this.$nextTick(() => {
          let geojson = this.$refs.neighborhoods.mapObject;
          geojson.eachLayer(function(layer) {
            layerIDs[layer.feature.properties.hood] = layer._leaflet_id;
          });
          geojson.bringToFront();
        });
      }
    },
    dataSize: function(val) {
      if (this.data) {
        this.redrawHexbins();
      }
    },
    selectedHood: function(val) {
      this.zoomToHood(val);
    }
  },
  methods: {
    zoomToHood(hood) {
      // zoom to a specific neighborhood
      if (hood) {
        let geojson = this.$refs.neighborhoods.mapObject;
        let layer = geojson.getLayer(this.layerIDs[hood]);
        this.$refs.basemap.mapObject.flyToBounds(layer.getBounds());
      }
      // zoom to the home
      else this.zoomHome();
    },
    capitalize(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    zoomHome() {
      this.$refs.basemap.mapObject.flyToBounds(this.homeBounds);
    },
    redrawHexbins() {
      let coords = [];
      this.data.allFiltered().forEach(val => {
        if (this.activeLayer === "repairs") {
          if (val.kind === "order") coords.push([val.lng, val.lat, val.count]);
        } else {
          if (val.kind === "request") coords.push([val.lng, val.lat]);
        }
      });

      // Update the layer data
      this.hexLayer.data(coords);

      // save these coordinates
      this.coords[this.activeLayer] = coords;
    },
    toggleHexbins() {
      if (this.coords[this.activeLayer] === null) this.addHexLayer();
      else this.redrawHexbins();

      // update store
      this.$store.commit("setValue", {
        key: "mapVariable",
        value: this.activeLayer
      });
    },
    // set "selectedHood" in the Vuex store
    selectNeighborhood(event) {
      let geojson = this.$refs.neighborhoods.mapObject;
      let clickedLayers = leafletPip.pointInLayer(event.latlng, geojson);
      if (clickedLayers.length) {
        let layer = clickedLayers[0];
        var hood = layer.feature.properties.hood;
        let value;
        if (this.selectedHood === hood) value = null;
        else value = hood;

        // update the list of clicked features
        this.$store.commit("setValue", {
          key: "selectedHood",
          value: value
        });
      }
    },
    hexbinFunction(d) {
      if (this.activeLayer === "requests") {
        return d.length;
      } else {
        let cnt = 0;
        for (let i = 0; i < d.length; i++) cnt += d[i].o[2];
        return cnt;
      }
    },
    highlightFeature(event) {
      event.layer.setStyle(highlightedStyle);
      this.info.update(event.layer.feature.properties);
      // update store
      this.$store.commit("setValue", {
        key: "highlightedHood",
        value: event.layer.feature.properties.hood
      });
    },
    resetStyle(event) {
      event.layer.setStyle(unhighlightedStyle);
      this.info.update();

      this.$store.commit("setValue", {
        key: "highlightedHood",
        value: null
      });
    },
    onmousemove(event) {
      var latlng = event.latlng;
      let geojson = this.$refs.neighborhoods.mapObject;

      geojson.fireEvent("mouseout", {
        latlng: latlng,
        layerPoint: event.layerPoint,
        containerPoint: event.containerPoint,
        originalEvent: event.originalEvent,
        layer: geojson
      });

      // Use Mapbox Leaflet PIP (point in polygon) library.
      let layers = leafletPip.pointInLayer(latlng, geojson);
      layers.forEach(function(layer) {
        geojson.fireEvent("mouseover", {
          latlng: latlng,
          layerPoint: event.layerPoint,
          containerPoint: event.containerPoint,
          originalEvent: event.originalEvent,
          layer: layer
        });
      });
    },
    addHexLayer() {
      // Get coordinate pairs for each record
      let coords = [];
      this.data.allFiltered().forEach(val => {
        if (this.activeLayer === "repairs") {
          if (val.kind === "order") coords.push([val.lng, val.lat, val.count]);
        } else {
          if (val.kind === "request") coords.push([val.lng, val.lat]);
        }
      });

      // Update the layer data
      this.hexLayer.data(coords);
      this.coords[this.activeLayer] = coords;

      // Add to the overlay group
      this.hexLayer.addTo(this.$refs.basemap.mapObject);

      // hlight maps
      this.$refs.basemap.mapObject.on("mousemove", this.onmousemove);
    }
  }
};
</script>

<style>
.defects-map-body {
  padding: 0px !important;
  border: 3px solid #d4dadc;
}

.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
  font-size: 1rem;
}

/* Heat map hexbin */
.hexbin-hexagon {
  stroke: #000;
  stroke-width: 0.5px;
  pointer-events: none !important;
}

.hexbin-tooltip {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid black;
  background-color: white;
}
</style>