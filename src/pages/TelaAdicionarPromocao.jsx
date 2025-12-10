import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import api from '../api/api';
import ModalDefinirPromocao from '../components/ModalDefinirPromocao';

function TelaAdicionarPromocao() {
  const navigate = useNavigate();
  const lojistaId = localStorage.getItem('userId');

  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para armazenar o ID da comunidade (necessário para criar o post)
  const [communityId, setCommunityId] = useState(null);

  // Estados do Modal de Desconto
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [porcentagemDesconto, setPorcentagemDesconto] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Buscar Catálogo de Produtos
        const response = await api.get(`products/store/${lojistaId}/`);
        setProdutos(response.data);

        // 2. Buscar ID da Comunidade (para poder postar a notificação)
        try {
            const resComm = await api.get(`/community/lojista/${lojistaId}/`);
            if (resComm.data && resComm.data.id) {
                setCommunityId(resComm.data.id);
            }
        } catch (commErr) {
            console.warn("Lojista sem comunidade ou erro ao buscar:", commErr);
        }

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lojistaId]);

  // Helper de formatação (movido para fora ou declarado antes do uso no handle)
  const formatValue = (val) => {
     return parseFloat(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- FUNÇÃO PRINCIPAL: APLICA O DESCONTO E NOTIFICA ---
  const handleSalvarPromocao = async () => {
    if (!produtoSelecionado || !porcentagemDesconto) return;

    const desconto = parseFloat(porcentagemDesconto);
    if (isNaN(desconto) || desconto <= 0 || desconto >= 100) {
      alert("Por favor, insira uma porcentagem válida (1-99).");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Calcular os valores
      const precoAtual = parseFloat(produtoSelecionado.price);
      const valorDoDesconto = precoAtual * (desconto / 100);
      const novoPreco = precoAtual - valorDoDesconto;

      // 2. Atualizar Produto (PATCH)
      const formData = new FormData();
      formData.append('price', novoPreco.toFixed(2)); 
      formData.append('old_price', precoAtual.toFixed(2)); 
      formData.append('is_promotion', 'true'); 

      const response = await api.patch(`/products/${produtoSelecionado.id}/`, formData);

      // 3. Atualizar lista local
      setProdutos(prevProdutos => 
        prevProdutos.map(prod => 
          prod.id === produtoSelecionado.id ? response.data : prod
        )
      );

      // --- 4. CRIAR POST AUTOMÁTICO NA COMUNIDADE (Gera Notificação) ---
      if (communityId) {
          try {
              const postFormData = new FormData();
              postFormData.append('titulo', '🔥 Oferta Relâmpago!');
              postFormData.append('descricao', `O produto "${produtoSelecionado.name}" acabou de entrar em promoção! De ${formatValue(precoAtual)} por apenas ${formatValue(novoPreco)}. Venha conferir antes que acabe!`);
              postFormData.append('comunidade', communityId);
              
              // Se quiser adicionar a foto do produto no post (opcional, depende se o backend aceita URL ou apenas arquivo)
              // postFormData.append('imagem', ...); 

              await api.post('/community/publicacoes/criar/', postFormData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
              console.log("Post de notificação criado com sucesso.");
          } catch (postErr) {
              console.error("Erro ao criar post de notificação:", postErr);
              // Não impedimos o sucesso da promoção se o post falhar
          }
      }

      alert(`Promoção aplicada! O preço caiu de ${formatValue(precoAtual)} para ${formatValue(novoPreco)}.`);
      
      setProdutoSelecionado(null);
      setPorcentagemDesconto('');

    } catch (error) {
      console.error("Erro ao aplicar promoção:", error);
      alert("Erro ao aplicar promoção no servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-[#F8F9FA]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => navigate(-1)} className="cursor-pointer p-2 rounded-full text-gray-700 transition">
              <ChevronLeft size={28} className="cursor-pointer mr-3 text-gray-900 hover:text-[#FD7702] transition-colors"/>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Selecione um produto para promover</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
                 <p className="text-gray-500 animate-pulse">Carregando catálogo...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => setProdutoSelecionado(produto)}
                  className={`bg-white rounded-xl shadow-sm border cursor-pointer hover:ring-2 hover:ring-[#FD7702] transition overflow-hidden group 
                    ${produto.is_promotion ? 'border-orange-300 ring-1 ring-orange-200' : 'border-gray-200'}`}
                >
                  <div className="h-40 bg-gray-100 p-4 flex justify-center items-center relative">
                    {produto.is_promotion && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            EM OFERTA
                        </span>
                    )}
                    
                    {produto.product_image ? (
                      <img src={produto.product_image} alt={produto.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    ) : (
                      <ShoppingBag size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm truncate" title={produto.name}>{produto.name}</h3>
                    
                    <div className="mt-1">
                        {produto.is_promotion && produto.old_price ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through">{formatPrice(produto.old_price)}</span>
                                <span className="text-sm font-bold text-red-600">{formatPrice(produto.price)}</span>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-xs">Preço atual: {formatPrice(produto.price)}</p>
                        )}
                    </div>

                    <div className="mt-3 text-center py-2 bg-orange-50 text-[#FD7702] font-semibold rounded-lg text-sm group-hover:bg-[#FD7702] group-hover:text-white transition">
                      {produto.is_promotion ? 'Alterar Desconto' : 'Aplicar Desconto'}
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
            isLoading={isSaving}
          />
        </main>
      </div>
    </div>
  );
}

export default TelaAdicionarPromocao;