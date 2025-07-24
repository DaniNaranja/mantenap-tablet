<template>
  <div class="min-h-screen w-full flex flex-col">
    <!-- Navbar fija -->
    <nav-bar class="w-full shrink-0" />

    <!-- Contenedor de vistas -->
    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>
