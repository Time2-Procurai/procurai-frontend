// chamadas de API
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    // 1. O interceptor vai ao localStorage e pega o token
    const token = localStorage.getItem('accessToken');
    
    // 2. Se o token existir, ele o adiciona no cabeçalho (Header)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 3. Ele retorna a requisição modificada (agora com o token)
    return config;
  },
  (error) => {
    // Em caso de erro
    return Promise.reject(error);
  }
);

export default api;
