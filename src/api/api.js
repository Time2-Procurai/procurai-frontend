// chamadas de API
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",    // url local, se for testar localmente, comentar linha abaixo e descomentar essa
  //baseURL: "https://procurai.duckdns.org/api/", // url produção
});

api.interceptors.request.use(
  (config) => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('authToken'); // Ou qualquer nome que você usou
    
    // 2. Se o token existir, adiciona ele no cabeçalho (Header)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ou 'Token ${token}' se você usou o TokenAuthentication do DRF
    }
    
    // 3. Libera a requisição para continuar
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;
