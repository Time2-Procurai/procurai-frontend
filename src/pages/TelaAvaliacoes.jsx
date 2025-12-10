import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star, User } from 'lucide-react'; 
import { useAuth } from '../context/UseAuth.jsx';
import BarraLateral from '../components/BarraLateral';
import BarraPesquisa from '../components/BarraPesquisa';
import api from '../api/api'; 

// Botão de Filtro (Design fiel ao print)
const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer rounded-md border px-4 py-1.5 text-sm font-semibold transition-colors ${isActive
        ? 'border-[#FD7702] bg-[#FD7702] text-white'
        : 'border-orange-200 bg-white text-gray-600 hover:border-[#FD7702] hover:text-[#FD7702]'
      }`}
  >
    {label}
  </button>
);

// Card de Avaliação (Layout idêntico ao print)
const ReviewCard = ({ review }) => (
  <div className="mb-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex gap-4">
      
      {/* 1. Coluna da Esquerda: Avatar */}
      <div className="flex-shrink-0">
        {review.userAvatar ? (
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="h-12 w-12 rounded-full bg-gray-200 object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User size={24} />
          </div>
        )}
        {/* Fallback escondido para erro de imagem */}
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hidden">
            <User size={24} />
        </div>
      </div>

      {/* 2. Coluna da Direita: Todo o conteúdo */}
      <div className="flex-1">
        {/* Cabeçalho: Nome + Estrelas e Data */}
        <div className="flex justify-between items-start">
          <div>
             <h4 className="text-sm font-bold text-gray-900">{review.userName}</h4>
             
             {/* Estrelas logo abaixo do nome */}
             <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'fill-[#FD7702] text-[#FD7702]' : 'text-gray-300'}
                  />
                ))}
             </div>
          </div>
          <span className="text-xs text-gray-400">{review.date}</span>
        </div>

        {/* Texto da Avaliação */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {review.text}
        </p>
        
        {/* Imagens da Avaliação (Abaixo do texto) */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {review.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Foto ${index}`} 
                className="h-20 w-20 rounded-lg border border-gray-200 object-cover cursor-pointer hover:opacity-95 shadow-sm"
                onClick={() => window.open(img, '_blank')}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
);

export default function TelaAvaliacoes() {
  const navigate = useNavigate();
  const { produtoId } = useParams(); 
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- BUSCAR AVALIAÇÕES DA API ---
  useEffect(() => {
    const fetchReviews = async () => {
      if (!produtoId) return;
      
      setIsLoading(true);
      try {
        const response = await api.get(`/evaluations/products/${produtoId}/`);
        
        // Proteção contra paginação
        let dadosBackend = [];
        if (Array.isArray(response.data)) {
            dadosBackend = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
            dadosBackend = response.data.results;
        }

        // Mapeia os dados e busca foto do usuário se necessário
        const reviewsFormatadas = await Promise.all(dadosBackend.map(async (item) => {
            let avatarUrl = item.user?.profile_picture || item.user?.avatar;
            let nomeUsuario = item.user?.full_name || "Usuário";
            const userId = typeof item.user === 'object' ? item.user.id : item.user;

            if (userId && !avatarUrl) {
                try {
                    const userDetails = await api.get(`/user/listar/usuarios/${userId}/`);
                    avatarUrl = userDetails.data.profile_picture;
                    nomeUsuario = userDetails.data.full_name;
                } catch (err) {
                    console.warn(`Erro user ${userId}`, err);
                }
            }

            return {
                id: item.id,
                userName: nomeUsuario,
                userAvatar: avatarUrl || null,
                date: new Date(item.created_at).toLocaleDateString('pt-BR'),
                rating: item.rating,
                text: item.comment,
                // Mapeia as fotos do array 'photo_urls'
                images: item.photos ? item.photos.map(p => p.photo) : []
            };
        }));

        setReviews(reviewsFormatadas);
        setFilteredReviews(reviewsFormatadas); 
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [produtoId]);

  // --- FILTRAGEM ---
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === activeFilter));
    }
  }, [activeFilter, reviews]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { average: '0,0', count: 0 };
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = (sum / total).toFixed(1).replace('.', ',');
    return { average: avg, count: total };
  }, [reviews]);

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto bg-white p-6">
          <header className="flex items-center mb-6 border-b border-gray-100 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer mr-4 rounded-full p-2 text-gray-700 transition-colors"
            >
              <ChevronLeft size={24} className="cursor-pointer mr-3 text-gray-900 hover:text-[#FD7702] transition-colors"/>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Avaliações</h1>
          </header>

          <div className="mx-auto max-w-4xl">
            
            {isLoading ? (
                 <div className="flex justify-center py-10">
                    <p className="text-gray-500 animate-pulse">Carregando avaliações...</p>
                 </div>
            ) : (
                <>
                    {/* Seção de Resumo e Filtros */}
                    <section className="mb-8">
                        <div className="flex items-end gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-extrabold text-gray-900">{stats.average}</span>
                                <Star size={32} className="fill-[#FD7702] text-[#FD7702]" />
                            </div>
                            <span className="mb-1 text-sm text-gray-500">de 5 ({stats.count} avaliações)</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <FilterButton label="Tudo" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                            {[5, 4, 3, 2, 1].map((star) => (
                                <FilterButton key={star} label={`${star} estrelas`} isActive={activeFilter === star} onClick={() => setActiveFilter(star)} />
                            ))}
                        </div>
                    </section>

                    {/* Lista de Cards */}
                    <section className="space-y-4">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <div className="py-10 text-center text-gray-500 border border-dashed rounded-lg">
                                <p>Nenhuma avaliação encontrada para este filtro.</p>
                            </div>
                        )}
                    </section>
                </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}