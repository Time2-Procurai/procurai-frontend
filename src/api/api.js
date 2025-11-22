// chamadas de API
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",    // url local, se for testar localmente, comentar linha abaixo e descomentar essa
  //baseURL: "https://procurai.duckdns.org/api/", // url produção
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// === FIM DO INTERCEPTOR DE REQUISIÇÃO ===


// === INÍCIO DO NOVO INTERCEPTOR DE RESPOSTA ===
// Isso lida com o token *expirado*
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // --- CORREÇÃO AQUI ---
    // Verifica se a requisição que falhou foi a de LOGIN ('user/token/')
    // Se foi login, nós NÃO queremos tentar refresh token, nem redirecionar.
    // Queremos apenas devolver o erro para o LoginPage mostrar a msg "Senha inválida".
    if (originalRequest.url.includes('user/token/')) {
      return Promise.reject(error);
    }

    // Verifica se o erro é 401 (Unauthorized) E se ainda não tentamos atualizar
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error("Refresh token não encontrado. Deslogando.");
        // Só redireciona se NÃO estivermos já na tela de login para evitar loops
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await api.post('user/token-refresh/', {
          refresh: refreshToken
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        // Atualiza o header padrão também para futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token é inválido. Deslogando.", refreshError);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');

        // Só redireciona se NÃO estivermos já na tela de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;