<template>
  <div class="home-page text-left ml-3 mr-3">
    <p>
      Under the leadership of City Controller Rebecca Rhynhart, the
      Controller’s Office is committed to increasing transparency around city
      services and spending. To that end, the Controller’s Office will release
      datasets and/or interactive reports to help inform the public about areas of
      interest. Questions and concerns about the state of Philadelphia’s streets
      are frequently raised. As such, the Controller’s Office is releasing six
      years of data related to Philadelphia’s roadways, specifically paving and
      pothole repairs, in hopes of advancing the discussion around improving the
      quality of Philadelphia’s streets.
    </p>
    <p>
      According to the Philadelphia Streets Department, the City of Philadelphia
      (City) needs to repave at least 131 miles of roadways annually to maintain the
      integrity of the streets network. The City has struggled to meet this goal
      historically. It worsened in the late 2000s, in part due to budget cuts brought
      on by the Great Recession and to an unfunded federal mandate, which took effect
      in 2010, requiring the installation of new ADA ramps wherever repaving occurs.
      More than half of the total spending for paving in 2014 was on ADA ramp
      upgrades. However in 2015, the Streets Department reached an agreement to spend
      20 percent of its Capital Budget funds on ramp upgrades. Since then, the City
      has increased the total miles paved each year.
    </p>

    <p>
      With recent increases in funding committed to the department and plans to
      add a third paving crew, the Streets Department projects that it will meet
      its 131-mile goal by Fiscal Year 2023.
    </p>

    <!-- miles paved -->
    <MilesPavedChart/>

    <p class="mt-3">
      The Streets Department provided two datasets to the Controller's Office:
      data for every street paved since 2013 and data for nearly 300,000 street
      defect repairs performed since 2013. The Controller's Office analyzed
      these datasets and is presenting them in an interactive and accessible
      format, allowing Philadelphia's residents to explore the data and examine
      major trends over time and across different neighborhoods of the city. The
      Controller's Office thanks the Streets Department for their cooperation
      in providing these datasets.
    </p>

    <p class="font-weight-bold">
      View the data for
      <router-link to="/paving" class="text-link">paving</router-link>&nbsp;or
      <router-link to="/potholes" class="text-link">street defects</router-link>.
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



