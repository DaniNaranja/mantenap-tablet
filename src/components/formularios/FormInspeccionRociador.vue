<template>
  <div class="flex flex-col h-[calc(100vh-20rem)] ">

    <!-- Título -->
    <h2 class="text-2xl font-bold my-3">{{ tituloInforme }}</h2>

    <!-- Pestañas -->
    <div class="mb-6 flex space-x-4 border-b">
      <button :class="{ 'border-b-2 border-blue-600 font-semibold bg-indigo-300 py-2 text-md px-6 rounded-t-lg': paginaActual === 'formulario',
        'bg-indigo-100 py-3 px-6 text-md rounded-t-lg': paginaActual !== 'formulario'
       }"
        @click="paginaActual = 'formulario'">
        Formulario
      </button>
      <button :class="{ 
        'border-b-2 border-blue-600 font-semibold bg-indigo-300 py-2 px-6 text-md rounded-t-lg': paginaActual === 'imagenes',
        'bg-indigo-100 py-3 px-6 text-md rounded-t-lg': paginaActual !== 'imagenes'
        }"
        @click="paginaActual = 'imagenes'">
        Registro fotográfico
      </button>
    </div>

    <!-- Contenido -->
    <div v-if="paginaActual === 'formulario'">
      <div v-if="plantilla.campos_generales.length">
        <!-- Campos generales -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="campo in plantilla.campos_generales" :key="campo.nombre">
            <label class="font-semibold text-md">{{ campo.etiqueta }}</label>
            <input v-model="form[campo.nombre]" :type="campo.tipo === 'fecha' ? 'date' : 'text'"
              class="border rounded px-2 py-2 w-full text-lg" />
          </div>
        </div>

        <!-- Tabla con equipos -->
<div class="overflow-y-auto mb-6  rounded" style="max-height: 50vh;">
  <table class="w-full table-fixed border">
    <thead>
      <tr>
        <th class=" border px-2 py-3 text-md text-left w-2/5">
          N° de equipo o sector que protege (baterías de Butano/Propano)
        </th>
        <th v-for="i in 4" :key="'equipo_header_' + i" 
            class=" border px-2 py-3 text-md text-center w-1/6">
          <input v-model="form.nro_equipo[i - 1]" placeholder="Equipo"
            class="w-full text-center border rounded px-1 py-2 text-md" />
        </th>
        <th class=" border-b px-2 py-3 text-md text-center w-1/4">Observaciones</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="grupo in plantilla.equipos.campos" :key="grupo.grupo">
        <!-- Encabezado de grupo -->
        <tr>
          <td colspan="6" class="font-semibold bg-gray-200 border px-2 py-3 text-md">
            {{ grupo.grupo }}
          </td>
        </tr>
        <!-- Filas del grupo -->
        <tr v-for="campo in grupo.campos.filter(c => c.nombre !== 'nro_equipo')" :key="campo.nombre"
            class="bg-white">
          <td class="border px-2 py-3 text-md">{{ campo.etiqueta }}</td>
          <td v-for="i in 4" :key="'campo_' + campo.nombre + '_' + i" class="border bg-white px-2 py-3 text-md">
            <select v-if="campo.tipo === 'booleano'" v-model="form[campo.nombre][i - 1]"
              class="w-full border px-1 py-2 rounded">
              <option :value="null" disabled>Seleccione...</option>
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
            <input v-else v-model="form[campo.nombre][i - 1]" 
              class="w-full border px-1 py-2 rounded text-md" />
          </td>
          <td class="border px-2 py-3">
            <input v-model="observaciones[campo.nombre]" 
              class="w-full border px-1 py-2 rounded text-md" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

        <!-- Actividades pendientes -->
        <div class="mb-4">
          <label class="font-semibold text-md">{{ plantilla.actividades_pendientes.etiqueta }}</label>
          <textarea v-model="form[plantilla.actividades_pendientes.nombre]"
            class="border rounded px-2 py-2 w-full mt-1 text-md" rows="3"></textarea>
        </div>

        <!-- Observaciones generales -->
        <div class="mb-4">
          <label class="font-semibold text-md">{{ plantilla.observaciones_generales.etiqueta }}</label>
          <textarea v-model="form[plantilla.observaciones_generales.nombre]"
            class="border rounded px-2 py-2 w-full mt-1 text-md" rows="3"></textarea>
        </div>

        <!-- Firmas -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="firma in plantilla.firmas" :key="firma.nombre">
            <label class="font-semibold text-md">{{ firma.etiqueta }}</label>
            <input v-model="form[firma.nombre]" type="text" class="border rounded px-2 py-2 w-full text-md" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="paginaActual === 'imagenes'">
      <div
        class="relative flex flex-col items-center justify-center h-90 w-full border-2 border-dashed rounded p-4 hover:bg-gray-100 cursor-pointer transition">
        <i class="fa-solid fa-camera text-4xl text-gray-500 mb-2"></i>
        <span class="text-gray-600 text-md text-center">Haz click para subir imágenes (Max. 4)</span>
        <input ref="fileInput" type="file" accept="image/*" multiple @change="cargarImagenes"
          class="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      <!-- Previsualización de imágenes en fila -->
      <div class="flex flex-wrap justify-center gap-2 w-full mt-3">
        <div v-for="(preview, index) in imagenesPreview" :key="index" class="relative w-28 h-28">
          <img :src="preview" class="w-full h-full object-cover rounded shadow border" />
          <button @click="eliminarImagen(index)"
            class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
            title="Eliminar imagen">
            &times;
          </button>
        </div>
      </div>
    </div>

    <!-- Botones para navegar / emitir -->
    <div class="mt-6 flex justify-between">
      <button v-if="paginaActual === 'imagenes'" @click="paginaActual = 'formulario'"
        class="px-8 py-2 text-lg border rounded mb-8 hover:bg-gray-100">
        Volver al formulario
      </button>

      <button v-if="paginaActual === 'formulario'" @click="paginaActual = 'imagenes'"
        class="px-8 py-2 text-lg border rounded mb-8 hover:bg-gray-100">
        Ir a subir imágenes
      </button>

      <button @click="emitir" class="bg-green-600 text-white px-24 py-6 mb-8 text-lg rounded font-bold hover:bg-green-700">
        Registrar
      </button>
    </div>
  </div>
</template>


<script>
import axios from '../../plugins/axios'

export default {
  name: 'FormInspeccionHidrante',
  props: ['tag', 'tipoInstrumento', 'tipoRevision'],
  data() {
    return {
      paginaActual: 'formulario', // controla qué pestaña se ve
      plantilla: {
        campos_generales: [],
        firmas: [],
        equipos: {
          campos: []
        },
        actividades_pendientes: {},
        observaciones_generales: {}
      },
      form: {},
      observaciones: {},
      imagenes: [], // array para guardar los archivos seleccionados
      imagenesPreview: [] // array para las URLs de previsualización
    }
  },

  async mounted() {
    console.log('🔍 Tag recibido como prop:', this.tag)

    const res = await axios.get(`/informes_plantillas/${this.tipoInstrumento}/${this.tipoRevision}`)
    console.log('Plantilla recibida:', res.data)
    this.plantilla = res.data.campos
    this.inicializarFormulario()
  },
  computed: {
    tituloInforme() {
      switch (this.tipoRevision) {
        case 'inspeccion':
          return 'Formulario de Inspección - Sistema de Rociadores';
        case 'mantencion':
          return 'Formulario de Mantención - Sistema de Rociadores';
        default:
          return 'Formulario Sistema de Rociadores';
      }
    }
  },
  methods: {
    inicializarFormulario() {
      this.form.nro_equipo = ['', '', '', '']

      // Campos generales
      if (this.plantilla.campos_generales) {
        this.plantilla.campos_generales.forEach(c => {
          this.form[c.nombre] = ''
        })
      }

      // Campos por grupo de equipos
      if (this.plantilla.equipos && Array.isArray(this.plantilla.equipos.campos)) {
        this.plantilla.equipos.campos.forEach(grupo => {
          if (grupo.campos && Array.isArray(grupo.campos)) {
            grupo.campos.forEach(campo => {
              if (campo.tipo === 'booleano') {
                 this.form[campo.nombre] = [null, null, null, null];
              } else {
                this.form[campo.nombre] = ['', '', '', '']
              }
              this.observaciones[campo.nombre] = ''
            })
          }
        })
      }

      // Firmas
      if (this.plantilla.firmas) {
        this.plantilla.firmas.forEach(f => {
          this.form[f.nombre] = ''
        })
      }

      // Campos de texto largo
      if (this.plantilla.actividades_pendientes?.nombre) {
        this.form[this.plantilla.actividades_pendientes.nombre] = ''
      }

      if (this.plantilla.observaciones_generales?.nombre) {
        this.form[this.plantilla.observaciones_generales.nombre] = ''
      }
    },

    eliminarImagen(index) {
      this.imagenes.splice(index, 1)
      this.imagenesPreview.splice(index, 1)
    },

    cargarImagenes(event) {
      const files = Array.from(event.target.files)
      const disponibles = 4 - this.imagenes.length
      const nuevos = files.slice(0, disponibles) // tomar solo los que faltan hasta 4

      nuevos.forEach(file => {
        this.imagenes.push(file)
        this.imagenesPreview.push(URL.createObjectURL(file))
      })

      // Limpiar input para poder seleccionar las mismas imágenes otra vez si se quiere
      event.target.value = null
    },

    emitir() {
      const datos = {
        ...this.form,
        observaciones_por_fila: this.observaciones
      }

      const formData = new FormData()
      formData.append('instrumento_tag', this.tag)
      formData.append('tipo_informe', this.tipoRevision)
      formData.append('folio', this.form.folio || '')
      formData.append('fecha', this.form.fecha || '')
      formData.append('datos', JSON.stringify(datos))

      // Emitir formData y las imágenes en array por separado
      this.$emit('registrar', { formData, imagenes: this.imagenes })
    }
  }
}
</script>
