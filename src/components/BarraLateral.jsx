import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function BarraLateral() {
  const navigate = useNavigate();
  const tipoUsuario = localStorage.getItem('userRole');

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const confirmarLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  return (
    <>
      {/* --- POPUP DE CONFIRMAÇÃO --- */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Deseja mesmo sair?
            </h2>

            <div className="flex justify-around mt-6">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded-lg hover:bg-gray-300 bg-gray-200 font-semibold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarLogout}
                className="px-9 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BARRA LATERAL --- */}
      <div className="inline-block align-top w-60 h-full border-r border-gray-200 bg-white p-6">
        <div className="space-y-6">

          {/* Rotas de navegação */}
          {tipoUsuario === "cliente" ? (
            <>
              <button
                onClick={() => navigate("/perfil/cliente/" + localStorage.getItem('userId'))}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">👤</span>
                <span className="font-bold ml-2">Meu perfil</span>
              </button>

              <button
                onClick={() => navigate("/Notificacoes")}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">🔔</span>
                <span className="font-bold ml-2">Notificações</span>
              </button>

              <button
                onClick={() => navigate("/promocoes/" + localStorage.getItem('userId'))}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">🏷️</span>
                <span className="font-bold ml-2">Promoções</span>
              </button>

              <button
                onClick={() => navigate("/Favoritos/" + localStorage.getItem('userId'))}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">❤️</span>
                <span className="font-bold ml-2">Favoritos</span>
              </button>

              <button
                onClick={() => navigate("/Configuracoes/" + localStorage.getItem('userId'))}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">⚙️</span>
                <span className="font-bold ml-2">Configurações</span>
              </button>

              {/* Botão de sair */}
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">⬅️</span>
                <span className="font-bold ml-2">Sair</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  navigate("/perfil/empresa/" + localStorage.getItem('userId'))
                }
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">👤</span>
                <span className="font-bold ml-2">Meu perfil</span>
              </button>

              <button
                onClick={() => navigate("/Notificacoes" )}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">🔔</span>
                <span className="font-bold ml-2">Notificações</span>
              </button>

              <button
                onClick={() => navigate("/promocoes/" + localStorage.getItem('userId'))}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">🏷️</span>
                <span className="font-bold ml-2">Promoções</span>
              </button>

              <button
                onClick={() => navigate("/Configuracoes/" + localStorage.getItem('userId'))}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">⚙️</span>
                <span className="font-bold ml-2">Configurações</span>
              </button>

              {/* Botão de sair */}
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer"
              >
                <span className="text-lg">⬅️</span>
                <span className="font-bold ml-2">Sair</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BarraLateral;