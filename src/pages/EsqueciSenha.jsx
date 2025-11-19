import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';
import api from '../api/api';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Estado para mensagem de sucesso
  const [loading, setLoading] = useState(false); // Estado para desabilitar botão enquanto envia
  
  // Não precisa de navigate se for apenas mostrar mensagem, 
  // mas mantive caso queira redirecionar depois
  const navigate = useNavigate(); 

  const handleResetRequest = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // ATENÇÃO: Verifique qual é a rota correta no seu Back-end para "Forgot Password"
      // Geralmente é algo como 'user/password_reset/' ou 'auth/reset-password/'
      await api.post('user/password_reset/', {
        email: email,
      });

      setSuccess('Um link de redefinição foi enviado para o seu e-mail.');
      setEmail(''); // Limpa o campo após o sucesso

    } catch (err) {
      console.error('Falha ao solicitar redefinição:', err);
      setError('Erro ao enviar. Verifique se o e-mail está correto ou tente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-[#1A225F]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <LadoLogoPage />
        
        {/* Lado do Formulário */}
        <div className="flex flex-col justify-center items-center md:bg-white p-8 md:p-12">
          <div className="w-full max-w-sm">

            <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800">
              Recuperar Senha
            </h1>
            
            <p className="text-pink-100 md:text-gray-500 mb-8 text-sm">
              Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
            </p>

            {/* Mensagens de Erro ou Sucesso */}
            {error && (
              <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4 border border-red-200">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-100 text-green-700 text-center p-3 rounded-md mb-4 border border-green-200">
                {success}
              </p>
            )}

            <form onSubmit={handleResetRequest}>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="email">
                  E-mail
                </label>

                <input id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Digite seu e-mail cadastrado" 
                  className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main" 
                  required 
                  disabled={loading}
                />
              </div>

              {/* Botão de Envio */}
              <button type="submit" 
                disabled={loading}
                className={`shadow-lg w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>

              <div className="mt-8 text-center">
                <p className="text-pink-100 md:text-gray-500">
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

export default ForgotPasswordPage;