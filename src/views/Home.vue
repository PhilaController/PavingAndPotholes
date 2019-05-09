<template>
  <div class="home text-left ml-3 mr-3">
    <p>
      Controller Rebecca Rhynhart is committed to increasing transparency around
      city services and the spending associated with those services.
      Towards this goal, the Controller’s Office is partnering with the Streets
      Department to release over five years’ worth of data related to
      Philadelphia's roadways. The data, visualized in an interactive
      format, provides a recent history of two important aspects of our city’s
      streets: paving and street defects.
    </p>
    <p>
      These datasets are interconnected: the total miles of streets repaved each
      year directly impacts the number of potholes and other street defects that
      are likely to occur. When viewed together, they provide a glimpse into the
      health of Philadelphia's roadways, the challenges faced by the Streets
      Department, and the progress that has been made in recent years.
    </p>

    <h2>Paving</h2>

    <p>
      The visualization of paving data includes interactive maps showing which
      streets have been paved since 2013 as well as the agency responsible
      for repaving duties. It also highlights the total number of miles paved
      annually since 2013 and the total financial costs associated with that
      paving.
    </p>

    <p>
      The data presented here is purely historical, covering the years
      2013 to 2018. For the latest information on the Streets Department's
      repaving efforts for the current calendar year, see the PavePHL
      interactive tool.
    </p>

    <p class="font-weight-bold">
      View the interactive visualization
      <router-link to="/paving" class="my-nav-link">here</router-link>.
    </p>

    <h2>Street Defects</h2>

    <p>
      Data for nearly 270,000 street defect repairs and 200,000 requests since
      2013 can be explored in a dashboard that highlights the
      monthly trends and geographic distribution of the data. The charts and
      maps are fully reactive, allowing users to interactively filter and
      explore data for individual time periods and neighborhoods of the city.
    </p>

    <p class="font-weight-bold">
      View the interactive visualization
      <router-link to="/potholes" class="my-nav-link">here</router-link>.
    </p>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
