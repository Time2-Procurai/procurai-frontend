import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, Store, MoreVertical } from 'lucide-react'; 
import api from '../api/api';

function CatalogoEmpresa() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId: storeId } = useParams(); 
  const visitanteId = localStorage.getItem('userId');
  const isOwner = storeId === visitanteId;

  useEffect(() => {
    if (!storeId) {
      setError("ID da loja não encontrado na URL.");
      setIsLoading(false);
      return;
    }
    const fetchProdutos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`products/store/${storeId}/`);
        setProdutos(response.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdutos();
  }, [storeId]);

  const handleProductMenuClick = (e, produtoId) => {
    e.stopPropagation(); 
    console.log(`Menu clicado para o produto ID: ${produtoId}`);
    alert(`Opções para o produto ${produtoId}:\n- Editar\n- Excluir`);
  };

  if (isLoading) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center items-center">
            <p className="text-xl text-gray-500 animate-pulse">Carregando produtos...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <main className="flex-1 overflow-y-auto p-6 bg-white flex justify-center items-center">
            <p className="text-xl text-red-500">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-start mb-6">
            <button
              onClick={() => navigate(`/perfil/empresa/${storeId}`)}
              className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Todos os produtos
            </h1>
          </div>

          {isOwner && (
            <div className="justify-center flex gap-40 mb-8">
              <button
                onClick={() => navigate('/produtos/adicionar')}
                className="shadow-md border-2 border-[#FD7702] font-medium py-3 px-8 rounded-sm hover:bg-[#FD7702] hover:text-white hover:cursor-pointer transition-colors"
              >
                Adicionar novo produto
              </button>
              <button
                onClick={() => navigate(`/estatisticas/${storeId}`)}
                className="shadow-md border-2 border-[#FD7702] font-medium py-3 px-8 rounded-sm hover:bg-[#FD7702] hover:text-white hover:cursor-pointer transition-colors"
              >
                Acessar minhas estatísticas
              </button>
            </div>
          )}

          {produtos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="hover:cursor-pointer shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow relative"
                  onClick={() => navigate(`/produto/${produto.id}`)}
                >
                  
                  {isOwner && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => handleProductMenuClick(e, produto.id)}
                        className="p-1 rounded-full bg-white/80 text-gray-700 hover:bg-gray-100 transition shadow-md"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  )}

                  <div className="w-full h-48 flex justify-center items-center bg-gray-50 py-4">
                    {produto.product_image ? (
                      <img
                        src={produto.product_image}
                        alt={produto.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Store size={48} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-sm font-medium text-gray-800 mb-1 truncate">
                      {produto.name}
                    </h2>
                    {/* --- CORREÇÃO AQUI --- */}
                    <p className="text-gray-700 font-semibold">
                      R$ {parseFloat(produto.price).toFixed(2).replace('.', ',')}
                    </p> 
                    {/* --- FIM DA CORREÇÃO --- */}
                    {produto.is_negotiable && (
                      <p className="text-green-600 font-semibold text-sm mt-1">
                        Preço negociável
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Store size={48} className="mb-4 text-gray-600" />
              <p className="text-lg font-medium">Nenhum produto adicionado no catálogo</p>
              {isOwner && (
                <p className="text-md mt-1">
                  Clique em <span className="text-[#FD7702] font-semibold">Adicionar novo produto</span> para começar.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CatalogoEmpresa;