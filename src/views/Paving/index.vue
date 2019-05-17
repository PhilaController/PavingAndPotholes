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
        of roadways, the maintenance for which is federally and locally funded and
        contracted out to private businesses by the City. Approximately 500 miles of
        roadways are maintained by the Commonwealth, called the PennDOT network.
      </p>

      <p>
        Roadways maintained by the Streets Department are divided into two networks: the
        local network, about 1,900 miles of roadways for which maintenance costs are
        funded by the City, and the FAM network, which is short for Federal Aid for
        Municipalities Highway Program. The FAM network is comprised of about 300 miles
        of roadways, the maintenance for which is federally and locally funded and
        contracted out to private businesses by the City. Approximately 500 miles of
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
        To maintain the integrity of the City’s roadways and meet national standards,
        131 miles of roadways should be paved annually.
        <router-link to="/" class="text-link">
          As discussed in the
          introduction
        </router-link>, this goal has been difficult for the Streets
        Department to meet, though progress has been made recently. The
        interactive map below shows which segments of the Local and FAM networks
        have been paved during calendar years 2013 to 2018. Paving data for
        state-maintained roadways is not currently available and is not shown on
        the map. Note that this map only presents historical data. For the
        latest information on the Streets Department's repaving work for the
        current calendar year, see the
        <a
          class="text-link"
          href="https://streetsmartphl.phila.gov/"
          target="_blank"
        >PavePHL tool</a>.
      </p>

      <!-- paving map -->
      <PavingMap class="mt-1"/>
    </div>

    <!-- Paving Costs-->
    <div class="paving-costs text-left mt-5">
      <h2 class="section-title text-center">Paving-Related Costs</h2>

      <p>The paving process is typically a five-week operation involving four main steps:</p>

      <ol>
        <li>
          <span class="font-weight-bold">Milling:</span> Private contractors are
          responsible for grinding off the top layer of asphalt from the surface of
          the road;
        </li>
        <li>
          <span class="font-weight-bold">Street Adjustments:</span> Utility manholes
          and castings are prepped and adjusted by contractors prior to
          the start of paving;
        </li>
        <li>
          <span class="font-weight-bold">Paving:</span> City paving crews apply a
          sticky, tar-like material, known as tack coat, to the milled road before
          laying down a new layer of asphalt, and;
        </li>
        <li>
          <span class="font-weight-bold">Line Striping:</span> City crews apply
          road surface markings to the newly paved roads.
        </li>
      </ol>

      <p>
        Most funding for paving comes from the Capital Fund, which manages
        resources for investing in facilities and infrastructure throughout the
        city. Capital Fund dollars are used to hire private contractors for the
        milling and adjustment steps described above and to purchase tack coat
        and asphalt for the paving step. Supplies for line striping, as well as
        payroll and overtime costs for paving personnel, are paid out of the
        General Fund, the City's main operating fund.
      </p>
      <p>
        The chart below shows paving-related costs per square yard paved for
        each year since 2013. The spending figures include both the Capital Fund
        and General Fund spending areas outlined above. It’s important to note
        the impact of a 2010 unfunded federal mandate requiring the installation
        of new ADA ramps wherever repaving occurs on repaving costs. Spending on
        ADA ramp upgrades accounted for more than half of the total spending
        during the 2014 paving program. However in 2015, the Streets Department
        reached an agreement to spend 20 percent of its Capital Budget funds on
        ramp upgrades. Since ADA ramp upgrades require a bid process for private
        contractors, the agreement has helped limit fluctuations in budgetary
        resources from year to year and contributed to the increased number of
        miles paved in more recent years.
      </p>

      <p>
        During calendar year 2017, the latest year with full data available,
        Capital Fund costs related to paving totaled $12.9 million, while General
        Fund costs totaled $5.4 million. With more than a million square yards of
        roadway paved, this spending translates to a cost of about $17 per square
        yard paved.
      </p>

      <p>
        When excluding the cost of ramp upgrades, the cost of paving has fluctuated
        modestly from year to year, but has typically remained in the range of $15 to
        $17 per square yard since 2013.
      </p>

      <!-- paving costs -->
      <div class="card">
        <div class="card-header d-flex flex-column">
          <div class="my-card-title">Paving Costs per Square Yard Paved</div>
        </div>
        <div class="card-body">
          <CostsChart/>
        </div>
        <div class="card-footer">* Paving costs estimated through July 1, 2018.</div>
      </div>
    </div>
  </div>
</template>

<script>
import PavingMap from "./PavingMap.vue";
import CostsChart from "./CostsChart.vue";
import NetworksMap from "./NetworksMap.vue";

export default {
  name: "PavingPage",
  components: {
    PavingMap,
    CostsChart,
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
