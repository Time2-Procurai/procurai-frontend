import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';

{/* Implementar captura da senha */ }
function RedefinicaoSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRedefinicao = (e) => {
    e.preventDefault();
    setError(""); // limpa erros anteriores

    // validação de senha
    if (password !== confirmacao) {
      setError("As senhas não coincidem.");
      return; // impede o cadastro se as senhas forem diferentes
    } else {
      // Atualizar senha
    }
  };

  return (
    <div className="h-screen font-sans text-gray-800">
      <BarraPesquisa />

      <div className="h-[calc(100%-56px)]"> {/* Altura total menos a barra do topo */}
        <BarraLateral />

        {/* Área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">
          <button onClick={() => navigate("/Configuracoes")} 
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer ml-2 text-[30px] mb-10">
            &lt; <span className="text-[24px] font-bold ml-6">Configurações &lt; Redefinição de Senha</span>
          </button>
          
          {/* Implementar método de Redefinição */}
          <div className="flex flex-col items-center h-full mt-10">
            <div className="ml-13 mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                Nova senha
              </label>

              <input
                id="senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div className="ml-13">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                Confirmar nova senha
              </label>

              <input id="confirmacao"
                type="password"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                placeholder="Confirmar senha"
                className="w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />

              <button type="submit"
                className="block mt-8 cursor-pointer w-md bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                onClick={handleRedefinicao}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RedefinicaoSenhaPage;