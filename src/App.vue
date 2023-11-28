<template>
  <navbar></navbar>
  <router-view></router-view>
</template>

<script>
import Navbar from './components/navbar/navbar.vue';

export default{
  components: {
    Navbar
  }
}

</script>