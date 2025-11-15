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
  // 1. Se a resposta for SUCESSO (2xx), não faz nada.
  (response) => {
    return response;
  },
  
  // 2. Se a resposta for ERRO (4xx, 5xx), executa esta função.
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é 401 (Unauthorized) E se ainda não tentamos
    // atualizar o token para esta requisição (evita loops infinitos).
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca que já tentamos 1 vez

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Se não houver refresh token, desloga o usuário.
        console.error("Refresh token não encontrado. Deslogando.");
        window.location.href = '/login'; // Redireciona para o login
        return Promise.reject(error);
      }

      try {
        // 3. Tenta pedir um novo accessToken usando o refreshToken
        // (A sua URL de refresh no Django é 'user/token-refresh/')
        const response = await api.post('user/token-refresh/', {
          refresh: refreshToken
        });

        // 4. Se deu certo, pega o novo accessToken
        const newAccessToken = response.data.access;

        // 5. Salva o novo accessToken no localStorage
        localStorage.setItem('accessToken', newAccessToken);

        // 6. Atualiza o cabeçalho da requisição original que falhou
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 7. Retenta a requisição original (agora com o token novo)
        return api(originalRequest);

      } catch (refreshError) {
        // 8. Se o refresh token TAMBÉM falhar (ex: expirou)
        console.error("Refresh token é inválido. Deslogando.", refreshError);
        
        // Limpa o localStorage e desloga o usuário
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        window.location.href = '/login'; // Redireciona para o login
        return Promise.reject(refreshError);
      }
    }

    // Se o erro não for 401, apenas rejeita
    return Promise.reject(error);
  }
);


export default api;
