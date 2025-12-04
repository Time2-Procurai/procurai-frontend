import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import AvaliacaoPopup from "../components/AvaliacaoPopup";
import CriarPostPopup from '../components/CriarPostPopup';
import ModalEnquete from '../components/ModalEnquete'; 
import EnquetePost from '../components/EnquetePost'; 
import api from '../api/api';
import {
  ChevronLeft, Star, Store, Map,
  Share2, MoreVertical, Heart, ThumbsDown, MessageCircle,
  Trash2, UserPlus, UserCheck 
} from 'lucide-react';

function PerfilEmpresa() {
  const navigate = useNavigate();
  const { userId: profileIdFromUrl } = useParams();
  const visitanteTipo = localStorage.getItem('userRole');
  const visitanteId = localStorage.getItem('userId');

  const [popupAberto, setPopupAberto] = useState(false);
  const [modalPostAberto, setModalPostAberto] = useState(false);
  const [modalEnqueteAberto, setModalEnqueteAberto] = useState(false);

  const [abaAtiva, setAbaAtiva] = useState('Informações');
  const [lojaData, setLojaData] = useState(null);

  // Estados Dinâmicos
  const [posts, setPosts] = useState([]);
  const [promos, setPromos] = useState([]);
  
  // Estado para controle de comunidade e seguidores
  const [communityId, setCommunityId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); 

  const [menuAbertoId, setMenuAbertoId] = useState(null);

  useEffect(() => {
    const fetchDadosLoja = async () => {
      if (!profileIdFromUrl) {
        console.error("ID do perfil não encontrado na URL.");
        return;
      }

      try {
        // 1. Buscar Perfil do Usuário/Loja
        const response = await api.get(`/user/listar/usuarios/${profileIdFromUrl}/`);
        const userData = response.data;
        
        const { street, number, neighborhood, city, complement } = userData;
        const enderecoCompleto = [street, number, neighborhood, city, complement]
          .filter(Boolean)
          .join(', ');

        setLojaData({
          nome: userData.full_name, 
          categoria: userData.company_category || "Categoria não definida",
          rating: "4,9",
          status: "Aberto",
          descricao: userData.description || "Sem descrição disponível.",
          horario: userData.operating_hours || "Horário não informado.",
          contato: userData.phone || "Sem telefone.",
          endereco: enderecoCompleto || "Endereço não informado.",
          bannerUrl: userData.cover_picture,
          profileUrl: userData.profile_picture,
          mapUrl: null,
        });

        // 2. Buscar Produtos da Loja
        try {
            const resProd = await api.get(`/products/store/${profileIdFromUrl}/`);
            setPromos(resProd.data.slice(0, 3));
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
        }

        // 3. Buscar Comunidade e Publicações
        try {
            const resComm = await api.get(`/community/lojista/${profileIdFromUrl}/`);
            if (resComm.data && resComm.data.id) {
                const cId = resComm.data.id;
                setCommunityId(cId);

                // Verifica se o usuário já segue a comunidade
                if (visitanteTipo === 'cliente') {
                    try {
                        const resFollow = await api.get(`/community/${cId}/esta-seguindo/`);
                        setIsFollowing(resFollow.data.seguindo); 
                    } catch (followErr) {
                        console.warn("Erro ao verificar status de seguidor", followErr);
                    }
                }

                // A. Busca publicações (Texto/Imagem)
                const resPosts = await api.get(`/community/publicacoes/${cId}/listar/`);
                const formattedPosts = resPosts.data.map(p => ({
                    id: p.id,
                    type: 'post',
                    author: userData.full_name,
                    dateObj: new Date(p.data_publicacao),
                    date: new Date(p.data_publicacao).toLocaleDateString('pt-BR'),
                    content: p.descricao,
                    tag: p.titulo || "Publicação",
                    likes: 0, 
                    comments: 0, 
                    postImage: p.imagem
                }));

                // B. Busca Enquetes
            const resEnquetes = await api.get(`/community/enquetes/?comunidade=${cId}`);

            const formattedEnquetes = resEnquetes.data.map(e => {
                const total = e.total_votos || 0;

                return {
                    id: e.id,
                    type: 'enquete',
                    author: userData.full_name,

                    dateObj: new Date(e.data_criacao),
                    date: new Date(e.data_criacao).toLocaleDateString('pt-BR'),

                    question: e.pergunta,

                    options: e.opcoes
                        ? e.opcoes.map(op => {
                            const percent = total > 0 ? (op.votos / total) * 100 : 0;
                            return {
                                id: op.id,
                                text: op.texto,
                                votes: op.votos,
                                percent: percent.toFixed(1),      // exemplo: "42.5"
                                barWidth: `${percent}%`           // exemplo: "42%"
                            };
                        })
                        : [],

                    totalVotes: total,
                    likes: 0,
                    comments: 0
                };
            });

            // Mescla e ordena por data (mais recente primeiro)
            const mixedFeed = [...formattedPosts, ...formattedEnquetes].sort(
                (a, b) => b.dateObj - a.dateObj
            );

            setPosts(mixedFeed);
            }
        } catch (err) {
            console.log("Comunidade não encontrada ou erro:", err);
        }

      } catch (e) {
        console.error("Erro ao obter dados do usuário:", e);
      }
    };

    fetchDadosLoja();
  }, [profileIdFromUrl, visitanteTipo]);

  // --- AÇÃO DE SEGUIR/DESSEGUIR ---
  const handleToggleFollow = async () => {
    if (!communityId) return;
    
    try {
        await api.post(`/community/${communityId}/follow/`);
        setIsFollowing(!isFollowing);

    } catch (err) {
        console.error("Erro ao seguir/desseguir:", err);
        alert("Não foi possível realizar a ação. Tente novamente.");
    }
  };

  const handleAdicionarPost = async (dados) => {
    if (!communityId) return alert("Erro: Comunidade não encontrada.");
    try {
        const formData = new FormData();
        formData.append('titulo', dados.titulo || "Novo Post");
        formData.append('descricao', dados.descricao);
        formData.append('comunidade', communityId);
        const response = await api.post('/community/publicacoes/criar/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const newPostApi = response.data;
        const newPost = {
            id: newPostApi.id,
            type: 'post',
            author: lojaData.nome,
            dateObj: new Date(newPostApi.data_publicacao),
            date: new Date(newPostApi.data_publicacao).toLocaleDateString('pt-BR'),
            content: newPostApi.descricao,
            tag: newPostApi.titulo,
            likes: 0,
            comments: 0,
            postImage: newPostApi.imagem
        };
        // Adiciona no topo da lista
        setPosts([newPost, ...posts]);
        setModalPostAberto(false);
    } catch (err) {
        console.error("Erro ao criar post:", err);
        alert("Erro ao publicar.");
    }
  };

  // --- FUNÇÃO CORRIGIDA PARA PERSISTIR ENQUETE ---
  const handleAdicionarEnquete = async (dadosEnquete) => {
    if (!communityId) return alert("Erro: Comunidade não encontrada.");

    try {
      // O backend espera: { "pergunta": "...", "opcoes": ["A", "B"] }
      const payload = {
        pergunta: dadosEnquete.pergunta,
        opcoes: dadosEnquete.opcoes // Array de strings
      };

      // Chama a API
      const response = await api.post('/community/enquetes/', payload);
      const novaEnqueteApi = response.data;

      // Formata para exibir na tela sem precisar recarregar
      const novaEnqueteVisual = {
        id: novaEnqueteApi.id,
        type: 'enquete',
        author: lojaData.nome,
        dateObj: new Date(novaEnqueteApi.data_criacao),
        date: new Date(novaEnqueteApi.data_criacao).toLocaleDateString('pt-BR'),
        question: novaEnqueteApi.pergunta,
        // O backend retorna opções com ID e Votos
        options: novaEnqueteApi.opcoes.map(op => ({
           id: op.id,
           text: op.texto,
           votes: op.votos
        })),
        totalVotes: 0,
        likes: 0,
        comments: 0
      };

      setPosts([novaEnqueteVisual, ...posts]);
      setModalEnqueteAberto(false);
      alert("Enquete publicada com sucesso!");

    } catch (err) {
      console.error("Erro ao criar enquete:", err);
      alert("Erro ao criar enquete. Tente novamente.");
    }
  };

  const handleDeletarPost = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta publicação?")) {
      setPosts(posts.filter((post) => post.id !== id));
      setMenuAbertoId(null);
    }
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    if (menuAbertoId === id) {
      setMenuAbertoId(null);
    } else {
      setMenuAbertoId(id);
    }
  };

  // Função para votar (Opcional, para conectar o componente EnquetePost)
  const handleVotarEnquete = async (enqueteId, opcaoId) => {
      try {
          await api.post(`/community/enquetes/${enqueteId}/votar/`, { opcao_id: opcaoId });
          alert("Voto computado!");
          // O ideal seria recarregar a enquete para atualizar os votos
      } catch (err) {
          console.error("Erro ao votar:", err);
          alert(err.response?.data?.message || "Erro ao votar.");
      }
  };

  const abaAtivaClass = "whitespace-nowrap border-b-2 border-orange-500 py-4 px-1 text-base font-semibold text-orange-500";
  const abaInativaClass = "whitespace-nowrap border-b-2 border-transparent py-4 px-1 text-base font-semibold text-gray-500 hover:text-gray-700";

  if (!lojaData) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <main className="flex-1 overflow-y-auto bg-white flex items-center justify-center">
            <p className="text-xl text-gray-500 animate-pulse">Carregando perfil...</p>
          </main>
        </div>
      </div>
    );
  }

  const isOwner = visitanteId === profileIdFromUrl;

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto bg-white">

          <CriarPostPopup
            isOpen={modalPostAberto}
            onClose={() => setModalPostAberto(false)}
            userName={lojaData?.nome}
            userAvatar={lojaData?.profileUrl}
            onPublicar={handleAdicionarPost}
          />
          
          <ModalEnquete 
            isOpen={modalEnqueteAberto}
            onClose={() => setModalEnqueteAberto(false)}
            userName={lojaData?.nome}
            userAvatar={lojaData?.profileUrl}
            onConfirm={handleAdicionarEnquete} 
          />

          <div>
            <div className="relative">
              {/* Banner */}
              {lojaData.bannerUrl ? (
                <div
                  className="h-40 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${lojaData.bannerUrl})` }}
                />
              ) : (
                <div className="h-40 w-full bg-gray-400" />
              )}

              {/* Botão de voltar */}
              <button
                onClick={() => navigate(-1)}
                className="hover:cursor-pointer absolute top-4 left-4 text-black p-2 transition hover:opacity-80 bg-white/50 rounded-full"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Botões Editar/Avaliar */}
              {isOwner && visitanteTipo === 'lojista' ? (
                <button
                  onClick={() => navigate(`/EditarPerfilLoja/`+localStorage.getItem('userId'))}
                  className="hover:cursor-pointer absolute top-4 ring-2 ring-[#FD7702] right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50"
                >
                  Editar perfil
                </button>
              ) : visitanteTipo === 'cliente' ? (
                <>
                  <button
                    onClick={() => setPopupAberto(true)}
                    className="hover:cursor-pointer absolute top-4 ring-2 ring-[#FD7702] right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50"
                  >
                    Avaliar loja
                  </button>
                  <AvaliacaoPopup
                    aberto={popupAberto}
                    storeId={profileIdFromUrl}
                    onFechar={() => setPopupAberto(false)}
                  />
                </>
              ) : null}

              {/* Foto de Perfil */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                {lojaData.profileUrl ? (
                  <img
                    src={lojaData.profileUrl}
                    alt="Logo"
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                    <Store size={48} className="text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Infos principais da loja */}
            <div className="px-6 pt-14 pb-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">{lojaData.nome}</h1>
                <p className="text-lg text-gray-500">{lojaData.categoria}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="text-xl font-bold">{lojaData.rating}</span>
                  <Star size={20} className="fill-current text-orange-500" />
                </div>
              </div>

              {/* --- ÁREA DO STATUS E BOTÃO SEGUIR (AJUSTADA) --- */}
              <div className="mt-4 flex items-center justify-between px-4"> 
                
                {/* BOTÃO SEGUIR (lado esquerdo) */}
                <div className="flex-1 flex justify-start"> 
                  {!isOwner && visitanteTipo === 'cliente' && communityId && (
                      <button
                          onClick={handleToggleFollow}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-colors shadow-sm cursor-pointer ${
                              isFollowing 
                              ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200' 
                              : 'bg-[#FD7702] text-white border border-[#FD7702] hover:bg-[#e66a00]'
                          }`}
                      >
                          {isFollowing ? (
                              <>
                                  <UserCheck size={16} />
                                  Seguindo
                              </>
                          ) : (
                              <>
                                  <UserPlus size={16} />
                                  Seguir
                              </>
                          )}
                      </button>
                  )}
                </div>

                {/* STATUS DA LOJA (lado direito) */}
                <div className="flex-1 flex justify-end"> 
                  <div className="flex items-center space-x-1.5 ml-auto">
                    <Store size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-700">{lojaData.status}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Navegação das Abas */}
            <div className="border-b border-gray-200">
              <nav className="flex justify-center space-x-10">
                <button
                  onClick={() => setAbaAtiva('Informações')}
                  className={`${abaAtiva === 'Informações' ? abaAtivaClass : abaInativaClass} cursor-pointer`}
                >
                  Informações
                </button>
                <button
                  onClick={() => setAbaAtiva('Comunidade')}
                  className={`${abaAtiva === 'Comunidade' ? abaAtivaClass : abaInativaClass} cursor-pointer`}
                >
                  Comunidade
                </button>
                <Link
                  to={`/produtos/${profileIdFromUrl}`}
                  className={abaInativaClass}
                >
                  Produtos
                </Link>
              </nav>
            </div>

            {/* Aba Informações */}
            {abaAtiva === 'Informações' && (
              <div className="p-4">
                <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Descrição</h3>
                        <p className="text-sm text-gray-600">{lojaData.descricao}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Horário de funcionamento</h3>
                        <p className="text-sm text-gray-600">{lojaData.horario}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-base font-bold text-gray-900">Contato</h3>
                        <p className="text-sm text-gray-600">{lojaData.contato}</p>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3">
                      <div className="mb-2">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Endereço</h3>
                        <p className="text-sm text-gray-600">{lojaData.endereco}</p>
                      </div>
                      {lojaData.mapUrl ? (
                        <img src={lojaData.mapUrl} alt="Mapa" className="h-28 w-full rounded-lg object-cover" />
                      ) : (
                        <div className="h-28 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                          <Map size={32} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aba Comunidade */}
            {abaAtiva === 'Comunidade' && (
              <div className="p-4 md:px-8 max-w-4xl mx-auto bg-gray-50 min-h-[400px]">
                 <div className="flex items-center justify-between mb-6 pt-4">
                  <h2 className="text-xl font-bold text-gray-900">Publicações</h2>
                  {isOwner && (
                    <div className="flex gap-3">
                        <button
                          onClick={() => setModalPostAberto(true)}
                          className="cursor-pointer px-4 py-1.5 text-sm font-semibold text-[#FD7702] border border-[#FD7702] rounded-full hover:bg-orange-50 transition active:scale-95"
                        >
                          Criar publicação
                        </button>
                        <button 
                          onClick={() => setModalEnqueteAberto(true)} 
                          className="cursor-pointer px-4 py-1.5 text-sm font-semibold text-[#FD7702] border border-[#FD7702] rounded-full hover:bg-orange-50 transition active:scale-95"
                        >
                          Criar enquete
                        </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6 mb-12">
                  {posts.map((post) => (
                    <div 
                      key={`${post.type}-${post.id}`} 
                      onClick={() => {
                         if (post.type !== 'enquete') {
                             navigate(`/post/${post.id}`);
                         }
                      }}
                      className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative transition-shadow 
                        ${post.type !== 'enquete' ? 'cursor-pointer hover:shadow-md' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                            {lojaData.profileUrl ? (
                              <img src={lojaData.profileUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <Store size={20} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">{post.author}</h3>
                            <div className="flex items-center gap-2">
                              {post.tag && (
                                <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FD7702] text-[10px] font-bold uppercase border border-orange-200">
                                  {post.tag}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">{post.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-400 gap-2" onClick={(e) => e.stopPropagation()}>
                          <button className="hover:text-gray-600 cursor-pointer p-1 rounded hover:bg-gray-100">
                            <Share2 size={18} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => toggleMenu(post.id, e)}
                              className="hover:text-gray-600 cursor-pointer p-1 rounded hover:bg-gray-100"
                            >
                              <MoreVertical size={18} />
                            </button>
                            {isOwner && menuAbertoId === post.id && (
                              <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden animate-in fade-in zoom-in duration-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletarPost(post.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition"
                                >
                                  <Trash2 size={14} />
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Renderização Condicional: Enquete ou Post Texto */}
                      {post.type === 'enquete' ? (
                        <div className="mb-4 w-full" onClick={(e) => e.stopPropagation()}>
                           <EnquetePost 
                             question={post.question}
                             options={post.options}
                             onVote={(opId) => handleVotarEnquete(post.id, opId)} // Passando a função de voto
                           />
                        </div>
                      ) : (
                        <>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3 text-justify">
                            {post.content}
                            </p>
                            
                            {post.postImage && (
                                <div className="w-full h-64 mb-4 rounded-lg overflow-hidden">
                                    <img src={post.postImage} alt="Post" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </>
                      )}

                      <hr className="border-gray-100 mb-3" />
                      
                      <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition group cursor-pointer">
                          <Heart size={20} className="group-hover:fill-current" />
                          <span className="text-xs">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition cursor-pointer">
                          <ThumbsDown size={20} />
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition cursor-pointer">
                          <MessageCircle size={20} />
                          <span className="text-xs">{post.comments}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-10">
                  <hr className="border-gray-200 mb-8" />
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Meus produtos em promoção</h2>
                    {isOwner && (
                      <button 
                        onClick={() => navigate(`/produtos/${profileIdFromUrl}`)}
                        className="cursor-pointer px-4 py-1.5 text-sm font-semibold text-[#FD7702] border border-[#FD7702] rounded-full hover:bg-orange-50 transition active:scale-95"
                      >
                        Gerenciar
                      </button>
                    )}
                  </div>
                  {promos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {promos.map((product) => (
                        <div 
                          key={product.id} 
                          className="cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
                          onClick={() => navigate(`/produto/${product.id}`)}
                        >
                          <div className="h-48 bg-white p-4 flex items-center justify-center relative">
                            {product.product_image ? (
                              <img
                                src={product.product_image}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <Store size={48} className="text-gray-400" />
                            )}
                          </div>
                          <div className="bg-gray-200 p-4 flex flex-col gap-1">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-gray-900 font-medium">
                                R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                              </span>
                              {product.is_negotiable && (
                                <span className="text-[#FD7702] font-bold text-xs uppercase">
                                  Negociável
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilEmpresa;