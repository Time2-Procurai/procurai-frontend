import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';

function ConfiguracoesPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen font-sans text-gray-800">
      <BarraPesquisa />

      <div className="h-[calc(100%-56px)]"> {/* altura total menos a barra do topo */}
        {/* barra lateral */}
        <BarraLateral />

        {/* área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">
          <button onClick={() => navigate("/FeedCliente")} 
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer ml-2 text-[30px] mb-10">
            &lt; <span className="text-[24px] font-bold ml-6">Configurações</span>
          </button>

          <button onClick={() => navigate("/RedefinicaoSenha")} 
            className="ml-13 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold mb-10 p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">🔐</span>Redefinição de Senha
          </button>

          <button onClick={() => navigate("/ExclusaoConta")} 
            className="ml-13 w-160 shadow shadow-gray-400 flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer text-[24px] font-semibold p-3 rounded-lg align-middle">
            <span className="text-lg mr-4 ml-2">🗑️</span>Exclusão de Conta
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;