<template>
  <div id="miles-paved-panel" class="card">
    <div class="card-header d-flex flex-column">
      <div class="my-card-title">Number of Miles Paved Annually Since 2013</div>
    </div>
    <div class="card-body">
      <div id="miles-paved-chart">
        <apexchart height="300" type="line" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
    <div
      class="card-footer"
    >Note: Paving by PennDOT for state-maintained roadways is excluded from the above totals.</div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Vue from "vue";
import { format } from "d3-format";
Vue.component("apexchart", VueApexCharts);

export default {
  data() {
    return {
      data: require("@/data/miles_paved.json"),
      chartOptions: {
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return `${format(".0f")(val)}`;
          },
          style: { fontSize: "22px" }
        },
        chart: {
          toolbar: {
            show: false
          }
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          },
          padding: { left: 25 }
        },
        markers: {
          size: 7,
          strokeColor: "#2176d2",
          colors: ["#ffffff"],
          strokeWidth: 4
        },
        tooltip: {
          enabled: false,
          style: { fontSize: "20px" },
          y: {
            formatter: function(val) {
              return `${format(".1f")(val)} miles`;
            }
          }
        },
        xaxis: {
          type: "categories",
          categories: [2013, 2014, 2015, 2016, 2017, 2018],
          labels: {
            style: { fontSize: "20px" }
          },
          crosshairs: { show: false }
        },
        yaxis: {
          decimalsInFloat: 0,
          labels: {
            style: { fontSize: "20px" }
          },
          min: 0,
          forceNiceScale: true
        },

        colors: ["#2176d2"]
      }
    };
  },
  computed: {
    series() {
      let toret = [];
      let series = {};
      series.name = "Miles Paved";
      series.data = this.data.map(x => x.total);
      toret.push(series);

      return toret;
    }
  }
};
</script>

<style scoped>
#miles-paved-chart {
  padding-right: 50px;
  padding-left: 50px;
}

@media only screen and (max-width: 600px) {
  #miles-paved-chart {
    padding-right: 0px;
    padding-left: 0px;
  }
  .card-body {
    padding: 0px;
  }
}

.card-body {
  padding-bottom: 0px;
}
</style>
