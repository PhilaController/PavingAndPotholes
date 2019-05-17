
<template>
  <div>
    <div class="xaxis-label font-weight-bold">Number of {{xAxisLabel}}</div>
    <div id="hood-repairs-chart"></div>
  </div>
</template>

<script>
import "dc/dc.css";
let dc = require("dc");
import * as d3 from "d3";
import d3Tip from "d3-tip";

// Keep track of the original ordering of row charts
function save_first_order() {
  let original_value = {};
  return function(chart) {
    chart
      .group()
      .all()
      .forEach(function(kv) {
        original_value[kv.key] = kv.value;
      });
    chart.ordering(function(kv) {
      return -original_value[kv.key];
    });
  };
}

export default {
  props: ["data", "height"],
  data() {
    return {
      chart: null,
      defaultColor: "#96c9ff",
      ordering: {}
    };
  },
  watch: {
    data: function(val) {
      if (val) {
        this.drawChart();
      }
    },
    selectedHood: function(val) {
      // filter for a specific neighborhood
      if (val) {
        this.chart.replaceFilter([val]);
      } else {
        this.chart.filterAll();
      }
      dc.redrawAll(); // redraw all the charts
    },
    mapVariable: function(val) {
      this.chart.group(this.getGroup()).redraw();
    }
  },
  computed: {
    dimension() {
      return this.data.dimension(d => d.hood);
    },
    highlightedHood() {
      return this.$store.state.highlightedHood;
    },
    selectedHood() {
      return this.$store.state.selectedHood;
    },
    mapVariable() {
      return this.$store.state.mapVariable;
    },
    xAxisLabel() {
      let val = this.mapVariable;
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  methods: {
    getGroup() {
      if (this.mapVariable === "requests")
        return this.dimension
          .group()
          .reduceSum(d => (d.kind == "request" ? 1 : 0));
      else return this.dimension.group().reduceSum(d => d.count);
    },
    drawChart() {
      // initialize the chart
      this.chart = dc.rowChart("#hood-repairs-chart");

      // set the options
      this.chart
        .height(this.height)
        .useViewBoxResizing(true)
        .margins({ left: 10, top: 30, right: 10, bottom: 0 })
        .renderTitle(false)
        .dimension(this.dimension)
        .group(this.getGroup())
        .x(d3.scaleLinear())
        .elasticX(true)
        .colors(this.defaultColor)
        .on("postRender", save_first_order()) // save first order
        .xAxis(d3.axisTop());

      this.chart
        .xAxis()
        .ticks(4)
        .tickFormat(function(d) {
          if (d >= 1e3) {
            return d3.formatPrefix(",.0", 1e3)(d);
          } else return d;
        });

      // when the bar is clicked update the state
      this.chart.on("renderlet.barclicker", (chart, filter) => {
        chart.selectAll("g.row").on("click.custom", d => {
          let value;
          if (this.selectedHood === d.key) value = null;
          else value = d.key;
          this.$store.commit("setValue", {
            key: "selectedHood",
            value: value
          });
        });
      });

      // add a tooltip
      let tip = d3Tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(p => {
          return `<div>${p.key}</div>
                  <div>${this.xAxisLabel}: ${d3.format(",")(p.value)}</div>`;
        });

      // move the x-axis to the top
      this.chart.on("pretransition", function(chart) {
        chart.select("g.axis").attr("transform", "translate(0,0)");
        chart.selectAll("line.grid-line").attr("y2", chart.effectiveHeight());
      });

      // set mouse behaviors
      let v = this;
      this.chart.on("pretransition.add-tip", function(chart) {
        chart
          .selectAll("rect")
          .call(tip)
          .on("mouseover", function(d) {
            tip.show(d, this);
            v.$store.commit("setValue", {
              key: "highlightedHood",
              value: d.key
            });
          })
          .on("mouseout", function(d) {
            tip.hide(d, this);
            v.$store.commit("setValue", {
              key: "highlightedHood",
              value: null
            });
          });
      });

      // render the chart
      this.chart.render();

      // save the ordering
      this.chart.selectAll("rect").each((d, i) => {
        this.ordering[d.key] = i;
      });
    }
  }
};
</script>

<style>
#hood-repairs-chart {
  width: 100%;
}
#hood-repairs-chart text {
  pointer-events: none;
}

text.row {
  fill: #2c3e50 !important;
  font-size: 0.9rem !important;
}

.dc-chart .tick text {
  font-size: 0.9rem;
}
.xaxis-label {
  font-size: 1.1rem;
}
</style>


