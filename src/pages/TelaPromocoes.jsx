import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, Store, ShoppingBag } from 'lucide-react';
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
  const { userId: storeIdFromUrl } = useParams();

  const [promocoes, setPromocoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera dados de persistência simulada
  const promocoesSalvas = JSON.parse(localStorage.getItem('promocoes_ativas') || '{}');

  const visitanteId = localStorage.getItem('userId');
  const visitanteRole = localStorage.getItem('userRole');
  const isOwner = (visitanteId === storeIdFromUrl) && (visitanteRole === 'lojista');

  useEffect(() => {
    const fetchPromocoes = async () => {
      if (!storeIdFromUrl) {
        setError("ID da loja não encontrado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`products/store/${storeIdFromUrl}/`);
        const todosProdutos = response.data;

        // FILTRAGEM E ENRIQUECIMENTO DE DADOS
        // Filtra apenas produtos que têm ID presente no objeto 'promocoesSalvas'
        // E adiciona o campo 'discount_percentage' dinamicamente
        const produtosEmOferta = todosProdutos
          .filter(produto => promocoesSalvas[produto.id])
          .map(produto => ({
            ...produto,
            discount_percentage: promocoesSalvas[produto.id]
          }));

        setPromocoes(produtosEmOferta);

      } catch (err) {
        console.error("Erro ao buscar promoções:", err);
        setError("Não foi possível carregar as promoções da loja.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromocoes();
  }, [storeIdFromUrl]);

  // Formata Preço
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Renderiza a Tag Dinâmica
  const renderDiscountTag = (produto) => {
    if (produto.discount_percentage) {
      return (
        <span className="bg-orange-100 text-[#FD7702] border border-orange-200 px-2 py-1 rounded text-xs font-bold ml-2">
          {produto.discount_percentage}% OFF
        </span>
      );
    }
    return null;
  };

  // Calcula preço final para exibir
  const getFinalPrice = (produto) => {
    const original = parseFloat(produto.price);
    const desconto = produto.discount_percentage;
    if (desconto) {
      return original * (1 - (desconto / 100));
    }
    return original;
  };

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
                        const role = localStorage.getItem('userRole');
                        const id = localStorage.getItem('userId');

                        if (role === 'lojista') {
                          navigate(`/FeedEmpresa/${id}`);
                        } else {
                          // Assume que se não for lojista, é cliente
                          navigate(`/FeedCliente/${id}`);
                        }
                      }}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                >
                  <ChevronLeft size={28} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isOwner ? "Minhas Promoções Ativas" : "Ofertas Especiais"}
                </h1>
              </div>

              {isOwner && (
                <div className="flex gap-3">
                  <button
                    // Agora leva para a nova tela que criamos
                    onClick={() => navigate('/promocoes/adicionar')}
                    className="cursor-pointer shadow-md bg-[#FD7702] text-white font-bold py-2.5 px-6 rounded-full hover:bg-[#e66a00] hover:scale-105 transition-all flex items-center gap-2"
                  >
                    + Nova Promoção
                  </button>
                </div>
              )}
            </div>

            {promocoes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {promocoes.map((produto) => (
                  <div
                    key={produto.id}
                    onClick={() => navigate(`/produto/${produto.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full group"
                  >
                    <div className="h-48 bg-gray-100 p-4 flex justify-center items-center relative">
                      {/* Badge de Promoção Flutuante */}
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
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
                        {/* Preço "De" riscado */}
                        <div className="text-xs text-gray-400 line-through">
                          De {formatPrice(produto.price)}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#FD7702] font-extrabold text-xl">
                            {formatPrice(getFinalPrice(produto))}
                          </span>
                          {renderDiscountTag(produto)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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