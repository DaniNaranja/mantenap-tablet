import axios from 'axios';
import router from '../router';


// Crear la instancia de Axios
const instance = axios.create({
  baseURL: 'http://localhost:3002', // Ajusta según tu entorno
  timeout: 10000,
});





export default instance;
