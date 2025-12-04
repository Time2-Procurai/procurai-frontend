import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";
import api from "../api/api";
import { ChevronLeft, User } from "lucide-react";

function EditarPerfilCliente() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    interesses: "", // Manteremos como string aqui para funcionar no Input de texto
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- BUSCAR DADOS (GET) ---
  useEffect(() => {
    const fetchCurrentData = async () => {
      setIsFetching(true);
      try {
        const response = await api.get('/user/profile/');
        const { user, profile } = response.data;

        // LÓGICA DE INTERESSES (Array -> String)
        let interessesFormatados = "";
        
        if (profile?.interesses) {
            if (Array.isArray(profile.interesses)) {
                // Se vier ['Tech', 'Saúde'], vira "Tech, Saúde"
                interessesFormatados = profile.interesses.join(', ');
            } else {
                // Se vier string antiga ou algo estranho
                interessesFormatados = String(profile.interesses);
            }
        }

        setFormData({
          full_name: user.full_name || '',
          username: user.username || '',
          interesses: interessesFormatados, 
        });

        console.log("Interesses formatados:", interessesFormatados);
        const urlBase = "http://localhost:8080/"; // Ajuste conforme sua URL real
        if (profile?.profile_picture) {
           // Verifica se já vem com http (alguns backends mandam full url)
           const imgUrl = profile.profile_picture.startsWith('http') 
              ? profile.profile_picture 
              : urlBase + profile.profile_picture;
          setProfileImagePreview(imgUrl);
        }

      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        setError("Não foi possível carregar seus dados.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCurrentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // --- ENVIAR DADOS (PATCH) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const submissionData = new FormData();

    submissionData.append('full_name', formData.full_name);
    submissionData.append('username', formData.username);

    // LÓGICA DE INTERESSES (String -> Array -> JSON String)
    // 1. Pega "Tech, Saúde", quebra na vírgula e remove espaços extras
    const listaInteresses = formData.interesses
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== ""); // Remove vazios

    // 2. Transforma em JSON String "['Tech', 'Saúde']" para o backend processar
    // Usamos a chave 'interests' para ativar o to_internal_value do Serializer que criamos
    submissionData.append('interests', JSON.stringify(listaInteresses));

    if (profileImageFile) {
      submissionData.append('profile_picture', profileImageFile);
    }

    try {
      await api.patch('/user/profile/', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("Perfil atualizado com sucesso!");
      // navigate(-1); // Opcional: voltar ou ficar na tela
      
      // Opcional: Recarregar dados para confirmar
      // window.location.reload(); 

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      // Tratamento de erro melhorado
      const msg = err.response?.data?.detail || "Erro ao atualizar. Verifique os dados.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <div className="flex-1 flex justify-center items-center">
            <p className="text-xl text-gray-500 animate-pulse">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <div className="flex-1 flex flex-col py-8 overflow-y-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="w-full max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Editar o perfil</h1>

            {/* FOTO DE PERFIL */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="relative w-32 h-32 cursor-pointer group"
                onClick={handleImageContainerClick}
              >
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-500" />
                  )}
                  {/* Overlay ao passar o mouse */}
                  <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center rounded-full">
                    <span className="text-white text-xs font-bold">Alterar</span>
                  </div>
                </div>
              </div>
              <span className="text-gray-800 text-md mt-2 font-bold">Alterar foto de perfil</span>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              ref={fileInputRef}
              className="hidden"
            />

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex flex-col">
                <label className="font-bold mb-1">Nome completo</label>
                <input
                  name="full_name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1">Nome de usuário</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1">Seus interesses</label>
                <span className="text-xs text-gray-500 mb-1">Separe por vírgulas (ex: Futebol, Tecnologia)</span>
                <input
                  name="interesses"
                  type="text"
                  placeholder="Ex: Construção, Saúde, Tecnologia"
                  value={formData.interesses}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FD7702] text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:bg-orange-300 cursor-pointer"
                >
                  {isLoading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfilCliente;