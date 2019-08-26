import Vue from "vue";
import Vuex from "vuex";
import { timeParse } from "d3-time-format";
import { min, max } from "d3-array";
import { json } from "d3-fetch";
let crossfilter = require("crossfilter2");

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
    mapVariable: "repairs", // the variable shown on the PotholeExplorer map
    globalStartDate: null, // start data for data
    globalEndDate: null // end date for data
  },
  actions: {
    fetchData(store) {
      let url =
        "https://s3.us-east-2.amazonaws.com/streets-data-release/data.json";

      return json(url).then(function(_) {
        _.forEach(function(d) {
          d["date"] = parseTime(d["date"]);
        });

        // set global start/end dates
        store.commit("setValue", {
          value: min(_.map(d => d.date)),
          key: "globalStartDate"
        });
        store.commit("setValue", {
          value: max(_.map(d => d.date)),
          key: "globalEndDate"
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
      let _ = require("@/data/PhillyNeighborhoods.json");
      store.commit("setValue", { value: _, key: "neighborhoodsJSON" });
      return _;
    }
  },
  mutations: {
    setValue(state, payload) {
      state[payload.key] = payload.value;
    }
  }
});
