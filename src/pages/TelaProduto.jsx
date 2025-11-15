import { useState, useEffect } from 'react';
import { useAuth } from '../context/UseAuth.jsx';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import { ChevronLeft, MoreVertical, Star, Bookmark, MessageCircle } from 'lucide-react';
import ModalAvaliacao from '../components/ModalAvaliacao';
import ModalOpcoesProduto from '../components/ModalOpcoesProduto';
import ModalExcluirProduto from '../components/ModalExcluirProduto';

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

const LoadingSpinner = () => (
  <div className="flex-1 flex justify-center items-center">
    <p>Carregando produto...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-red-500">{message}</p>
  </div>
);

const mockApiCall = (id) => {
  console.log(`Buscando dados para o produto ID: ${id}`);

  const mockData = {
    product: {
      id,
      name: "Parafusadeira DEWALT LT3",
      category: "Construção",
      originalPrice: "R$ 215,00",
      discountPrice: "R$ 172,00",
      description:
        "A Parafusadeira DeWALT LT3 é a escolha ideal para quem busca potência, durabilidade e praticidade.",
      image: "https://i.imgur.com/kS9Qj6q.png",
    },
    seller: {
      id: "vendedor-ze-123",
      name: "Zézinho Construções",
      type: "Armazém",
      rating: 4.9,
      avatar: "https://i.imgur.com/rN4gXmB.png",
    },
    latestReview: {
      user: "gabrielgermano",
      date: "04/08/25",
      rating: 5,
      text: "Excelente ferramenta! Muito potente e com ótima autonomia.",
      images: [
        "https://i.imgur.com/v2JvP9Y.png",
        "https://i.imgur.com/M6TqGq7.png",
        "https://i.imgur.com/W2Nl89d.png",
        "https://i.imgur.com/Yl6h8fO.png",
      ],
    },
    reviewSummary: { rating: 4.9, count: 100 },
  };

  return Promise.resolve(mockData);
};


export default function TelaProduto() {
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [latestReview, setLatestReview] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { produtoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCliente = user && user.userType === 'cliente';
  const isLojista = user && user.userType === 'lojista';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await mockApiCall(produtoId);

        setProduct(data.product);
        setSeller(data.seller);
        setLatestReview(data.latestReview);
        setReviewSummary(data.reviewSummary);
      } catch (err) {
        setError("Não foi possível carregar o produto. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [produtoId]);

  const handleOpenOptions = () => setIsOptionsModalOpen(true);

  const handleOpenDelete = () => {
    setIsOptionsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(`DELETANDO PRODUTO ID: ${produtoId}`);
    setIsDeleteModalOpen(false);
    alert('Produto excluído com sucesso!');
    navigate('/produtos');
  };


  if (isLoading || !product) {
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
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />

        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />

          <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">

            {/* HEADER */}
            <header className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>

              {isLojista && (
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

              {/* Imagem */}
              <div className="md:w-5/12 lg:w-4/12 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg flex justify-center items-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-80 object-contain"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">

                <section className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-xs text-gray-500 mb-1">Categoria: {product.category}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                    <span className="text-2xl font-extrabold text-[#FD7702]">{product.discountPrice}</span>
                  </div>
                </section>

                {/* Descrição */}
                <section className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição do produto</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </section>

                {/* Cliente */}
                {isCliente && (
                  <section className="mb-4">

                    <div className="flex items-center gap-4 mb-4">

                      {/* Quantidade */}
                      <div className="w-1/3 max-w-[120px]">
                        <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
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

                      {/* Comprar */}
                      <button
                        onClick={() => alert('Redirecionando para link externo...')}
                        className="bg-[#FD7702] text-white font-bold py-2 px-24 rounded-xl hover:bg-[#e66a00] transition-colors"
                      >
                        Comprar
                      </button>
                    </div>

                    {/* Favoritar */}
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

            {/* LOJA */}
            <section className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                  <p className="text-sm text-gray-500">{seller.type}</p>

                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-bold text-gray-800">{seller.rating}</span>
                    <Star size={14} className="text-[#FD7702] fill-[#FD7702]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/perfil/empresa"
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

            {/* AVALIAÇÕES */}
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
                <span className="text-sm text-gray-500 ml-2">({reviewSummary.count} avaliações)</span>
              </div>

              <div className="border-t border-gray-200 pt-4">

                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="https://i.imgur.com/9w2g5G9.png"
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
                    <img
                      key={i}
                      src={img}
                      alt={`Review ${i + 1}`}
                      className="w-20 h-20 rounded-md object-cover"
                    />
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

      {/* Modais */}
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
