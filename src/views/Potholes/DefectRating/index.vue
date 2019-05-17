<template>
  <div class="defect-rating-section text-left">
    <h2 class="section-title text-center">Where Do Street Defects Happen?</h2>

    <p>
      The occurrence of potholes and other street defects across the city
      offers important information about the health of the city's streets. The
      interactive map below uses data for street defect repairs to shed light
      on a key question: which streets have had the most street defect repairs
      since 2013?
    </p>
    <p>
      To answer this question, the Controller's Office developed the "Street
      Defect Rating", which rates streets from 0 to 100 based on the number of
      defect repairs since 2013 and accounts for the different lengths of
      streets across the city. Streets with a high rating, colored red in the
      map, have had more defect repairs than average since 2013, while streets
      with a lower rating, colored green, have had fewer repairs than the
      citywide average over that time period.
    </p>

    <!-- Defect Rating Map -->
    <Map class="mt-1"/>
  </div>
</template>

<script>
import Map from "./Map.vue";

export default {
  name: "DefectRating",
  components: { Map }
};
</script>

