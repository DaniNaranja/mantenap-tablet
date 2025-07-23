<template>
  <div class="min-h-screen w-full flex flex-col">
    <!-- Navbar fija -->
    <nav-bar class="w-full h-30 shrink-0" />

    <!-- Contenedor de vistas -->
    <div class="flex-1 overflow-hidden h-[calc(100vh-10rem)]">
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
