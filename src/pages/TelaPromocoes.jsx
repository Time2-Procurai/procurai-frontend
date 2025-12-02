import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, Store, ShoppingBag, Heart } from 'lucide-react';
import api from '../api/api';

const LoadingSpinner = () => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-xl text-gray-500 animate-pulse">Carregando promoções...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-red-500">{message}</p>
  </div>
);

function TelaPromocoes() {
  const navigate = useNavigate();
  const { userId: paramId } = useParams(); // ID da URL (Pode ser do Cliente ou da Loja)

  const [promocoes, setPromocoes] = useState([]);
  const [favoritosEmPromocao, setFavoritosEmPromocao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const visitanteRole = localStorage.getItem('userRole');
  const isCliente = visitanteRole === 'cliente';
  // Se for lojista, o ID da URL deve ser o dele mesmo para ser dono
  const isOwner = (!isCliente) && (localStorage.getItem('userId') === paramId);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isCliente) {
            // --- LÓGICA DO CLIENTE ---
            // 1. Busca os favoritos do usuário logado
            const responseFavoritos = await api.get('/products/favorites/user/'+localStorage.getItem('userId')+'/');
            const listaFavoritos = responseFavoritos.data; // Array de objetos { id, product: {...} }
          
            // 2. Filtra: Apenas produtos onde (Preço Antigo > Preço Atual)
            // Isso garante que é uma promoção real.
            const favsComDesconto = listaFavoritos
                .map(fav => fav.product) // Extrai o objeto do produto
                .filter(prod => {
                    if (!prod || !prod.old_price) return false;
                    // Converte para float para garantir a comparação numérica
                    const price = parseFloat(prod.price);
                    const oldPrice = parseFloat(prod.old_price);
                    return oldPrice > price;
                });

            setFavoritosEmPromocao(favsComDesconto);
            setPromocoes([]); // Cliente vendo promoções gerais: poderia ser uma lista de 'todas as ofertas', mas o foco aqui é favoritos.

        } else {
            // --- LÓGICA DO LOJISTA (Visualizando sua própria loja ou outra) ---
            if (!paramId) throw new Error("ID da loja não encontrado.");

            // Busca produtos da loja especificada na URL
            const responseProdutos = await api.get(`products/store/${paramId}/`);
            const todosProdutos = responseProdutos.data;

            // Filtra produtos marcados como promoção
            const produtosEmOferta = todosProdutos.filter(produto => produto.is_promotion);
            setPromocoes(produtosEmOferta);
            setFavoritosEmPromocao([]);
        }

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar as promoções.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paramId, isCliente]);

  // Formata Preço
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Calcula % de desconto
  const calcularDesconto = (precoAtual, precoAntigo) => {
      if (!precoAntigo || parseFloat(precoAntigo) <= parseFloat(precoAtual)) return null;
      const desconto = ((parseFloat(precoAntigo) - parseFloat(precoAtual)) / parseFloat(precoAntigo)) * 100;
      return Math.round(desconto);
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-[#F8F9FA]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : (
          <main className="flex-1 overflow-y-auto p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isOwner) {
                       navigate(`/FeedEmpresa`);
                    } else if (isCliente) {
                       navigate(`/feedcliente/${paramId}`); // Cliente volta para o seu feed
                    } else {
                       navigate(`/perfil/empresa/${paramId}`);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                >
                  <ChevronLeft size={28} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isOwner ? "Minhas Promoções Ativas" : (isCliente ? "Promoções" : "Ofertas Especiais")}
                </h1>
              </div>

              {isOwner && (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/promocoes/adicionar')}
                    className="cursor-pointer shadow-md bg-[#FD7702] text-white font-bold py-2.5 px-6 rounded-full hover:bg-[#e66a00] hover:scale-105 transition-all flex items-center gap-2"
                  >
                    + Gerenciar Promoções
                  </button>
                </div>
              )}
            </div>

            {/* --- SEÇÃO: FAVORITOS EM PROMOÇÃO (Só aparece para Cliente) --- */}
            {isCliente && (
                <section className="mb-10">
                    {favoritosEmPromocao.length > 0 ? (
                        <>
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="text-red-500 fill-current" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Favoritos com preço reduzido!</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favoritosEmPromocao.map((produto) => (
                                    <div
                                    key={produto.id}
                                    onClick={() => navigate(`/produto/${produto.id}`)}
                                    className="bg-white rounded-xl shadow-sm border-2 border-red-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full group"
                                >
                                    <div className="h-48 bg-red-50 p-4 flex justify-center items-center relative">
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                                        <Heart size={12} fill="white" /> FAVORITO
                                    </div>
                                    
                                    {produto.product_image ? (
                                        <img src={produto.product_image} alt={produto.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300" />
                                    ) : (
                                        <ShoppingBag size={48} className="text-gray-400" />
                                    )}
                                    </div>
                
                                    <div className="p-4 flex flex-col flex-grow bg-white relative">
                                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{produto.name}</h3>
                
                                    <div className="mt-auto pt-2">
                                        {produto.old_price && (
                                            <div className="text-xs text-gray-400 line-through">
                                            De {formatPrice(produto.old_price)}
                                            </div>
                                        )}
                
                                        <div className="flex items-center justify-between">
                                        <span className="text-[#FD7702] font-extrabold text-xl">
                                            {formatPrice(produto.price)}
                                        </span>
                                        {produto.old_price && (
                                            <span className="bg-orange-100 text-[#FD7702] border border-orange-200 px-2 py-1 rounded text-xs font-bold ml-2">
                                                {calcularDesconto(produto.price, produto.old_price)}% OFF
                                            </span>
                                        )}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            <Heart size={64} className="mb-4 text-gray-300" />
                            <p className="text-xl font-semibold text-gray-600">Nenhum favorito em promoção no momento.</p>
                            <p className="text-sm text-gray-400 mt-2">Fique de olho! Quando o preço de um favorito baixar, ele aparecerá aqui.</p>
                        </div>
                    )}
                </section>
            )}


            {/* --- SEÇÃO: LISTA GERAL DE PROMOÇÕES (Para Lojista ou Visitante em Loja Específica) --- */}
            {!isCliente && promocoes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {promocoes.map((produto) => (
                  <div
                    key={produto.id}
                    onClick={() => navigate(`/produto/${produto.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full group"
                  >
                    <div className="h-48 bg-gray-100 p-4 flex justify-center items-center relative">
                      <div className="absolute top-2 right-2 bg-[#FD7702] text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                        OFERTA
                      </div>

                      {produto.product_image ? (
                        <img
                          src={produto.product_image}
                          alt={produto.name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <ShoppingBag size={48} className="text-gray-400" />
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow bg-white relative">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                        {produto.name}
                      </h3>

                      <div className="mt-auto pt-2">
                        {produto.old_price && (
                             <div className="text-xs text-gray-400 line-through">
                               De {formatPrice(produto.old_price)}
                             </div>
                         )}

                        <div className="flex items-center justify-between">
                          <span className="text-[#FD7702] font-extrabold text-xl">
                            {formatPrice(produto.price)}
                          </span>
                           {produto.old_price && (
                               <span className="bg-orange-100 text-[#FD7702] border border-orange-200 px-2 py-1 rounded text-xs font-bold ml-2">
                                 {calcularDesconto(produto.price, produto.old_price)}% OFF
                               </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Mensagem vazia para Lojista */}
            {!isCliente && promocoes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    <Store size={64} className="mb-4 text-gray-300" />
                    <p className="text-xl font-semibold text-gray-600">Nenhuma promoção ativa no momento.</p>
                    {isOwner && (
                    <button
                        onClick={() => navigate('/promocoes/adicionar')}
                        className="mt-4 text-[#FD7702] font-semibold hover:underline cursor-pointer"
                    >
                        Clique aqui para adicionar sua primeira oferta
                    </button>
                    )}
                </div>
            )}

          </main>
        )}
      </div>
    </div>
  );
}

export default TelaPromocoes;