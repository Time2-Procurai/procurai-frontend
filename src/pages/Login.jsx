import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const usuarios = [
      { email: 'cliente@email.com', senha: '123456', tipo: 'cliente' },
      { email: 'lojista@email.com', senha: '123456', tipo: 'lojista' },
    ];

    const usuarioEncontrado = usuarios.find(
      (u) => u.email === email && u.senha === password
    );

    if (usuarioEncontrado) {
      // Gera token fictício
      const fakeToken = 'jwt-token-falso';
      localStorage.setItem('novo-projeto-token', fakeToken);
      localStorage.setItem('usuario-tipo', usuarioEncontrado.tipo);

      // Redireciona com base no tipo
      if (usuarioEncontrado.tipo === 'cliente') {
        navigate('/FeedCliente');
      } else {
        navigate('/FeedEmpresa');
      }

      } else {
        // simulação da msg de erro
        setError('Email ou senha inválidos.');
      }
  };

  return (
    <div className="min-h-screen text-gray-800 bg-[#1A225F]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <LadoLogoPage />
        {/* formulário */}
        <div className="flex flex-col justify-center items-center md:bg-white p-8 md:p-12">
          <div className="w-full max-w-sm">

            {/* telas menores caso vcs decidam colocar dps (ainda ta com as coisas do meu projeto, se quiser alterem) */}
            <div className="md:hidden text-center mb-52 text-white">
              <h2 className="font-display text-6xl relative inline-block">
                RecoSIS
              </h2>

              <p className="text-pink-100 mt-4 text-sm">
                Aumente o <strong className="font-bold text-white">volume</strong> 
                e se prepare para as recomendações que temos para você!
              </p>
            </div>
            
            <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800">
              Entrar na sua conta
            </h1>

            {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="email">
                  E-mail
                </label>

                <input id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Digite seu e-mail" 
                  className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main" 
                  required 
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                  Senha
                </label>

                <input id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Digite sua senha" 
                  className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main" 
                  required 
                />
              </div>

              <button type="submit" 
                className="shadow-lg w-full border-1 mb-4 md:bg-main text-main font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer">
                Faça Login com o Google
              </button>

              <button type="submit" 
                className="shadow-lg w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer">
                Entrar
              </button>

              <p className="mt-6 text-pink-100 md:text-gray-500 mb-8">
                Não tem uma conta?{' '}
                <a href="/cadastro" className="text-[#1A225F] md:text-main font-bold hover:underline">
                  Cadastre-se
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;