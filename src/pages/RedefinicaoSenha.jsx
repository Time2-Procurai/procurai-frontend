import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api'; 

function RedefinicaoSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRedefinicao = async (e) => { 
    e.preventDefault();
    setError("");
    setSuccess("");

    // validação de senha
    if (password !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.patch('user/change-password/', {
        password: password,
        password_confirm: confirmacao,
      });

      setSuccess(response.data.message || "Senha alterada com sucesso!");
      setPassword("");
      setConfirmacao("");

      // redireciona o usuário após 2 segundos
      setTimeout(() => navigate('/configuracoes'), 2000);

    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.password) {
          setError(errorData.password[0]);
        } else if (errorData.password_confirm) {
          setError(errorData.password_confirm[0]);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <div className="h-screen font-sans text-gray-800">
      <BarraPesquisa />
      <div className="h-[calc(100%-56px)]">
        <BarraLateral />

        {/* Área central */}
        <div className="inline-block align-top w-[calc(100%-16rem)] h-full p-8 bg-white">
          <button onClick={() => navigate("/Configuracoes/" + localStorage.getItem('userId'))} 
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer ml-2 text-[30px] mb-10">
            &lt; <span className="text-[24px] font-bold ml-6">Configurações &lt; Redefinição de Senha</span>
          </button>

          <div className="flex flex-col items-center h-full mt-10">
            <div className="ml-13 mb-4">
              <label
                className="block text-sm font-bold mb-2 text-gray-800 text-[20px]"
                htmlFor="password"
              >
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
              <label
                className="block text-sm font-bold mb-2 text-gray-800 text-[20px]"
                htmlFor="confirmacao"
              >
                Confirmar nova senha
              </label>
              <input
                id="confirmacao"
                type="password"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                placeholder="Confirmar senha"
                className="w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />

              {/* Mensagens de erro e sucesso */}
              {error && <p className="text-red-600 mt-3">{error}</p>}
              {success && <p className="text-green-600 mt-3">{success}</p>}

              <button
                type="submit"
                className="block mt-8 cursor-pointer w-md bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                onClick={handleRedefinicao}
              >
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
