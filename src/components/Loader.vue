<template>
  <div id="loading">
    <div id="loader"></div>
  </div>
</template>

<script>
export default {
  name: "Loader"
};
</script>


<style>
#loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

#loading {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  background-color: #fff;
  z-index: 9999;
  text-align: center;
}
</style>
