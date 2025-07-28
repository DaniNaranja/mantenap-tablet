<template>
  <div class="flex flex-col   w-screen h-[calc(100vh-5rem)] bg-gradient-to-b from-indigo-50 to-indigo-200 p-6 mt-20">


    <!-- Título -->
    <h1 class="text-4xl font-bold text-black-800 mb-12">
      Bienvenido
    </h1>
    <div class="flex flex-col items-center justify-center mt-10">
    <router-link
      to="/mapa"
      class="w-full h-40 flex items-center justify-center bg-violet-800 text-white text-4xl font-semibold px-8 rounded-2xl shadow-lg hover:bg-violet-700 active:bg-violet-800 transition-all duration-300 text-center ripple"
    >
    <img src="../assets/fire.png" class="h-30">
    <span class="ml-10"> Mapa instrumentos</span>
    </router-link>
    <router-link
      to="/"
      class="w-full h-40 mt-8 flex items-center justify-center bg-indigo-500 text-white text-4xl font-semibold px-8 rounded-2xl shadow-lg hover:bg-violet-700 active:bg-violet-800 transition-all duration-300 text-center"
    >
    
    <span class="ml-10"> -----------------</span>
    </router-link>
    <router-link
      to="/"
      class="w-full h-40 mt-8 flex items-center justify-center bg-blue-400 text-white text-4xl font-semibold px-8 rounded-2xl shadow-lg hover:bg-violet-700 active:bg-violet-800 transition-all duration-300 text-center"
    >
    <span class="ml-10"> -----------------</span>
    </router-link>
    <router-link
      to="/"
      class="w-full h-40 mt-8 flex items-center justify-center bg-green-600 text-white text-4xl font-semibold px-8 rounded-2xl shadow-lg hover:bg-violet-700 active:bg-violet-800 transition-all duration-300 text-center"
    >
    
    <span class="ml-10"> -----------------</span>
    </router-link>

    </div>
    <!-- Botón principal -->
    
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>
