import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import BarraPesquisa from "../components/BarraPesquisa";
import { User, MessageSquare } from "lucide-react"; // Adicionei MessageSquare para caso vazio
import Comentario from "../components/Comentario";
import api from "../api/api";

function PerfilCliente() {
  const navigate = useNavigate();
  
  const { userId: profileIdFromUrl } = useParams(); 
  const visitanteId = localStorage.getItem('userId');

  const [userData, setUserData] = useState(null);
  const [comentarios, setComentarios] = useState([]); // Estado para os comentários
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileIdFromUrl) {
      console.error("ID do perfil não encontrado na URL.");
      setIsLoading(false);
      setError("Perfil não encontrado.");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Busca dados do usuário
        const responseUser = await api.get(`/user/listar/usuarios/${profileIdFromUrl}/`);
        setUserData(responseUser.data);

        // 2. Busca avaliações feitas por esse usuário
        // (Certifique-se de adicionar essa rota no backend, código abaixo)
        const responseComments = await api.get(`/evaluations/user/${profileIdFromUrl}/`);
        setComentarios(responseComments.data);

      } catch (err) {
        console.error("Erro ao buscar dados do cliente:", err);
        setError("Não foi possível carregar o perfil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileIdFromUrl]);

  const isOwner = visitanteId === profileIdFromUrl;

  // Helper para data
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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

    if (!userData) return null;

    return (
      <div className="flex-1 overflow-y-auto p-6">
        {/* Card do Perfil */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center relative">
          <div className="mr-6">
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
            <h2 className="text-xl font-semibold text-gray-800">{userData.full_name}</h2>
            <p className="text-gray-500 text-sm">@{userData.username}</p>

            <p className="mt-2 text-gray-600 text-sm">
              Escreveu <span className="font-semibold text-black">{comentarios.length}</span> avaliações ou comentários
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => navigate("/EditarPerfilCliente")}
              className="hover:cursor-pointer absolute top-6 ring-2 ring-[#FD7702] right-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50">
              Editar perfil
            </button>
          )}
        </div>

        {/* Seção de Comentários Dinâmica */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Últimas Avaliações</h3>
          
          <div className="space-y-6">
            {comentarios.length > 0 ? (
              comentarios.map((comentario) => (
                <Comentario
                  key={comentario.id}
                  usuario={userData.full_name} // Nome do próprio usuário
                  data={formatDate(comentario.created_at)}
                  estrelas={comentario.rating}
                  // Mostra onde foi feito o comentário (Produto ou Loja) como título
                  titulo={comentario.product_name 
                    ? `Avaliou o produto: ${comentario.product_name}` 
                    : `Avaliou a loja: ${comentario.store_name || 'Loja'}`
                  }
                  texto={comentario.comment}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <MessageSquare size={48} className="mb-2 opacity-50"/>
                <p>Este usuário ainda não fez avaliações.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen text-gray-800 bg-gray-50">
      <BarraPesquisa />
      <div className="flex h-[calc(100%-64px)]">
        <BarraLateral />
        {renderContent()}
      </div>
    </div>
  );
}

export default PerfilCliente;

