<template>
  <navbar v-if="!$route.meta.hideNavbar"></navbar>
  <router-view></router-view>
</template>

<script>

import Navbar from './components/navbar/Navbar.vue';

export default{
  components: {
    Navbar
  }
}

</script>