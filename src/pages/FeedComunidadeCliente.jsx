import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import CriarPostPopup from '../components/CriarPostPopup';
import ModalEnquete from '../components/ModalEnquete';
import EnquetePost from '../components/EnquetePost';
import api from '../api/api'; 
import {
  ChevronLeft, Share2, MoreVertical, Heart, MessageCircle, Trash2, Image as ImageIcon
} from 'lucide-react';

export default function FeedComunidadeCliente() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [comunidade, setComunidade] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalPostAberto, setModalPostAberto] = useState(false);
  const [modalEnqueteAberto, setModalEnqueteAberto] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  // --- 1. BUSCAR DADOS DA API (CORRIGIDO) ---
  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        // A. Busca detalhes da comunidade
        const responseComunidade = await api.get(`/customer-community/comunidades/${id}/`);
        const communityData = responseComunidade.data;
        setComunidade(communityData);

        // --- MUDANÇA AQUI: Busca Posts E Enquetes em paralelo ---
        const [resPosts, resEnquetes] = await Promise.all([
            api.get(`/community/publicacoes/?comunidade_cliente=${id}`),
            api.get(`/community/enquetes/?comunidade_cliente=${id}`)
        ]);
        
        // 1. Processa Posts de Texto
        // Filtra para garantir que não venha lixo
        const postsFiltrados = resPosts.data.filter(p => p.comunidade_cliente !== null);
        
        const formattedPosts = postsFiltrados.map(p => ({
            id: p.id,
            type: 'text',
            author: p.autor_nome || "Usuário",
            avatar: p.imagem_capa || communityData.imagem_capa, // Foto do criador como fallback
            // Guardamos dateObj para ordenar depois
            dateObj: new Date(p.data_publicacao),
            date: new Date(p.data_publicacao).toLocaleDateString('pt-BR'),
            
            title: p.titulo,
            content: p.descricao,
            imagemPost: p.imagem,
            
            likes: p.likes || 0,
            user_has_liked: p.user_has_liked || false,
            comments: p.total_comentarios || 0
        }));

        // 2. Processa Enquetes (Cálculo Matemático + Formatação)
        const formattedEnquetes = resEnquetes.data.map(e => {
            // Calcula total de votos
            const totalCalculado = e.opcoes 
                ? e.opcoes.reduce((acc, op) => {
                    const qtd = parseInt(op.votos) || parseInt(op.votos_count) || 0;
                    return acc + qtd;
                }, 0) 
                : 0;

            return {
                id: e.id,
                type: 'enquete',
                author: communityData.criador_nome || e.autor_nome || "Admin", 
                avatar: communityData.imagem_capa, // Foto do criador da comunidade
                // Ajuste aqui para pegar o campo correto de data vindo do seu backend (data_criacao ou criada_em)
                dateObj: new Date(e.data_criacao || e.criada_em),
                date: new Date(e.data_criacao || e.criada_em).toLocaleDateString('pt-BR'),
                question: e.pergunta,
                
                // Formata as opções visualmente
                options: e.opcoes ? e.opcoes.map(op => {
                    const votosOpcao = parseInt(op.votos) || parseInt(op.votos_count) || 0;
                    const percentNum = totalCalculado > 0 ? (votosOpcao / totalCalculado) * 100 : 0;
                    
                    return {
                        id: op.id,
                        text: op.texto, // Importante: mapeia 'texto' para 'text'
                        votes: votosOpcao,
                        percent: percentNum.toFixed(1),
                        barWidth: `${percentNum}%`
                    };
                }) : [],
                
                totalVotes: totalCalculado,
                likes: 0, 
                comments: 0
            };
        });

        // 3. Mistura tudo e ordena por data (Mais recente primeiro)
        const feedMisto = [...formattedPosts, ...formattedEnquetes].sort((a, b) => b.dateObj - a.dateObj);
        
        setPosts(feedMisto);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchDados();
    }
  }, [id]);

  // --- 2. FUNÇÃO DE VOTAR ---
  const handleVotarEnquete = async (enqueteId, opcaoId) => {
    try {
      await api.post(`/community/enquetes/${enqueteId}/votar/`, { opcao_id: opcaoId });

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === enqueteId) {
          const totalAtual = post.options.reduce((acc, op) => acc + op.votes, 0);
          const novoTotal = totalAtual + 1;

          const novasOpcoes = post.options.map(op => {
            const novosVotos = op.id === opcaoId ? (op.votes + 1) : op.votes;
            const percent = novoTotal > 0 ? (novosVotos / novoTotal) * 100 : 0;

            return {
              ...op,
              votes: novosVotos,
              percent: percent.toFixed(1),
              barWidth: `${percent}%`
            };
          });

          return {
            ...post,
            options: novasOpcoes,
            totalVotes: novoTotal,
            user_has_voted: true 
          };
        }
        return post;
      }));

    } catch (err) {
      console.error("Erro ao votar:", err);
      if (err.response && err.response.status === 400) {
        const msg = JSON.stringify(err.response.data).toLowerCase();
        if (msg.includes("unique") || msg.includes("já votou")) alert("Você já votou nesta enquete!");
        else alert("Não foi possível computar seu voto.");
      }
    }
  };

  // --- 3. CRIAR POST ---
  const handleAdicionarPost = async (dados) => {
    try {
        const formData = new FormData();
        formData.append('titulo', dados.titulo || "Novo Post");
        formData.append('descricao', dados.descricao);
        formData.append('comunidade_cliente', id);
        
        if (dados.imagem) {
            formData.append('imagem', dados.imagem);
        }

        const response = await api.post('/community/publicacoes/criar/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const newPostApi = response.data;
        
        // Adiciona na lista visualmente (Otimista)
        const novoPost = {
            id: newPostApi.id,
            author: "Você",
            avatar: null, 
            dateObj: new Date(), // Adicionado para manter consistência na ordenação se precisar reordenar
            date: "Agora",
            title: newPostApi.titulo,
            content: newPostApi.descricao,
            imagemPost: newPostApi.imagem,
            likes: 0,
            comments: 0,
            type: "text"
        };

        setPosts([novoPost, ...posts]);
        setModalPostAberto(false);

    } catch (error) {
        console.error("Erro ao criar post:", error);
        alert("Erro ao publicar.");
    }
  };

  // --- 4. CRIAR ENQUETE ---
  const handleAdicionarEnquete = async (dadosEnquete) => {
    try {
        const payload = {
            pergunta: dadosEnquete.pergunta,
            opcoes: dadosEnquete.opcoes,
            comunidade_cliente: id 
        };

        const response = await api.post('/community/enquetes/', payload);
        const novaEnquete = response.data;

        // Formata para o visual (Otimista)
        const novoPostEnquete = {
            id: novaEnquete.id,
            author: "Você",
            dateObj: new Date(),
            date: "Agora",
            type: "enquete",
            question: novaEnquete.pergunta,
            options: novaEnquete.opcoes.map(op => ({ 
                id: op.id, 
                text: op.texto, 
                votes: 0, 
                percent: "0.0", 
                barWidth: '0%' 
            })),
            likes: 0,
            comments: 0
        };

        setPosts([novoPostEnquete, ...posts]);
        setModalEnqueteAberto(false);

    } catch (error) {
        console.error("Erro ao criar enquete:", error);
        alert("Erro ao criar enquete.");
    }
  };

  const toggleMenu = (postId) => {
    setMenuAbertoId(menuAbertoId === postId ? null : postId);
  };

  const handleDeletarPost = async (postId) => {
    if (!window.confirm("Excluir publicação?")) return;
    try {
        await api.delete(`/community/publicacoes/${postId}/`); 
        setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Não foi possível excluir.");
    }
  };

  const handleToggleLike = async (post, e) => {
    e.stopPropagation(); 
    const jaCurtiu = post.user_has_liked;
    
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          user_has_liked: !jaCurtiu,
          likes: jaCurtiu ? Math.max(p.likes - 1, 0) : p.likes + 1
        };
      }
      return p;
    }));

    try {
      if (jaCurtiu) {
        await api.post(`/community/publicacoes/${post.id}/descurtir/`);
      } else {
        await api.post(`/community/publicacoes/${post.id}/curtir/`);
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center text-gray-500 animate-pulse">
      Carregando comunidade...
    </div>
  );

  if (!comunidade) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center text-gray-500">
        <p>Comunidade não encontrada.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#FD7702] underline">Voltar</button>
    </div>
  );

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-white">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-0">
          
          {/* HEADER DA COMUNIDADE */}
          <div className="relative">
            <button 
              onClick={() => navigate(-1)} 
              className="absolute top-4 left-4 z-20 p-1 text-gray-700 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Banner */}
            <div className="w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
              {comunidade.imagem_capa ? (
                <img src={comunidade.imagem_capa} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={64} />
                  <span className="text-sm mt-2">Sem foto de capa</span>
                </div>
              )}
            </div>

            {/* Título da Comunidade */}
            <div className="text-center mt-6 px-4">
              <h1 className="text-3xl font-black text-gray-900">
                {comunidade.nome}
              </h1>
              <p className="text-gray-600 text-lg mt-2 font-medium capitalize">
                {comunidade.categoria}
              </p>
              <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
                  {comunidade.descricao}
              </p>
            </div>
          </div>

          {/* ÁREA DE CONTEÚDO */}
          <div className="max-w-4xl mx-auto px-6 pb-12 mt-8">
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
              <div>
                <span className="text-lg font-bold text-gray-900">Membros</span>
                <span className="ml-2 text-lg font-medium text-gray-600">
                    {Array.isArray(comunidade.seguidores) ? comunidade.seguidores.length : 0}
                </span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setModalPostAberto(true)} 
                  className="px-5 py-2 border-2 border-[#FD7702] text-[#FD7702] font-bold rounded-full hover:bg-orange-50 transition-colors text-sm"
                >
                  Criar publicação
                </button>
                <button 
                  onClick={() => setModalEnqueteAberto(true)} 
                  className="px-5 py-2 bg-[#FD7702] text-white font-bold rounded-full hover:bg-[#e66a00] transition-colors text-sm shadow-md"
                >
                  Criar enquete
                </button>
              </div>
            </div>

            {/* LISTA DE POSTS */}
            {posts.length === 0 ? (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p>Nenhuma publicação ainda. Seja o primeiro a postar!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => {
                        if(post.type !== 'enquete') navigate(`/post/${post.id}`)
                    }}
                    className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative transition-shadow 
                        ${post.type !== 'enquete' ? 'cursor-pointer hover:shadow-md' : ''}`}
                  >
                    
                    {/* Header Post */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold border border-gray-300">
                          {post.avatar ? (
                            <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                          ) : (
                            (post.author && post.author[0]) || 'U'
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{post.author}</h3>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </div>

                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleMenu(post.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <MoreVertical size={20} />
                        </button>
                        {menuAbertoId === post.id && (
                          <div className="absolute right-0 top-8 bg-white shadow-lg border rounded-lg py-2 w-32 z-10 animate-in fade-in zoom-in duration-100">
                            <button onClick={() => handleDeletarPost(post.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 size={16} /> Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- RENDERIZAÇÃO DO CONTEÚDO --- */}
                    {post.type === 'enquete' ? (
                      <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                        <EnquetePost 
                            question={post.question} 
                            options={post.options} 
                            onVote={(opId) => handleVotarEnquete(post.id, opId)}
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        {post.title && (
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            {post.title}
                          </h4>
                        )}

                        {post.content && (
                          <p className="text-gray-700 leading-relaxed mb-3 text-sm">{post.content}</p>
                        )}
                        
                        {post.imagemPost && (
                          <div className="rounded-lg overflow-hidden border border-gray-200 mt-3">
                            <img 
                              src={post.imagemPost} 
                              alt="Imagem do post" 
                              className="w-full h-auto object-cover max-h-96" 
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-6 border-t border-gray-100 pt-3 mt-2" onClick={(e) => e.stopPropagation()}>
                      
                      <button 
                        onClick={(e) => handleToggleLike(post, e)} 
                        className={`flex items-center gap-1.5 transition group cursor-pointer ${post.user_has_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <Heart size={18} className={post.user_has_liked ? "fill-current" : "group-hover:scale-110 transition-transform"} />
                        <span className="text-xs font-medium">{post.likes}</span>
                      </button>

                      {post.type !== 'enquete' && (
                          <button 
                            onClick={() => navigate(`/post/${post.id}`)} 
                            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                          >
                            <MessageCircle size={18} />
                            <span className="text-xs font-medium">{post.comments}</span>
                          </button>
                      )}
                      
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors ml-auto">
                        <Share2 size={18} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAIS */}
      <CriarPostPopup 
        isOpen={modalPostAberto} 
        onClose={() => setModalPostAberto(false)} 
        onPublicar={handleAdicionarPost}
        userName="Você"
      />
      
      <ModalEnquete 
        isOpen={modalEnqueteAberto} 
        onClose={() => setModalEnqueteAberto(false)} 
        onConfirm={handleAdicionarEnquete}
        userName="Você"
      />

    </div>
  );
}