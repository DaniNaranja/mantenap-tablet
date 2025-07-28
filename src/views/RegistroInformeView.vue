<template>
  <div class="fixed top-20 left-0 w-screen h-[calc(100vh-5rem)] flex flex-col bg-gray-50 ">
    <!-- HEADER -->
    <div class="sticky top-0 z-50 bg-violet-800 text-white px-6 py-3 shadow flex justify-between items-center">
      <button @click="$router.back()" class="text-lg font-bold">←</button>
      <h1 class="text-md font-semibold">Registrar Informe</h1>
      <div></div>
    </div>

    <!-- SELECTOR -->
    <div class="sticky top-[4rem] bg-gray-50 z-40 px-6 py-4 shadow-md">
      <label class="block font-semibold mb-2 text-lg">Tipo de revisión</label>
      <select v-model="tipoRevision" class="w-full h-10 rounded px-4 bg-white shadow border text-lg mb-2">
        <option value="">Seleccione tipo de revisión</option>
        <option value="inspeccion">Inspección</option>
        <option value="mantencion">Mantención</option>
        <option value="prueba">Prueba</option>
      </select>
    </div>

    <!-- CONTENEDOR SCROLLABLE -->
    <div class="flex-1 overflow-y-auto px-6">
      <component
        v-if="componenteFormulario"
        :is="componenteFormulario"
        :tag="tagInstrumento"
        :tipoRevision="tipoRevision"
        :tipoInstrumento="tipoInstrumento"
        @registrar="abrirModalConfirmacion"
        @cancelar="$router.back()"
      />
      <div v-else class="text-gray-500 text-center mt-40 text-xl">
        No se ha seleccionado un tipo de revisión
      </div>
    </div>

    <!-- MODAL CONFIRMACIÓN -->
    <div v-if="mostrarModalConfirmacion" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center relative">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Confirmar Registro</h3>
        <p class="text-gray-600 mb-6">
          ¿Está seguro que desea registrar este informe? No podrá ser editado.
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="mostrarModalConfirmacion = false"
            class="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmarRegistro"
            class="bg-green-600 text-white px-6 py-3 bottom-12 rounded hover:bg-green-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormInspeccionHidrante from '../components/formularios/FormInspeccionHidrante.vue'
import FormPruebaHidrante from '../components/formularios/FormPruebaHidrante.vue'
import FormInspeccionRociador from '../components/formularios/FormInspeccionRociador.vue'
import FormPruebaRociador from '../components/formularios/FormPruebaRociador.vue'
import axios from '../plugins/axios'
import { useToast } from 'vue-toastification'

export default {
  name: 'RegistrarInformeTablet',
  data() {
    return {
      tipoRevision: '',
      tipoInstrumento: '',
      tagInstrumento: this.$route.params.tag || '',
      datosFormulario: null,
      mostrarModalConfirmacion: false
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
    abrirModalConfirmacion(payload) {
      this.datosFormulario = payload // Guardamos el formData e imágenes
      this.mostrarModalConfirmacion = true
    },
    async confirmarRegistro() {
      this.mostrarModalConfirmacion = false
      if (this.datosFormulario) {
        await this.guardarDatosFormulario(this.datosFormulario)
      }
    },
    async guardarDatosFormulario({ formData, imagenes }) {
      const toast = useToast()
      try {
        const token = localStorage.getItem('authToken')
        const res = await axios.post('/tablet/informes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        const id_informe = res.data.id
        if (imagenes.length > 0) {
          const imgData = new FormData()
          imgData.append('informe_id', id_informe)
          imgData.append('instrumento_tag', this.tagInstrumento)
          imgData.append('tipo_instrumento', this.tipoInstrumento)
          imgData.append('tipo_revision', formData.get('tipo_informe'))
          imagenes.forEach(img => imgData.append('imagenes[]', img))

          await axios.post('/imagenes', imgData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          })
        }

        toast.success('Informe registrado exitosamente')
        this.$router.back()
      } catch (error) {
        console.error('Error registrando informe:', error)
        toast.error('Error al registrar informe')
      }
    },
    async obtenerTipoInstrumento() {
      try {
        const response = await axios.get(`/instrumentos/${this.tagInstrumento}`)
        this.tipoInstrumento = response.data.tipo
      } catch (error) {
        console.error('Error obteniendo tipo de instrumento:', error)
      }
    }
  }
}
</script>
