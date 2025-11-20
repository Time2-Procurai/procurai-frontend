import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";
import api from "../api/api"; // Importe sua instância da API
import { ChevronLeft, User } from "lucide-react"; // Importe os ícones

function EditarPerfilCliente() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Referência para o input de arquivo

  // 1. Estados alinhados com a API
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    interesses: "", // O campo do seu model ClienteProfile
  });

  // 2. Estados separados para o arquivo (envio) e preview (exibição)
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // 3. Estados de controle
  const [isFetching, setIsFetching] = useState(true); // Para o carregamento inicial
  const [isLoading, setIsLoading] = useState(false);   // Para o envio (submit)
  const [error, setError] = useState(null);

  // --- 4. useEffect: Buscar dados atuais do usuário ---
  useEffect(() => {
    const fetchCurrentData = async () => {
      setIsFetching(true);
      try {
        // O backend (UserProfileView) usa o token para saber quem é o usuário
        const response = await api.get('/user/profile/');
        const { user, profile } = response.data;

        setFormData({
          full_name: user.full_name || '',
          username: user.username || '',
          interesses: profile?.interesses || '', // Acessa o perfil (pode ser null)
        });

        // Define a foto de perfil *existente*
        if (profile?.profile_picture) {
          setProfileImagePreview(profile.profile_picture);
        }

      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        setError("Não foi possível carregar seus dados.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCurrentData();
  }, []); // [] = Roda apenas uma vez, quando o componente é montado

  // Função para atualizar o formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 5. Funções para Upload de Foto ---
  // Aciona o clique no input de arquivo escondido
  const handleImageContainerClick = () => {
    fileInputRef.current.click();
  };

  // Quando um arquivo é selecionado
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file); // Guarda o ARQUIVO para o upload
      setProfileImagePreview(URL.createObjectURL(file)); // Gera uma URL de PREVIEW
    }
  };

  // --- 6. handleSubmit: Enviar dados (PATCH) para a API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const submissionData = new FormData();

    // Adiciona os campos de texto
    submissionData.append('full_name', formData.full_name);
    submissionData.append('username', formData.username);
    submissionData.append('interesses', formData.interesses);

    // Adiciona a *nova* foto APENAS se o usuário selecionou uma
    if (profileImageFile) {
      submissionData.append('profile_picture', profileImageFile);
    }

    try {
      // Usa PATCH para atualização parcial no mesmo endpoint
      await api.patch('/user/profile/', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("Perfil atualizado com sucesso!");
      navigate(-1); // Volta para a página anterior

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Erro ao atualizar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 7. Tela de Carregamento Inicial ---
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

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col py-8 overflow-y-auto relative">

          {/* --- 8. Seta "Voltar" --- */}
          <button
            onClick={() => navigate(-1)} // -1 = Voltar
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="w-full max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Editar Perfil</h1>

            {/* FOTO DE PERFIL */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="relative w-32 h-32 cursor-pointer"
                onClick={handleImageContainerClick} // Aciona o clique
              >
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Ícone de placeholder
                    <User size={64} className="text-gray-500" />
                  )}
                </div>
              </div>
              <span className="text-gray-600 text-sm mt-2">Alterar foto</span>
            </div>

            {/* Input de arquivo escondido */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              ref={fileInputRef}
              className="hidden"
            />

            {/* FORMULÁRIO */}
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
            >
              {/* --- 9. Nomes dos campos corrigidos --- */}
              <div className="flex flex-col">
                <label className="font-bold mb-1">Nome completo</label>
                <input
                  name="full_name" // Corrigido
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.full_name} // Corrigido
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1">Nome de usuário</label>
                <input
                  name="username" // Corrigido
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={formData.username} // Corrigido
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1">Seus interesses</label>
                <input
                  name="interesses" // Corrigido
                  type="text"
                  placeholder="Categorias que são do seu interesse"
                  value={formData.interesses} // Corrigido
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Botão */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FD7702] text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:bg-orange-300"
                >
                  {isLoading ? "Salvando..." : "Salvar"}
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