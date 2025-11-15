import React, { useState, useEffect } from 'react';
// --- 1. Importar hooks e API ---
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, Store } from 'lucide-react';
import api from '../api/api'; // Importar a instância da API

// (As imagens de fallback não são mais necessárias para a lógica principal)
// import imgParafusadeira from '../assets/parafusadeira.jpg';
// ...

function CatalogoEmpresa() {
  const navigate = useNavigate();

  // --- 2. Hooks de estado para dados dinâmicos ---
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. Pegar IDs da URL e do localStorage ---
  // Pega o ID da loja da URL (ex: /produtos/5)
  // Certifique-se que sua rota no App.jsx é '/produtos/:storeId'
  const { userId: storeId } = useParams(); 
  // Pega o ID do usuário logado (visitante)
  const visitanteId = localStorage.getItem('userId');

  // Verifica se o usuário logado é o dono deste catálogo
  const isOwner = storeId === visitanteId;

  // --- 4. useEffect para buscar produtos da API ---
  useEffect(() => {
    // Se não houver ID da loja na URL, não faz nada
    if (!storeId) {
      setError("ID da loja não encontrado na URL.");
      setIsLoading(false);
      return;
    }

    const fetchProdutos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usa o endpoint do seu urls.py: "store/<int:owner_id>/"
        // Assumindo que suas URLs de produto estão em 'products/'
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
  }, [storeId]); // Executa toda vez que o ID da loja na URL mudar

  // --- 5. Lógica de renderização ---
  
  // Estado de carregamento
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

  // Estado de erro
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

  // Renderização principal (quando sucesso)
  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {/* cabeçalho */}
          <div className="flex items-center justify-start mb-6">
            <button
              // Botão voltar agora volta para o perfil da loja que estamos vendo
              onClick={() => navigate(`/perfil/empresa/${storeId}`)}
              className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Todos os produtos
              {/* Opcional: Adicionar nome da loja, ex: "Produtos de {storeName}" */}
            </h1>
          </div>

          {/* --- 6. Botões só aparecem para o dono da loja --- */}
          {isOwner && (
            <div className="justify-center flex gap-40 mb-8">
              <button
                // Link para adicionar produto (a API sabe o 'owner' pelo token)
                onClick={() => navigate('/produtos/adicionar')}
                className="shadow-md border-2 border-[#FD7702] font-medium py-3 px-8 rounded-sm hover:bg-[#FD7702] hover:text-white hover:cursor-pointer transition-colors"
              >
                Adicionar novo produto
              </button>
              <button
                // Opcional: Rota de estatísticas (precisa ser criada)
                onClick={() => navigate(`/estatisticas/${storeId}`)}
                className="shadow-md border-2 border-[#FD7702] font-medium py-3 px-8 rounded-sm hover:bg-[#FD7702] hover:text-white hover:cursor-pointer transition-colors"
              >
                Acessar minhas estatísticas
              </button>
            </div>
          )}

          {/* grid de produtos */}
          {produtos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* --- 7. Mapear dados da API para o card --- */}
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="hover:cursor-pointer shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {/* Imagem do produto (com fallback) */}
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
                    <p className="text-gray-700 font-semibold">
                      {/* Formata o preço vindo da API */}
                      R$ {parseFloat(produto.price).toFixed(2).replace('.', ',')}
                    </p>
                    {/* Opcional: mostrar se é negociável */}
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
            // Mensagem de "Nenhum produto"
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