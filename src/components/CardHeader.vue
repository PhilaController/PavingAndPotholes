<template>
  <div class="card-header">
    <div class="title-wrapper d-flex justify-content-between align-items-center">
      <div class="my-card-title text-left" :class="spacerClass">{{title}}</div>
      <div class="d-flex">
        <div
          class="filter-reset ml-2"
          :data-tippy-content="resetMessage"
          v-show="showReset"
          @click="onReset"
          ref="filterResetIcon"
        >
          <i class="fas fa-undo"></i>
        </div>
        <div class="ml-3 help-icon" :data-tippy-content="helpMessage" ref="helpIcon">
          <i class="fa fa-question-circle" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tippy from "tippy.js";

export default {
  name: "cardHeader",
  props: ["title", "helpMessage", "showReset", "onReset"],
  data() {
    return { resetMessage: "Click to reset filter" };
  },
  computed: {
    spacerClass() {
      return this.showReset ? "mr-0" : "mr-5";
    }
  },
  mounted() {
    this.$nextTick(() => {
      tippy(this.$refs.helpIcon, {
        delay: 0,
        duration: 0,
        placement: "left",
        arrow: true,
        arrowType: "round",
        size: "large",
        sticky: true
      });
      tippy(this.$refs.filterResetIcon, {
        delay: 0,
        duration: 0,
        placement: "left",
        arrow: true,
        arrowType: "round",
        size: "large",
        sticky: true
      });

      // convert icons to svg
      if (window.FontAwesome) window.FontAwesome.dom.i2svg();
    });
  }
};
</script>

<style scoped>
.help-icon,
.filter-reset {
  font-size: 1.5rem;
}
</style>


