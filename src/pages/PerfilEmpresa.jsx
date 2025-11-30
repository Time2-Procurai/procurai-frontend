import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import AvaliacaoPopup from "../components/AvaliacaoPopup";
import CriarPostPopup from '../components/CriarPostPopup';
import api from '../api/api';
import {
  ChevronLeft, Star, Store, Map,
  Share2, MoreVertical, Heart, ThumbsDown, MessageCircle,
  Trash2
} from 'lucide-react';

// --- DADOS MOCKADOS (Publicações - Mantidos por enquanto como fallback ou exemplo) ---
const MOCK_POSTS = [
  {
    id: 1,
    author: "Zezinho Construções",
    date: "04/09/25",
    content: "A Zezinho Construções preparou uma oferta especial para você que não abre mão de qualidade e performance nas suas ferramentas. A poderosa parafusadeira DeWalt LT3 está com preço promocional por tempo limitado!",
    tag: "Promoção",
    likes: 12,
    comments: 2,
    // Sem imagem
  },
  {
    id: 2,
    author: "Zezinho Construções",
    date: "01/09/25",
    content: "⚡ Zezinho Construções convida você para o Grande Feirão da Construção 2025! Nos dias 18, 19 e 20 de outubro, nossa loja estará em clima de promoção.",
    tag: null,
    likes: 45,
    comments: 8,
    // Sem imagem
  }
];

function PerfilEmpresa() {
  const navigate = useNavigate();
  const { userId: profileIdFromUrl } = useParams();
  const visitanteTipo = localStorage.getItem('userRole');
  const visitanteId = localStorage.getItem('userId');

  const [popupAberto, setPopupAberto] = useState(false);
  const [modalPostAberto, setModalPostAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('Informações');
  const [lojaData, setLojaData] = useState(null);

  // Estado dos posts agora começa vazio para ser preenchido pela API
  const [posts, setPosts] = useState([]); 
  const [promos, setPromos] = useState([]); 
  
  // Armazena o ID da comunidade (necessário para criar o post)
  const [communityId, setCommunityId] = useState(null);

  const [menuAbertoId, setMenuAbertoId] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      if (!profileIdFromUrl) return;

      try {
        // 1. Buscar dados do Perfil da Loja
        const responseUser = await api.get(`/user/listar/usuarios/${profileIdFromUrl}/`);
        const userData = responseUser.data;
        const { street, number, neighborhood, city, complement } = userData;
        const enderecoCompleto = [street, number, neighborhood, city, complement].filter(Boolean).join(', ');

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
        const responseProducts = await api.get(`/products/store/${profileIdFromUrl}/`);
        setPromos(responseProducts.data.slice(0, 3));

        // --- 3. Buscar Comunidade e Publicações ---
        try {
           // Tenta achar a comunidade desse lojista
           const responseCommunity = await api.get(`/community/lojista/${profileIdFromUrl}/`);
           
           if (responseCommunity.data && responseCommunity.data.id) {
             const comId = responseCommunity.data.id;
             setCommunityId(comId);
   
             // Agora busca os posts dessa comunidade
             const responsePosts = await api.get(`/community/publicacoes/${comId}/listar/`);
             
             // Mapeia os dados do backend para o formato do frontend
             const postsFormatados = responsePosts.data.map(p => ({
               id: p.id,
               author: userData.full_name, // Nome da loja
               date: new Date(p.data_publicacao).toLocaleDateString('pt-BR'),
               content: p.descricao,
               tag: p.titulo || "Publicação",
               likes: 0, // Mockado
               comments: 0, // Mockado
               // postImage: p.imagem (Removido conforme solicitado)
             }));
             
             setPosts(postsFormatados);
           }
        } catch (err) {
           console.log("Lojista ainda não tem comunidade criada ou erro ao buscar posts:", err);
           // Se falhar a busca na API, usa o mock apenas para visualização (opcional)
           // setPosts(MOCK_POSTS);
        }

      } catch (e) {
        console.error("Erro ao obter dados gerais:", e);
      }
    };

    fetchDados();
  }, [profileIdFromUrl]);

  // --- FUNÇÃO DE CRIAR POST (Persistência) ---
  const handleAdicionarPost = async (dados) => {
    if (!communityId) {
        alert("Erro: Comunidade não encontrada para criar post.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append('titulo', dados.titulo);
        formData.append('descricao', dados.descricao); 
        formData.append('comunidade', communityId); 
        
        // Faz o POST para a API
        const response = await api.post('/community/publicacoes/criar/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Pega o post criado que voltou da API e adiciona na tela
        const novoPostApi = response.data;
        const novoPostFormatado = {
            id: novoPostApi.id,
            author: lojaData.nome,
            date: new Date(novoPostApi.data_publicacao).toLocaleDateString('pt-BR'),
            content: novoPostApi.descricao,
            tag: novoPostApi.titulo,
            likes: 0,
            comments: 0,
            // Sem imagem
        };
        
        setPosts([novoPostFormatado, ...posts]);
        setModalPostAberto(false); 

    } catch (error) {
        console.error("Erro ao criar post:", error);
        alert("Erro ao criar publicação. Tente novamente.");
    }
  };

  const handleDeletarPost = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta publicação?")) {
      // Futuramente: await api.delete(`/community/publicacoes/${id}/`);
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

  const abaAtivaClass = "whitespace-nowrap border-b-2 border-orange-500 py-4 px-1 text-base font-semibold text-orange-500";
  const abaInativaClass = "whitespace-nowrap border-b-2 border-transparent py-4 px-1 text-base font-semibold text-gray-500 hover:text-gray-700";

  if (!lojaData) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <div className="flex-1 flex justify-center items-center">
            <p className="text-xl text-gray-500 animate-pulse">Carregando perfil...</p>
          </div>
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

          <div>
            {/* Header / Banner */}
            <div className="relative">
              {lojaData.bannerUrl ? (
                <div
                  className="h-40 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${lojaData.bannerUrl})` }}
                />
              ) : (
                <div className="h-40 w-full bg-gray-400" />
              )}

              <button
                onClick={() => navigate(-1)}
                className="hover:cursor-pointer absolute top-4 left-4 text-black p-2 transition hover:opacity-80 bg-white/50 rounded-full"
              >
                <ChevronLeft size={28} />
              </button>

              {isOwner && visitanteTipo === 'empresa' ? (
                <button
                  onClick={() => navigate(`/EditarPerfilLoja`)}
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

            <div className="px-6 pt-14 pb-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">{lojaData.nome}</h1>
                <p className="text-lg text-gray-500">{lojaData.categoria}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="text-xl font-bold">{lojaData.rating}</span>
                  <Star size={20} className="fill-current text-orange-500" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="flex items-center space-x-1.5">
                  <Store size={20} className="text-gray-700" />
                  <span className="font-medium text-gray-700">{lojaData.status}</span>
                </div>
              </div>
            </div>

            {/* Abas */}
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
                    <button
                      onClick={() => setModalPostAberto(true)}
                      className="cursor-pointer px-4 py-1.5 text-sm font-semibold text-[#FD7702] border border-[#FD7702] rounded-full hover:bg-orange-50 transition active:scale-95"
                    >
                      Criar publicação
                    </button>
                  )}
                </div>

                {/* Lista de Publicações */}
                <div className="space-y-6 mb-12">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div 
                        key={post.id} 
                        // Redireciona para o post ao clicar
                        onClick={() => navigate(`/post/${post.id}`)}
                        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative cursor-pointer hover:shadow-md transition-shadow"
                      >
                        {/* Header Post */}
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

                          {/* Ações Topo (Share, Menu) */}
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
                                <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
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

                        {/* Texto do Post */}
                        <p className="text-sm text-gray-700 leading-relaxed mb-3 text-justify">
                          {post.content}
                        </p>

                        {/* SEM IMAGEM NO POST */}

                        <hr className="border-gray-100 mb-3" />
                        
                        {/* Ações Rodapé */}
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
                    ))
                  ) : (
                    <p className="text-center text-gray-500">Nenhuma publicação ainda.</p>
                  )}
                  
                  {posts.length > 0 && (
                    <div className="text-right">
                      <button className="text-sm text-[#FD7702] font-semibold hover:underline cursor-pointer">Ver todas</button>
                    </div>
                  )}
                </div>

                {/* Seção Promoções */}
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