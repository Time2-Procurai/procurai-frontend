import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import BarraPesquisa from "../components/BarraPesquisa";
// Removi o UploadFoto, pois esta é uma tela de visualização.
// Vamos adicionar um ícone de placeholder.
import { User } from "lucide-react"; 
import Comentario from "../components/Comentario";
import api from "../api/api"; // Importe a sua instância do API

function PerfilCliente() {
  const navigate = useNavigate();
  
  // --- 1. Hooks para dados dinâmicos ---
  const { userId: profileIdFromUrl } = useParams(); // ID do perfil a ser visto
  const visitanteId = localStorage.getItem('userId'); // ID de quem está logado

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- 2. useEffect para buscar dados ---
  useEffect(() => {
    if (!profileIdFromUrl) {
      console.error("ID do perfil não encontrado na URL.");
      setIsLoading(false);
      setError("Perfil não encontrado.");
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usamos o mesmo endpoint que já criamos
        const response = await api.get(`/user/listar/usuarios/${profileIdFromUrl}/`);
        setUserData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do cliente:", err);
        setError("Não foi possível carregar o perfil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [profileIdFromUrl]); // Executa toda vez que o ID na URL mudar

  // --- 3. Lógica do botão Editar ---
  const isOwner = visitanteId === profileIdFromUrl;

  // --- 4. Estados de Carregamento e Erro ---
  // (Mostra o "Carregando..." dentro do layout principal)
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <p className="text-xl text-gray-500 animate-pulse">Carregando perfil...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      );
    }
    
    if (!userData) {
        return null; // Não deve acontecer se o loading/error funcionar
    }

    // --- 5. Conteúdo Principal (quando os dados carregam) ---
    return (
      <div className="flex-1 overflow-y-auto p-6">
        {/*foto e dados */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center relative">
          <div className="mr-6">
            {/* Foto de Perfil Dinâmica */}
            {userData.profile_picture ? (
                <img
                    src={userData.profile_picture}
                    alt="Foto de Perfil"
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
            ) : (
                <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                    <User size={48} className="text-gray-500" />
                </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {/* Nome Dinâmico */}
            <h2 className="text-xl font-semibold text-gray-800">{userData.full_name}</h2>
            {/* Username Dinâmico */}
            <p className="text-gray-500 text-sm">@{userData.username}</p>
            
            {/* TODO: Esta contagem (150) precisaria vir da API */}
            <p className="mt-2 text-gray-600 text-sm">
              Escreveu <span className="font-semibold text-black">150</span> avaliações ou comentários
            </p>
          </div>

          {/* Botão editar (só aparece se for o dono) */}
          {isOwner && (
            <button
              onClick={() => navigate("/EditarPerfilCliente")}
              className="hover:cursor-pointer absolute top-6 ring-2 ring-[#FD7702] right-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md">
              Editar perfil
            </button>
          )}
        </div>

        {/* Seção de comentários (Estática, como no original) */}
        {/* TODO: No futuro, esta seção também deve ser carregada via API */}
        <div className="mt-6 space-y-6">
          <Comentario
            usuario="luizmatheus"
            data="04/09/25"
            estrelas={5}
            titulo="Excelente ferramenta!"
            texto="SenSalSilOlNal"
          />
          <Comentario
            usuario="luizmatheus"
            data="04/09/25"
            estrelas={4}
            texto="Comprei essa parafusadeira na promoção e foi um ótimo investimento! O preço estava excelente e a entrega chegou bem rápido. A ferramenta é potente, leve e super fácil de usar. O atendimento da Zezinho Construções também foi impecável, responderam tudo com muita paciência. Recomendo de olhos fechados!"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen text-gray-800 bg-gray-50">
      {/* Barra superior */}
      <BarraPesquisa />
      <div className="flex h-[calc(100%-64px)]">
        {/* Barra lateral fixa */}
        <BarraLateral />
        {/* Conteúdo principal (Carregando, Erro ou Sucesso) */}
        {renderContent()}
      </div>
    </div>
  );
}

export default PerfilCliente;