<template>
  <sidebar v-if="!$route.meta.hideNavbar">
    <template v-slot:content><router-view></router-view></template>
  </sidebar>
  <router-view v-else></router-view>
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