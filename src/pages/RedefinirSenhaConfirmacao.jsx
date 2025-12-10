import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LadoLogoPage from '../components/LadoLogoPage';
import api from '../api/api';

function RedefinirSenhaConfirmacao() {
  const { uid, token } = useParams(); // Pega da URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Chama a rota de confirmação do backend
      await api.post('user/password_reset_confirm/', {
        uid: uid,
        token: token,
        password: password
      });

      setMessage("Senha alterada com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("O link é inválido ou expirou. Tente solicitar novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-[#1A225F]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <LadoLogoPage />

        <div className="flex flex-col justify-center items-center md:bg-white p-8 md:p-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold mb-6 text-white md:text-gray-800">
              Nova Senha
            </h1>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
            {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</p>}

            {!message && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2 text-white md:text-gray-800">Nova Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Digite sua nova senha"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2 text-white md:text-gray-800">Confirmar Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Confirme a nova senha"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full bg-[#FD7702] text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Alterando..." : "Alterar Senha"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RedefinirSenhaConfirmacao;

// Em App.jsx
// Importe

// ...

// Dentro do <Routes>
// Esta é a rota que o usuário acessa ao clicar no e-mail