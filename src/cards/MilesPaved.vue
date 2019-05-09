<template>
  <div id="miles-paved-panel" class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div class="my-card-title">Annual Paving Miles for the City Local & FAM Networks</div>
    </div>
    <div class="card-body">
      <div id="miles-paved-chart">
        <apexchart height="300" type="bar" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Vue from "vue";
import { format } from "d3-format";
import { LOCAL, FAM } from "@/colors";
Vue.component("apexchart", VueApexCharts);

export default {
  data() {
    return {
      data: require("@/data/miles_paved.json"),
      networks: ["Local", "FAM"],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%"
          }
        },
        legend: {
          show: true,
          position: "top",
          containerMargin: {
            top: 30
          },
          fontSize: "22px",
          markers: { width: 20, height: 20, radius: 10 }
        },
        chart: {
          selection: {
            enabled: false
          }
        },
        states: {
          hover: {
            filter: {
              type: "none"
            }
          }
        },
        tooltip: {
          style: { fontSize: "20px" },
          y: {
            formatter: function(val) {
              return `${format(".1f")(val)} miles`;
            }
          }
        },
        xaxis: {
          categories: [2013, 2014, 2015, 2016, 2017, 2018],
          labels: {
            style: { fontSize: "20px" }
          }
        },
        yaxis: {
          decimalsInFloat: 0,
          labels: {
            style: { fontSize: "20px" }
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: [LOCAL, FAM]
      }
    };
  },
  computed: {
    series() {
      let toret = [];
      let series;
      for (let i = 0; i < this.networks.length; i++) {
        series = {};
        series.name = `City ${this.networks[i]}`;
        series.data = this.data
          .filter(x => x.network === this.networks[i])
          .map(x => x.total);
        toret.push(series);
      }

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
.card-body {
  padding-bottom: 0px;
}
</style>
