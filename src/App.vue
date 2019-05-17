<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" class="my-nav-link">Home</router-link>
      <router-link to="/paving" class="my-nav-link">Paving</router-link>
      <router-link to="/potholes" class="my-nav-link">Potholes</router-link>
    </div>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view :key="$route.path"/>
      </keep-alive>
    </transition>
  </div>
</template>

<style>
@media only screen and (max-width: 736px) {
  .header-button-block {
    width: 100%;
  }
}
@media only screen and (min-width: 736px) {
  .entry-header .row:first-child {
    flex-wrap: nowrap;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#nav a {
  font-weight: bold;
  font-size: 1.2rem;
}

.my-nav-link:not(:last-child) {
  border-right: 2px solid #666;
  padding-right: 0.25rem;
}
.my-nav-link:not(:first-child) {
  padding-left: 0.25rem;
}
.my-nav-link:hover {
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #f3c613 !important;
}

#nav a,
.my-nav-link {
  color: #2176d2 !important;
}
.my-nav-link:hover {
  color: #0f4d90 !important;
}

.my-card-title {
  font-size: 1.5rem;
  font-weight: 500;
}

.text-link:hover {
  text-decoration: none;
}

.text-link {
  color: #2176d2 !important;
}
.text-link:hover {
  color: #0f4d90 !important;
}

.d3-tip {
  line-height: 1.2;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
  pointer-events: none;
}

.flex-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* tooltip */
.tooltip-line {
  border-bottom: 1px solid #f0f0f0;
}

.tooltip-line td {
  padding: 0 7px 0 7px;
}

.tooltip-line-header {
  font-weight: bold;
  text-align: left;
}

.leaflet-tooltip {
  padding: 10px;
  font: 1rem sans-serif;
  background: #ffffff;
  border-radius: 8px;
  pointer-events: none;
  border: 1px solid #cdcdcd;
  opacity: 1;
  display: block;
  max-width: 300px;
}
.tooltip-title {
  margin-bottom: 5px;
  border-bottom: 1px solid #cdcdcd;
  text-align: center;
  font-weight: bold;
  padding-bottom: 5px;
}
.leaflet-tooltip-pane {
  z-index: 750 !important;
}

/* Override Wordpress theme */
.hood-dropdown input {
  line-height: 1.4 !important;
  font-size: 1em !important;
  border: 1px solid transparent !important;
  border-left: none !important;
  outline: none !important;
  margin: 4px 0 0 !important;
  padding: 0 7px !important;
  background: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  width: 0 !important;
  max-width: 100% !important;
  -webkit-box-flex: 1 !important;
  -ms-flex-positive: 1 !important;
  flex-grow: 1 !important;
}
</style>
