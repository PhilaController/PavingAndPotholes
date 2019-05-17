
<template>
  <div class="row">
    <!-- Total Repairs -->
    <div class="col-lg-4 col-md-4 col-sm-12 mb-4">
      <div class="card total-repairs-panel h-100">
        <div class="card-header">
          <div class="my-card-title">Total Repairs</div>
        </div>
        <div class="card-body flex-centered">
          <div class="number" id="totalRepairs"></div>
        </div>
      </div>
    </div>

    <!-- Total Requests -->
    <div class="col-lg-4 col-md-4 col-sm-12 mb-4">
      <div class="card total-requests-panel h-100">
        <div class="card-header">
          <div class="my-card-title">Total Requests</div>
        </div>
        <div class="card-body flex-centered">
          <div class="number" id="totalRequests"></div>
        </div>
      </div>
    </div>

    <!-- Date Range -->
    <div class="col-lg-4 col-md-4 col-sm-12 mb-4">
      <div class="card total-repairs-panel h-100">
        <div class="card-header">
          <div class="my-card-title">Date Range</div>
        </div>
        <div class="card-body flex-centered">
          <div class="date-range">
            <div class="date-limit">{{ minDateText }}</div>
            <div>to</div>
            <div class="date-limit">{{ maxDateText }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "dc/dc.css";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
let dc = require("dc");

export default {
  name: "SummaryCards",
  props: ["data"],
  data() {
    return {
      requests: null,
      repairs: null
    };
  },
  watch: {
    data: function(val) {
      if (val) {
        this.updateNumbers();
      }
    }
  },
  computed: {
    minDate() {
      return this.$store.state.dateFilterMin;
    },
    maxDate() {
      return this.$store.state.dateFilterMax;
    },
    minDateText() {
      let f = timeFormat("%b %Y");
      return f(this.minDate);
    },
    maxDateText() {
      let f = timeFormat("%b %Y");
      return f(this.maxDate);
    },
    group() {
      return this.data.groupAll().reduce(
        function(p, v) {
          ++p.n;
          p.tot += v.count;
          return p;
        },
        function(p, v) {
          --p.n;
          p.tot -= v.count;
          return p;
        },
        function() {
          return { n: 0, tot: 0 };
        }
      );
    }
  },
  methods: {
    updateNumbers() {
      this.requests = dc.numberDisplay("#totalRequests");
      this.repairs = dc.numberDisplay("#totalRepairs");

      this.requests
        .formatNumber(format(",d"))
        .valueAccessor(function(d) {
          return d.n;
        })
        .group(this.group);

      // Total repairs
      this.repairs
        .formatNumber(format(",d"))
        .valueAccessor(function(d) {
          return d.tot;
        })
        .group(this.group);

      this.requests.render();
      this.repairs.render();
    }
  }
};
</script>

<style scoped>
.total-requests-panel {
  flex: 1;
}
.total-repairs-panel {
  flex: 1;
}

.number {
  font-weight: 500;
  font-size: 3rem;
}

.date-limit {
  font-weight: 500;
  font-size: 2rem;
}

.date-range {
  font-weight: 500;
  font-size: 1.5rem;
}
</style>

