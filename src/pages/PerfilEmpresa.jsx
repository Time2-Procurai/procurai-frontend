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

// --- DADOS MOCKADOS (Publicações) ---
// Adicionei 'postImage' para termos o que clicar
const MOCK_POSTS = [
  {
    id: 1,
    author: "Zezinho Construções",
    date: "04/09/25",
    content: "A Zezinho Construções preparou uma oferta especial para você que não abre mão de qualidade e performance nas suas ferramentas. A poderosa parafusadeira DeWalt LT3 está com preço promocional por tempo limitado!",
    tag: "Promoção",
    likes: 12,
    comments: 2,
    //postImage: "https://placehold.co/600x300/png?text=Oferta+DeWalt" // Imagem da publicação
  },
  {
    id: 2,
    author: "Zezinho Construções",
    date: "01/09/25",
    content: "⚡ Zezinho Construções convida você para o Grande Feirão da Construção 2025! Nos dias 18, 19 e 20 de outubro, nossa loja estará em clima de promoção.",
    tag: null,
    likes: 45,
    comments: 8,
    //postImage: "https://placehold.co/600x300/png?text=Feirao+2025" // Imagem da publicação
  }
];

// --- DADOS MOCKADOS (Produtos em Promoção) ---
const MOCK_PROMOS = [
  { id: 1, name: "Parafusadeira DEWALT LT3", price: "R$ 180,90", discount: "20% OFF" },
  { id: 2, name: "Furadeira Impacto", price: "R$ 220,00", discount: "15% OFF" },
  { id: 3, name: "Jogo de Chaves", price: "R$ 89,90", discount: "10% OFF" },
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

  const [posts, setPosts] = useState(MOCK_POSTS);
  const [promos, setPromos] = useState(MOCK_PROMOS);

  const [menuAbertoId, setMenuAbertoId] = useState(null);

  useEffect(() => {
    const fetchDadosLoja = async () => {
      if (!profileIdFromUrl) return;

      try {
        const response = await api.get(`/user/listar/usuarios/${profileIdFromUrl}/`);
        const { street, number, neighborhood, city, complement } = response.data;
        const enderecoCompleto = [street, number, neighborhood, city, complement].filter(Boolean).join(', ');

        setLojaData({
          nome: response.data.full_name, // Corrigido para full_name (User) ou company_name se disponível
          categoria: response.data.company_category || "Categoria não definida",
          rating: "4,9",
          status: "Aberto",
          descricao: response.data.description || "Sem descrição disponível.",
          horario: response.data.operating_hours || "Horário não informado.",
          contato: response.data.phone || "Sem telefone.",
          endereco: enderecoCompleto || "Endereço não informado.",
          bannerUrl: response.data.cover_picture,
          profileUrl: response.data.profile_picture,
          mapUrl: null,
        });
      } catch (e) {
        console.error("Erro ao obter dados do usuário:", e);
      }
    };

    fetchDadosLoja();
  }, [profileIdFromUrl]);

  const handleAdicionarPost = (dados) => {
    const novoPost = {
      id: Date.now(),
      author: lojaData.nome,
      date: new Date().toLocaleDateString('pt-BR'),
      content: dados.descricao,
      tag: dados.titulo ? dados.titulo : null,
      likes: 0,
      comments: 0,
      postImage: "https://placehold.co/600x300/png?text=Nova+Publicacao" // Placeholder para novos posts
    };
    setPosts([novoPost, ...posts]);
  };

  const handleDeletarPost = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta publicação?")) {
      setPosts(posts.filter((post) => post.id !== id));
      setMenuAbertoId(null);
    }
  };

  const toggleMenu = (id) => {
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
                  onClick={() => navigate(`/EditarPerfilLoja/${profileIdFromUrl}`)}
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
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      // Removi o 'onClick' do container e o cursor-pointer global
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative"
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
                        <div className="flex items-center text-gray-400 gap-2">
                          <button className="hover:text-gray-600 cursor-pointer p-1 rounded hover:bg-gray-100">
                            <Share2 size={18} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => toggleMenu(post.id)}
                              className="hover:text-gray-600 cursor-pointer p-1 rounded hover:bg-gray-100"
                            >
                              <MoreVertical size={18} />
                            </button>
                            {isOwner && menuAbertoId === post.id && (
                              <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                <button
                                  onClick={() => handleDeletarPost(post.id)}
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

                      {/* Texto do Post (NÃO Clicável) */}
                      <div onClick={() => navigate(`/post/${post.id}`)}>    
                      <p className="text-sm text-gray-700 leading-relaxed mb-3 text-justify">
                        {post.content}
                      </p>
                      </div>

                      {/* --- IMAGEM DO POST (SOMENTE ELA É CLICÁVEL) --- */}
                      {post.postImage && (
                        <div 
                          className="w-full h-64 mb-4 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => navigate(`/post/${post.id}`)}
                        >
                          <img 
                            src={post.postImage} 
                            alt="Conteúdo do post" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <hr className="border-gray-100 mb-3" />
                      
                      {/* Ações Rodapé */}
                      <div className="flex items-center gap-6">
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
                  <div className="text-right">
                    <button className="text-sm text-[#FD7702] font-semibold hover:underline cursor-pointer">Ver todas</button>
                  </div>
                </div>

                {/* --- SEÇÃO DE PROMOÇÕES RESTAURADA --- */}
                <div className="mb-10">
                  <hr className="border-gray-200 mb-8" />
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Meus produtos em promoção</h2>
                    {isOwner && (
                      <button className="cursor-pointer px-4 py-1.5 text-sm font-semibold text-[#FD7702] border border-[#FD7702] rounded-full hover:bg-orange-50 transition active:scale-95">
                        Editar promoções
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {promos.map((promo) => (
                      <div key={promo.id} className="cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
                        <div className="h-48 bg-white p-4 flex items-center justify-center relative">
                          <img
                            src="https://placehold.co/400x400/png?text=Ferramenta"
                            alt={promo.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="bg-gray-200 p-4 flex flex-col gap-1">
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">
                            {promo.name}
                          </h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-900 font-medium">
                              {promo.price}
                            </span>
                            <span className="text-[#FD7702] font-bold text-sm">
                              {promo.discount}
                            </span>
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