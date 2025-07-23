<template>
  <div class="w-screen h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <div class="flex items-center justify-between bg-violet-700 text-white px-6 py-4 shadow">
      <button @click="$router.back()" class="text-2xl font-bold">←</button>
      <h1 class="text-xl font-semibold">Registrar Informe</h1>
      <div></div>
    </div>

    <!-- Selector tipo de revisión -->
    <div class="p-6">
      <label class="block font-semibold mb-2">Tipo de revisión</label>
      <select v-model="tipoRevision" class="w-full h-12 rounded px-4 bg-white shadow border">
        <option value="">Seleccione tipo de revisión</option>
        <option value="inspeccion">Inspección</option>
        <option value="mantencion">Mantención</option>
        <option value="prueba">Prueba</option>
      </select>
    </div>

    <!-- Formulario dinámico -->
    <div class="flex-1 overflow-y-auto px-6 pb-6">
      <component
        v-if="componenteFormulario"
        :is="componenteFormulario"
        :tag="tagInstrumento"
        :tipoRevision="tipoRevision"
        :tipoInstrumento="tipoInstrumento"
        @registrar="registrarInforme"
        @cancelar="$router.back()"
      />
    </div>
  </div>
</template>

<script>
import FormInspeccionHidrante from '../components/formularios/FormInspeccionHidrante.vue'
import FormPruebaHidrante from '../components/formularios/FormPruebaHidrante.vue'
import FormInspeccionRociador from '../components/formularios/FormInspeccionRociador.vue'
import FormPruebaRociador from '../components/formularios/FormPruebaRociador.vue'
import axios from '../plugins/axios'

export default {
  name: 'RegistrarInformeTablet',
  data() {
    return {
      tipoRevision: '',
      tipoInstrumento: '',
      tagInstrumento: this.$route.params.tag || '',
    }
  },
  computed: {
    componenteFormulario() {
      if (!this.tipoRevision || !this.tipoInstrumento) return null

      const key = `${this.tipoRevision}-${this.tipoInstrumento}`

      const formularios = {
        'inspeccion-hidrante': FormInspeccionHidrante,
        'mantencion-hidrante': FormInspeccionHidrante,
        'prueba-hidrante': FormPruebaHidrante,
        'inspeccion-rociadores': FormInspeccionRociador,
        'mantencion-rociadores': FormInspeccionRociador,
        'prueba-rociadores': FormPruebaRociador,
      }

      return formularios[key] || null
    }
  },
  mounted() {
    this.obtenerTipoInstrumento()
  },
  methods: {
    async obtenerTipoInstrumento() {
      try {
        const response = await axios.get(`/instrumentos/${this.tagInstrumento}`)
        this.tipoInstrumento = response.data.tipo
      } catch (error) {
        console.error('Error obteniendo tipo de instrumento:', error)
      }
    },
    registrarInforme({ formData, imagenes }) {
      console.log('Nuevo informe:', formData, imagenes)
      this.$router.back()
    }
  }
}
</script>
