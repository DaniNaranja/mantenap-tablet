<template>
<div class="fixed top-20 left-0 w-screen h-[calc(100vh-5rem)]">        <!-- Barra de búsqueda y botón volver -->
        <div class="absolute top-4 left-4 right-4 z-20 flex justify-between items-start gap-3">
            <!-- Botón cerrar -->
            <button @click="volverHome"
                class="bg-gray-600 text-white shadow-lg w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-100">
                ✕
            </button>

            <!-- Contenedor derecha: búsqueda + dropdown -->
            <div class="flex flex-col items-end gap-3">
                <!-- Input búsqueda -->
                <div class="relative w-140">
                    <input v-model="searchQuery" placeholder="Buscar instrumento por tag..."
                        class="w-full h-12 rounded-full shadow-md pl-8 pr-14 text-lg bg-white/80 focus:outline-none" />
                    <i
                        class="fa fa-search absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"></i>
                </div>

                <!-- Desplegable tipo instrumento -->
                <select v-model="selectedTipo"
                    class="w-90 h-12 rounded-full px-6 text-lg bg-white/80 shadow focus:outline-none">
                    <option value="">Seleccionar tipo de instrumento...</option>
                    <option value="hidrante">Hidrantes</option>
                    <option value="rociadores">Rociadores</option>

                </select>
                <!-- Control de radio debajo del select -->
                <div class="mt-1 flex items-center bg-white/80 py-2 px-6 rounded-full">
                    <label for="radioSlider" class="text-lg font-semibold">Radio:</label>
                    <input id="radioSlider" type="range" min="100" max="1000" step="100" v-model="radioFiltro"
                        class="w-40 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500 ml-2" />
                    <span class="text-lg font-medium w-18 text-right">{{ radioFiltro }} m</span>
                </div>


            </div>
        </div>

        <!-- Mapa -->
        <div ref="mapContainer" class="absolute inset-0 z-0"></div>





        <!-- Instrucción -->
        <div class="absolute bottom-20 inset-x-0 flex justify-center z-20">
            <div class="h-30 bg-slate-900/75 text-white mb-10 w-3/5 max-w-[90%] rounded-lg shadow md:text-xl 
        flex items-center justify-center text-center px-6">
                Haga click en el instrumento a seleccionar
            </div>
        </div>
    </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "../plugins/axios"; // Reutilizamos el axios con configuración base

import hydrantIcon from '../assets/hydrant.png';
import sprinklerIcon from '../assets/sprinkler.png';

import { toRaw } from 'vue'


export default {
    name: "MapaView",
    data() {
        return {
            map: null,
            markers: [],
            searchQuery: "",
            selectedTipo: "",
            instrumentos: [], // Todos los instrumentos
            userLat: -36.779,   // Por defecto Refinería
            userLng: -73.123,   // Por defecto Refinería
            radioFiltro: 300,   // Radio inicial en metros
            circleLayer: null
        };
    },

    computed: {
        instrumentosFiltrados() {
            return this.instrumentos.filter(inst => {
                const matchesTipo = this.selectedTipo ? inst.tipo === this.selectedTipo : true;
                const matchesSearch = this.searchQuery
                    ? inst.tag.toLowerCase().includes(this.searchQuery.toLowerCase())
                    : true;
                const distancia = this.map
                    ? this.map.distance([this.userLat, this.userLng], [inst.latitud, inst.longitud])
                    : 0;
                const matchesDistancia = distancia <= Number(this.radioFiltro);

                return matchesTipo && matchesSearch && matchesDistancia;
            });
        }
    },
    watch: {
        radioFiltro() {
            this.actualizarCirculo();
            this.mostrarMarcadores();
        },
        instrumentosFiltrados() {
            this.mostrarMarcadores();
        }
    },

    async mounted() {
        this.inicializarMapa();
        await this.cargarInstrumentos();
    },
    methods: {
        actualizarCirculo() {
            // Eliminar círculo previo si existe
            if (this.circleLayer) {
                this.map.removeLayer(this.circleLayer);
            }

            // Crear un nuevo círculo con el radio actual
            this.circleLayer = L.circle([this.userLat, this.userLng], {
                radius: this.radioFiltro, // en metros
                color: '#87afd6',
                fillColor: '#bcd9f5',
                fillOpacity: 0.3
            }).addTo(this.map);
        },
        inicializarMapa() {
            this.map = L.map(this.$refs.mapContainer, {
                zoomControl: false,
            }).setView([this.userLat, this.userLng], 16);

            L.control.zoom({ position: "bottomright" }).addTo(this.map);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);

            // Intentar obtener ubicación real del usuario
            if (!navigator.geolocation) {
                console.warn("Geolocalización no soportada por el navegador.");
                this.actualizarCirculo();
                this.mostrarMarcadores();
                return;
            }

            const opciones = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            navigator.geolocation.watchPosition(
                (position) => {
                    this.userLat = position.coords.latitude;
                    this.userLng = position.coords.longitude;

                    console.log(`Ubicación detectada: ${this.userLat}, ${this.userLng}`);

                    this.map.setView([this.userLat, this.userLng], 16);
                    this.actualizarCirculo();

                    // Marcar ubicación del usuario (un solo marcador que se actualiza)
                    if (!this.userMarker) {
                        this.userMarker = L.marker([this.userLat, this.userLng], { title: "Tu ubicación" })
                            .addTo(this.map);
                    } else {
                        this.userMarker.setLatLng([this.userLat, this.userLng]);
                    }

                    this.mostrarMarcadores();
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error.message);

                    // Usar ubicación por defecto si falla
                    this.userLat = -36.779;
                    this.userLng = -73.123;

                    console.warn("Usando ubicación por defecto (Refinería Bio Bio)");
                    this.map.setView([this.userLat, this.userLng], 16);
                    this.actualizarCirculo();
                    this.mostrarMarcadores();
                },
                opciones
            );
        },





        async cargarInstrumentos() {
            try {
                const res = await axios.get("/instrumentos");
                this.instrumentos = res.data;
                this.mostrarMarcadores();
            } catch (error) {
                console.error("Error cargando instrumentos:", error);
            }
        },
        mostrarMarcadores() {
            // Limpiar marcadores previos
            this.markers.forEach(marker => this.map.removeLayer(marker));
            this.markers = [];

            const defaultIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [45, 61],
                iconAnchor: [12, 41],
                popupAnchor: [0, -41]
            });

            const iconoHidrante = L.icon({
                iconUrl: hydrantIcon,
                iconSize: [60, 60],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });

            const iconoRociador = L.icon({
                iconUrl: sprinklerIcon,
                iconSize: [60, 60],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });

            // Agregar marcadores filtrados
            this.instrumentosFiltrados.forEach(inst => {
                if (inst.latitud && inst.longitud) {
                    let icono = null;

                    if (inst.tipo === 'hidrante') {
                        icono = iconoHidrante;
                    } else if (inst.tipo === 'rociadores') {
                        icono = iconoRociador;
                    } else {
                        // icono por defecto
                        icono = L.icon({
                            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [0, -41]
                        });
                    }


                    const marker = L.marker([inst.latitud, inst.longitud], { icon: icono })
                        .addTo(toRaw(this.map));

                    marker.on('click', () => {
                        console.log('Instrumento seleccionado:', inst.tag); // Debug
                        this.$router.push({ name: 'detalleinstrumento', params: { tag: inst.tag } });
                    });


                    this.markers.push(marker);
                }
            });
        },
        volverHome() {
            this.$router.push("/");
        },
    },
};
</script>
