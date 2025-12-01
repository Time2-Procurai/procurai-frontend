import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Check, Store, ShoppingBag, RefreshCw } from 'lucide-react';
import BarraLateral from '../components/BarraLateral';
import BarraPesquisa from '../components/BarraPesquisa';
import ModalConfirmacaoFav from '../components/ModalConfirmacaoFav';
import api from '../api/api'; 

export default function TelaFavoritos() {
  const navigate = useNavigate();

  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controle de interação (Modal)
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); 
  const [showSuccess, setShowSuccess] = useState(false);

  // --- FUNÇÃO DE BUSCA (Extraída para poder recarregar) ---
  const fetchFavoritos = async () => {
    setIsLoading(true);
    setError(null);
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
       navigate('/login');
       return;
    }

    try {
      console.log("🔄 Buscando favoritos...");
      const response = await api.get('/products/favorites/user/'+localStorage.getItem('userId')+'/');
      console.log("✅ Resposta da API (Favoritos):", response.data);

      // --- CORREÇÃO PARA PAGINAÇÃO ---
      // Se o Django retornar paginação { results: [...] }, usamos o .results
      // Se retornar a lista direta [...], usamos o data direto
      let dadosLista = [];
      if (Array.isArray(response.data)) {
          dadosLista = response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
          console.log("⚠️ API está paginada. Usando response.data.results");
          dadosLista = response.data.results;
      } else {
          console.warn("⚠️ Formato de dados inesperado:", response.data);
      }

      setFavoritos(dadosLista);

    } catch (err) {
      console.error("❌ Erro ao buscar favoritos:", err);
      setError("Não foi possível carregar seus favoritos.");
      
      if (err.response && err.response.status === 401) {
           // Se for 401 real, o interceptor do api.js deveria ter tratado.
           // Se chegou aqui, o refresh falhou.
           console.error("Token expirado ou inválido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect inicial
  useEffect(() => {
    fetchFavoritos();
  }, [navigate]);

  const handleTrashClick = (productId) => {
    setItemToDelete(productId);
    setShowModal(true);
    setShowSuccess(false);
  };

  const confirmarExclusao = async () => {
    if (itemToDelete) {
      try {
        await api.post(`/products/favorite/${itemToDelete}/`);

        // Atualiza a lista localmente para ser rápido
        const novaLista = favoritos.filter((item) => {
            // Verifica se item.product existe antes de acessar o id
            return item.product && item.product.id !== itemToDelete;
        });
        setFavoritos(novaLista);

        setShowModal(false);
        setItemToDelete(null);
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 3000);

      } catch (err) {
        console.error("Erro ao remover favorito:", err);
        alert("Erro ao remover favorito.");
      }
    }
  };

  const cancelarExclusao = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const formatPrice = (price) => {
    if (!price) return "R$ 0,00";
    return parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] relative">

      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="w-full">

            <header className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button onClick={() => navigate(-1)} className="mr-3 text-gray-900 hover:text-[#FD7702] transition-colors">
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Produtos favoritos</h1>
              </div>
              
              {/* Botão de recarregar manual para teste */}
              <button onClick={fetchFavoritos} className="p-2 text-gray-500 hover:text-[#FD7702] transition" title="Recarregar lista">
                <RefreshCw size={20} />
              </button>
            </header>

            {showSuccess && (
              <div className="mb-6 flex items-center gap-2 animate-fadeIn p-3 bg-green-50 border border-green-200 rounded-md">
                <Check strokeWidth={4} className="text-[#FD7702] w-6 h-6" />
                <span className="font-bold text-black text-lg">Produto removido com sucesso!</span>
              </div>
            )}
            
            {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md text-center">
                   {error}
               </div>
            )}

            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <div className="w-10 h-10 border-4 border-[#FD7702] border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-gray-500">Carregando favoritos...</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritos.length > 0 ? (
                  favoritos.map((favItem) => {
                    const produto = favItem.product;
                    
                    // Proteção contra dados corrompidos
                    if (!produto) return null;

                    return (
                      <div 
                        key={favItem.id} 
                        className="relative flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/produto/${produto.id}`)}
                      >

                        <div className="relative flex h-56 items-center justify-center bg-gray-50 p-4">
                          {produto.product_image ? (
                            <img 
                              src={produto.product_image} 
                              alt={produto.name} 
                              className="max-h-full max-w-full object-contain" 
                            />
                          ) : (
                             <ShoppingBag size={48} className="text-gray-400" />
                          )}

                          <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTrashClick(produto.id);
                            }}
                            className="absolute bottom-0 right-4 translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-orange-400 bg-white text-gray-600 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all shadow-sm z-10"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-col justify-between bg-white p-4 pt-8 border-t border-gray-100">
                          <h3 className="mb-2 text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px]" title={produto.name}>
                            {produto.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-gray-900">
                                {formatPrice(produto.price)}
                            </span>
                            {produto.is_negotiable && (
                                <span className="text-xs font-bold text-[#FD7702] uppercase">Negociável</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                    <ShoppingBag size={64} className="text-gray-300 mb-4" />
                    <p className="text-lg font-medium">Você ainda não tem produtos favoritos.</p>
                    <p className="text-sm text-gray-400 mb-6">Explore o catálogo e salve o que mais gostar!</p>
                    <button 
                        onClick={() => navigate('/search')}
                        className="px-6 py-2 bg-[#FD7702] text-white rounded-full font-bold hover:opacity-90 transition"
                    >
                        Explorar produtos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <ModalConfirmacaoFav
        isOpen={showModal}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
        title="Remover favorito?"
        message="O item será removido da sua lista de favoritos. Tem certeza da sua ação?"
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

    </div>
  );
}