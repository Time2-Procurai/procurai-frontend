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

  // Estados do Modal de Desconto
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [porcentagemDesconto, setPorcentagemDesconto] = useState('');
  const [isSaving, setIsSaving] = useState(false); // Estado de loading ao salvar

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

  // --- FUNÇÃO PRINCIPAL: APLICA O DESCONTO NO BACKEND ---
  const handleSalvarPromocao = async () => {
    if (!produtoSelecionado || !porcentagemDesconto) return;

    const desconto = parseFloat(porcentagemDesconto);
    if (isNaN(desconto) || desconto <= 0 || desconto >= 100) {
      alert("Por favor, insira uma porcentagem válida (1-99).");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Calcular o novo preço
      const precoAtual = parseFloat(produtoSelecionado.price);
      const valorDoDesconto = precoAtual * (desconto / 100);
      const novoPreco = precoAtual - valorDoDesconto;

      // 2. Preparar o payload como FormData (CORREÇÃO PARA O ERRO 415)
      // O backend espera multipart/form-data por causa do parser de imagens configurado na View
      const formData = new FormData();
      
      formData.append('price', novoPreco.toFixed(2));
      formData.append('old_price', precoAtual.toFixed(2)); // Salva o original
      formData.append('is_promotion', 'true'); // Envia como string, o Django converte

      // 3. Enviar para a API
      // Não definimos 'Content-Type' manualmente, o axios faz isso ao ver o FormData
      const response = await api.patch(`/products/${produtoSelecionado.id}/`, formData);

      // 4. Atualizar a lista localmente (para o usuário ver a mudança na hora)
      setProdutos(prevProdutos => 
        prevProdutos.map(prod => 
          prod.id === produtoSelecionado.id ? response.data : prod
        )
      );

      alert(`Sucesso! O preço caiu de R$ ${precoAtual.toFixed(2)} para R$ ${novoPreco.toFixed(2)}.`);
      
      // 5. Limpar e fechar modal
      setProdutoSelecionado(null);
      setPorcentagemDesconto('');

    } catch (error) {
      console.error("Erro ao aplicar promoção:", error);
      alert("Erro ao aplicar promoção. Tente novamente.");
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
            <button onClick={() => navigate(-1)} className="cursor-pointer p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
              <ChevronLeft size={28} />
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
                    {/* Badge se já estiver em promoção */}
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
            isLoading={isSaving} // Passar estado de loading para o modal desabilitar botão
          />
        </main>
      </div>
    </div>
  );
}

export default TelaAdicionarPromocao;