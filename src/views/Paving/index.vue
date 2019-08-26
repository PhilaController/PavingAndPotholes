<template>
  <div class="paving-page">
    <!-- Paving  Responsibilities -->
    <div class="who-paves text-left">
      <h2 class="section-title text-center">Paving Responsibilities</h2>
      <p>
        Roadways maintained by the Streets Department are divided into two networks: the
        local network, about 1,900 miles of roadways for which maintenance costs are
        funded by the City, and the FAM network, which is short for Federal Aid for
        Municipalities Highway Program. The FAM network is comprised of about 300 miles
        of roadways, the maintenance for which is contracted out to private businesses
        by the City and federally and locally funded. Approximately 500 miles of
        roadways are maintained by the Commonwealth, called the PennDOT network.
      </p>

      <p>
        The three main street networks, Local, FAM, and PennDOT, are shown in an
        interactive format below.
      </p>

      <!-- Networks Map -->
      <NetworksMap/>
    </div>

    <!-- Paving History -->
    <div class="paving-history text-left mt-5">
      <h2 class="section-title text-center">Six Years of City Paving</h2>

      <p>
        The interactive map below shows which segments of the Local and FAM
        networks have been paved between calendar years 2013 and 2018. Paving
        data for state-maintained roadways is not currently available and is not
        shown on the map. For more information on the paving process, see the
        Street Department's
        <a
          href="https://philadelphiastreets.com/images/uploads/documents/2019_Paving_Program_Booklet_Final_-_OIT2.pdf"
          target="_blank"
          class="text-link"
        >2019 paving program and list</a>.
      </p>

      <!-- paving map -->
      <PavingMap class="mt-1"/>
    </div>
  </div>
</template>

<script>
import PavingMap from "./PavingMap.vue";
import NetworksMap from "./NetworksMap.vue";

export default {
  name: "PavingPage",
  components: {
    PavingMap,
    NetworksMap
  }
};
</script>

<style scoped>
.card-body {
  padding-bottom: 0px;
}
.vue-affix {
  width: 300px;
  z-index: 100000;
}
</style>
