<template>
  <div>
    <DotNavbar selector=".section-title"/>
    <div class="paving text-left">
      <!-- Paving Responsibilities -->
      <h2 class="section-title text-center">Paving Responsibilities</h2>
      <p>
        There are several agencies responsible for the management and maintenance
        of Philadelphia's streets network, which is composed of nearly 2,800 miles
        of roadways. Below, we outline these main network types, the agency responsible
        for paving, and the source of funding for paving-related work.
      </p>

      <p>
        The majority of the city's roads, about 80 percent, are maintained by
        the Transportation Division of the Streets Department. A portion of
        these routes, about 300 miles, are funded through the Federal Aid for
        Municipalities (FAM) Highway Program, in which 80 percent of funds are
        provided by the federal government and the City provides the remaining
        20 percent. Paving-related work for FAM streets is contracted out by the
        City to private companies. The remaining set of roads managed by the
        Streets Department is known as the Local network, and these streets are
        fully funded through local City funds. There is also about 500 miles of
        state-maintained highways within Philadelphia's city limits that are
        paved by the Pennsylvania Department of Transportation (PennDOT).
      </p>
      <p>
        The three main street networks, Local, FAM, and PennDOT, can be explored
        interactively in the map below.
      </p>

      <!-- network map -->
      <StreetNetworksMap class="mt-1"/>

      <!-- History of Paving -->
      <h2 class="section-title text-center mt-5">A History of Local + FAM Paving</h2>

      <p>
        City funding alone is used to repave the Local network of streets, and a
        combination of City and federal funding is used to repave streets in the
        FAM network. Because paving duties for these networks rest entirely with
        the City, they will be the focus of this section.
      </p>

      <p>
        According to national standards, the City needs to repave at least 131
        miles of roadway annually to maintain healthy streets. In recent years,
        the City has struggled to meet this goal. Fiscal cuts following the
        Great Recession in 2008 strained the Streets Department's budgetary
        resources. A new federal mandate related to the Americans with
        Disabilities Act (ADA) went into effect in 2010 and further strained
        resources. The mandate required the installation of new ADA ramps
        wherever repaving occurs without any additional sources of funding.
      </p>
      <p>
        As seen in the chart below, the total miles paved for the Local and FAM
        networks has increased each year since 2013. The most significant increase
        occurred in 2018 when the addition of a second paving crew in April 2018
        enabled a total of 77 miles to be paved, exceeding the Department's 75-mile
        goal. The Streets Department continues to move closer to 131 annual paving
        miles and is currently on pace to repave 95 miles during 2019.
      </p>
      <p>
        A commitment for increased funding and the planned addition of a third
        paving crew has the Streets Department on track to meets its annual paving
        goal of 131 miles by Fiscal Year 2023, according the City's latest
        <a
          href="https://www.phila.gov/media/20190306121321/FY20-24-FYP_FINAL.pdf"
          target="_blank"
        >Five Year Plan</a>. In the intervening years, the
        Department expects that incremental increases in staffing and funding
        resources will increase the annual paving totals each year by
        about ten percent.
      </p>

      <!-- miles paved -->
      <MilesPavedCard/>

      <p class="mt-3">
        The interactive map below shows which segments of the Local and FAM
        networks have been paved during calendar years 2013 to 2018. The
        segments are colored according to the network type: blue and red for
        the Local and FAM networks, respectively. Note that this map only presents
        historical data. For the latest information on the Streets Department's
        repaving efforts for the current calendar year, see the PavePHL
        interactive tool.
      </p>

      <p>
        The selection process for a given year's paving program is generated each winter,
        in preparation for the paving season that typically runs from the spring to fall.
        Streets are selected using an adaptation of the
        <a
          href="https://en.wikipedia.org/wiki/Pavement_Condition_Index"
          target="_blank"
        >Pavement Condition Index (PCI)</a>, a standard rating
        system for evaluating pavement conditions developed by the Army Corps of
        Engineers. Streets are rated from 0 (failed) to 100 (excellent) during
        visual inspections for signs of distress and deterioration. Streets with
        failing PCI scores are prioritized for repaving each year. Condition
        scores are combined with several other metrics, such as vehicle traffic
        counts, crash ratios, future utility projects, and funding sources, to
        produce the final paving list each year. The result of this selection
        process for the years 2013 to 2018 can be seen in the map below.
      </p>

      <!-- paving map -->
      <PavingMap class="mt-1"/>

      <!-- Paving Costs-->
      <h2 class="section-title text-center mt-5">The Paving Process</h2>

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
        The first two steps typically take about a week, while paving and line striping
        typically last for about three weeks.
      </p>
      <p>
        The majority of funding for the Streets paving program comes from the
        Capital Fund, which manages resources for investing in facilities and
        infrastructure throughout the city. These funds are used to hire private
        contractors for the milling and adjustment steps described above and to
        purchase tack coat and asphalt for the paving step. Supplies for line
        striping, as well as payroll and overtime costs for paving
        personnel, are paid out of the General Fund, the City's main operating
        fund.
      </p>
      <p>
        During calendar year 2017, the latest year with full data available,
        Capital Fund costs related to paving totaled $12.9 million while General
        Fund costs totaled $5.4 million. With over a million square yards of
        roadway paved, this spending translates to a cost of about $17 per square
        mile paved. The chart below shows paving-related costs per square yard
        paved for each year since 2013. The spending figures include both
        the Capital Fund and General Fund spending areas outlined above.
      </p>
      <p>
        Notably, spending on ADA ramp upgrades accounted for more than half of the
        total spending during the 2014 paving program. Starting in 2015, the
        Streets Department reached an agreement to spend 20 percent of its Capital
        Budget funds on ramp upgrades. Since ADA ramp upgrades require a bid
        process for private contractors, the agreement has helped limit
        fluctuations in budgetary resources from year to year and contributed to
        the increased number of miles paved in more recent years.
      </p>

      <p>
        When excluding the cost of ramp upgrades, the cost of paving has fluctuated
        modestly from year to year, but has typically remained in the range of $15 to
        $17 per square mile paved since 2013.
      </p>

      <!-- paving costs -->
      <div id="paving-costs-panel" class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div class="my-card-title">Paving-Related Costs</div>
        </div>
        <div class="card-body">
          <PavingPerSqYardChart/>
        </div>
        <div class="card-footer">* Paving costs estimated through July 1, 2018.</div>
      </div>
    </div>
  </div>
</template>

<script>
import PavingMap from "@/cards/PavingMap.vue";
import StreetNetworksMap from "@/cards/StreetNetworksMap.vue";
import MilesPavedCard from "@/cards/MilesPaved.vue";
import PavingPerSqYardChart from "@/cards/PavingPerSqYardChart.vue";
import DotNavbar from "@/components/Navbar.vue";

export default {
  name: "Paving",
  components: {
    PavingMap,
    MilesPavedCard,
    PavingPerSqYardChart,
    StreetNetworksMap,
    DotNavbar
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
