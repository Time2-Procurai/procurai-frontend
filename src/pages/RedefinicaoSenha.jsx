import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api';
import { ChevronLeft } from 'lucide-react';

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
      setTimeout(() => navigate('/configuracoes/' + localStorage.getItem('userId')), 2000);

    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      if (err.response?.data) {
        const errorData = err.response.data;
        const errorTranslations = {
          "This password is too common.": "Esta senha é muito comum.",
          "This password is entirely numeric.": "Esta senha é inteiramente numérica.",
          "This field may not be blank.": "Este campo não pode ficar vazio.",
          "This password is too weak.": "Esta senha é muito fraca.",
          "This password is too short.": "A senha é muito curta.",
          "This password is too short. It must contain at least %(min_length)d characters.": "A senha é muito curta. Ela deve conter pelo menos %(min_length)d caracteres.",
          "This password is too similar to the username.": "A senha é muito parecida com o nome de usuário.",
          "This password is too similar to the first name.": "A senha é muito parecida com o primeiro nome.",
          "This password is too similar to the last name.": "A senha é muito parecida com o sobrenome.",
          "This password is too similar to the email.": "A senha é muito parecida com o e-mail."
        };

        if (errorData.password) {
          const original = errorData.password[0];
          setError(errorTranslations[original] || original);
        } else if (errorData.password_confirm) {
          const original = errorData.password_confirm[0];
          setError(errorTranslations[original] || original);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <div className="h-screen text-gray-800">
      <BarraPesquisa />
      <div className="h-[calc(100%-56px)]">
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
                className="w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-main"
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
                className="w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-main"
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