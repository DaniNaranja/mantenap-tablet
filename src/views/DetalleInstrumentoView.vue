<template>
    <div class="relative w-full h-[calc(100vh-5rem)] flex flex-col items-center mt-20 ">
        <!-- Botón volver -->
        <button @click="$router.push('/mapa')"
            class="absolute top-2  left-2 bg-gray-700 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md hover:bg-gray-800">
            ✕
        </button>

        <!-- Tabs -->
        <div class="mt-3 flex w-4/5 max-w-3xl bg-white rounded-full shadow-md ">
            <button class="flex-1 py-3 text-lg font-semibold transition-colors rounded-l-full"
                :class="tab === 'detalles' ? 'bg-violet-600 text-white' : 'text-gray-600 bg-gray-200'"
                @click="tab = 'detalles'">
                Detalles
            </button>
            <button class="flex-1 py-3 text-lg font-semibold transition-colors rounded-r-full"
                :class="tab === 'informes' ? 'bg-violet-600 text-white' : 'text-gray-600 bg-gray-200'"
                @click="tab = 'informes'">
                Informes
            </button>
        </div>

        <!-- Contenido -->
        <div v-if="tab === 'detalles'" class="flex flex-col items-center w-full">
            <!-- Imagen -->
            <div class="mt-8 w-2/5">
                <img v-if="getUrlImagen(instrumento.imagen)" :src="getUrlImagen(instrumento.imagen)"
                    alt="Imagen del instrumento" class="rounded-xl shadow-lg w-full object-cover h-80" />
                <p v-else class="text-gray-500 text-center">No hay imagen disponible</p>
            </div>

            <!-- Datos -->
            <div class="grid grid-cols-2 gap-3 mt-5 w-full px-8">
                <div class="bg-gray-200 rounded-lg p-2 text-center">
                    <span class="block font-bold text-gray-700">TAG:</span>
                    <span class="block text-md">{{ instrumento.tag }}</span>
                </div>
                <div class="bg-gray-200 rounded-lg p-2 text-center">
                    <span class="block font-bold text-gray-700">Ubicación:</span>
                    <span class="block text-md">{{ instrumento.ubicacion || 'No disponible' }}</span>
                </div>
                <div v-for="[key, value] in caracteristicasArray" :key="key"
                    class="bg-gray-200 rounded-lg p-2 text-center">
                    <span class="block font-bold text-gray-700">{{ traducirEtiqueta(key) }}:</span>
                    <span class="block text-md">{{ renderizarValor(value, key) }}</span>
                </div>
                <div class="bg-gray-200 rounded-lg p-2 text-center">
                    <span class="block font-bold text-gray-700">Último registro:</span>
                    <span class="block text-md">
                        {{ instrumento.ultimo_registro ? formatFecha(instrumento.ultimo_registro) : 'No disponible' }}
                    </span>
                </div>
            </div>

            <!-- Botones -->
            <div class="w-full max-w-5xl mt-10 flex flex-col items-center space-y-4">

                <button @click="crearNuevoRegistro"
                    class="w-4/5 h-30 bg-green-600 text-white text-2xl font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-green-600">
                    Registrar nuevo informe
                    <i class="fa fa-plus text-3xl ml-6"></i>
                </button>
            </div>
        </div>

        <!-- INFORMES -->
        <div v-if="tab === 'informes'" class="w-full max-w-3xl mt-8 space-y-3 overflow-y-auto"
            style="max-height: calc(100vh - 12rem);">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Historial de informes</h2>
            <div v-if="informes.length">
                <div v-for="(grupo, mes) in informesPorMes" :key="mes" class="mb-2">
                    <h4 class="font-bold text-violet-700 border-b-5 border-violet-400 mb-3 text-xl">{{ mes }}</h4>
                    <div v-for="informe in grupo" :key="informe.id" @click="abrirInforme(informe.id)"
                        class="grid grid-cols-[1fr_1fr_1fr] gap-4 bg-gray-100 hover:bg-gray-200 rounded px-4 py-5 mb-3 cursor-pointer items-center no-underline shadow-md text-inherit">
                        <span class="text-lg">{{ informe.folio || `Informe ${informe.id}` }}</span>
                        <span class="text-lg capitalize">{{ informe.tipo_informe }}</span>
                        <span class="text-lg text-gray-600">{{ formatFecha(informe.fecha) }}</span>
                    </div>
                </div>
            </div>
            <p v-else class="text-gray-500">No hay informes registrados.</p>
        </div>
    </div>
</template>

<script>
import axios from "../plugins/axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export default {
    name: "DetalleInstrumentoTablet",
    data() {
        return {
            instrumento: {},
            informes: [],
            tab: "detalles",
        };
    },
    computed: {
        caracteristicasArray() {
            return Object.entries(this.instrumento.caracteristicas || {});
        },
        informesPorMes() {
            const informesOrdenados = [...this.informes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            const grupos = {};
            informesOrdenados.forEach((inf) => {
                const mes = dayjs(inf.fecha).format("MMMM YYYY");
                if (!grupos[mes]) grupos[mes] = [];
                grupos[mes].push(inf);
            });
            return grupos;
        },
    },
    mounted() {
        this.cargarInstrumento();
        this.cargarInformes();
    },
    methods: {

        async cargarInstrumento() {
            try {
                const tag = this.$route.params.tag;
                const res = await axios.get(`/instrumentos/${tag}`);
                this.instrumento = res.data;
            } catch (e) {
                console.error("Error cargando instrumento:", e);
            }
        },
        async cargarInformes() {
            try {
                const tag = this.$route.params.tag;
                const res = await axios.get(`/informes/tag/${tag}`);
                this.informes = res.data;
            } catch (e) {
                console.error("Error cargando informes:", e);
            }
        },
        getUrlImagen(path) {
            if (!path) return null;
            return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;
        },
        formatFecha(fecha) {
            return dayjs(fecha).format("DD-MM-YYYY");
        },
        traducirEtiqueta(key) {
            const etiquetas = {
                equipo_protegido: "Equipo protegido",
                numero_salidas: "Número de salidas",
                diametro_base: "Diámetro base",
                tiene_valvula_corte: "¿Tiene válvula de corte?",
                tipo_sistema: "Tipo de sistema instalado",
                tiene_deteccion: "¿Posee sistema de detección?",
                presion_operacion: "Presión de operación",
                cantidad_rociadores: "Cantidad de rociadores",
                fecha_instalacion: "Fecha de instalación",
                tag_equipo: "Equipo protegido",
                equipos_protegidos: "Equipos protegidos",
                tapas_storz: "¿Posee tapas Storz?",
                direccion_salidas: "Dirección de salidas",
            }
            return etiquetas[key] || key
        },
        renderizarValor(valor) {
            if (typeof valor === "boolean") return valor ? "Sí" : "No";
            if (Array.isArray(valor)) return valor.join(", ");
            return valor;
        },
    
        crearNuevoRegistro() {
           this.$router.push({ name: 'registrarinforme', params: { tag: this.instrumento.tag } })

        },
        abrirInforme(id) {
            this.$router.push({ name: "detalleinforme", params: { id } });
        },
    },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 4px;
}
</style>

