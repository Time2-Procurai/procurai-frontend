import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, Bell, Store } from 'lucide-react';
import api from '../api/api'; // Importe a API

function Notificacoes() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. BUSCAR NOTIFICAÇÕES DA API ---
  useEffect(() => {
    const fetchNotificacoes = async () => {
      // 1. Verificação de Segurança Local
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Se não tiver token, nem tenta chamar a API, vai pro login direto
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        // Chama o endpoint que criamos no Django
        const response = await api.get('/notifications/');
        setNotificacoes(response.data);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
        
        // 2. Verificação de Segurança da Resposta
        if (err.response && err.response.status === 401) {
             // Se o token for inválido/expirado, redireciona
             navigate('/login');
             return;
        }

        setError("Não foi possível carregar suas notificações.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificacoes();
  }, [navigate]); // Adicionei navigate às dependências

  // --- 2. LÓGICA DE REDIRECIONAMENTO ---
  const handleNotificationClick = async (notificacao) => {
    try {
      // Marca como lida no backend (opcional, mas recomendado)
      if (!notificacao.is_read) {
        await api.post(`/notifications/${notificacao.id}/read/`);
        // Atualiza estado local para mostrar como lida visualmente
        setNotificacoes(prev => prev.map(n => 
          n.id === notificacao.id ? { ...n, is_read: true } : n
        ));
      }

      // Redireciona baseado no tipo e no objeto vinculado
      if (notificacao.type === 'new_post' && notificacao.object_id) {
        navigate(`/post/${notificacao.object_id}`);
      } else if (notificacao.type === 'favorite_promo' && notificacao.object_id) {
        navigate(`/produto/${notificacao.object_id}`);
      } else {
        console.log("Notificação genérica ou sem link");
      }
    } catch (err) {
      console.error("Erro ao processar clique:", err);
    }
  };

  // --- 3. HELPERS DE FORMATAÇÃO ---
  const getTitleSuffix = (type) => {
    switch (type) {
      case 'announcement': return 'anunciou uma nova promoção';
      case 'favorite_promo': return 'está com uma promoção no produto que você favoritou';
      case 'new_post': return 'fez um nova publicação';
      default: return 'enviou uma notificação';
    }
  };

  // Helper simples para formatar preço caso venha como número
  const formatPrice = (val) => {
    if (!val) return "";
    if (typeof val === 'string' && val.includes('R$')) return val;
    return parseFloat(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto bg-white p-8">
          
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="hover:bg-gray-100 p-1 rounded-full transition"
            >
              <ChevronLeft size={32} className="text-black" />
            </button>
            <h1 className="text-2xl font-bold text-black">Notificações</h1>
          </div>

          {/* --- CONTEÚDO DA LISTA --- */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-gray-500 animate-pulse">Carregando notificações...</p>
            </div>
          ) : error ? (
             <div className="text-center py-10 text-red-500">
               <p>{error}</p>
             </div>
          ) : notificacoes.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Bell size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Você não tem novas notificações.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notificacoes.map((notificacao) => (
                <div 
                  key={notificacao.id} 
                  onClick={() => handleNotificationClick(notificacao)}
                  className={`flex gap-5 py-6 border-b border-gray-200 last:border-none hover:bg-gray-50 transition p-4 rounded-lg cursor-pointer ${!notificacao.is_read ? 'bg-orange-50/50' : ''}`}
                >
                  
                  {/* Avatar da Loja */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                      {notificacao.avatar ? (
                        <img 
                          src={notificacao.avatar} 
                          alt={notificacao.storeName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Store size={24} className="text-gray-500"/>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900 font-medium mb-2">
                      <span className="font-bold">{notificacao.storeName}</span> {getTitleSuffix(notificacao.type)}
                    </h3>

                    {/* Texto (Anúncio ou Post) */}
                    {(notificacao.type === 'announcement' || notificacao.type === 'new_post') && (
                      <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                        {notificacao.title && (
                          <p className="font-semibold text-gray-800">{notificacao.title}</p>
                        )}
                        <p className="line-clamp-3">
                          {notificacao.content}
                        </p>
                      </div>
                    )}

                    {/* Produto Favoritado (CARD COM PREÇOS) */}
                    {notificacao.type === 'favorite_promo' && (
                      <div className="mt-3 bg-white border border-gray-200 rounded-md p-4 shadow-sm inline-block min-w-[300px]">
                        <p className="font-bold text-gray-800 text-base mb-1">
                          {notificacao.productName || "Produto em oferta"}
                        </p>
                        
                        {/* Exibe preços se o backend enviar (productOldPrice / productNewPrice) */}
                        {(notificacao.productNewPrice || notificacao.content) ? (
                            <div className="flex items-center gap-3">
                                {notificacao.productOldPrice && (
                                    <span className="text-xs text-gray-400 line-through">
                                        {formatPrice(notificacao.productOldPrice)}
                                    </span>
                                )}
                                <span className="text-[#FD7702] font-extrabold text-lg">
                                    {formatPrice(notificacao.productNewPrice)}
                                </span>
                                {/* Fallback: se não tiver campos específicos, mostra o content */}
                                {!notificacao.productNewPrice && (
                                    <span className="text-sm text-gray-600">{notificacao.content}</span>
                                )}
                            </div>
                        ) : (
                             <p className="text-xs text-[#FD7702] font-semibold">Clique para ver o desconto!</p>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-3">
                      {notificacao.date}
                    </p>
                  </div>

                  {/* Bolinha de 'Não lido' */}
                  {!notificacao.is_read && (
                    <div className="flex-shrink-0 pt-2">
                      <div className="w-3 h-3 bg-[#FD7702] rounded-full"></div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Notificacoes;