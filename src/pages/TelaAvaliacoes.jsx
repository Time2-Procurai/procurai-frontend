import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { useAuth } from '../context/UseAuth.jsx';
import BarraLateral from '../components/BarraLateral';
import BarraPesquisa from '../components/BarraPesquisa';
const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-md border px-4 py-1.5 text-sm font-semibold transition-colors ${isActive
        ? 'border-[#FD7702] bg-[#FD7702] text-white'
        : 'border-orange-200 bg-white text-gray-600 hover:border-[#FD7702] hover:text-[#FD7702]'
      }`}
  >
    {label}
  </button>
);

const ReviewCard = ({ review }) => (
  <div className="mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <img
        src={review.userAvatar}
        alt={review.userName}
        className="h-10 w-10 rounded-full bg-gray-200 object-cover"
      />
      <div>
        <h4 className="text-sm font-bold text-gray-900">{review.userName}</h4>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < review.rating ? 'fill-[#FD7702] text-[#FD7702]' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">{review.date}</span>
        </div>
      </div>
    </div>
    <p className="mb-4 text-sm leading-relaxed text-gray-600">{review.text}</p>
    {review.images && review.images.length > 0 && (
      <div className="flex gap-2">
        {review.images.map((img, index) => (
          <img key={index} src={img} alt={`Foto ${index}`} className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
        ))}
      </div>
    )}
  </div>
);

// exemplos de avaliações
const mockReviews = [
  { id: 1, userName: 'vitorbarros', userAvatar: 'https://i.imgur.com/rN4gXmB.png', date: '04/09/25', rating: 5, text: 'Bom custo-benefício...', images: ['https://i.imgur.com/v2JvP9Y.png'] },
  { id: 2, userName: 'gabrielsalgado', userAvatar: 'https://i.imgur.com/9w2g5G9.png', date: '04/09/25', rating: 4, text: 'Cumpre o que promete...', images: ['https://i.imgur.com/W2Nl89d.png'] },
  { id: 3, userName: 'joaopedro', userAvatar: 'https://i.imgur.com/rN4gXmB.png', date: '04/09/25', rating: 3, text: 'Esperava mais da bateria...', images: [] },
];

export default function TelaAvaliacoes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === activeFilter));
    }
  }, [activeFilter, reviews]);

  // calc dinamico pro valor da avaliação geral do produto
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
              className="mr-4 rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Avaliações</h1>
          </header>

          <div className="mx-auto max-w-4xl">
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
            <section className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)
              ) : (
                <div className="py-10 text-center text-gray-500 border border-dashed rounded-lg">
                  <p>Nenhuma avaliação encontrada.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}