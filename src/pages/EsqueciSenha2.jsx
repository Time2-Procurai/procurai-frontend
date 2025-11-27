import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';
import api from '../api/api';

function ForgotPasswordPage2() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Ajuste esta rota conforme seu backend
      await api.post('user/password_reset/verify/', { // Trocar ?
        code: code,
      });

      setSuccess('Código verificado com sucesso!');
      // Redireciona para pagina de redefinir senha
      setTimeout(() => {
        navigate('/redefinirSenha/3');
      }, 1200);

    } catch (err) {
      console.error('Erro ao verificar código:', err);
      setError('Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post('user/password_reset/resend/');
      setSuccess('Novo código enviado para seu e-mail.');
    } catch (err) {
      setError('Erro ao reenviar código. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen text-gray-800 bg-[#1A225F]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <LadoLogoPage />

        <div className="flex flex-col justify-center items-center md:bg-white p-8 md:p-12">
          <div className="w-full max-w-sm">

            <h1 className="text-[28px] font-bold mb-2 text-white md:text-gray-800 text-center">
              Insira o código de seis dígitos
            </h1>

            <p className="font-semibold md:text-gray-800 mb-8 mt-4 text-md text-center">
              Verifique se o código chegou no seu e-mail.
            </p>

            {/* Mensagens */}
            {error && (
              <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleVerifyCode}>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]">
                  Código
                </label>

                <input
                  type="text"
                  value={code}
                  maxLength={6} // código de até 6 dígitos
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite o código"
                  className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#00008B] mt-4 hover:underline text-sm font-semibold cursor-pointer"
                  disabled={loading}
                >
                  Reenviar código
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`shadow-lg w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Verificando...' : 'Enviar'}
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

export default ForgotPasswordPage2;