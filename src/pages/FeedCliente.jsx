import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';

function FeedPageCliente() {
  const navigate = useNavigate();

  return (
    <div className="h-screen font-sans text-gray-800">
      <BarraPesquisa />

      <div className="h-[calc(100%-56px)]"> {/* altura total menos a barra do topo */}
        {/* barra lateral */}
        <div className="inline-block align-top w-60 h-full border-r border-gray-200 bg-white p-6">
          <div className="space-y-6">
            {/*criar as rotas de navegacao */}
            <button onClick={() => navigate("/Perfil")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
              <span className="text-lg">👤</span>
              <span className="font-bold ml-2">Meu perfil</span>
            </button>

            <button onClick={() => navigate("/Notificacoes")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
              <span className="text-lg">🔔</span>
              <span className="font-bold ml-2">Notificações</span>
            </button>

            <button onClick={() => navigate("/Promocoes")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
              <span className="text-lg">🏷️</span>
              <span className="font-bold ml-2">Promoções</span>
            </button>

            <button onClick={() => navigate("/Favoritos")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
              <span className="text-lg">❤️</span>
              <span className="font-bold ml-2">Favoritos</span>
            </button>

            <button onClick={() => navigate("/Configuracoes")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
              <span className="text-lg">⚙️</span>
              <span className="font-bold ml-2">Configurações</span>
            </button>
          </div>
        </div>

        {/* área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">
          <h2 className="text-lg font-semibold mb-20">Comunidades sugeridas</h2>
          <h2 className="text-lg font-semibold">Lojas mais visitadas</h2>
        </div>
      </div>
    </div>
  );
}

export default FeedPageCliente;