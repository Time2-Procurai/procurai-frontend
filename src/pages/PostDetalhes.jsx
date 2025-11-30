import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import {
  ChevronLeft, Store, Heart, ThumbsDown, MessageCircle, Share2,
  Send, MoreVertical, Smile
} from 'lucide-react';

// --- MOCK DE DADOS (Mantido para simulação) ---
const getMockPostDetalhado = (id) => {
  return {
    id: id,
    author: "Zézinho Construções",
    authorId: 6,
    authorAvatar: null,
    date: "04/09/25",
    content: "A Zezinho Construções preparou uma oferta especial para você que não abre mão de qualidade e performance nas suas ferramentas. A poderosa parafusadeira DeWalt LT3 está com preço promocional por tempo limitado! Ideal para uso profissional ou doméstico, ela oferece alta durabilidade, torque eficiente e praticidade para o dia a dia na obra ou na oficina. Aproveite as condições facilitadas de pagamento e garanta agora a sua na Zezinho Construções. Não perca essa chance de trabalhar com uma das melhores marcas do mercado por um preço que cabe no seu bolso. Zezinho Construções — tudo para sua construção com confiança e economia.",
    tag: "Promoção",
    likes: 12,
    commentsList: [
      { id: 101, user: "gabrielgermano", date: "04/09/25", avatar: null, text: "Comprei essa parafusadeira na promoção e fiquei impressionada com a qualidade. O pessoal da loja foi super atencioso e tirou todas as minhas dúvidas pelo WhatsApp. Recomendo demais!" },
      { id: 102, user: "luizmatheus", date: "04/09/25", avatar: null, text: "Ótima ferramenta, fácil de manusear e muito resistente. Aproveitei a promoção e não me arrependo. Zezinho Construções sempre com boas ofertas!" },
      { id: 103, user: "vinicius", date: "04/09/25", avatar: null, text: "Produto chegou em perfeito estado e funciona muito bem. Atendimento da loja excelente, me ajudaram a escolher a melhor opção." },
      { id: 104, user: "joaopedro", date: "04/09/25", avatar: null, text: "A promoção estava irresistível! A DeWalt LT3 tem torque ótimo e é perfeita para uso profissional. Com certeza voltarei a comprar na Zezinho Construções" },
      { id: 105, user: "vitorbarros", date: "04/09/25", avatar: null, text: "Adoro comprar na Zezinho Construções porque a loja é pertinho de casa. Dá para ir rapidinho, ver os produtos pessoalmente e ainda aproveitar as promoções como a da DeWalt LT3. Super prática e confiável" },
    ]
  };
};

function PostDetalhes() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const data = getMockPostDetalhado(postId);
      setPost(data);
      setLoading(false);
    }, 500);
  }, [postId]);

  const handleEnviarComentario = (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    const comentario = {
      id: Date.now(),
      user: "Você",
      avatar: null,
      text: novoComentario,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setPost(prev => ({
      ...prev,
      commentsList: [comentario, ...prev.commentsList]
    }));
    setNovoComentario("");
  };

  if (loading) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <main className="flex-1 flex items-center justify-center bg-white">
            <p className="text-xl text-gray-500 animate-pulse">Carregando publicação...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">

          {/* Cabeçalho da Página */}
          <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-800 transition"
            >
              <ChevronLeft size={32} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Publicação de {post.author}
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">

            {/* --- CARD DO POST --- */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative">

              {/* Ícone de Compartilhar (Topo Direito) */}
              <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition">
                <Share2 size={24} />
              </button>

              {/* Header do Autor */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div
                  className="h-14 w-14 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer flex-shrink-0"
                  onClick={() => navigate(`/perfil/empresa/${post.authorId}`)}
                >
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Store size={28} className="text-gray-500" />
                  )}
                </div>

                {/* Nome e Data */}
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-bold text-gray-900 text-base cursor-pointer hover:underline"
                      onClick={() => navigate(`/perfil/empresa/${post.authorId}`)}
                    >
                      {post.author}
                    </h3>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  {post.tag && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md border border-orange-200 bg-orange-50 text-[#FD7702] text-[10px] font-bold uppercase tracking-wide">
                      {post.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Conteúdo do Texto */}
              <p className="text-sm text-gray-800 leading-relaxed mb-6 text-justify">
                {post.content}
              </p>

              {/* Ações (Like, Dislike, Comentário) */}
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-red-500 transition">
                  <Heart size={24} />
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition">
                  <ThumbsDown size={24} />
                </button>
                <button className="text-gray-600 hover:text-blue-500 transition">
                  <MessageCircle size={24} />
                </button>
              </div>
            </div>

            {/* --- INPUT DE COMENTÁRIO --- */}
            <form onSubmit={handleEnviarComentario} className="relative">
              <input
                type="text"
                placeholder="Adicionar comentário"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                className="w-full rounded-full border-2 border-[#FD7702] py-3 pl-6 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FD7702] transition"
              >
                {novoComentario.trim() ? <Send size={24} /> : <Smile size={24} />}
              </button>
            </form>

            {/* --- TÍTULO DA SEÇÃO --- */}
            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Comentários</h3>

            {/* --- LISTA DE COMENTÁRIOS --- */}
            <div className="space-y-4">
              {post.commentsList.map((comment) => (
                <div key={comment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative">

                  {/* Avatar do Comentário */}
                  <div className="h-12 w-12 rounded-full bg-[#FDF6EC] border border-orange-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {/* Placeholder colorido para diferenciar */}
                    <span className="font-bold text-[#FD7702] text-xl">
                      {comment.user.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Conteúdo do Comentário */}
                  <div className="flex-1 pr-8"> {/* pr-8 para dar espaço aos 3 pontinhos */}
                    <div className="flex items-center gap-4 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{comment.user}</span>
                      <span className="text-xs text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>

                  {/* Opções (Três pontinhos) */}
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default PostDetalhes;