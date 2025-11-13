import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api.js'; 

function ExclusaoContaPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null); 

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

    // 6. (Opcional) Uma confirmação final para o usuário
    if (!window.confirm("Você tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
      return; // O usuário clicou em "Cancelar"
    }

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
    }
  };

  return (
    <div className="h-screen text-gray-800">
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

              {/* 10. Adicione um local para mostrar a mensagem de erro */}
              {error && (
                <p className="text-red-600 text-center font-bold mt-4">{error}</p>
              )}

              <div className="flex flex-col items-center h-full">
                <button 
                  type="button" 
                  className="block mt-8 cursor-pointer w-md border-1 md:bg-main text-main md:text font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                  onClick={() => navigate("/Configuracoes")}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="block mt-8 cursor-pointer w-md bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                  onClick={handleConfirmDelete} r
                >
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