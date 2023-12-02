<template>
  <!-- <navbar v-if="!$route.meta.hideNavbar"></navbar> -->
  <sidebar v-if="!$route.meta.hideNavbar">
    <template v-slot:content><router-view></router-view></template>
  </sidebar>
</template>

<script>
import Sidebar from './components/navbar/Sidebar.vue'
import Navbar from './components/navbar/Navbar.vue';

export default{
  components: {
    Navbar,
    Sidebar
  }
}

</script>