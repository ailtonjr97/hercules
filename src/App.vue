<template>
  <topbar  v-if="!$route.meta.hideNavbar">
    <template v-slot:content><router-view></router-view></template>
  </topbar>
  <router-view v-if="$route.meta.hideNavbar"></router-view>
</template>

<script>
import Topbar from './components/navbar/Topbar.vue';

export default{
  components: {
    Topbar
  }
}

</script>