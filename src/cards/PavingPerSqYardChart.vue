<template>
  <div id="paving-costs-chart">
    <apexchart height="300" type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Vue from "vue";

export default {
  data() {
    return {
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
          fontSize: "20px",
          markers: { width: 15, height: 15, radius: 10 }
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
        theme: {
          palette: "palette3" // upto palette10
        },
        xaxis: {
          categories: [2013, 2014, 2015, 2016, 2017, "2018*"],
          labels: {
            style: { fontSize: "20px" }
          }
        },
        yaxis: {
          decimalsInFloat: 0,
          labels: {
            style: { fontSize: "20px" },
            formatter: function(y) {
              return "$" + y;
            }
          },
          title: {
            text: "Costs Per Sq. Yard Paved",
            style: { fontSize: "18px", cssClass: "font-weight-bold" }
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          style: { fontSize: "20px" },
          y: {
            formatter: function(val) {
              return "$ " + val;
            }
          }
        }
      },
      series: [
        {
          name: "Excluding ADA Ramps",
          data: [10.4, 14.38, 18.92, 14.93, 17.18, 17.44]
        },
        {
          name: "Including ADA Ramps",
          data: [12.07, 32.51, 23.53, 18.86, 17.26, 17.44]
        }
      ]
    };
  }
};
</script>

<style scoped>
#paving-costs-chart {
  padding-right: 50px;
  padding-left: 50px;
}
</style>