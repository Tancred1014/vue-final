<template>
  <div>
    <Header />
    <div class="container-fluid">
      <div class="row">
        <router-view></router-view>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./Header";
import Main from "./Main";
import AboutUs from "./AboutUs";
import Footer from "./Footer";
// import Alert from "./AlertMessage";

export default {
  components: {
    Header,
    Main,
    AboutUs,
    Footer
    // Alert
  }
};
</script>
