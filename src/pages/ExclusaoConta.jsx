import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api.js';
import { ChevronLeft } from 'lucide-react';

function ExclusaoContaPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Crie uma função de 'logout' para limpar os dados após a exclusão
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    // Limpa o cabeçalho de autorização do 'api'
    delete api.defaults.headers.common['Authorization'];
    navigate('/login'); // Redireciona para o login
  };

  // 5. Crie a função de exclusão que o botão "Confirmar" vai chamar
  const handleConfirmDelete = async () => {
    setError(null); // Limpa erros antigos

    try {
      // Chame o endpoint de 'DELETE'.
      // O 'api.js' (interceptor) vai anexar o token de login automaticamente.
      const response = await api.delete('user/delete-account/');

      console.log(response.data.message); // "Conta apagada com sucesso"

      // Se funcionou, avise o usuário e faça o logout
      alert('Sua conta foi excluída com sucesso.');
      handleLogout();

    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      setError("Não foi possível excluir sua conta. Tente novamente mais tarde.");
    } finally {
      setShowPopup(false);
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
              onClick={() => navigate("/configuracoes/" + localStorage.getItem('userId'))}
              className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-[26px] font-semibold text-gray-800">
              Configurações
            </h1>
          </div>

          {/* Implementar método de Exclusão */}
          <div className="flex flex-col items-center h-full mt-10">
            <div className="ml-13 mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                Deseja excluir sua conta?
              </label>
              <p>
                Você perderá o acesso à <strong>todos</strong> os recursos da plataforma. Tem certeza da sua ação?
              </p>

              {/* 10. Adicione um local para mostrar a mensagem de erro */}
              {error && (
                <p className="text-red-600 text-center font-bold mt-4">{error}</p>
              )}

              <div className="flex flex-col items-center h-full">
                <button
                  type="button"
                  className="block mt-8 cursor-pointer w-md border-1 md:bg-main text-main md:text font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                  onClick={() => navigate("/Configuracoes/" + localStorage.getItem('userId'))}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="block mt-8 cursor-pointer w-md bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                  onClick={() => setShowPopup(true)}
                >
                  Confirmar
                </button>

                {showPopup && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
                      <h2 className="text-xl font-semibold text-center mb-4">
                        Confirmar exclusão?
                      </h2>

                      <p className="text-center mb-6">
                        Tem certeza que deseja excluir sua conta? <br />
                        <strong>Esta ação é irreversível.</strong>
                      </p>

                      <div className="flex justify-between gap-4">
                        <button
                          className="w-full py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                          onClick={() => setShowPopup(false)}
                        >
                          Cancelar
                        </button>

                        <button
                          className="w-full py-2 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-400 transition cursor-pointer"
                          onClick={handleConfirmDelete} r
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExclusaoContaPage;