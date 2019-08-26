<template>
  <div class="control-panel flex-centered" ref="networkToggle">
    <label class="control-panel-label">Network Type</label>

    <!-- Toggles -->
    <div class="toggle-wrapper flex-centered">
      <template v-for="(network, i) in networks">
        <div
          class="pretty p-default p-round network-input"
          v-if="showNetwork(network.name)"
          :key="i"
        >
          <input
            v-if="type === 'checkbox'"
            :type="type"
            v-model="network.active"
            @change="toggleNetwork(i, network.active)"
            :disabled="isLoading"
          >
          <input
            v-else
            :type="type"
            :value="i"
            @change="toggleNetwork(i, true)"
            :disabled="isLoading"
          >
          <div class="state">
            <label
              :class="{ 'font-weight-bold': boldLabels}"
              :style="{ color: inColor ? network.color : '#2c3e50' }"
            >{{ network.name }}</label>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import "pretty-checkbox/dist/pretty-checkbox.min.css";
import { LOCAL, FAM, STATE } from "@/colors";

export default {
  props: ["type", "exclude", "isLoading", "inColor", "boldLabels", "actives"],
  data() {
    return {
      networks: {
        Local: { active: false, color: LOCAL, name: "City Local" },
        FAM: { active: false, color: FAM, name: "City FAM" },
        PennDOT: { active: false, color: STATE, name: "PennDOT" }
      },
      activeNetwork: "Local"
    };
  },
  mounted() {
    for (let i = 0; i < this.actives.length; i++) {
      this.networks[this.actives[i]].active = true;
    }
    if (this.type == "radio") {
      this.setRadioChecked();
    }
  },
  methods: {
    removedChecked() {
      $(this.$refs.networkToggle)
        .find("input:checked")
        .prop("checked", false);
    },
    setRadioChecked() {
      this.removedChecked();
      $(this.$refs.networkToggle)
        .find(`[value='${this.activeNetwork}']`)
        .prop("checked", true);
    },
    showNetwork(network) {
      let exclude = this.exclude || [];
      return exclude.indexOf(network) == -1;
    },
    toggleNetwork(network, value) {
      if (this.isLoading) return;
      if (this.type == "radio") {
        this.activeNetwork = network;
        this.setRadioChecked();
      }
      this.$emit("change", network, value);
    }
  }
};
</script>

<style scoped>
.control-panel-label {
  margin-bottom: 0;
  margin-right: 1rem;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .control-panel,
  .toggle-wrapper {
    flex-wrap: wrap;
  }
  .network-input {
    margin-bottom: 0.5rem;
  }
  .control-panel-label {
    margin-bottom: 0.5rem;
    margin-right: 0rem;
  }
}
</style>


