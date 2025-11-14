import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';

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
          <button onClick={handleVoltar} 
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer ml-2 text-[30px] mb-10">
            &lt; <span className="text-[24px] font-bold ml-6">Configurações</span>
          </button>

          <button onClick={() => navigate("/RedefinicaoSenha/" + localStorage.getItem('userId'))} 
            className="ml-13 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold mb-10 p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">🔐</span>Redefinição de Senha
          </button>

          <button onClick={() => navigate("/ExclusaoConta/" + localStorage.getItem('userId'))} 
            className="ml-13 mb-10 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">🗑️</span>Exclusão de Conta
          </button>
          
          {/* Implementar método de Logout */}
          <button onClick={() => {
            localStorage.clear();
            navigate("/Login");
          }}
            className="ml-13 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">&#x21A9;</span>Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;