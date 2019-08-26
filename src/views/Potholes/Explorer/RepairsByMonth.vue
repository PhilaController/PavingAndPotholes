
<template>
  <div class="card">
    <!-- The Card Title -->
    <CardHeader
      title="Street Defect Repairs by Month"
      :helpMessage="helpMessage"
      :onReset="resetFilter"
      :showReset="showFilterReset"
    />

    <!-- Body -->
    <div class="card-body">
      <!-- Time Filter Text -->
      <div class="time-filter-text text-left mb-3">
        <span class="font-weight-bold">Selected:</span>
        {{ timeFilterText }}
      </div>
      <!-- Monthly Chart -->
      <div id="monthly-repairs-chart"></div>
    </div>
  </div>
</template>

<script>
import CardHeader from "@/components/CardHeader.vue";
import "dc/dc.css";
let dc = require("dc");
import * as d3 from "d3";
import d3Tip from "d3-tip";

export default {
  props: ["data"],
  components: { CardHeader },
  data() {
    return {
      timeFilterText: null,
      showFilterReset: false,
      minDate: null,
      maxDate: null,
      chart: null,
      helpMessage: `Click and drag the brush filter
        to select a specific time period to view.`
    };
  },
  created() {
    // update state
    this.updateDateFilterState([this.minDate, this.maxDate]);
  },
  computed: {
    dimension() {
      return this.data.dimension(d => d3.timeMonth(d.date));
    }
  },
  watch: {
    data: function(val) {
      if (val) {
        // set min/max Date
        this.minDate = this.$store.state.globalStartDate;
        this.maxDate = this.$store.state.globalEndDate;

        // draw Chart
        this.drawChart();
      }
    }
  },
  methods: {
    updateDateFilterState(values) {
      // set the date filter min
      this.$store.commit("setValue", {
        key: "dateFilterMin",
        value: values[0]
      });
      // set the date filter max
      this.$store.commit("setValue", {
        key: "dateFilterMax",
        value: values[1]
      });
    },
    resetFilter(val) {
      this.chart.filterAll();
      this.chart.filter([this.minDate, this.maxDate]);
      dc.redrawAll();
      this.showFilterReset = false;
    },
    setTimeFilter(chart) {
      let filters = chart.filters();
      let range;
      if (filters.length) range = filters[0];
      else range = [this.minDate, this.maxDate];

      let format = d3.timeFormat("%b %Y");
      this.timeFilterText = `${format(range[0])} to ${format(range[1])}`;
      this.updateDateFilterState(range);
    },
    drawChart() {
      // initialize the charts
      this.chart = dc.barChart("#monthly-repairs-chart");

      let width = $(window).width();
      let marginLeft = width > 500 ? 70 : 40;
      let xTicks = width > 500 ? 16 : 2;

      // set the options
      this.chart
        .useViewBoxResizing(true)
        .margins({ left: marginLeft, top: 0, right: 10, bottom: 40 })
        .x(d3.scaleTime().domain([this.minDate, this.maxDate]))
        .xUnits(d3.timeMonths)
        .elasticY(true)
        .brushOn(true)
        .yAxisPadding("10%")
        .dimension(this.dimension)
        .group(this.dimension.group().reduceSum(d => d.count))
        .renderTitle(false)
        .barPadding(0.5)
        .colors("#96c9ff");

      this.chart
        .yAxis()
        .ticks(8)
        .tickFormat(function(d) {
          if (d >= 1e3) {
            return d3.formatPrefix(",.0", 1e3)(d);
          } else return d;
        });

      // change x axis tick
      this.chart
        .xAxis()
        .ticks(xTicks)
        .tickFormat(function(date) {
          if (d3.timeYear(date) < date) {
            return d3.timeFormat("%b")(date);
          } else {
            return d3.timeFormat("%Y")(date);
          }
        });

      // set the time filter initially
      this.setTimeFilter(this.chart);

      // filter behavior
      this.chart.on("filtered", chart => {
        // update the "Selected: " text
        this.setTimeFilter(chart);

        // whether to show the reset filter button
        let filters = this.chart.filters();
        let range;
        if (filters.length) range = filters[0];
        else range = [this.minDate, this.maxDate];

        if (range[0] > this.minDate || range[1] < this.maxDate)
          this.showFilterReset = true;
        else this.showFilterReset = false;
      });

      // render the chart
      this.chart.render();

      // bold the years
      this.chart
        .selectAll(".axis.x .tick > text")
        .style("font-weight", function(d) {
          if (d.getMonth() === 0) return "bold";
          else return "normal";
        });

      // reset the filter initially
      this.resetFilter();
    }
  }
};
</script>

<style>
#monthly-repairs-chart {
  width: 100%;
  height: 250px;
}
/* set the time filter selection */
.dc-chart .brush rect.selection {
  fill: #444 !important;
}
</style>


