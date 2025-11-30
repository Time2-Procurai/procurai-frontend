import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';
import api from '../api/api';

function ForgotPasswordPage3() {
  const [password, setPassword] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.patch("user/password_reset/confirm/", { // Trocar para 'user/change-password/' ?
        password: password,
        password_confirm: confirmacao,
      });

      setSuccess(response.data.message || "Senha redefinida com sucesso!");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error("Erro ao redefinir senha:", err);

      if (err.response?.data) {
        const errData = err.response.data;

        const traducoes = {
          "This password is too common.": "Esta senha é muito comum.",
          "This password is entirely numeric.": "Esta senha é inteiramente numérica.",
          "This field may not be blank.": "Este campo não pode ficar vazio.",
          "This password is too weak.": "Esta senha é muito fraca.",
          "This password is too short.": "A senha é muito curta.",
          "This password is too similar to the username.": "A senha é muito parecida com o nome de usuário."
        };

        const msg =
          errData.password?.[0] ||
          errData.password_confirm?.[0] ||
          "Senha inválida.";

        setError(traducoes[msg] || msg);
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <div className="min-h-screen text-gray-800 bg-[#1A225F]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

        <LadoLogoPage />

        <div className="flex flex-col justify-center items-center md:bg-white p-8 md:p-12">
          <div className="w-full max-w-sm">

            <h1 className="text-[32px] font-bold mb-2 text-white md:text-gray-900 text-center">
              Digite sua nova senha
            </h1>

            <p className="text-gray-200 md:text-gray-900 font-semibold mb-8 text-center">
              Crie uma senha segura para proteger sua conta!
            </p>

            {error && (
              <p className="bg-red-100 text-red-700 text-center p-3 mb-4 rounded-md">
                {error}
              </p>
            )}

            <form onSubmit={handleRedefinirSenha}>

              {/* Nova senha */}
              <label className="block font-bold text-white md:text-gray-800 text-[18px] mb-2">
                Nova senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6"
              />

              {/* Confirmar senha */}
              <label className="block font-bold text-white md:text-gray-800 text-[18px] mb-2">
                Confirmar nova senha
              </label>
              <input
                type="password"
                placeholder="Confirmar sua senha"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                className="shadow-sm w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="submit"
                className="mt-8 w-full bg-[#FD7702] md:bg-main text-white font-bold py-3 rounded-lg hover:opacity-90 cursor-pointer transition"
              >
                Enviar
              </button>

              <div className="mt-6 text-center">
                <p className="text-pink-100 md:text-gray-700">
                  Lembrou sua senha?{' '}
                  <a href="/login" className="text-[#1A225F] md:text-main font-bold hover:underline">
                    Voltar para o Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage3;