import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/UseAuth.jsx';

const ProtectedRoute = () => {
  // 1. Pega o usuário do contexto
  const { user } = useAuth();

  // 2. Verifica se o usuário está logado
  if (!user) {
    // 3. Se não estiver logado, redireciona para a página de login
    // 'replace' impede o usuário de voltar para a página protegida clicando em "Voltar"
    return <Navigate to="/login" replace />;
  }

  // 4. Se estiver logado, renderiza o componente da rota (a página filha)
  // O <Outlet /> é o "espaço" onde o React Router colocará a página
  // (ex: <FeedPageCliente />, <PerfilCliente />, etc.)
  return <Outlet />;
};

export default ProtectedRoute;