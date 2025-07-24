<template>
  <div class="flex gap-8 h-[calc(100vh-7.5rem)] mt-20 p-6">
    <div class="flex-1 overflow-y-auto pr-2 space-y-6">
      <button @click="volverAlInstrumento"
        class="text-violet-800 font-bold mb-4 flex items-center hover:cursor-pointer text-lg">
        <i class="fa fa-arrow-left mr-1 text-lg mr-4"></i> Volver
      </button>

      <h2 class="text-xl font-bold mb-4">Detalle del Informe</h2>
      <h2 class="text-2xl font-bold">{{ tituloDetalle }}</h2>

      <component v-if="componenteDetalle" :is="componenteDetalle" :datos="datosCampos" :plantilla="plantilla"
        :observaciones="observacionesPorCampo" :equipos="equipos" :informe="informe" />

      <div v-else>
        <p>Cargando detalle del informe...</p>
      </div>

      <!-- NUEVA SECCIÓN: Grid de imágenes -->
      <div v-if="imagenes.length" class="mt-8">
        <h3 class="text-xl font-semibold mb-4"> Registro fotográfico</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(img, index) in imagenes" :key="img.id"
            class="w-full aspect-square bg-gray-200 rounded overflow-hidden shadow">
            <img :src="getUrlImagen(img.ruta)" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Botón flotante -->
      <button @click="generarPDF"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-700 text-white rounded-full shadow-lg p-8 md:px-18 flex items-center justify-center gap-2 z-50"
        title="Generar PDF">
        <i class="fa fa-file-pdf-o text-3xl"></i>
        <span class="hidden md:inline text-2xl font-semibold ml-4">Generar PDF</span>
      </button>
    </div>
  </div>

  <div ref="contenidoPDF" class="p-6 pdf-export pdf-contenido" style="display:none;">
    <h2 class="text-2xl font-bold mb-4">{{ tituloDetalle }}</h2>
    <component :is="componenteDetalle" :datos="datosCampos" :plantilla="plantilla" :informe="informe"
      :observaciones="observacionesPorCampo" :equipos="equipos" />
  </div>

  <!-- Contenido de fotos (segunda página PDF) -->
  <div ref="contenidoFotosPDF" class="p-6 pdf-export pdf-contenido" style="display:none;">
    <h3 class="text-xl font-semibold mb-4">4. Registro Fotográfico</h3>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(img, i) in imagenes" :key="img.id"
        class="w-full aspect-square bg-gray-200 rounded overflow-hidden shadow">
        <img :src="getUrlImagen(img.ruta)" class="object-cover w-full h-full" />
      </div>
    </div>
  </div>
</template>



<script>
import axios from '../plugins/axios'
import DetalleHidrantePrueba from '../components/informes/DetalleHidrantePrueba.vue'
import DetalleHidranteMantencion from '../components/informes/DetalleHidranteMantencion.vue'
import DetalleRociadoresPrueba from '../components/informes/DetalleRociadoresPrueba.vue'
import DetalleRociadoresMantencion from '../components/informes/DetalleRociadoresMantencion.vue'

import jsPDF from "jspdf";
import html2canvas from 'html2canvas'
import { useToast } from "vue-toastification";

export default {
  name: 'DetalleInformeView',
  components: {
    DetalleHidrantePrueba,
    DetalleHidranteMantencion,
    DetalleRociadoresPrueba,
    DetalleRociadoresMantencion,
  },

  data() {
    return {
      informe: null,
      imagenes: [],
      datosCampos: {},
      observacionesPorCampo: {},
      tipoInstrumento: '',
      equipos: [],
      plantilla: null,
      imagenActual: 0,
      componenteDetalle: null,
      mostrarModalEliminar: false,
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const res = await axios.get(`/informes/id/${id}`)
    this.informe = res.data
    this.tipoInstrumento = res.data.tipo_instrumento
    console.log('Tipo instrumento:', this.tipoInstrumento)
    console.log('Tipo informe:', this.informe.tipo_informe)


    let datos = {}
    if (res.data.datos) {
      if (typeof res.data.datos === 'string') {
        datos = JSON.parse(res.data.datos)
      } else {
        datos = res.data.datos
      }
    }

    this.datosCampos = datos
    this.observacionesPorCampo = datos.observaciones_por_fila || {}

    // Imágenes
    const imgRes = await axios.get(`/imagenes/${id}`)
    this.imagenes = imgRes.data

    // Cargar plantilla y definir componenteDetalle
    if (this.tipoInstrumento === 'hidrante') {
      this.plantilla = (await axios.get(`/informes_plantillas/hidrante/${this.informe.tipo_informe}`)).data
      this.equipos = [] // Ojo hidrantes no usan equipos, o agregar si es necesario
      if (this.informe.tipo_informe === 'prueba') {
        this.componenteDetalle = 'DetalleHidrantePrueba'
      } else {
        this.componenteDetalle = 'DetalleHidranteMantencion'
      }
    } else if (this.tipoInstrumento === 'rociadores') {
      this.plantilla = (await axios.get(`/informes_plantillas/rociadores/${this.informe.tipo_informe}`)).data

      this.equipos = this.extraerEquipos(this.datosCampos)

      if (this.informe.tipo_informe === 'prueba') {
        this.componenteDetalle = 'DetalleRociadoresPrueba'
      } else {
        this.componenteDetalle = 'DetalleRociadoresMantencion'
      }
    }
  },

  methods: {

    async generarPDF() {
      const toast = useToast();
      try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const elementosNoPDF = document.querySelectorAll('.no-pdf');
        elementosNoPDF.forEach(el => el.style.display = 'none');

        // Función para limpiar colores oklch
        function limpiarOklch(elemento) {
          const elementos = elemento.querySelectorAll('*');
          elementos.forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = '#ffffff';
            }
            if (style.color.includes('oklch')) {
              el.style.color = '#000000';
            }
            if (style.borderColor.includes('oklch')) {
              el.style.borderColor = '#cccccc';
            }
          });
        }

        /** ----------- Página 1: Detalle del informe ----------- **/
        const elemento = this.$refs.contenidoPDF;
        if (!elemento) return;
        elemento.style.display = "block";
        limpiarOklch(elemento);

        const canvas = await html2canvas(elemento, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: elemento.scrollWidth,
          windowHeight: elemento.scrollHeight
        });

        const imgData = canvas.toDataURL("image/png");

        // Calcular escalado proporcional para que quepa en A4
        let imgWidth = pdfWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pdfHeight) {
          imgHeight = pdfHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        // Centrar la imagen en la página
        const marginX = (pdfWidth - imgWidth) / 2;
        const marginY = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight, undefined, "FAST");

        elemento.style.display = "none";

        /** ----------- Página 2: Registro Fotográfico ----------- **/
        if (this.imagenes.length > 0) {
          const fotosElem = this.$refs.contenidoFotosPDF;
          fotosElem.style.display = "block";
          limpiarOklch(fotosElem);

          const canvasFotos = await html2canvas(fotosElem, {
            scale: 2,
            useCORS: true,
            logging: false
          });

          const imgDataFotos = canvasFotos.toDataURL("image/png");
          const imgHeightFotos = (canvasFotos.height * pdfWidth) / canvasFotos.width;

          if (imgHeightFotos > pdfHeight) {
            pdf.addPage();
            pdf.addImage(imgDataFotos, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
          } else {
            pdf.addPage();
            pdf.addImage(imgDataFotos, "PNG", 0, 0, pdfWidth, imgHeightFotos, undefined, "FAST");
          }
          fotosElem.style.display = "none";
        }

        /** ----------- Guardar PDF ----------- **/
        pdf.save(`informe_${this.informe.tipo_informe}_${this.informe.id}.pdf`);
        toast.success('PDF generado correctamente');

      } catch (err) {
        console.error("Error generando PDF:", err);
        toast.error('Ocurrio un error al generar el PDF');
      }
    },


    volverAlInstrumento() {
      this.$router.push(`/detalleinstrumento/${this.informe.instrumento_tag}`);
    },
    async eliminarInforme() {
      const toast = useToast();
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`/informes/delete/${this.informe.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$router.replace(`/detalleinstrumento/${this.informe.instrumento_tag}`);
        toast.success('Informe eliminado correctamente');
      } catch (error) {
        console.error("Error al eliminar informe:", error);
        toast.error('Ocurrió un error al eliminar el informe');
      } finally {
        this.mostrarModalEliminar = false;
      }
    },
    anteriorImagen() {
      if (this.imagenActual === 0) {
        this.imagenActual = this.imagenes.length - 1
      } else {
        this.imagenActual--
      }
    },
    siguienteImagen() {
      if (this.imagenActual === this.imagenes.length - 1) {
        this.imagenActual = 0
      } else {
        this.imagenActual++
      }
    },
    extraerDatosGenerales(datos) {
      const generales = {}
      for (const [key, val] of Object.entries(datos)) {
        if (!Array.isArray(val) && typeof val !== 'object') {
          generales[key] = val
        }
      }
      return generales
    },
    extraerEquipos(datos) {
      if (Array.isArray(datos.equipos)) {
        // Si ya existe "equipos", lo usamos tal cual
        return datos.equipos;
      }

      // Si no, reconstruimos desde arrays planos
      const resultado = [{}, {}, {}, {}]; // máximo 4 equipos
      for (const [clave, valores] of Object.entries(datos)) {
        if (Array.isArray(valores)) {
          valores.slice(0, 4).forEach((v, idx) => {
            resultado[idx][clave] = v;
          });
        }
      }
      return resultado.filter(eq => Object.keys(eq).length > 0); // Solo equipos con datos
    },


    getUrlImagen(path) {
      if (!path) return ''
      const normalizado = path.replace(/\\/g, '/')
      return `${import.meta.env.VITE_API_URL}/uploads/${normalizado}`
    },

    traducirEtiqueta(etiqueta) {
      const map = {
        fecha: 'Fecha del informe',
        // puedes añadir más si lo deseas
      }
      if (map[etiqueta]) return map[etiqueta]

      // Si no está en el diccionario, formatear automáticamente
      return etiqueta
        .replace(/_/g, ' ')
        .replace(/^./, l => l.toUpperCase())

    },
    renderizarValor(valor) {
      if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
      if (Array.isArray(valor)) return valor.join(', ')
      return valor ?? '-'
    }
  },
  computed: {
    tituloDetalle() {
      if (!this.informe) return 'Detalle de Informe';

      const { tipo_informe, tipo_instrumento } = this.informe;
      let instrumentoLabel = tipo_instrumento === 'hidrante'
        ? 'Hidrantes/Monitores'
        : 'Rociadores';

      switch (tipo_informe) {
        case 'mantencion':
          return `Hoja de mantención ${instrumentoLabel}`;
        case 'inspeccion':
          return `Hoja de inspección ${instrumentoLabel}`;
        case 'prueba':
          return tipo_instrumento === 'hidrante'
            ? 'Prueba Hidrantes Contra Incendios'
            : 'Prueba Anual del Sistema de Rociadores';
        default:
          return 'Detalle de Informe';
      }
    }
  }
}
</script>


<style scoped>
.pdf-export table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  /* Igual ancho en todas las columnas */
}

.pdf-export th,
.pdf-export td {
  width: calc(100% / 6);
  /* Ajusta 6 por el número de columnas que tienes */
  text-align: center;
  padding: 6px;
  border: 1px solid #000;
  word-wrap: break-word;
}
</style>
