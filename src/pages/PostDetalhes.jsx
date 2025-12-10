import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api';
import {
  ChevronLeft, Store, Heart, MessageCircle, Share2,
  Send, MoreVertical, Smile, User
} from 'lucide-react';

function PostDetalhes() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [novoComentario, setNovoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const responsePost = await api.get(`/community/publicacoes/${postId}/`);
        const postData = responsePost.data;
        setPost(postData);

        if (postData.autor) {
           try {
             const responseAutor = await api.get(`/user/listar/usuarios/${postData.autor}/`);
             setAuthorData(responseAutor.data);
           } catch (err) {
             console.error("Erro ao buscar autor:", err);
           }
        }

        const responseComments = await api.get(`/community/publicacoes/${postId}/comentarios/`);
        setCommentsList(responseComments.data);

      } catch (err) {
        console.error("Erro ao carregar publicação:", err);
        setError("Não foi possível carregar a publicação.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchAllData();
  }, [postId]);

  const handleAuthorClick = () => {
    if (authorData?.is_lojista) {
        navigate(`/perfil/empresa/${post.autor}`);
    } else {
        console.log("Perfil de usuário comum clicado");
    }
  };

  const getMainAuthorName = () => {
    if (!authorData) return "Carregando...";
    if (authorData.is_lojista && authorData.lojista_profile?.company_name) {
        return authorData.lojista_profile.company_name;
    }
    return authorData.full_name || authorData.username || "Usuário";
  };

  const getMainAuthorImage = () => {
     if (!authorData) return null;
     if (authorData.is_lojista) return authorData.lojista_profile?.profile_picture;
     return authorData.cliente_profile?.profile_picture; 
  }

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    setEnviandoComentario(true);
    try {
      const response = await api.post(`/community/publicacoes/${postId}/comentar/`, {
        texto: novoComentario
      });

      // Adiciona campos do autor atual para exibir a foto/nome imediatamente sem refresh
      // (Assumindo que o back retorna dados básicos ou você pega do localStorage/Context)
      const novoCommentObj = {
          ...response.data,
          // Fallback visual temporário até o refresh
          autor_nome: "Você", 
          autor_foto: null 
      };
      
      setCommentsList(prev => [...prev, novoCommentObj]);
      setNovoComentario("");

    } catch (err) {
      console.error("Erro ao comentar:", err);
      alert("Erro ao enviar comentário.");
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleCurtir = async () => {
    if (post.user_has_liked) return;
    try {
      await api.post(`/community/publicacoes/${postId}/curtir/`);
      setPost(prev => ({ ...prev, user_has_liked: true, likes: prev.likes + 1 }));
    } catch (err) { console.error(err); }
  };

  const handleDescurtir = async () => {
    if (!post.user_has_liked) return;
    try {
      await api.post(`/community/publicacoes/${postId}/descurtir/`);
      setPost(prev => ({ ...prev, user_has_liked: false, likes: Math.max(prev.likes - 1, 0) }));
    } catch (err) { console.error(err); }
  };

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

  // BLINDAGEM: Se der erro ou se post for null, mostra mensagem em vez de quebrar
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

  const authorImage = getMainAuthorImage();
  const authorCursor = authorData?.is_lojista ? 'cursor-pointer hover:underline' : 'cursor-default';

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="cursor-pointer p-1 rounded-full transition">
              <ChevronLeft size={32} className="cursor-pointer mr-3 text-gray-900 hover:text-[#FD7702] transition-colors" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Publicação</h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative">
              
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className={`h-14 w-14 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center flex-shrink-0 ${authorCursor}`}
                  onClick={handleAuthorClick}
                >
                  {authorImage ? (
                    <img src={authorImage} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User size={28} className="text-gray-500" />
                  )}
                </div>

                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <h3 
                      className={`font-bold text-gray-900 text-base ${authorCursor}`}
                      onClick={handleAuthorClick}
                    >
                      {getMainAuthorName()}
                    </h3>
                    <span className="text-sm text-gray-500">{formatDate(post.data_publicacao)}</span>
                  </div>
                  {post.titulo && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md border border-orange-200 bg-orange-50 text-[#FD7702] text-[10px] font-bold uppercase">
                      {post.titulo}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-800 leading-relaxed mb-6 text-justify whitespace-pre-wrap">
                {post.descricao}
              </p>
              
              {post.imagem && (
                <div className="w-full mb-6 rounded-lg overflow-hidden">
                    <img src={post.imagem} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
               )}

              <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                <button
                  onClick={post.user_has_liked ? handleDescurtir : handleCurtir}
                  className={`cursor-pointer transition flex items-center gap-1 ${post.user_has_liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                >
                  <Heart size={24} fill={post.user_has_liked ? "red" : "none"} stroke={post.user_has_liked ? "red" : "currentColor"} />
                  <span>{post.likes}</span>
                </button>
                <div className="cursor-pointer text-gray-600 flex items-center gap-1">
                  <MessageCircle size={24} />
                  <span className="text-sm font-medium">{commentsList.length}</span>
                </div>
              </div>
            </div>

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
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FD7702] transition disabled:opacity-50"
              >
                {novoComentario.trim() ? <Send size={24} /> : <Smile size={24} />}
              </button>
            </form>

            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Comentários ({commentsList.length})</h3>

            <div className="space-y-4 pb-10">
              {commentsList.length === 0 ? (
                 <p className="text-gray-500 text-center py-4">Seja o primeiro a comentar!</p>
              ) : (
                commentsList.map((comment) => (
                    <div key={comment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative">
                    
                    <div className="h-10 w-10 rounded-full bg-[#FDF6EC] border border-orange-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {comment.autor_foto ? (
                            <img src={comment.autor_foto} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-[#FD7702]">
                                <User size={18}/>
                            </span>
                        )}
                    </div>

                    <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">
                                {/* Prioridade: 1. Nome formatado pelo Back, 2. Objeto Autor, 3. Fallback para ID */}
                                {comment.autor_nome || comment.autor?.full_name || `Usuário #${comment.autor_id || comment.autor || '?'}`}
                            </span>
                            <span className="text-xs text-gray-400">• {formatDate(comment.data)}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.texto}
                        </p>
                    </div>

                    <button className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1">
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