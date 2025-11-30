import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api'; // Importar API
import {
  ChevronLeft, Store, Heart, ThumbsDown, MessageCircle, Share2,
  Send, MoreVertical, Smile
} from 'lucide-react';

function PostDetalhes() {
  const navigate = useNavigate();
  const { postId } = useParams();

  // Estados
  const [post, setPost] = useState(null);
  const [authorData, setAuthorData] = useState(null); // Dados do autor (nome, foto)
  const [commentsList, setCommentsList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [novoComentario, setNovoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // --- 1. BUSCAR DADOS (Post + Autor + Comentários) ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // A. Buscar detalhes do post
        const responsePost = await api.get(`/community/publicacoes/${postId}/`);
        const postData = responsePost.data;
        setPost(postData);

        // B. Buscar dados do Autor (Lojista)
        if (postData.autor) {
           try {
             const responseAutor = await api.get(`/user/listar/usuarios/${postData.autor}/`);
             setAuthorData(responseAutor.data);
           } catch (err) {
             console.error("Erro ao buscar autor:", err);
           }
        }

        // C. Buscar Comentários
        const responseComments = await api.get(`/community/publicacoes/${postId}/comentarios/`);
        setCommentsList(responseComments.data);

      } catch (err) {
        console.error("Erro ao carregar publicação:", err);
        setError("Não foi possível carregar a publicação.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
        fetchAllData();
    }
  }, [postId]);

  // --- 2. ENVIAR COMENTÁRIO ---
  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    setEnviandoComentario(true);
    try {
      const response = await api.post(`/community/publicacoes/${postId}/comentar/`, {
        texto: novoComentario
      });

      // Adiciona o novo comentário à lista
      const novoCommentObj = response.data;
      setCommentsList(prev => [...prev, novoCommentObj]);
      setNovoComentario("");

    } catch (err) {
      console.error("Erro ao comentar:", err);
      alert("Erro ao enviar comentário.");
    } finally {
      setEnviandoComentario(false);
    }
  };

  // --- 3. CURTIR / DESCURTIR (AJUSTADO) ---
  const handleCurtir = async () => {
    try {
      await api.post(`/community/publicacoes/${postId}/curtir/`);
      
      // Removemos o alert e atualizamos o contador visualmente
      setPost(prev => ({
        ...prev,
        likes: (prev?.likes || 0) + 1
      }));

    } catch (err) {
      console.error("Erro ao curtir:", err);
      // Opcional: Se o erro for "Já curtiu", não faz nada ou avisa sutilmente
    }
  };

  const handleDescurtir = async () => {
    try {
      await api.post(`/community/publicacoes/${postId}/descurtir/`);
      
      // Removemos o alert e atualizamos o contador visualmente
      setPost(prev => ({
        ...prev,
        likes: Math.max((prev?.likes || 0) - 1, 0) // Evita números negativos
      }));

    } catch (err) {
      console.error("Erro ao descurtir:", err);
    }
  };

  // Helpers de formatação
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
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

  if (error || !post) {
    return (
        <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
          <BarraPesquisa />
          <div className="flex flex-1 overflow-hidden">
            <BarraLateral />
            <main className="flex-1 flex items-center justify-center bg-white">
              <p className="text-xl text-red-500">{error || "Publicação não encontrada"}</p>
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
              Publicação de {authorData?.full_name || "..."}
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
                  onClick={() => navigate(`/perfil/empresa/${post.autor}`)}
                >
                  {authorData?.profile_picture ? (
                    <img src={authorData.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Store size={28} className="text-gray-500" />
                  )}
                </div>

                {/* Nome e Data */}
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-bold text-gray-900 text-base cursor-pointer hover:underline"
                      onClick={() => navigate(`/perfil/empresa/${post.autor}`)}
                    >
                      {authorData?.full_name || "Carregando..."}
                    </h3>
                    <span className="text-sm text-gray-500">{formatDate(post.data_publicacao)}</span>
                  </div>
                  {post.titulo && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md border border-orange-200 bg-orange-50 text-[#FD7702] text-[10px] font-bold uppercase tracking-wide">
                      {post.titulo}
                    </span>
                  )}
                </div>
              </div>

              {/* Conteúdo do Texto */}
              <p className="text-sm text-gray-800 leading-relaxed mb-6 text-justify whitespace-pre-wrap">
                {post.descricao}
              </p>
              
              {/* Imagem do Post (Se houver) */}
              {post.imagem && (
                <div className="w-full mb-6 rounded-lg overflow-hidden">
                    <img 
                    src={post.imagem} 
                    alt="Imagem da publicação" 
                    className="w-full h-auto object-cover max-h-[500px]"
                    />
                </div>
               )}

              {/* Ações (Like, Dislike, Comentário) */}
              <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                
                {/* --- BOTÃO CURTIR (COM CONTADOR) --- */}
                <button 
                    onClick={handleCurtir}
                    className="text-gray-600 hover:text-red-500 transition flex items-center gap-1"
                >
                  <Heart size={24} />
                  <span className="text-sm font-medium">{post?.likes || 0}</span>
                </button>

                {/* --- BOTÃO DESCURTIR --- */}
                <button 
                    onClick={handleDescurtir}
                    className="text-gray-600 hover:text-gray-900 transition"
                    title="Remover curtida"
                >
                  <ThumbsDown size={24} />
                </button>

                <button className="text-gray-600 hover:text-blue-500 transition flex items-center gap-1">
                  <MessageCircle size={24} />
                  <span className="text-sm font-medium">{commentsList.length}</span>
                </button>
              </div>
            </div>

            {/* --- INPUT DE COMENTÁRIO --- */}
            <form onSubmit={handleEnviarComentario} className="relative">
              <input
                type="text"
                placeholder="Adicionar comentário..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                disabled={enviandoComentario}
                className="w-full rounded-full border-2 border-[#FD7702] py-3 pl-6 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={enviandoComentario}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FD7702] transition disabled:opacity-50"
              >
                {novoComentario.trim() ? <Send size={24} /> : <Smile size={24} />}
              </button>
            </form>

            {/* --- TÍTULO DA SEÇÃO --- */}
            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Comentários ({commentsList.length})</h3>

            {/* --- LISTA DE COMENTÁRIOS --- */}
            <div className="space-y-4 pb-10">
              {commentsList.length === 0 ? (
                 <p className="text-gray-500 text-center py-4">Seja o primeiro a comentar!</p>
              ) : (
                commentsList.map((comment) => (
                    <div key={comment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative">
                    
                    {/* Avatar do Comentário */}
                    <div className="h-10 w-10 rounded-full bg-[#FDF6EC] border border-orange-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <span className="font-bold text-[#FD7702] text-lg">
                            <Store size={18}/>
                        </span>
                    </div>

                    {/* Conteúdo do Comentário */}
                    <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">Usuário #{comment.autor}</span>
                            <span className="text-xs text-gray-400">• {formatDate(comment.data)}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.texto}
                        </p>
                    </div>

                    {/* Opções (Três pontinhos) */}
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical size={18} />
                    </button>
                    </div>
                ))
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default PostDetalhes;