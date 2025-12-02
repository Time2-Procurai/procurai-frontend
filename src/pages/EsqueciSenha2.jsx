import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';
import api from '../api/api';

function EsqueciSenha2() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      alert("Fluxo inválido. Por favor, inicie a recuperação de senha novamente.");
      navigate('/redefinirSenha');
    }
  }, [email, navigate]);

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('user/password-reset/validate/', { 
        email: email,
        code: code,
      });

      setSuccess('Código verificado com sucesso!');
      
      setTimeout(() => {
        navigate('/redefinirSenha/3', { state: { email, code } });
      }, 1200);

    } catch (err) {
      console.error('Erro ao verificar código:', err);
      setError('Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('user/password-reset/request/', { email });
      setSuccess('Novo código enviado para seu e-mail.');
    } catch (err) {
      setError('Erro ao reenviar código. Tente novamente.');
    } finally {
      setLoading(false);
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
              Verifique se o código chegou no seu e-mail: <strong>{email}</strong>
            </p>

            {/* Mensagens */}
            {error && (
              <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-100 text-green-700 text-center p-3 rounded-md mb-4">
                {success}
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
                  maxLength={6}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite o código"
                  className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />

                <div className="text-right">
                    <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-[#00008B] mt-4 hover:underline text-sm font-semibold cursor-pointer"
                    disabled={loading}
                    >
                    Reenviar código
                    </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`shadow-lg w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default EsqueciSenha2;