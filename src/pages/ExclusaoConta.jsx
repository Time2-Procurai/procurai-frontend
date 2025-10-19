import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';

{/* Implementar captura dos dados para exclusão */ }
function ExclusaoContaPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen font-sans text-gray-800">
      <BarraPesquisa />

      <div className="h-[calc(100%-56px)]"> {/* Altura total menos a barra do topo */}
        <BarraLateral />

        {/* Área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">
          <button onClick={() => navigate("/Configuracoes")}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer ml-2 text-[30px] mb-10">
            &lt; <span className="text-[24px] font-bold ml-6">Configurações &lt; Exclusão de Conta</span>
          </button>

          {/* Implementar método de Exclusão */}
          <div className="flex flex-col items-center h-full mt-10">
            <div className="ml-13 mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                Deseja excluir sua conta?
              </label>
              <p>
                Você perderá o acesso à <strong>todos</strong> os recursos da plataforma. Tem certeza da sua ação?
              </p>

              <div className="flex flex-col items-center h-full">
                <button type="submit"
                  className="block mt-8 cursor-pointer w-md border-1 md:bg-main text-main md:text font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                  onClick={() => navigate("/Configuracoes")}>
                  Cancelar
                </button>
                <button type="submit"
                  className="block mt-8 cursor-pointer w-md bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                  onClick="">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExclusaoContaPage;