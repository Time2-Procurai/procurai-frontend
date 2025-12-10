import { useState, useEffect } from 'react';
import api from '../api/api';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, MoreVertical, Star, Bookmark, MessageCircle, ShoppingBag, Store, User } from 'lucide-react';

// Import dos Modais e Componentes
import ModalAvaliacao from '../components/ModalAvaliacao';
import ModalOpcoesProduto from '../components/ModalOpcoesProduto';
import ModalExcluirProduto from '../components/ModalExcluirProduto';
import FeedbackFav from '../components/FeedbackFav';

// --- 1. ADICIONE O MAPEAMENTO DE CATEGORIAS AQUI ---
  const categoryChoices = [
    { key: "eletronicos", label: "Eletrônicos" },
    { key: "vestuario", label: "Vestuário" },
    { key: "alimentos_bebidas", label: "Alimentos e Bebidas" },
    { key: "moveis_decoracao", label: "Móveis e Decoração" },
    { key: "livros_midia", label: "Livros e Mídia" },
    { key: "esportes_lazer", label: "Esportes e Lazer" },
    { key: "beleza_cuidados", label: "Beleza e Cuidados Pessoais" },
    { key: "automoveis_veiculos", label: "Automóveis e Veículos" },
    { key: "imoveis", label: "Imóveis" },
    { key: "servicos_profissionais", label: "Serviços Profissionais" },
    { key: "saude_bem_estar", label: "Saúde e Bem-estar" },
    { key: "educacao_cursos", label: "Educação e Cursos" },
    { key: "pets_animais", label: "Pets e Animais" },
    { key: "ferramentas_construcao", label: "Ferramentas e Construção" },
    { key: "arte_artesanato", label: "Arte e Artesanato" },
    { key: "brinquedos_jogos", label: "Brinquedos e Jogos" },
    { key: "joias_acessorios", label: "Jóias e Acessórios" },
    { key: "informatica", label: "Informática" },
    { key: "telefonia", label: "Telefonia" },
    { key: "eletrodomesticos", label: "Eletrodomésticos" },
    { key: "outros", label: "Outros" },
  ];

const getCategoryLabel = (key) => {
    const found = categoryChoices.find(item => item.key === key);
    return found ? found.label : key; // Se não achar, mostra a chave mesmo
  };

// Componente de Estrelas (Visual)
const RatingStars = ({ rating, size = 16 }) => {
  const starsToDisplay = Math.round(rating || 0);
  const emptyStars = 5 - starsToDisplay;
  return (
    <div className="flex">
      {[...Array(starsToDisplay)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="text-[#FD7702] fill-[#FD7702]" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
};

// Componente de Carregamento
const LoadingSpinner = () => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-xl text-gray-500 animate-pulse">Carregando produto...</p>
  </div>
);

// Componente de Erro
const ErrorDisplay = ({ message }) => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-red-500">{message}</p>
  </div>
);

export default function TelaProduto() {
  const { produtoId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  
  // Estado para Avaliações Reais do Produto
  const [reviews, setReviews] = useState([]); 
  
  // Estado para a nota da LOJA (dono do produto)
  const [storeRating, setStoreRating] = useState("Novo"); 

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  // --- ESTADOS PARA O FAVORITO E FEEDBACK ---
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('add'); // 'add' ou 'remove'

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Auth
  const visitanteTipo = localStorage.getItem('userRole');
  const visitanteId = localStorage.getItem('userId');
  const isCliente = visitanteTipo === 'cliente';

  // Função auxiliar para formatar preço (R$ 1.000,00)
  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!produtoId) {
        setError('ID do produto não encontrado.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 1. Busca Produto
        const productResponse = await api.get(`/products/${produtoId}/`);
        setProduct(productResponse.data);
        const ownerId = productResponse.data.owner_id;

        // 2. Busca Vendedor
        const sellerResponse = await api.get(`/user/listar/usuarios/${ownerId}/`);
        setSeller(sellerResponse.data);

        // --- Busca Média da LOJA ---
        try {
            const storeEvaluationsRes = await api.get(`/evaluations/stores/${ownerId}/`);
            const storeEvaluations = storeEvaluationsRes.data || [];
            
            if (storeEvaluations.length > 0) {
                const total = storeEvaluations.reduce((acc, curr) => acc + Number(curr.rating), 0);
                const avg = (total / storeEvaluations.length).toFixed(1);
                setStoreRating(avg);
            } else {
                setStoreRating("Novo");
            }
        } catch (err) {
            console.warn("Erro ao buscar nota da loja", err);
            setStoreRating("Novo");
        }

        // 3. Busca Avaliações do Produto
        try {
            const reviewsResponse = await api.get(`/evaluations/products/${produtoId}/`);
            const reviewsData = reviewsResponse.data;

            // Busca foto do usuário da última avaliação se necessário
            if (reviewsData.length > 0) {
                const latest = reviewsData[0];
                const userId = latest.user?.id || latest.user; 
                
                if (userId) {
                    try {
                        const userDetails = await api.get(`/user/listar/usuarios/${userId}/`);
                        if (typeof latest.user === 'object') {
                            latest.user.profile_picture = userDetails.data.profile_picture;
                            latest.user.full_name = userDetails.data.full_name; 
                        }
                    } catch (err) {
                        console.warn("Não foi possível carregar a foto do avaliador.");
                    }
                }
            }
            setReviews(reviewsData);
        } catch (err) {
            console.error("Erro ao buscar avaliações:", err);
        }

        // 4. Verifica se já é favorito (checando na API)
        if (isCliente) {
            try {
                const favResponse = await api.get('/products/favorites/');
                const isFav = favResponse.data.some(fav => fav.product.id === parseInt(produtoId));
                setIsFavorited(isFav);
            } catch (err) {
                console.error("Erro ao verificar favoritos:", err);
            }
        }

      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar o produto. Verifique sua conexão.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [produtoId, isCliente]);

  // --- LÓGICA DE COMPRA (WHATSAPP) ---
  const handleBuy = () => {
    if (!seller || !seller.phone) {
        alert("O vendedor não cadastrou um número de telefone.");
        return;
    }

    // Remove caracteres não numéricos
    const cleanPhone = seller.phone.replace(/\D/g, '');
    
    // Mensagem personalizada
    const message = `Olá, ${seller.full_name}! Tenho interesse no produto "${product.name}" que vi no ProcurAí.`;
    
    // Adiciona código do país (55) se não tiver
    const fullPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    
    // Abre o WhatsApp
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const refreshReviews = async () => {
    try {
      const reviewsResponse = await api.get(`/evaluations/product/${produtoId}/`);
      const reviewsData = reviewsResponse.data;
      if (reviewsData.length > 0) {
          const latest = reviewsData[0];
          const userId = latest.user?.id || latest.user;
          if (userId) {
             const userDetails = await api.get(`/user/listar/usuarios/${userId}/`);
             if (typeof latest.user === 'object') {
                 latest.user.profile_picture = userDetails.data.profile_picture;
             }
          }
      }
      setReviews(reviewsData);
    } catch (err) {
      console.error("Erro ao atualizar avaliações:", err);
    }
  };

  const handleToggleFavorite = async () => {
    try {
        const response = await api.post(`/products/favorite/${produtoId}/`);
        const novoEstado = response.data.is_favorited;
        setIsFavorited(novoEstado);
        setFeedbackType(novoEstado ? 'add' : 'remove');
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
    } catch (err) {
        console.error("Erro ao favoritar:", err);
        if (err.response && err.response.status === 403) {
            alert("Apenas clientes podem favoritar produtos.");
        } else {
            alert("Não foi possível atualizar os favoritos. Tente novamente.");
        }
    }
  };

  const handleOpenOptions = () => setIsOptionsModalOpen(true);
  const handleOpenDelete = () => { setIsOptionsModalOpen(false); setIsDeleteModalOpen(true); };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/products/delete/${produtoId}/`);
      setIsDeleteModalOpen(false);
      alert('Produto excluído com sucesso!');
      navigate(`/produtos/${visitanteId}`);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Falha ao excluir o produto.");
    }
  };

  const isOwner = product && (visitanteTipo === 'lojista') && (visitanteId == product.owner_id);

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1) 
      : 0;
  
  const latestReview = reviewCount > 0 ? reviews[0] : null;

  const formatDate = (dateString) => {
      if(!dateString) return "";
      return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading || !product || !seller) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <LoadingSpinner />
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
          <ErrorDisplay message={error} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] relative">

        <BarraPesquisa />

        {/* TOAST DE FEEDBACK */}
        <FeedbackFav
          visible={showFeedback}
          type={feedbackType}
          onClose={() => setShowFeedback(false)}
          onAction={() => navigate(`/favoritos/` + localStorage.getItem('userId'))} 
        />

        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />

          <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
            <header className="flex justify-between items-center mb-4">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                <ChevronLeft size={24} />
              </button>

              {isOwner && (
                <button onClick={handleOpenOptions} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                  <MoreVertical size={24} />
                </button>
              )}
            </header>

            {/* CONTEÚDO */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
              {/* IMAGEM */}
              <div className="md:w-5/12 lg:w-4/12 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg flex justify-center items-center p-4 aspect-square">
                  {product.product_image ? (
                    <img 
                        src={product.product_image} 
                        alt={product.name} 
                        className="max-h-80 object-contain" 
                    />
                  ) : (
                    <ShoppingBag size={80} className="text-gray-300" />
                  )}
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1">
                <section className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-xs text-gray-500 mb-1">
                    Categoria: {getCategoryLabel(product.category_name)}
                  </p>
                  
                  {/* --- CORREÇÃO DE FORMATAÇÃO DE PREÇO AQUI --- */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#FD7702]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {product.is_negotiable && <p className="text-sm font-semibold text-green-600 mt-1">Preço negociável</p>}
                </section>

                <section className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição do produto
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </section>

                {/* AÇÕES DO CLIENTE */}
                {isCliente && (
                  <section className="mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-1/3 max-w-[120px]">
                        <label
                          htmlFor="quantidade"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quantidade
                        </label>
                        <select
                          id="quantidade"
                          value={quantidade}
                          onChange={(e) => setQuantidade(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>

                      {/* BOTÃO COMPRAR (WHATSAPP) */}
                      <button
                        onClick={handleBuy}
                        className="bg-[#FD7702] text-white font-bold py-2 px-24 rounded-xl hover:bg-[#e66a00] transition-colors"
                      >
                        Comprar
                      </button>
                    </div>

                    <button
                      onClick={handleToggleFavorite}
                      className={`flex items-center gap-2 text-xs font-semibold p-2 -ml-2 rounded-md transition-all ${isFavorited ? 'text-[#FD7702] bg-[#FD7702]/10' : 'text-[#FD7702] hover:underline hover:bg-gray-50'
                        }`}
                    >
                      {isFavorited ? <Bookmark size={18} fill="#FD7702" /> : <Bookmark size={18} />}
                      {isFavorited ? 'Produto favoritado' : 'Adicionar aos favoritos'}
                    </button>
                  </section>
                )}
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* LOJA */}
            <section className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {seller.profile_picture ? (
                    <img
                    src={seller.profile_picture}
                    alt={seller.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <Store size={32} className="text-gray-500"/>
                    </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">{seller.full_name}</h3>
                  <p className="text-sm text-gray-500">{seller.company_category || 'Loja'}</p>

                  <div className="flex items-center gap-1 text-sm">
                    {/* Exibe a nota real da loja (storeRating) */}
                    <span className="font-bold text-gray-800">{storeRating}</span>
                    <Star size={14} className="text-[#FD7702] fill-[#FD7702]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/perfil/empresa/${seller.id}`}
                  className="px-4 py-2 border border-[#FD7702] text-[#FD7702] rounded-lg text-sm font-semibold hover:bg-[#FD7702]/10 transition-colors"
                >
                  Visitar a loja
                </Link>

                {isCliente && (
                  <button 
                    onClick={() => navigate(`/perfil/empresa/${seller.id}`, { state: { initialTab: 'Comunidade' } })} 
                    className="px-4 py-2 bg-[#FD7702] text-white rounded-lg text-sm font-semibold hover:bg-[#e66a00] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    Entrar na comunidade
                  </button>
                )}
              </div>
            </section>

            <hr className="my-6 border-gray-200" />

            {/* AVALIAÇÕES */}
            <section className="pb-10">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Avaliações</h2>

                {isCliente && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-semibold text-[#FD7702] hover:underline"
                  >
                    Avalie este produto
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                <RatingStars rating={averageRating} size={18} />
                <span className="text-sm text-gray-500 ml-2">
                  ({reviewCount} avaliações)
                </span>
              </div>

              {/* Última avaliação */}
              {latestReview ? (
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                    {latestReview.user.profile_picture ? (
                          <img src={latestReview.user.profile_picture} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={14} className="text-gray-500"/>
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{latestReview.user.full_name || "Usuário"}</p>
                        <p className="text-xs text-gray-500">{formatDate(latestReview.created_at)}</p>
                    </div>
                    </div>

                    <div className="mb-2">
                    <RatingStars rating={latestReview.rating} size={16} />
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{latestReview.comment}</p>

                    <div className="flex gap-2">
                    {latestReview.photo_urls && latestReview.photo_urls.map((imgObj, i) => (
                        <img
                        key={imgObj.id || i}
                        src={imgObj.photo}
                        alt={`Review ${i + 1}`}
                        className="w-20 h-20 rounded-md object-cover border border-gray-200"
                        />
                    ))}
                    </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Este produto ainda não tem avaliações.</p>
              )}

              {reviewCount > 0 && (
                <div className="text-right mt-4">
                    <Link
                        to={`/produto/${produtoId}/avaliacoes`}
                        className="text-sm font-bold text-[#FD7702] hover:underline cursor-pointer"
                    >
                        Ver todas avaliações
                    </Link>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* MODAIS */}
      {isModalOpen && (
        <ModalAvaliacao
          productName={product.name}
          produtoId={produtoId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={refreshReviews} 
        />
      )}

      {isOptionsModalOpen && (
        <ModalOpcoesProduto
          produtoId={produtoId}
          onClose={() => setIsOptionsModalOpen(false)}
          onExcluirClick={handleOpenDelete}
        />
      )}

      {isDeleteModalOpen && (
        <ModalExcluirProduto
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}