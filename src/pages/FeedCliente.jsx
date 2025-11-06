import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';

function FeedPageCliente() {
  const navigate = useNavigate();

  return (
    <div className="h-screen text-gray-800">
      <BarraPesquisa />
      
      <div className="h-[calc(100%-56px)]"> {/* altura total menos a barra do topo */}
        {/* barra lateral */}
        <BarraLateral />

        {/* área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">
          <h2 className="text-lg font-semibold mb-20">
            Comunidades sugeridas
          </h2>

          <h2 className="text-lg font-semibold">
            Lojas mais visitadas
          </h2>
        </div>
      </div>
    </div>
  );
}

export default FeedPageCliente;