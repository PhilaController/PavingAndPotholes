<template>
  <div>
    <div class="potholes-text text-left">
      <p>
        The Streets Department provided the Controller's Office with data for
        nearly 200,000 street defect requests and 270,000 repairs that occurred
        between January 1, 2013 and July 1, 2018. Below, we visualize these
        datasets with the
        <em>Pothole Explorer</em>, an interactive dashboard highlighting trends
        over time and across different neighborhoods of the city. The charts and
        maps are fully reactive, allowing users to select specific neighborhoods
        or time periods and have each component of the dashboard update
        accordingly.
      </p>

      <p>
        The data includes both the requests for street defect repairs that were
        received by the Streets Department and the subsequent repairs that were
        performed. Residents can report street defects by calling 311, 215-686-5560,
        <a
          href="https://www.philadelphiastreets.com/forms/philly_311?form_id=4133"
          target="blank_"
        >filling out an online form</a>, or by using the 311 mobile app.
      </p>
      <p>
        There is not a
        one-to-one relationship between requests and repairs, as some street
        defects are reported multiple times to the Streets Department and others
        are not reported at all. So, while certain areas of the city tend to
        report street defects more often than other areas, the repairs performed
        tend to be more evenly distributed throughout the city.
      </p>

      <h3>Quick Facts</h3>
      <ul>
        <li>
          Street defects come in
          <a
            href="https://www.philadelphiastreets.com/highways/potholes/"
            target="_blank"
          >several different flavors</a>. The majority, about 80
          percent, are potholes. The remaining amount are classified as cave-ins
          and utility ditches, which are generally more complicated to fix and
          can require additional work from a utility company.
        </li>
        <li>
          Not all repairs are the responsibility of the Streets Department. For example,
          defects near trolley lines must be repaired by SEPTA and defects on state-maintained
          roadways are fixed by PennDOT. These types of requests are automatically forwarded
          to the correct agency by the Streets Department.
        </li>
        <li>About 90 percent of reported potholes are repaired within 3 business days.</li>
        <li>
          Repairs typically peak during January, February, and March,
          as the freeze and thaw cycle of winter and spring is a significant contributor
          to the formation of new potholes.
        </li>
        <li>
          Weather is the driving factor behind the fluctuations in the number
          of potholes each year. The overall health of the streets network, affected by
          the number of miles paved annually, also impacts the number of potholes that
          occur each year.
        </li>
      </ul>
    </div>

    <!-- Main content -->
    <div class="pothole-explorer">
      <h2 class="section-title text-center">Pothole Explorer</h2>

      <!-- Show a loader  -->
      <Loader v-if="isLoading"/>
      <div v-if="!isLoading" class="pothole-dashboard">
        <!-- Summary Cards -->
        <div class="row">
          <div class="col-md-12 col-sm-12">
            <SummaryCards :data="data"/>
          </div>
        </div>

        <!-- Repairs by Month -->
        <div class="row">
          <div class="col-md-12 col-sm-12">
            <RepairsByMonth class="h-100" :data="data"/>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col-md-12 col-sm-12">
            <NeighborhoodsCard class="h-100" :data="data"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import RepairsByMonth from "@/cards/RepairsByMonth.vue";
import SummaryCards from "@/cards/SummaryCards.vue";
import NeighborhoodsCard from "@/cards/NeighborhoodsCard.vue";

export default {
  name: "Potholes",
  components: {
    RepairsByMonth,
    SummaryCards,
    Loader,
    NeighborhoodsCard
  },
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
<style>
.hex-map-component {
  flex: 1;
}
.top-streets-component {
  flex: 1;
}

.row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
}
.row > [class*="col-"] {
  display: flex;
  flex-direction: column;
}
</style>



