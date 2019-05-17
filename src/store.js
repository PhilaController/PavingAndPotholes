import Vue from "vue";
import Vuex from "vuex";
import { timeParse } from "d3-time-format";
let crossfilter = require("crossfilter2");
import axios from "axios";

Vue.use(Vuex);
const parseTime = timeParse("%Y-%m-%d %H:%M:%S");

export default new Vuex.Store({
  state: {
    data: null, // repairs / request data for PotholeExplorer
    dataSize: null, // size of the currently filtered data
    isLoading: true, // whether data is loading
    neighborhoodsJSON: null, // the neighborhoods GeoJSON
    highlightedHood: null, // the currently highlighted neighborhood
    selectedHood: null, // the currently selected neighborhood
    dateFilterMin: null, // the min date selected
    dateFilterMax: null, // the max data selected
    mapVariable: "repairs" // the variable shown on the PotholeExplorer map
  },
  actions: {
    fetchData(store) {
      let url =
        "https://s3.us-east-2.amazonaws.com/streets-data-release/data.json";

      // return axios.get(url).then(function({ data: _ }) {
      return import("@/data/street_defects.json").then(function({
        default: _
      }) {
        _.forEach(function(d) {
          d["date"] = parseTime(d["date"]);
        });

        // create a crossfilter  object
        _ = crossfilter(_);

        // commit the initial size
        store.commit("setValue", { value: _.size(), key: "dataSize" });

        // reset the size on change
        _.onChange((x, i) => {
          store.commit("setValue", {
            value: _.allFiltered().length,
            key: "dataSize"
          });
        });

        // store it
        store.commit("setValue", { value: false, key: "isLoading" });
        store.commit("setValue", { value: _, key: "data" });
        return _;
      });
    },
    fetchNeighborhoods(store) {
      return import("@/data/PhillyNeighborhoods.json").then(function({
        default: _
      }) {
        store.commit("setValue", { value: _, key: "neighborhoodsJSON" });
        return _;
      });
    }
  },
  mutations: {
    setValue(state, payload) {
      state[payload.key] = payload.value;
    }
  }
});
