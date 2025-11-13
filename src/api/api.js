// chamadas de API
import axios from "axios";

const api = axios.create({
  //baseURL: "http://127.0.0.1:8000/api/",    // url local, se for testar localmente, comentar linha abaixo e descomentar essa
  baseURL: "http://137.184.151.61:8080/api/", // url produção
});



export default api;
