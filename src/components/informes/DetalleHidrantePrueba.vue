<template>
    <div class="p-2 space-y-4 text-base">
        <!-- Encabezado -->
        <section>
            <div class="flex justify-between text-xl">
                <div><strong>Folio:</strong> {{ datos.folio }}</div>
                <div><strong>Fecha:</strong> {{ datos.fecha }}</div>
            </div>
        </section>

        <!-- 1. Datos -->
        <section>
            <h3 class="font-semibold text-xl border-b pb-2 mb-2">1. Datos</h3>
            <div class="space-y-1">
                <div class="grid grid-cols-[200px_1fr] gap-x-4" v-for="campo in ['nombre_planta', 'area', 'ubicacion']" :key="campo">
                    <span class="font-semibold text-lg">{{ traducirEtiqueta(campo) }}:</span>
                    <span class="text-lg">{{ datos[campo] }}</span>
                </div>
            </div>
        </section>

        <!-- 2. Datos Hidrante -->
        <section>
            <h3 class="font-semibold text-xl border-b pb-2 mb-2">2. Datos Hidrante</h3>

            <!-- 2.1 Identificación -->
            <h4 class="font-semibold mb-1 text-lg">2.1 Identificación</h4>
            <div class="space-y-1 mb-3 text-lg">
                <div v-for="campo in plantilla.campos.datos_hidrante.campos" :key="campo.nombre" class="grid grid-cols-[200px_1fr] gap-x-4">
                    <span class="font-semibold">{{ campo.etiqueta }}:</span>
                    <span>{{ datos[campo.nombre] }}</span>
                </div>
            </div>

            <!-- 2.2 Condición -->
            <h4 class="font-semibold mb-1 text-lg">2.2 Condición</h4>
            <div class="space-y-1 text-lg">
                <div v-for="campo in plantilla.campos.condicion.campos" :key="campo.nombre" class="grid grid-cols-[200px_1fr] gap-x-4">
                    <span class="font-semibold">{{ campo.etiqueta }}:</span>
                    <span>{{ renderizarValor(datos[campo.nombre]) }}</span>
                </div>
            </div>
        </section>

        <!-- 3. Datos Prueba -->
        <section>
            <h3 class="font-semibold text-xl border-b pb-2 mb-2 text-lg">3. Datos Prueba</h3>
            <div class="space-y-2 text-lg">
                <!-- Estado -->
                <div class="grid grid-cols-[220px_1fr] gap-x-4 items-start">
                    <span class="font-semibold">Estado:</span>
                    <span>{{ renderizarValor(datos.estado) }}</span>
                </div>

                <!-- Caudal de agua + Observación -->
                <div class="grid grid-cols-[220px_1fr_120px_1fr] gap-x-4 items-start">
                    <span class="font-semibold">Caudal de agua:</span>
                    <span>{{ renderizarValor(datos.caudal_agua) }}</span>
                    <span class="font-semibold">Obs. caudal:</span>
                    <span>{{ renderizarValor(datos.caudal_obs) }}</span>
                </div>

                <!-- Presión + Observación -->
                <div class="grid grid-cols-[220px_1fr_120px_1fr] gap-x-4 items-start">
                    <span class="font-semibold">Presión de prueba (si posee):</span>
                    <span>{{ renderizarValor(datos.presion) }}</span>
                    <span class="font-semibold">Obs. presión:</span>
                    <span>{{ renderizarValor(datos.presion_obs) }}</span>
                </div>

                <!-- Tiempo de prueba -->
                <div class="grid grid-cols-[220px_1fr] gap-x-4 items-start">
                    <span class="font-semibold">Tiempo de prueba:</span>
                    <span>{{ renderizarValor(datos.tiempo_prueba) }}</span>
                </div>
            </div>
        </section>

        <!-- 4. Registro fotográfico -->
        <section>
            <h3 class="font-semibold text-xl border-b pb-2 mb-2">4. Registro fotográfico</h3>
            <div class="grid grid-cols-3 gap-2">
                <img v-for="img in imagenes" :key="img.id" :src="getUrlImagen(img.ruta)" class="w-full h-40 object-cover rounded shadow" />
            </div>
            <div class="mt-2 grid grid-cols-[200px_1fr] gap-x-4 text-lg">
                <span class="font-semibold">Hora registro:</span>
                <span>{{ datos[plantilla.campos.hora_registro.nombre] }}</span>
            </div>
        </section>

        <!-- Firmas -->
        <section>
            <h3 class="font-semibold text-xl border-b pb-2 mb-2">Firmas</h3>
            <div class="space-y-1">
                <div v-for="firma in plantilla.campos.firmas" :key="firma.nombre" class="grid grid-cols-[200px_1fr] gap-x-4 text-lg">
                    <span class="font-semibold">{{ firma.etiqueta }}:</span>
                    <span>{{ datos[firma.nombre] }}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        datos: { type: Object, required: true },
        plantilla: { type: Object, required: true },
        imagenes: { type: Array, default: () => [] },
        informe: { type: Object, required: true }
    },

    methods: {
        traducirEtiqueta(campo) {
            const map = { nombre_planta: 'Nombre Planta', area: 'Área', ubicacion: 'Ubicación' }
            return map[campo] || campo
        },
        renderizarValor(valor) {
            if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
            if (Array.isArray(valor)) return valor.join(', ')
            return valor ?? '-'
        },
        getUrlImagen(path) {
            if (!path) return ''
            const normalizado = path.replace(/\\/g, '/')
            return `${import.meta.env.VITE_API_URL}/uploads/${normalizado}`
        }
    }
}
</script>
