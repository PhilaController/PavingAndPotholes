
<template>
  <div class="top-streets-table-wrapper">
    <div class="my-card-title">Top 10 Streets with the Most {{columnLabel}}</div>
    <div class="table-responsive">
      <table class="table table-striped top-streets-table table-sm"></table>
    </div>
  </div>
</template>

<script>
import "dc/dc.css";
import { descending } from "d3-array";
import { format } from "d3-format";
let dc = require("dc");

export default {
  name: "TopStreetsTable",
  props: ["data", "height"],
  data() {
    return {
      table: null
    };
  },
  watch: {
    data: function(val) {
      if (val) {
        this.updateTable();
      }
    },
    mapVariable: function(val) {
      this.table
        .dimension(this.getGroup())
        .columns([
          {
            label: "Street Name",
            format: function(d) {
              return d.key;
            }
          },
          {
            label: `Number of ${this.columnLabel}`,
            format: function(d) {
              return format(",")(d.value);
            }
          }
        ])
        .redraw();
    }
  },
  computed: {
    mapVariable() {
      return this.$store.state.mapVariable;
    },
    columnLabel() {
      let val = this.mapVariable;
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    dimension() {
      return this.data.dimension(d => d.street);
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
    updateTable() {
      this.table = dc.dataTable(".top-streets-table");
      this.table
        .dimension(this.getGroup())
        .size(10)
        .showSections(false)
        .columns([
          {
            label: "Street Name",
            format: function(d) {
              return d.key;
            }
          },
          {
            label: `Number of ${this.columnLabel}`,
            format: function(d) {
              return format(",")(d.value);
            }
          }
        ])
        .sortBy(function(d) {
          return d.value;
        })
        .order(descending);

      this.table.render();
    }
  }
};
</script>

<style>
td.dc-table-column._0 {
  width: 60% !important;
}
.dc-table-head {
  font-size: 1.3rem;
}
.dc-table-column {
  font-size: 1.1rem;
}
.top-streets-table {
  margin-bottom: 0rem !important;
}

.top-streets-table-wrapper {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}
.table-responsive {
  border: 3px solid #d4dadc;
}
</style>

