<template>
    <div class="space-y-2 text-base">

        <!-- 1. Datos Generales -->
        <section>
            <h3 class="text-xl font-semibold border-b pb-1 mb-2">1. Datos</h3>
            <div class="grid grid-cols-[200px_1fr] gap-x-4">
                <template v-for="campo in plantilla.campos.campos_generales" :key="campo.nombre">
                    <span class="font-semibold text-lg">{{ campo.etiqueta }}:</span>
                    <span class="text-lg">{{ renderizarValor(datos[campo.nombre], campo.tipo) }}</span>
                </template>
            </div>
        </section>

        <!-- 2. Hidrante / Monitor -->
        <section>
            <h3 class="text-xl font-semibold border-b pb-1 mb-2">2. Hidrante / Monitor</h3>

            <!-- 2.1 Elemento -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">{{ plantilla.campos.elemento.campos[0].etiqueta }}:</span>
                <span class="text-lg">{{ renderizarValor(datos.tipo_elemento) }}</span>
            </div>

            <!-- 2.2 Marca -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.2 Marca:</span>
                <span class="text-lg">{{ renderizarValor(datos.marca_hidrante) }}</span>
            </div>

            <!-- 2.3 Tag Actual y Nuevo -->
            <div class="grid grid-cols-4 gap-4 py-2 border-b border-dashed">
                <div>
                    <span class="font-semibold text-lg">2.3 Tag Actual: </span>
                    <span class="text-lg">{{ renderizarValor(datos.tag_actual) }}</span>
                </div>
                <div>
                    <span class="font-semibold text-lg">Tag Nuevo: </span>
                    <span class="text-lg">{{ renderizarValor(datos.tag_nuevo) }}</span>
                </div>
            </div>

            <!-- 2.4 Diámetro Base -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.4 Diámetro Base:</span>
                <span class="text-lg">{{ renderizarValor(datos.diametro_base) }}</span>
            </div>

            <!-- 2.5 Válvula Corte Raiser -->
            <div class="mt-2">
                <h4 class="font-semibold mb-1">2.5 Válvula Corte Raiser</h4>
                <div class="grid grid-cols-4 gap-4 border-b border-dashed pb-2">
                    <div>
                        <span class="font-semibold block text-lg">Diámetro</span>
                        <span class="text-lg">{{ renderizarValor(datos.valvula_corte_raiser_diametro) }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block text-lg">Certificación</span>
                        <span class="text-lg">{{ renderizarValor(datos.valvula_corte_raiser_certificacion) }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block text-lg">Marca</span>
                        <span class="text-lg">{{ renderizarValor(datos.valvula_corte_raiser_marca) }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block text-lg">Estado</span>
                        <span class="text-lg pb-2">{{ renderizarValor(datos.valvula_corte_raiser_estado) }}</span>
                    </div>
                </div>
            </div>

            <!-- 2.6 Reducción -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.6 Reducción:</span>
                <span class="text-lg">{{ renderizarValor(datos.tiene_reduccion) }}</span>
            </div>

            <!-- 2.7 Número de Salidas -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.7 Número de Salidas:</span>
                <span class="text-lg">{{ renderizarValor(datos.numero_salidas) }}</span>
            </div>

            <!-- 2.8 Diámetro Salidas -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.8 Diámetro Salidas:</span>
                <span class="text-lg">{{ renderizarValor(datos.diametro_salida) }}</span>
            </div>

            <!-- 2.9 Válvula Corte Salidas -->
            <div class="mt-2">
                <h4 class="font-semibold mb-1 text-lg">2.9 Válvula Corte Salidas</h4>
                <div class="grid grid-cols-4 gap-4 border-b border-dashed pb-2">
                    <div>
                        <span class="font-semibold block text-lg">Diámetro</span>
                        <span class="text-lg">{{ renderizarValor(datos.valvula_corte_salida_diametro) }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block text-lg">Certificación</span>
                        <span class="text-lg">{{ renderizarValor(datos.valvula_corte_salida_certificacion) }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block text-lg">Marca</span>
                        <span class="text-lg">{{ renderizarValor(datos.valvula_corte_salida_marca) }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block text-lg">Estado</span>
                        <span class="text-lg pb-2">{{ renderizarValor(datos.valvula_corte_salida_estado) }}</span>
                    </div>
                </div>
            </div>

            <!-- 2.10 Tapas Storz -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.10 Tapas Storz:</span>
                <span class="text-lg">{{ renderizarValor(datos.tapas_storz) }}</span>
            </div>

            <!-- 2.11 Dirección Salidas -->
            <div class="grid grid-cols-[200px_1fr] gap-x-4 py-2 border-b border-dashed">
                <span class="font-semibold text-lg">2.11 Dirección Salidas:</span>
                <span class="text-lg">{{ renderizarValor(datos.direccion_salidas) }}</span>
            </div>

            <!-- 2.12 Observaciones -->
            <div v-if="plantilla.campos.observaciones" class="mt-4">
                <h4 class="font-semibold mb-2 text-lg">2.12 Observaciones</h4>
                <p class="whitespace-pre-wrap border rounded p-2 text-lg">
                    {{ renderizarValor(datos[plantilla.campos.observaciones.nombre]) }}
                </p>
            </div>

            <!-- Hora de registro -->
            <div v-if="plantilla.campos.hora_registro" class="mt-2 border-t">
                <h3 class="font-semibold text-xl">Hora registro</h3>
                <p class="text-lg">{{ renderizarValor(datos[plantilla.campos.hora_registro.nombre]) }}</p>
            </div>
        </section>

        <!-- Firmas -->
        <section>
            <h3 class="text-xl font-semibold border-b mb-2 py-1.5">Firmas</h3>
            <div class="grid grid-cols-[200px_1fr] gap-x-4">
                <template v-for="firma in plantilla.campos.firmas" :key="firma.nombre">
                    <span class="font-semibold text-lg">{{ firma.etiqueta }}:</span>
                    <span class="text-lg">{{ renderizarValor(datos[firma.nombre]) }}</span>
                </template>
            </div>
        </section>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: 'DetalleHidranteMantencion',
    props: {
        datos: { type: Object, required: true },
        plantilla: { type: Object, required: true },
        informe: { type: Object, required: true }
    },
    methods: {
        renderizarValor(v, tipo = '') {
            if (v == null || v === '') return '-';
            if (tipo === 'fecha' || (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v))) {
                return dayjs(v).isValid() ? dayjs(v).format('DD-MM-YYYY') : v;
            }
            if (typeof v === 'boolean') return v ? 'Sí' : 'No';
            if (Array.isArray(v)) return v.join(', ');
            return v;
        }
    }
};
</script>
