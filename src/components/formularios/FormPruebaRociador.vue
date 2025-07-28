<template>
  <div>
    <!-- Título -->
    <h2 class="text-xl font-bold mb-4">Prueba anual del sistema de rociadores contra incendio</h2>

    <!-- Pestañas -->
    <div class="mb-6 flex space-x-4 border-b">
      <button :class="{
        'border-b-2 border-blue-600 font-semibold bg-indigo-300 py-1 px-6 text-md rounded-t-lg': paginaActual === 'formulario',
        'bg-indigo-100 py-3 px-6 text-md rounded-t-lg': paginaActual !== 'formulario'
      }" @click="paginaActual = 'formulario'">
        Formulario
      </button>
      <button :class="{
        'border-b-2 border-blue-600 font-semibold bg-indigo-300 py-1 px-6 text-md rounded-t-lg': paginaActual === 'imagenes',
        'bg-indigo-100 py-3 px-6 text-md rounded-t-lg': paginaActual !== 'imagenes'
      }" @click="paginaActual = 'imagenes'">
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
              class="border rounded px-2 py-1 w-full text-lg" />
          </div>
        </div>

        <!-- Tabla con equipos -->
        <div class="overflow-x-auto mb-6">
          <table class="table-auto w-full border text-sm">
            <thead>
              <tr>
                <th class="border px-2 py-1 text-md">
                  {{plantilla.equipos.campos.find(c => c.nombre === 'nro_equipo')?.etiqueta || 'N° equipo'}}
                </th>
                <th v-for="i in 4" :key="'equipo_header_' + i" class="border px-2 py-1 text-center">
                  <input v-model="form.nro_equipo[i - 1]" placeholder="Equipo"
                    class="w-full text-center border rounded px-1 py-1 text-md" />
                </th>
                <th class="border px-2 py-1 text-md">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(grupo, gIndex) in plantilla.equipos.campos" :key="gIndex">
                <template v-if="grupo.campos">
                  <tr>
                    <td colspan="6" class="font-semibold bg-gray-100 border px-2 py-1 text-md">
                      {{ grupo.grupo }}
                    </td>
                  </tr>

                  <tr v-for="campo in grupo.campos" :key="campo.nombre">
                    <td class="border px-2 py-1 text-md">{{ campo.etiqueta }}</td>

                    <td v-for="i in 4" :key="'campo_' + campo.nombre + '_' + i" class="border px-2 py-1 text-md">
                      <select v-if="campo.tipo === 'booleano'" v-model="form[campo.nombre][i - 1]"
                        class="w-full border px-1 py-1 rounded ">
                        <option :value="null" disabled>Seleccione...</option>
                        <option :value="true">Sí</option>
                        <option :value="false">No</option>
                      </select>
                      <input v-else v-model="form[campo.nombre][i - 1]" class="w-full border px-1 py-1 rounded text-md" />
                    </td>

                    <td class="border px-2 py-1">
                      <input v-model="observaciones[campo.nombre]" class="w-full border px-1 py-1 rounded text-md" />
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>



        <!-- Firmas -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="firma in plantilla.firmas" :key="firma.nombre">
            <label class="font-semibold text-md">{{ firma.etiqueta }}</label>
            <input v-model="form[firma.nombre]" type="text" class="border rounded px-2 py-2 mt-2 w-full text-lg" />
          </div>
        </div>
      </div>
    </div>
    <!-- Pestaña registro fotografico-->
    <div v-else-if="paginaActual === 'imagenes'">
      <div
        class="relative flex flex-col items-center justify-center h-90 w-full border-2 border-dashed rounded p-4 hover:bg-gray-100 cursor-pointer transition">
        <i class="fa-solid fa-camera text-4xl text-gray-500 mb-2"></i>
        <span class="text-gray-600 text-md text-center">Haz click para subir imágenes (Max. 4)</span>
        <input ref="fileInput" type="file" accept="image/*" multiple @change="cargarImagenes"
          class="absolute inset-0 opacity-0 cursor-pointer" />
      </div>


      <!-- Previsualización de imágenes en fila -->
      <div class="flex flex-wrap justify-center gap-2 w-full">
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
    <div class="mt-6 flex justify-between mb-30">
      <button v-if="paginaActual === 'imagenes'" @click="paginaActual = 'formulario'"
        class="px-8 py-1 text-lg border rounded hover:bg-gray-100">
        Volver al formulario
      </button>

      <button v-if="paginaActual === 'formulario'" @click="paginaActual = 'imagenes'"
        class="px-8 py-1 text-lg border rounded hover:bg-gray-100">
        Ir a subir imágenes
      </button>

      <button @click="emitir" class="bg-green-600 text-white px-24 py-6 text-lg rounded font-bold hover:bg-green-700">
        Registrar
      </button>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  name: 'FormPruebaRociador',
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
  methods: {
    inicializarFormulario() {
      this.form.nro_equipo = ['', '', '', '']

      const campoNroEquipo = this.plantilla.equipos.campos.find(c => c.nombre === 'nro_equipo')
      if (!campoNroEquipo) {
        console.warn("⚠️ No se encontró campo 'nro_equipo' fuera de grupos.")
      }

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