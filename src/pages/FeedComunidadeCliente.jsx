import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import CriarPostPopup from '../components/CriarPostPopup';
import ModalEnquete from '../components/ModalEnquete';
import EnquetePost from '../components/EnquetePost';
import {
  ChevronLeft, Share2, MoreVertical, Heart, ThumbsDown, MessageCircle, Trash2, Image as ImageIcon
} from 'lucide-react';

// --- DADOS DE FALLBACK ---
const MOCK_FALLBACK = {
  id: 0,
  nome: "Comunidade não encontrada",
  categoria: "Geral",
  seguidores: 0,
  imagem: null,
  posts: []
};

export default function FeedComunidadeCliente() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [comunidade, setComunidade] = useState(null);
  const [posts, setPosts] = useState([]);
  const [modalPostAberto, setModalPostAberto] = useState(false);
  const [modalEnqueteAberto, setModalEnqueteAberto] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  // --- 1. BUSCAR DADOS ---
  useEffect(() => {
    const carregarDados = async () => {
      await new Promise(r => setTimeout(r, 100));
      const dadosSalvos = localStorage.getItem('minhas_comunidades');
      const comunidadesSalvas = dadosSalvos ? JSON.parse(dadosSalvos) : [];
      
      // Compara ID (== para ignorar diferença string/número)
      const comunidadeEncontrada = comunidadesSalvas.find(c => c.id == id);

      if (comunidadeEncontrada) {
        setComunidade({
          ...comunidadeEncontrada,
          seguidores: 1, 
          posts: []      
        });
      } else {
        setComunidade(MOCK_FALLBACK);
      }
    };
    carregarDados();
  }, [id]);

  // --- FUNÇÕES DE POSTAGEM ---
  
  const handleAdicionarPost = (dados) => {
    // console.log("Dados recebidos do modal:", dados); // Para debug se precisar
    const novoPost = {
      id: Date.now(),
      author: "Você",
      avatar: null, 
      date: "Agora",
      
      // --- AQUI ESTÁ O TÍTULO ---
      // Certifique-se que o Modal está enviando 'titulo'
      title: dados.titulo, 
      
      content: dados.descricao,
      imagemPost: dados.imagem, 
      likes: 0,
      comments: 0,
      type: "text"
    };
    setPosts([novoPost, ...posts]);
    setModalPostAberto(false);
  };

  const handleAdicionarEnquete = (dadosEnquete) => {
    const novoPost = {
      id: Date.now(),
      author: "Você",
      date: "Agora",
      type: "enquete",
      question: dadosEnquete.pergunta,
      options: dadosEnquete.opcoes,
      likes: 0,
      comments: 0
    };
    setPosts([novoPost, ...posts]);
    setModalEnqueteAberto(false);
  };

  const toggleMenu = (postId) => {
    setMenuAbertoId(menuAbertoId === postId ? null : postId);
  };

  const handleDeletarPost = (postId) => {
    if (window.confirm("Excluir publicação?")) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  if (!comunidade) return (
    <div className="h-screen bg-white flex items-center justify-center text-gray-500 animate-pulse">
      Carregando comunidade...
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
              className="absolute top-4 left-4 z-20 p-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Banner */}
            <div className="w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
              {comunidade.imagem ? (
                <img src={comunidade.imagem} alt="Banner" className="w-full h-full object-cover" />
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
              <p className="text-gray-600 text-lg mt-2 font-medium">
                {comunidade.category || comunidade.categoria}
              </p>
            </div>
          </div>

          {/* ÁREA DE CONTEÚDO */}
          <div className="max-w-4xl mx-auto px-6 pb-12 mt-8">
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
              <div>
                <span className="text-lg font-bold text-gray-900">Seguidores</span>
                <span className="ml-2 text-lg font-medium text-gray-600">{comunidade.seguidores}</span>
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
                  <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Header Post */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold border border-gray-300">
                          {post.avatar ? (
                            <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                          ) : (
                            post.author[0]
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{post.author}</h3>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </div>

                      <div className="relative">
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
                      <div className="mb-4">
                        <EnquetePost question={post.question} options={post.options} />
                      </div>
                    ) : (
                      <div className="mb-4">
                        
                        {/* 1. TÍTULO (Em negrito e destaque) */}
                        {post.title && (
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            {post.title}
                          </h4>
                        )}

                        {/* 2. TEXTO */}
                        {post.content && (
                          <p className="text-gray-700 leading-relaxed mb-3 text-sm">{post.content}</p>
                        )}
                        
                        {/* 3. IMAGEM */}
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
                    <div className="flex items-center gap-6 border-t border-gray-100 pt-3 mt-2">
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors group">
                        <Heart size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors">
                        <MessageCircle size={18} />
                        <span className="text-xs font-medium">{post.comments}</span>
                      </button>
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