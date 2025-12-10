import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api'; 
import { Eye, Store, TrendingUp, Tag } from 'lucide-react';

function FeedPageEmpresa() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); 

  const [maisVistos, setMaisVistos] = useState([]);
  const [promoMaisVistos, setPromoMaisVistos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        // --- MUDANÇA PRINCIPAL AQUI ---
        // Usamos a rota dedicada 'my_products' que criamos no backend.
        // Ela garante que só vêm produtos do usuário logado (baseado no token).
        const response = await api.get('/products/my_products/');
        
        let produtos = response.data;

        // Ordenação Manual no Front (Garantia extra)
        // Ordena por view_count decrescente
        produtos.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        
        // 1. Top 4 Mais Vistos Geral
        setMaisVistos(produtos.slice(0, 4));

        // 2. Top 4 Promoções Mais Vistas
        const emPromocao = produtos.filter(p => p.is_promotion);
        setPromoMaisVistos(emPromocao.slice(0, 4));

      } catch (error) {
        console.error("Erro ao buscar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []); // Removemos dependência de userId pois o token já define quem é

  const ProductCard = ({ product, isPromo }) => (
    <div 
      onClick={() => navigate(`/produto/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="h-40 bg-gray-100 relative flex items-center justify-center overflow-hidden">
        {product.product_image ? (
          <img 
            src={product.product_image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Store className="text-gray-300" size={40} />
        )}
        
        {product.is_promotion && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Tag size={10} /> PROMO
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{product.category_name || "Geral"}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.is_promotion && product.old_price && (
                <span className="text-xs text-gray-400 line-through block">
                    R$ {parseFloat(product.old_price).toFixed(2).replace('.', ',')}
                </span>
            )}
            <span className={`font-bold ${product.is_promotion ? 'text-red-500' : 'text-gray-900'}`}>
              R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <Eye size={14} />
            {/* Aqui mostra o contador vindo do banco */}
            <span className="text-xs font-semibold">{product.view_count/2 || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50"> 
          
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Painel da Loja</h1>

          {/* SEÇÃO 1 */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <TrendingUp size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Produtos mais vistos</h2>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center text-gray-400 animate-pulse">Carregando dados...</div>
            ) : maisVistos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {maisVistos.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            ) : (
                <p className="text-gray-500 bg-white p-6 rounded-lg border border-gray-200">
                    Nenhum produto encontrado. Cadastre novos produtos para ver as estatísticas.
                </p>
            )}
          </section>

          {/* SEÇÃO 2 */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                    <Tag size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Destaques em promoção</h2>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center text-gray-400 animate-pulse">Carregando dados...</div>
            ) : promoMaisVistos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {promoMaisVistos.map(p => <ProductCard key={p.id} product={p} isPromo={true} />)}
                </div>
            ) : (
                <div className="text-gray-500 bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center">
                    <p>Nenhum produto em promoção encontrado.</p>
                    <button 
                        onClick={() => navigate('/adicionarProduto')}
                        className="mt-4 text-[#FD7702] font-semibold hover:underline"
                    >
                        Criar promoção agora
                    </button>
                </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default FeedPageEmpresa;