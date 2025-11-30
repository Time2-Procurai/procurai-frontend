import React, { useState } from 'react';
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Insira um e-mail válido.");
      return;
    }

    /*const passwordRegex = /^[A-Za-z0-9!@#$%&*.\-_?]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Insira uma senha válida.");
      return;
    }*/

    try {
      const response = await api.post('user/token/', {
        email: email,
        password: password,
      });

      const { access, refresh } = response.data;

      // --- CORREÇÃO AQUI ---
      // Decodifique o token para pegar o payload
      const decoded = jwtDecode(access);

      // Pegue os dados do payload
      const userRole = decoded.role;
      // O nome aqui (ex: "user_id") deve ser o mesmo que o backend colocou no token
      const userId = decoded.user_id;

      // Verificação de segurança: Garante que o ID foi encontrado
      if (!userId) {
        console.error("user_id não encontrado no token JWT!");
        setError("Erro ao processar login. Tente novamente.");
        return;
      }

      // Salve TUDO no localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userId', userId); // <-- A LINHA QUE FALTAVA

      console.log(`Login com sucesso! Role: ${userRole}, ID: ${userId}`);

      // Navegação (seu código aqui está perfeito)
      if (userRole === 'cliente') {
        navigate('/FeedCliente/' + userId);
      } else if (userRole === 'lojista') {
        navigate('/FeedEmpresa/' + userId);
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Falha no login:', err);
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    // ... O resto do seu JSX (não precisa mudar nada) ...
    <div className="h-screen flex text-gray-800 bg-[#1A225F] overflow-hidden">
      <div className="w-1/2 h-screen">
        <LadoLogoPage />
      </div>

      {/* formulário */}
      <div className="w-1/2 h-screen bg-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-sm">

          <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800 mb-4">
            Entrar na sua conta
          </h1>

          {error &&
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4 whitespace-pre-line">
              {error}
            </p>}

          <form onSubmit={handleLogin}>
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
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                Senha
              </label>

              <input id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // limpa o erro ao começar a digitar
                }}
                placeholder="Digite sua senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-main"
              />
            </div>

            <p className=" text-pink-100 md:text-gray-500 mb-4 text-right">
              <a href="/redefinirSenha" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Esqueceu a senha?
              </a>
            </p>

            {/* Este é o botão que submete o formulário */}
            <button type="submit"
              className="shadow-lg w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300 cursor-pointer"
            >
              Entrar
            </button>

            <p className="mt-6 text-pink-100 md:text-gray-700 mb-8 text-center">
              Não tem uma conta?{' '}
              <a href="/cadastro" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Cadastre-se
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;