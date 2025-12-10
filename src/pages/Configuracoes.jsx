import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, User } from "lucide-react"; // Importe os ícones

function ConfiguracoesPage() {
  const navigate = useNavigate();

  // Recupera o tipo de usuário salvo no login
  const userRole = localStorage.getItem("userRole");

  // Função para voltar para o feed correto
  const handleVoltar = () => {
    if (userRole === "cliente") {
      navigate("/FeedCliente/" + localStorage.getItem('userId'));
    } else {
      navigate("/FeedEmpresa/" + localStorage.getItem('userId'));
    }
  };

  return (
    <div className="h-screen text-gray-800">
      <BarraPesquisa />

      <div className="h-[calc(100%-56px)]"> {/* Altura total menos a barra do topo */}
        <BarraLateral />

        {/* Área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">

          <div className="flex items-center justify-start mb-6">
            <button
              onClick={handleVoltar}
              className="cursor-pointer mr-3 text-gray-900 hover:text-[#FD7702] transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-[26px] font-semibold text-gray-800">
              Feed
            </h1>
          </div>

          <button onClick={() => navigate("/RedefinicaoSenha/" + localStorage.getItem('userId'))}
            className="ml-13 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold mb-10 p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">🔐</span>Redefinição de Senha
          </button>

          <button onClick={() => navigate("/ExclusaoConta/" + localStorage.getItem('userId'))}
            className="ml-13 mb-10 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">🗑️</span>Exclusão de Conta
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;