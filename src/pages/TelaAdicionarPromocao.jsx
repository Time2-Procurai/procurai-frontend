import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, Store, ShoppingBag, X, Check } from 'lucide-react';
import api from '../api/api';
import ModalDefinirPromocao from '../components/ModalDefinirPromocao';

function TelaAdicionarPromocao() {
  const navigate = useNavigate();
  const lojistaId = localStorage.getItem('userId');

  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal de Desconto
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [porcentagemDesconto, setPorcentagemDesconto] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get(`products/store/${lojistaId}/`);
        setProdutos(response.data);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdutos();
  }, [lojistaId]);

  // Função para salvar a promoção
  const handleSalvarPromocao = async () => {
    if (!produtoSelecionado || !porcentagemDesconto) return;

    const desconto = parseInt(porcentagemDesconto);
    if (isNaN(desconto) || desconto <= 0 || desconto >= 100) {
      alert("Por favor, insira uma porcentagem válida (1-99).");
      return;
    }

    try {
      // --- SIMULAÇÃO DE PERSISTÊNCIA (LOCALSTORAGE) ---
      // Como não posso alterar seu banco de dados para adicionar o campo 'discount_percentage',
      // vou salvar num objeto local para que a TelaPromocoes consiga ler.
      // Em produção, você faria: await api.patch(`/products/${produtoSelecionado.id}/`, { discount_percentage: desconto });

      const promocoesSalvas = JSON.parse(localStorage.getItem('promocoes_ativas') || '{}');
      promocoesSalvas[produtoSelecionado.id] = desconto;
      localStorage.setItem('promocoes_ativas', JSON.stringify(promocoesSalvas));

      // Feedback visual
      alert(`Promoção de ${desconto}% aplicada em ${produtoSelecionado.name}!`);
      setProdutoSelecionado(null); // Fecha modal
      setPorcentagemDesconto('');

    } catch (error) {
      console.error("Erro ao salvar promoção", error);
      alert("Erro ao aplicar promoção.");
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Cálculo do preço novo para preview
  const precoOriginal = produtoSelecionado ? parseFloat(produtoSelecionado.price) : 0;
  const precoComDesconto = produtoSelecionado && porcentagemDesconto
    ? precoOriginal * (1 - (parseInt(porcentagemDesconto) / 100))
    : precoOriginal;

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-[#F8F9FA]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => navigate(-1)} className="cursor-pointer p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Selecione um produto para promover</h1>
          </div>

          {isLoading ? (
            <p className="text-gray-500 animate-pulse">Carregando catálogo...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => setProdutoSelecionado(produto)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#FD7702] transition overflow-hidden group"
                >
                  <div className="h-40 bg-gray-100 p-4 flex justify-center items-center">
                    {produto.product_image ? (
                      <img src={produto.product_image} alt={produto.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    ) : (
                      <ShoppingBag size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{produto.name}</h3>
                    <p className="text-gray-500 text-xs mt-1">Preço atual: {formatPrice(produto.price)}</p>
                    <div className="mt-3 text-center py-2 bg-orange-50 text-[#FD7702] font-semibold rounded-lg text-sm group-hover:bg-[#FD7702] group-hover:text-white transition">
                      Aplicar Desconto
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- MODAL DE DEFINIÇÃO DE DESCONTO --- */}
          <ModalDefinirPromocao
            isOpen={!!produtoSelecionado}
            onClose={() => setProdutoSelecionado(null)}
            produto={produtoSelecionado}
            porcentagem={porcentagemDesconto}
            setPorcentagem={setPorcentagemDesconto}
            onConfirm={handleSalvarPromocao}
          />
        </main>
      </div>
    </div>
  );
}

export default TelaAdicionarPromocao;