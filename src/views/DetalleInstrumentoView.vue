<template>
    <div class="relative w-full h-full flex flex-col items-center ">
        <!-- Botón volver -->
        <button @click="$router.push('/mapa')"
            class="absolute top-6 left-6 bg-gray-700 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md hover:bg-gray-800">
            ✕
        </button>

        <!-- Tabs -->
        <div class="mt-6 flex w-4/5 max-w-3xl bg-white rounded-full shadow-md overflow-hidden">
            <button class="flex-1 py-3 text-lg font-semibold transition-colors"
                :class="tab === 'detalles' ? 'bg-violet-600 text-white' : 'text-gray-600 bg-gray-200'"
                @click="tab = 'detalles'">
                Detalles
            </button>
            <button class="flex-1 py-3 text-lg font-semibold transition-colors"
                :class="tab === 'informes' ? 'bg-violet-600 text-white' : 'text-gray-600 bg-gray-200'"
                @click="tab = 'informes'">
                Informes
            </button>
        </div>

        <!-- Contenido -->
        <div v-if="tab === 'detalles'" class="flex flex-col items-center w-full">
            <!-- Imagen -->
            <div class="mt-8 w-4/5 max-w-4xl">
                <img v-if="getUrlImagen(instrumento.imagen)" :src="getUrlImagen(instrumento.imagen)"
                    alt="Imagen del instrumento" class="rounded-xl shadow-lg w-full object-cover h-180" />
                <p v-else class="text-gray-500 text-center">No hay imagen disponible</p>
            </div>

            <!-- Datos -->
            <div class="grid grid-cols-2 gap-4 mt-10 w-full px-8">
                <div class="bg-gray-200 rounded-lg p-4 text-center">
                    <span class="block font-bold text-gray-700">TAG:</span>
                    <span class="block text-lg">{{ instrumento.tag }}</span>
                </div>
                <div class="bg-gray-200 rounded-lg p-4 text-center">
                    <span class="block font-bold text-gray-700">Ubicación:</span>
                    <span class="block text-lg">{{ instrumento.ubicacion || 'No disponible' }}</span>
                </div>
                <div v-for="[key, value] in caracteristicasArray" :key="key"
                    class="bg-gray-200 rounded-lg p-4 text-center">
                    <span class="block font-bold text-gray-700">{{ traducirEtiqueta(key) }}:</span>
                    <span class="block text-lg">{{ renderizarValor(value, key) }}</span>
                </div>
                <div class="bg-gray-200 rounded-lg p-4 text-center">
                    <span class="block font-bold text-gray-700">Último registro:</span>
                    <span class="block text-lg">
                        {{ instrumento.ultimo_registro ? formatFecha(instrumento.ultimo_registro) : 'No disponible' }}
                    </span>
                </div>
            </div>

            <!-- Botones -->
            <div class="w-full max-w-5xl mt-50 space-y-4">

                <button @click="crearNuevoRegistro"
                    class="w-full h-50 bg-green-600 text-white text-3xl font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-green-600">
                    Registrar nuevo informe
                    <i class="fa fa-plus text-5xl ml-6"></i>
                </button>
            </div>
        </div>

        <!-- INFORMES -->
        <div v-if="tab === 'informes'" class="w-full max-w-6xl mt-8 space-y-4 overflow-y-auto"
            style="max-height: calc(100vh - 12rem);">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Historial de informes</h2>
            <div v-if="informes.length">
                <div v-for="(grupo, mes) in informesPorMes" :key="mes" class="mb-4">
                    <h4 class="font-bold text-violet-700 border-b-5 border-violet-400 mb-3 text-2xl">{{ mes }}</h4>
                    <div v-for="informe in grupo" :key="informe.id" @click="abrirInforme(informe.id)"
                        class="grid grid-cols-[1fr_1fr_1fr] gap-4 bg-gray-100 hover:bg-gray-200 rounded px-4 py-8 mb-3 cursor-pointer items-center no-underline shadow-md text-inherit">
                        <span class="text-xl">{{ informe.folio || `Informe ${informe.id}` }}</span>
                        <span class="text-xl capitalize">{{ informe.tipo_informe }}</span>
                        <span class="text-xl text-gray-600">{{ formatFecha(informe.fecha) }}</span>
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
        descargarUltimoInforme() {
            console.log("Descargar último informe...");
        },
        crearNuevoRegistro() {
            console.log("Crear nuevo registro...");
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

