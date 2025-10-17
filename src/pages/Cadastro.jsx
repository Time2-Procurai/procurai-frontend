import React, { useState } from "react";
import LadoLogoPage from "./LadoLogoPage";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const [tipoCadastro, setTipoCadastro] = useState("usuario"); 

  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    setError("");

    if (tipoCadastro === "usuario") {
    navigate("/");
  } else if (tipoCadastro === "empresa") {
    navigate("/login");
  }

  };
  return (
    <div className="min-h-screen flex font-sans text-gray-800 bg-[#1A225F]" >
      <div className="w-1/2 h-screen center" >
      <LadoLogoPage />
      </div>

        <div className="w-1/2 h-screen bg-white flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800">Cadastre-se</h1>
            <div className="flex gap-4 mb-6">
  <button
    type="button"
    onClick={() => setTipoCadastro("usuario")}
    className={`w-full py-3 px-4 rounded-lg font-bold transition duration-300 ${
      tipoCadastro === "usuario"
        ? "bg-[#FD7702] text-white"
        : "bg-gray-300 text-gray-700"
    }`}
  >
    Usuário
  </button>

  <button
    type="button"
    onClick={() => setTipoCadastro("empresa")}
    className={`w-full py-3 px-4 rounded-lg font-bold transition duration-300 ${
      tipoCadastro === "empresa"
        ? "bg-[#FD7702] text-white"
        : "bg-gray-300 text-gray-700"
    }`}
  >
    Empresa
  </button>
</div>

            <form onSubmit={handleCadastro}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                  ></input>
                </div>
                <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Senha</label>
                <input
                  id="senha"
                  type="senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                ></input>      
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Confirme sua senha</label>
                <input id="confirmacao" type="confirmacao" value={confrimacao} onChange={(e)=> setConfirmacao(e.target.value)} placeholder="Confirme sua senha." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main">
                </input>
              </div>
            </form>
            <p className=" text-pink-100 md:text-gray-500 mb-8 mt-7">
              Já possui uma conta?{' '}
              <a href="/login" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Login.
              </a>
            </p>
            <button type="submit" className="w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300" onClick={handleCadastro}>
                Proximo
              </button>

          </div>
        </div>
      </div>
    
  );
}
export default Cadastro;
