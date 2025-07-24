<template>
  <div class="space-y-6 text-sm ">
    <!-- 1. Datos Generales -->
    <section>
      <h3 class="text-lg font-semibold border-b pb-1">1. Datos Generales</h3>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div v-for="campo in plantilla.campos?.campos_generales || []" :key="campo.nombre">
          <span class="font-semibold text-lg">{{ campo.etiqueta }}: </span>
          <span class="text-lg">{{ renderizarValor(datos[campo.nombre]) }}</span>
        </div>
      </div>
    </section>

    <!-- 2. Equipos -->
    <section>
      <h3 class="text-lg font-semibold border-b pb-1 mt-4">2. Equipos</h3>
      <div class="overflow-x-auto mt-2">
        <table class="w-full border text-sm">
          <colgroup>
            <col /> <!-- Columna de etiquetas -->
            <col v-for="(equipo, index) in equipos" :key="'col_equipo_' + index" class="w-[12%]" />
            <col /> <!-- Columna de observaciones -->
          </colgroup>
          <thead>
            <tr>
              <th class="border px-2 py-1.5">
                {{plantilla.campos?.equipos?.campos.find(c => c.nombre === 'nro_equipo')?.etiqueta || 'N° equipo'}}
              </th>
              <th v-for="(equipo, index) in equipos" :key="'equipo_header_' + index"
                class="border px-2 py-1.5 text-center">
                {{ equipo.nro_equipo || `Equipo ${index + 1}` }}
              </th>
              <th class="border px-2 py-1.5">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(grupo, gIndex) in plantilla.campos?.equipos?.campos.filter(c => c.grupo) || []"
              :key="gIndex">
              <tr>
                <td colspan="100%" class="font-semibold bg-gray-100 border px-2 py-1.5">
                  {{ grupo.grupo }}
                </td>
              </tr>
              <tr v-for="campo in grupo.campos" :key="campo.nombre">
                <td class="border px-2 py-1.5">{{ campo.etiqueta }}</td>
                <td v-for="(equipo, idx) in equipos" :key="campo.nombre + '_' + idx"
                  class="border px-2 py-1.5 text-center">
                  {{ renderizarValor(equipo[campo.nombre]) }}
                </td>
                <td class="border px-2 py-1.5 ">
                  {{ observaciones[campo.nombre] || '' }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 3. Firmas -->
    <section>
      <h3 class="text-lg font-semibold pb-1">3. Firmas</h3>
      <table class="table-auto w-full mt-1 border border-gray-300 text-sm">
        <tbody>
          <tr>
            <td class="border border-black px-1 py-1.5 font-semibold w-1/2">Operador MOP:</td>
            <td class="border border-black px-1 py-1.5 text-center">{{ renderizarValor(datos.operador_mop) }}</td>
          </tr>
          <tr>
            <td class="border border-black px-1 py-1.5 font-semibold">Operador Mantención:</td>
            <td class="border border-black px-1 py-1.5 text-center">{{ renderizarValor(datos.operador_mantencion) }}</td>
          </tr>
          <tr>
            <td class="border border-black px-1 py-1.5 font-semibold">Especialista Respuesta a Emergencias:</td>
            <td class="border border-black px-1 py-1.5text-center">{{ renderizarValor(datos.especialista_emergencia) }}</td>
          </tr>
          <tr>
            <td class="border border-black px-1 py-1.5 font-semibold">Jefe de Respuesta a Emergencias:</td>
            <td class="border border-black px-4 py-3 text-center">{{ renderizarValor(datos.jefe_emergencias) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from '../../plugins/axios'

export default {
  name: 'DetalleRociadoresPrueba',
  props: {
    datos: { type: Object, required: true },
    plantilla: { type: Object, required: true },
    observaciones: { type: Object, default: () => ({}) },
    equipos: { type: Array, default: () => [] },
    informe: { type: Object, required: true }
  },
  methods: {
    renderizarValor(v) {
      if (typeof v === 'boolean') return v ? 'Sí' : 'No';
      if (Array.isArray(v)) return v.join(', ');
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
        return dayjs(v).isValid() ? dayjs(v).format('DD-MM-YYYY') : v;
      }
      return v != null ? v : '-';
    },
    getUrlImagen(path) {
      if (!path) return null;
      return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;
    }
  }
}
</script>
