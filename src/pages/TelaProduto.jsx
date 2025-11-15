import { useState, useEffect } from 'react';
// --- 1. Importar a API real ---
import api from '../api/api'; 
import { Link, useParams, useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, MoreVertical, Star, Bookmark, MessageCircle, ShoppingBag } from 'lucide-react';
import ModalAvaliacao from '../components/ModalAvaliacao';
import ModalOpcoesProduto from '../components/ModalOpcoesProduto';
import ModalExcluirProduto from '../components/ModalExcluirProduto';

// (Componente RatingStars - Sem mudança)
const RatingStars = ({ rating, size = 16 }) => {
  const starsToDisplay = Math.round(rating);
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

// (Componente LoadingSpinner - Sem mudança)
const LoadingSpinner = () => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-xl text-gray-500 animate-pulse">Carregando produto...</p>
  </div>
);

// (Componente ErrorDisplay - Sem mudança)
const ErrorDisplay = ({ message }) => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-red-500">{message}</p>
  </div>
);

// --- DADOS MOCKADOS (APENAS PARA AVALIAÇÕES, pois a API não existe) ---
const mockReviewData = {
  latestReview: {
    user: 'gabrielgermano',
    date: '04/08/25',
    rating: 5,
    text: 'Excelente ferramenta! Muito potente e com ótima autonomia.',
    images: [
      'https://i.imgur.com/v2JvP9Y.png', 'https://i.imgur.com/M6TqGq7.png',
      'https://i.imgur.com/W2Nl89d.png', 'https://i.imgur.com/Yl6h8fO.png'
    ],
    avatar: 'https://i.imgur.com/9w2g5G9.png'
  },
  reviewSummary: { rating: 4.9, count: 100 }
};
// --- FIM DOS DADOS MOCKADOS ---


export default function TelaProduto() {
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  // --- 2. Manter reviews como estado (para o mock) ---
  const [latestReview, setLatestReview] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { produtoId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  // --- 3. Lógica de autenticação com localStorage ---
  const visitanteTipo = localStorage.getItem('userRole');
  const visitanteId = localStorage.getItem('userId');
  const isCliente = visitanteTipo === 'cliente';
  // (isLojista será verificado junto com isOwner)

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

        // --- 4. CHAMADA DE API REAL (Produto) ---
        // (Baseado no seu urls.py: path("<int:pk>/", ...))
        const productResponse = await api.get(`/products/${produtoId}/`);
        setProduct(productResponse.data);

        const ownerId = productResponse.data.owner_id;
        console.log("Owner ID do produto:", ownerId);
        // --- 5. CHAMADA DE API REAL (Vendedor/Loja) ---
        // (Usa o endpoint que já criamos para buscar perfis)
        const sellerResponse = await api.get(`/user/listar/usuarios/${ownerId}/`);
        setSeller(sellerResponse.data);
        
        // --- 6. Usar dados mockados para as avaliações ---
        setLatestReview(mockReviewData.latestReview);
        setReviewSummary(mockReviewData.reviewSummary);

      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar o produto. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [produtoId]); // Re-busca se o ID na URL mudar

  const handleOpenOptions = () => setIsOptionsModalOpen(true);

  const handleOpenDelete = () => {
    setIsOptionsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  // --- 7. Lógica de exclusão com API ---
  const handleConfirmDelete = async () => {
    try {
      // (Baseado no seu urls.py: path("delete/<int:pk>/", ...))
      await api.delete(`/products/delete/${produtoId}/`);
      setIsDeleteModalOpen(false);
      alert('Produto excluído com sucesso!');
      // Navega para o catálogo do dono (que deve ser o usuário logado)
      navigate(`/produtos/${visitanteId}`);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Falha ao excluir o produto.");
    }
  };
  
  // --- 8. Lógica de Proprietário (isOwner) ---
  // Só é 'true' se o visitante for um lojista E o ID dele
  // for o mesmo que o 'owner_id' do produto.
  const isOwner = product && (visitanteTipo === 'lojista') && (visitanteId == product.owner_id);
  // (Usamos '==' para comparar string com número)


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

  // --- 9. Renderização Principal (com dados dinâmicos) ---
  return (
    <>
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
            <header className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate(-1)} // Volta para a página anterior
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Mostra o menu de "..." se for o DONO */}
              {isOwner && (
                <button
                  onClick={handleOpenOptions}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                >
                  <MoreVertical size={24} />
                </button>
              )}
            </header>

            {/* CONTEÚDO */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
              {/* IMAGEM */}
              <div className="md:w-5/12 lg:w-4/12 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg flex justify-center items-center p-4 aspect-square">
                  {/* Usa a imagem do produto vinda da API */}
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
                  {/* Usa a categoria vinda da API */}
                  <p className="text-xs text-gray-500 mb-1">Categoria: {product.category_name}</p>

                  <div className="flex items-baseline gap-2">
                    {/* Usa o preço vindo da API */}
                    <span className="text-2xl font-extrabold text-[#FD7702]">
                      R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                    </span>
                    {/* (Removido preço original, pois não há no model) */}
                  </div>
                  {/* Mostra se o preço é negociável */}
                  {product.is_negotiable && (
                    <p className="text-sm font-semibold text-green-600">
                      Preço negociável
                    </p>
                  )}
                </section>

                {/* DESCRIÇÃO */}
                <section className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição do produto
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </section>

                {/* CLIENTE (Ações de compra) */}
                {isCliente && (
                  <section className="mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      {/* (Input de quantidade - sem mudança) */}
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
                          <option>1</option> <option>2</option> <option>3</option>
                          <option>4</option> <option>5</option>
                        </select>
                      </div>

                      <button
                        onClick={() => alert('Redirecionando para link externo...')}
                        className="bg-[#FD7702] text-white font-bold py-2 px-24 rounded-xl hover:bg-[#e66a00] transition-colors"
                      >
                        Comprar
                      </button>
                    </div>

                    <button
                      onClick={() => alert('Produto adicionado aos favoritos!')}
                      className="flex items-center gap-1 text-xs font-semibold text-[#FD7702] hover:underline p-2 -ml-2 rounded-md hover:bg-[#FD7702]/10 transition-colors"
                    >
                      <Bookmark size={14} />
                      Adicionar aos favoritos
                    </button>
                  </section>
                )}
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* LOJA (Dados dinâmicos do vendedor) */}
            <section className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Imagem do vendedor vinda da API */}
                {seller.profile_picture ? (
                   <img
                    src={seller.profile_picture}
                    alt={seller.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                    <Store size={32} />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">{seller.full_name}</h3>
                  <p className="text-sm text-gray-500">{seller.company_category || "Loja"}</p>
                  
                  {/* (Rating da loja - mantido estático por enquanto) */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-bold text-gray-800">4.9</span>
                    <Star size={14} className="text-[#FD7702] fill-[#FD7702]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Link dinâmico para o perfil da loja */}
                <Link
                  to={`/perfil/empresa/${seller.id}`}
                  className="px-4 py-2 border border-[#FD7702] text-[#FD7702] rounded-lg text-sm font-semibold hover:bg-[#FD7702]/10 transition-colors"
                >
                  Visitar a loja
                </Link>

                {isCliente && (
                  <button className="px-4 py-2 bg-[#FD7702] text-white rounded-lg text-sm font-semibold hover:bg-[#e66a00] transition-colors flex items-center gap-2">
                    <MessageCircle size={16} />
                    Entrar na comunidade
                  </button>
                )}
              </div>
            </section>

            <hr className="my-6 border-gray-200" />

            {/* AVALIAÇÕES (Dados mockados) */}
            <section>
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
                <span className="text-2xl font-bold text-gray-900">{reviewSummary.rating}</span>
                <RatingStars rating={reviewSummary.rating} size={18} />
                <span className="text-sm text-gray-500 ml-2">
                  ({reviewSummary.count} avaliações)
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={latestReview.avatar}
                    alt={latestReview.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{latestReview.user}</p>
                    <p className="text-xs text-gray-500">{latestReview.date}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <RatingStars rating={latestReview.rating} size={16} />
                </div>
                <p className="text-sm text-gray-700 mb-3">{latestReview.text}</p>
                <div className="flex gap-2">
                  {latestReview.images.map((img, i) => (
                    <img key={i} src={img} alt={`Review ${i + 1}`} className="w-20 h-20 rounded-md object-cover" />
                  ))}
                </div>
              </div>

              <Link
                to={`/produto/${produtoId}/avaliacoes`}
                className="w-full text-center block p-3 mt-4 text-sm font-semibold text-[#FD7702] rounded-lg hover:bg-[#FD7702]/10 transition-colors"
              >
                Ver todas
              </Link>
            </section>
          </main>
        </div>
      </div>

      {/* MODAIS (Sem mudança) */}
      {isModalOpen && (
        <ModalAvaliacao
          productName={product.name}
          produtoId={produtoId}
          onClose={() => setIsModalOpen(false)}
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