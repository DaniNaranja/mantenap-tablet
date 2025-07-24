import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetalleInstrumentoView from '../views/DetalleInstrumentoView.vue'
import DetalleInformeView from '../views/DetalleInformeView.vue'
import MapaView from '../views/MapaView.vue'
import RegistroInformeView from '../views/RegistroInformeView.vue'
import { name } from 'dayjs/locale/es'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/mapa',
    name: 'mapa',
    component: MapaView,
  },
  {
    path: '/detalleinstrumento/:tag',
    name: 'detalleinstrumento',
    component: DetalleInstrumentoView,
  },
  {
    path: '/registrarinforme/:tag',
    name: 'registrarinforme',
    component: RegistroInformeView

  },
  {
    path: '/detalleinforme/:id',
    name: 'detalleinforme',
    component: DetalleInformeView,
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard global


export default router
