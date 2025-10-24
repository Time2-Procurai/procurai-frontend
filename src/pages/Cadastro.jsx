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
  
  if (!password.trim()) {
    setError("Insira uma senha válida.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Insira um e-mail válido.");
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
    if (tipoCadastro === "cliente") {
      console.log('Tipo do cadastro -->',tipoCadastro)
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
        setError("Não foi possível conectar ao servidor. Tente novamente.");
    }
  
  } 
};

  return (
    <div className="min-h-screen flex font-sans text-gray-800 bg-[#1A225F]" >
      <div className="w-1/2 h-screen center mt-26 ml-1" >
        <LadoLogoPage />
      </div>

      <div className="w-1/2 h-screen bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold mb-4 text-white md:text-gray-800">
            Cadastre-se
          </h1>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setTipoCadastro("cliente")}
              className={`w-full py-3 px-4 rounded-lg font-bold cursor-pointer transition duration-300 ${tipoCadastro === "cliente"
                ? "bg-[#FD7702] text-white"
                : "bg-gray-300 text-gray-700"
              }`}>
              Cliente
            </button>

            <button
              type="button"
              onClick={() => setTipoCadastro("empresa")}
              className={`w-full py-3 px-4 rounded-lg font-bold cursor-pointer transition duration-300 ${tipoCadastro === "empresa"
                ? "bg-[#FD7702] text-white"
                : "bg-gray-300 text-gray-700"
              }`}>
              Empresa
            </button>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleCadastro}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]">
                E-mail
              </label>

              <input id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Senha</label>
              <input id="senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Confirmar senha</label>
              <input id="confirmacao" 
                type="password" 
                value={confirmacao} 
                onChange={(e) => setConfirmacao(e.target.value)} 
                placeholder="Confirmar senha" 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <p className=" text-pink-100 md:text-gray-500 mb-6 mt-3">
              <a href="/" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Esqueceu a senha?
              </a>
            </p>

            <button type="submit" 
              className="cursor-pointer w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300" 
              onClick={handleCadastro}>
              Criar conta
            </button>
          
            <p className=" text-pink-100 md:text-gray-500 mb-8 mt-7">
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