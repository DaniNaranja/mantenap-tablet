<template>
  <div class="flex flex-col h-[calc(100vh-20rem)] ">
    <!-- Tabs -->
    <div class="flex bg-gray-100 rounded-full overflow-hidden mb-4 w-full max-w-xl mx-auto mt-2 sticky fixed">
      <button class="flex-1 py-2 font-semibold"
        :class="tab === 'formulario' ? 'bg-violet-600 text-white' : 'text-gray-600 bg-gray-200'"
        @click="tab = 'formulario'">
        Formulario
      </button>
      <button class="flex-1 py-2 font-semibold"
        :class="tab === 'fotos' ? 'bg-violet-600 text-white' : 'text-gray-600 bg-gray-200'" @click="tab = 'fotos'">
        Fotografías
      </button>
    </div>

    <!-- Contenido -->
    <div class="flex-1 overflow-y-auto px-4 pb-2">
      <div v-if="tab === 'formulario'" class="pr-4 overflow-y-auto">
        <h2 class="text-lg font-bold mb-4">Formulario de Prueba - Hidrantes</h2>

        <div v-if="plantilla.campos">
          <!-- 1. Datos Generales -->
          <h3 class="font-semibold mb-2 text-lg">1. Datos Generales</h3>
          <div v-for="campo in plantilla.campos.campos_generales" :key="campo.nombre" class="mb-2">
            <label class="text-lg">{{ campo.etiqueta }}</label>
            <input :type="campo.tipo === 'fecha' ? 'date' : 'text'" v-model="form[campo.nombre]"
              class="border rounded px-2 py-2 w-full text-lg" />
          </div>

          <!-- 2.1 Identificación -->
          <h3 class="font-semibold mt-4 mb-2 text-lg">2.1 Identificación</h3>
          <div v-for="campo in plantilla.campos.datos_hidrante.campos" :key="campo.nombre" class="mb-2">
            <label class="text-lg">{{ campo.etiqueta }}</label>
            <input v-model="form[campo.nombre]" class="border rounded px-2 py-2 w-full text-lg" type="text" />
          </div>

          <!-- 2.2 Condición -->
          <h3 class="font-semibold mt-4 mb-2 text-lg">2.2 Condición</h3>
          <div v-for="campo in plantilla.campos.condicion.campos" :key="campo.nombre" class="mb-2">
            <label class="text-lg">{{ campo.etiqueta }}</label>
            <template v-if="campo.tipo === 'booleano'">
              <select v-model="form[campo.nombre]" class="border rounded px-2 py-2 w-full">
                <option :value="true">Sí</option>
                <option :value="false">No</option>
              </select>
            </template>
            <template v-else>
              <input v-model="form[campo.nombre]" class="border rounded px-2 py-2 w-full text-lg" type="text" />
            </template>
          </div>

          <!-- 3. Datos Prueba -->
          <h3 class="font-semibold mt-4 mb-2 text-lg">3. Datos Prueba</h3>
          <div v-for="campo in plantilla.campos.datos_prueba.campos" :key="campo.nombre" class="mb-2">
            <label class="text-lg">{{ campo.etiqueta }}</label>
            <input v-model="form[campo.nombre]" class="border rounded px-2 py-2 w-full text-lg" type="text" />
          </div>

          <!-- Hora de registro -->
          <div class="mb-2">
            <label class="text-lg">{{ plantilla.campos.hora_registro.etiqueta }}</label>
            <input type="time" v-model="form[plantilla.campos.hora_registro.nombre]"
              class="border rounded px-2 py-2 w-full text-lg" />
          </div>

          <!-- Firmas -->
          <h3 class="font-semibold mt-4 mb-2 text-lg">Firmas</h3>
          <div v-for="firma in plantilla.campos.firmas" :key="firma.nombre" class="mb-2">
            <label class="text-lg">{{ firma.etiqueta }}</label>
            <input v-model="form[firma.nombre]" class="border rounded px-2 py-2 w-full text-lg" type="text" />
          </div>
        </div>
      </div>

      <div v-if="tab === 'fotos'" class="flex flex-col items-center space-y-4">
        <h3 class="font-semibold">4. Control Fotográfico</h3>

        <div
          class="relative flex flex-col items-center justify-center h-90 w-full border-2 border-dashed rounded p-4 hover:bg-gray-50 cursor-pointer transition">
          <i class="fa-solid fa-camera text-3xl text-gray-500 mb-2"></i>
          <span class="text-gray-600 text-sm text-center">Haz click para subir imágenes (Máx. 4)</span>
          <input ref="fileInput" type="file" accept="image/*" multiple @change="cargarImagenes"
            class="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

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

        

    </div>

    <div class="mt-10">
          <button
            class="w-full bg-green-600 text-white text-3xl font-semibold py-6 rounded-lg shadow-lg hover:bg-green-700"
            @click="emitir">
            Registrar
          </button>
        </div>




  </div>
</template>

<script>
import axios from '../../plugins/axios';

export default {
  name: 'FormPruebaHidrante',
  props: ['tag', 'tipoInstrumento', 'tipoRevision'],
  data() {
    return {
      plantilla: {},
      form: {},
      imagenes: [],
      imagenesPreview: [],
      tab: 'formulario' // Controla la pestaña activa
    }
  },
  async mounted() {
    try {
      const res = await axios.get(`/informes_plantillas/${this.tipoInstrumento}/${this.tipoRevision}`);
      this.plantilla = res.data;
      this.inicializarFormulario();
    } catch (e) {
      console.error("Error cargando plantilla:", e);
    }
  },
  methods: {
    inicializarFormulario() {
      const campos = [
        ...this.plantilla.campos.campos_generales,
        ...this.plantilla.campos.datos_hidrante.campos,
        ...this.plantilla.campos.condicion.campos,
        ...this.plantilla.campos.datos_prueba.campos,
        this.plantilla.campos.hora_registro,
        ...this.plantilla.campos.firmas
      ];
      campos.forEach(c => {
        this.form[c.nombre] = '';
      });
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
    eliminarImagen(index) {
      this.imagenes.splice(index, 1);
      this.imagenesPreview.splice(index, 1);
    },
    emitir() {
      const formData = new FormData();
      formData.append('instrumento_tag', this.tag);
      formData.append('tipo_informe', this.tipoRevision);
      formData.append('folio', this.form.folio || '');
      formData.append('fecha', this.form.fecha || '');
      formData.append('datos', JSON.stringify(this.form));
      this.$emit('registrar', { formData, imagenes: this.imagenes });
    }
  }
}
</script>
