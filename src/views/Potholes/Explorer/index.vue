<template>
  <div class="pothole-explorer">
    <h2 class="section-title text-center">The Pothole Explorer</h2>

    <p class="text-left">
      The data for street defect repairs and requests is visualized below as
      part of an interactive dashboard highlighting trends over time and
      across different neighborhoods of the city. The charts and maps are
      fully reactive, allowing users to select specific neighborhoods or time
      periods and have each component of the dashboard update accordingly.
    </p>

    <!-- Dashboard  -->
    <div class="dashboard position-relative mt-5">
      <Loader v-if="isLoading"/>

      <!-- Totals Cards -->
      <TotalsCard :data="data"/>

      <!-- Repairs by Month -->
      <div class="row">
        <div class="col-md-12 col-sm-12">
          <RepairsByMonth class="h-100" :data="data"/>
        </div>
      </div>

      <!-- Neighborhood Card -->
      <div class="row mt-5">
        <div class="col-md-12 col-sm-12">
          <NeighborhoodCard class="h-100" :data="data"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TotalsCard from "@/views/Potholes/Explorer/TotalsCard.vue";
import RepairsByMonth from "@/views/Potholes/Explorer/RepairsByMonth.vue";
import NeighborhoodCard from "@/views/Potholes/Explorer/NeighborhoodCard";
import Loader from "@/components/Loader.vue";

export default {
  name: "PotholeExplorer",
  components: { TotalsCard, RepairsByMonth, NeighborhoodCard, Loader },
  data() {
    return { data: null, monthDimension: null, hoodDimension: null };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  created() {
    this.data = this.$store.state.data;
    if (!this.data) {
      this.$store.dispatch("fetchData").then(data => {
        this.data = data;
      });
    }
  }
};
</script>

