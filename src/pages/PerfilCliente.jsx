import React from "react";
import { useNavigate } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import BarraPesquisa from "../components/BarraPesquisa";
import UploadFoto from "../components/UploadFoto";
import Comentario from "../components/Comentario";

function PerfilCliente() {
  const navigate = useNavigate();

  return (
    <div className="h-screen text-gray-800 bg-gray-50">
      {/* Barra superior */}
      <BarraPesquisa />

      <div className="flex h-[calc(100%-64px)]">
        {/* Barra lateral fixa */}
        <BarraLateral />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-y-auto p-6">
          {/*foto e dados */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center relative">
            <div className="mr-6">
              <UploadFoto />
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-gray-800">Luiz Matheus</h2>
              <p className="text-gray-500 text-sm">@luizmatheus</p>
              <p className="mt-2 text-gray-600 text-sm">
                Escreveu <span className="font-semibold text-black">150</span> avaliações ou comentários
              </p>
            </div>

            {/* Botão editar */}
            <button
              onClick={() => navigate("/EditarPerfilCliente")}
              className="hover:cursor-pointer absolute top-6 ring-2 ring-[#FD7702] right-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md">
              Editar perfil
            </button>
          </div>

          {/* Seção de comentários */}
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
      </div>
    </div>
  );
}

export default PerfilCliente;