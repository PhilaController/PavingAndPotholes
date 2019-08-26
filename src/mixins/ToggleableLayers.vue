<script>
const esri = require("esri-leaflet");
const hash = require("object-hash");

const f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

export default {
  data() {
    return {
      isLoading: true,
      loadingStates: {}
    };
  },
  computed: {
    nParams() {
      return this.optionNames.length;
    },
    allOptions() {
      let key,
        args = [];
      for (let i = 0; i < this.nParams; i++) {
        key = this.optionNames[i];
        args.push(this.options[key].all);
      }

      args = cartesian.apply(null, args);
      return this.transformOptions(args);
    }
  },
  methods: {
    setLoading() {
      let key,
        q = [];
      for (let i = 0; i < this.allOptions.length; i++) {
        key = hash(this.allOptions[i]);
        q.push(this.loadingStates[key]);
      }
      return q.some(x => x);
    },
    transformOptions(values) {
      let x,
        out = [];

      if (this.nParams == 1) {
        values.forEach((value, i) => {
          x = {};
          x[this.optionNames[0]] = value;
          out.push(x);
        });
      } else {
        values.forEach((value, i) => {
          x = {};
          value.forEach((item, index) => {
            x[this.optionNames[index]] = item;
          });

          out.push(x);
        });
      }
      return out;
    },
    getActiveOptions() {
      let key,
        args = [];
      for (let i = 0; i < this.nParams; i++) {
        key = this.optionNames[i];
        args.push(this.options[key].active);
      }

      args = cartesian.apply(null, args);
      return this.transformOptions(args);
    },
    updateRadioState(key, value) {
      this.options[key].active = [value];
      this.updateLayers();
    },
    updateCheckboxState(key, value, flag) {
      if (flag) {
        this.options[key].active.push(value);
      } else {
        let index = this.options[key].active.indexOf(value);
        this.options[key].active.splice(index, 1);
      }
      this.updateLayers();
    },
    updateLayers() {
      let map = this.$refs.baseMap.mapObject;
      let layer;
      this.allOptions.forEach(option => {
        layer = this.getLayer(option);
        if (this.isActive(option)) {
          if (!map.hasLayer(layer)) {
            map.addLayer(layer);
            layer.setStyle(this.styleFunction); // set zoom style
          }
        } else {
          if (map.hasLayer(layer)) map.removeLayer(layer);
        }
      });
    },
    onEachFeatureFunction(feature, layer) {
      layer.bindTooltip(this.getTooltipText(layer.feature.properties), {
        permanent: false,
        sticky: true,
        opacity: 1.0
      });
    },
    styleFunction(feature) {
      return {
        weight: this.getWeightBasedOnZoom(),
        color: this.getColor(feature.properties)
      };
    },
    createLayer(state) {
      let whereClause = this.buildQuery(state);
      let key = hash(state);
      let layer = esri.featureLayer({
        url: this.layersURL,
        precision: 5,
        simplifyFactor: 0.5,
        where: whereClause,
        onEachFeature: this.onEachFeatureFunction,
        style: this.styleFunction
      });

      // when done loading, hide the spinner
      layer.on("loading", event => {
        this.loadingStates[key] = true;
        this.isLoading = this.setLoading();
      });
      layer.on("load", event => {
        this.loadingStates[key] = false;
        this.isLoading = this.setLoading();
      });

      return layer;
    },
    getLayer(state) {
      let baseMap = this.$refs.baseMap;
      let key = hash(state);

      if (!baseMap.layers[key]) {
        baseMap.layers[key] = this.createLayer(state);
      }

      return baseMap.layers[key];
    },
    buildQuery(state) {
      let q = [],
        all = [],
        key;
      for (let i = 0; i < this.nParams; i++) {
        key = this.optionNames[i];
        if (state[key] !== "All") q.push(`(${key} = '${state[key]}')`);
      }
      return q.join(" AND ");
    },
    isActive(state) {
      let key,
        q = [];
      for (let i = 0; i < this.nParams; i++) {
        key = this.optionNames[i];
        q.push(this.options[key].active.indexOf(state[key]) > -1);
      }
      return q.every(x => x);
    }
  },
  mounted() {
    this.$nextTick(() => {
      // the map
      let baseMap = this.$refs.baseMap;

      // create the active layers
      let activeOptions = this.getActiveOptions();
      let layer;
      activeOptions.forEach(option => {
        layer = this.getLayer(option);
        this.loadingStates[hash(option)] = true;
        baseMap.mapObject.addLayer(layer);
      });

      // remove labels while zooming
      baseMap.mapObject.on("zoomstart", () => {
        baseMap.mapObject.removeLayer(baseMap.layers.labels);
      });

      //  change stroke weight on zoom
      baseMap.mapObject.on("zoomend", () => {
        let activeOptions = this.getActiveOptions();
        let layer;
        activeOptions.forEach(option => {
          this.getLayer(option).setStyle(this.styleFunction);
        });

        // add labels back
        baseMap.mapObject.addLayer(baseMap.layers.labels);
      });
    });
  }
};
</script>
