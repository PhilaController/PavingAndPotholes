<template>
  <div>
    <!-- Introduction -->
    <Introduction/>

    <!-- Defect Rating -->
    <DefectRating class="mt-5"/>

    <!-- Pothole Explorer -->
    <PotholeExplorer class="mt-5"/>
  </div>
</template>

<script>
import Introduction from "@/views/Potholes/Introduction.vue";
import DefectRating from "@/views/Potholes/DefectRating";
import PotholeExplorer from "@/views/Potholes/Explorer";

export default {
  name: "PotholesPage",
  components: {
    Introduction,
    DefectRating,
    PotholeExplorer
  }
};
</script>




