import React, { useState } from 'react'; // <-- CORREÇÃO: Removido o 'use'
import { useNavigate } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';

import api from '../api/api';
import { jwtDecode } from 'jwt-decode';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      
      const response = await api.post('token/', {
        email: email,
        password: password,
      });

      
      const { access, refresh } = response.data;
      
      
      const decoded = jwtDecode(access);
      const userRole = decoded.role;

      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', userRole);
      
      console.log("Login com sucesso! Role:", userRole);

      
      if (userRole === 'cliente') {
        navigate('/FeedCliente');
      } else if (userRole === 'lojista') {
        navigate('/FeedEmpresa');
      } else {
        navigate('/');
      }

    } catch (err) { 
      console.error('Falha no login:', err);
      setError('Email ou senha inválidos.');
    }

 
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-[#1A225F]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <LadoLogoPage />
        {/* formulário */}
        <div className="flex flex-col justify-center items-center md:bg-white p-8 md:p-12">
          <div className="w-full max-w-sm">

            {/* ... (o resto do seu JSX) ... */}
            
            <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800">
              Entrar na sua conta
            </h1>

            {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4">{error}</p>}

            {/* Este formulário chama o handleLogin corrigido */}
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main" 
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main" 
                  required 
                />
              </div>

              {/* OBSERVAÇÃO: Mudei o type para 'button' para não submeter o form */}
              <button type="button" 
              className="w-full border-1 mb-4 md:bg-main text-main font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer">
                Faça Login com o Google
              </button>

              {/* Este é o botão que submete o formulário */}
              <button type="submit" 
              className="w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer">
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