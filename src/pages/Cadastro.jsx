import React, { useState } from "react";
import LadoLogoPage from "../components/LadoLogoPage";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const [tipoCadastro, setTipoCadastro] = useState("cliente");

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Insira um e-mail válido.");
      return;
    }

    const passwordRegex = /^[A-Za-z0-9!@#$%&*.\-_?]{8,}$/;
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Insira uma senha válida.");
      return;
    }

    if (password !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.post("user/register/tela1/", {
        email: email,
        password: password,
        password_confirm: confirmacao,
        user_type: tipoCadastro,
      });
      console.log("Resposta da API:", response.data);
      const id = response.data.user_id;
      sessionStorage.setItem("user_id", id)
      if (tipoCadastro === "cliente") {
        console.log('Tipo do cadastro -->', tipoCadastro)
        navigate("/cadastro/cliente");
      } else if (tipoCadastro === "empresa") {
        navigate("/cadastro/empresa");
      }

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.response && error.response.data) {
        setError("Erro ao cadastrar. Verifique os dados informados.");
        console.error("Detalhes do erro:", error.response.data);
      } else {
        setError("Não foi possível conectar ao servidor.\nTente novamente.");
      }
    }
  };

  return (
    <div className="h-screen flex text-gray-800 bg-[#1A225F] overflow-hidden">
      <div className="w-1/2 h-screen">
        <LadoLogoPage />
      </div>

      <div className="w-1/2 h-screen bg-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold mb-4 text-white md:text-gray-800">
            Cadastre-se
          </h1>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setTipoCadastro("cliente")}
              className={`shadow-lg w-full py-3 px-4 rounded-lg font-bold cursor-pointer hover:opacity-90 transition duration-300 ${tipoCadastro === "cliente"
                ? "bg-[#FD7702] text-white"
                : "bg-gray-300 text-gray-700"
                }`}>
              Cliente
            </button>

            <button
              type="button"
              onClick={() => setTipoCadastro("empresa")}
              className={`shadow-lg w-full py-3 px-4 rounded-lg font-bold cursor-pointer hover:opacity-90 transition duration-300 ${tipoCadastro === "empresa"
                ? "bg-[#FD7702] text-white"
                : "bg-gray-300 text-gray-700"
                }`}>
              Empresa
            </button>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4 whitespace-pre-line">
              {error}
            </p>
          )}

          <form onSubmit={handleCadastro}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="email">
                E-mail
              </label>

              <input id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // limpa o erro ao começar a digitar
                }}
                placeholder="Digite seu e-mail"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-main"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Senha</label>
              <input id="senha"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // limpa o erro ao começar a digitar
                }}
                placeholder="Digite sua senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-main"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Confirmar senha</label>
              <input id="confirmacao"
                type="password"
                value={confirmacao}
                onChange={(e) => {
                  setConfirmacao(e.target.value);
                  setError(""); // limpa o erro ao começar a digitar
                }}
                placeholder="Confirme sua senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-main"
                required
              />
            </div>

            <button type="submit"
              className="shadow-lg cursor-pointer w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300"
              onClick={handleCadastro}>
              Criar conta
            </button>

            <p className=" text-pink-100 md:text-gray-700 mb-8 mt-7 text-center">
              Já tem uma conta?{' '}
              <a href="/login" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;