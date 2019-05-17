<template>
  <div class="home-page text-left ml-3 mr-3">
    <p>
      The Office of the City Controller is committed to increasing transparency
      around city services and the spending associated with those services under
      Controller Rebecca Rhynhart. In line with this goal, the Controller’s Office
      partnered with the Philadelphia Streets Department to release more than five
      years of data related to Philadelphia’s roadways, specifically paving and
      street defects, like potholes. These datasets are interconnected: the total
      miles of streets repaved each year directly impacts the likeliness of street
      defects to occur. Considering these datasets together tells a story about
      state of Philadelphia’s roads, the challenges the Streets Department faces
      and the progress its made in recent years.
    </p>
    <p>
      Philadelphia has nearly 2,800 miles of roadways. According to national
      standards, the City needs to repave at least 131 miles of roadways annually to
      maintain the integrity of the streets network. The City has struggled to meet
      this goal since 2008, in part due to budget cuts brought on by the Great
      Recession and due to an unfunded federal mandate, which took effect in 2010,
      requiring the installation of new ADA ramps wherever repaving occurs. Since
      2014, however, the City has increased the total miles paved each year. The most
      significant increase in repaving occurred in 2018 after the Streets Department
      added a second paving crew, bringing the total miles paved to 79, above the
      department’s stated goal of 75 miles repaved for the year.
    </p>

    <!-- miles paved -->
    <MilesPavedChart/>

    <p class="mt-3">
      The Streets Department continues to move closer to meeting the national
      standard each year. They are currently on target to repave 95 miles of
      roadway in 2019. With an increase in funding committed to the department
      and plans to add a third paving crew, the Streets Department projects that
      it will meet its 131 mile goal by Fiscal Year 2023.
    </p>

    <p>
      To better examine the recent history of Philadelphia's streets, the
      Streets Department provided two datasets to the Controller's Office: data
      for every street paved since 2013 and data for nearly 270,000 street
      defect repairs performed since 2013. The Controller's Office analyzed
      these datasets and is presenting them in an interactive and accessible
      format, allowing Philadelphia's residents to explore the data and examine
      major trends over time and across different neighborhoods of the city.
    </p>

    <p>
      The data presented here is purely historical, covering the years
      2013 to 2018. For the latest information on the Streets Department's
      repaving efforts for the current calendar year, see the
      <a
        class="text-link"
        href="https://streetsmartphl.phila.gov/"
        target="_blank"
      >PavePHL interactive tool</a>..
    </p>

    <p class="font-weight-bold">
      View the
      <router-link to="/paving" class="text-link">paving data</router-link>&nbsp;or the
      <router-link to="/potholes" class="text-link">street defects data</router-link>.
    </p>
  </div>
</template>

<script>
import MilesPavedChart from "@/views/Home/MilesPaved.vue";

export default {
  name: "HomePage",
  components: { MilesPavedChart }
};
</script>



