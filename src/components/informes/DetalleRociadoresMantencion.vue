<template>
  <div class="space-y-3 text-base">
    <!-- 1. Datos Generales -->
    <section>
      <h3 class="text-lg font-semibold border-b pb-1">1. Datos Generales</h3>
      <div class="grid grid-cols-3 gap-1">
        <div v-for="campo in plantilla.campos.campos_generales" :key="campo.nombre" class="py-1">
          <span class="font-semibold text-lg">{{ campo.etiqueta }}: </span>
          <span class="text-lg">{{ renderizarValor(datos[campo.nombre], campo.tipo) }}</span>
        </div>
      </div>
    </section>

    <!-- 2. Equipos -->
    <section>
      <h3 class="text-lg font-semibold  pb-1 ">2. Equipos</h3>
      <table class="table-auto w-full text-md border mt-2">
        <colgroup>
          <col />
          <col v-for="(equipo, index) in equipos" :key="'col_equipo_' + index" class="w-[12%]" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th class="border px-2 py-1">N° de equipo o sector que protege</th>
            <th v-for="(equipo, index) in equipos" :key="'eq' + index" class="border px-2 py-1 text-center">
              {{ equipo.nro_equipo || `Equipo ${index + 1}` }}
            </th>
            <th class="border px-2 py-1">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(grupo, idx) in plantilla.campos.equipos.campos" :key="idx">
            <tr>
              <td colspan="100%" class="bg-gray-100 font-semibold px-2 py-1 border">
                {{ grupo.grupo }}
              </td>
            </tr>
            <tr v-for="campo in grupo.campos.filter(c => c.nombre !== 'nro_equipo')" :key="campo.nombre">
              <td class="border px-2 py-1">{{ campo.etiqueta }}</td>
              <td v-for="(equipo, i) in equipos" :key="i" class="border px-2 py-1 text-center">
                {{ renderizarValor(equipo[campo.nombre]) }}
              </td>
              <td class="border px-2 py-1">
                {{ observaciones[campo.nombre] || '' }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <!-- 3. Actividades Pendientes -->
    <section v-if="plantilla.campos.actividades_pendientes" class="mt-4">
      <h3 class="font-semibold border-b pb-1 text-lg">3. Actividades Pendientes</h3>
      <p class="whitespace-pre-wrap text-md">
        {{ renderizarValor(datos[plantilla.campos.actividades_pendientes.nombre]) }}
      </p>
    </section>

    <!-- 4. Observaciones Generales -->
    <section v-if="plantilla.campos.observaciones_generales" class="mt-4">
      <h3 class="font-semibold border-b pb-1 text-lg">4. Observaciones Generales</h3>
      <p class="whitespace-pre-wrap text-md">
        {{ renderizarValor(datos[plantilla.campos.observaciones_generales.nombre]) }}
      </p>
    </section>

    <!-- 5. Firmas -->
    <section class="mt-4">
      <h3 class="text-lg font-semibold border-b pb-1">5. Firmas</h3>
      <table class="table-auto w-full mt-4 border border-gray-300 text-center text-md">
        <thead>
          <tr>
            <th v-for="firma in plantilla.campos.firmas" :key="firma.nombre"
              class="border border-gray-300 px-2 py-1 font-semibold">
              {{ firma.etiqueta }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="firma in plantilla.campos.firmas" :key="firma.nombre" class="border border-gray-300 px-2 py-4">
              {{ renderizarValor(datos[firma.nombre]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'DetalleRociadoresMantencion',
  props: {
    datos: { type: Object, required: true },
    plantilla: { type: Object, required: true },
    observaciones: { type: Object, default: () => ({}) },
    equipos: { type: Array, default: () => [] },
    informe: { type: Object, required: true }
  },
  methods: {
    renderizarValor(valor, tipo = '') {
      if (valor == null || valor === '') return '-'
      if (tipo === 'fecha') {
        return dayjs(valor).isValid() ? dayjs(valor).format('DD-MM-YYYY') : valor
      }
      if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
      if (Array.isArray(valor)) return valor.join(', ')
      return valor
    }
  }
}
</script>
