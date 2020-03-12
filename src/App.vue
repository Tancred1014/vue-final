<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  created() {
    // const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/products/all`;
    const api =
      "http://raw.githubusercontent.com/kiang/pharmacies/master/json/points";
    this.$http.get(api).then(response => {
      console.log(response.data);
    });
    console.log(api);
  }
};
</script>

<style lang="scss">
@import "./assets/all";
</style>
