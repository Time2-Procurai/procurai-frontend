import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom'; 
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import AvaliacaoPopup from "../components/AvaliacaoPopup";
import api from '../api/api';
import { ChevronLeft, Star, Store, Map } from 'lucide-react';

function PerfilEmpresa() {
  const navigate = useNavigate();

  const { userId: profileIdFromUrl } = useParams(); 
  const visitanteTipo = localStorage.getItem('userRole');
  const visitanteId = localStorage.getItem('userId');

  const [popupAberto, setPopupAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('Informações');
  const [lojaData, setLojaData] = useState(null);

  
  useEffect(() => {
    const fetchDadosLoja = async () => {
      if (!profileIdFromUrl) {
        console.error("ID do perfil não encontrado na URL.");
        return;
      }

      try {
        const response = await api.get(`/user/listar/usuarios/${profileIdFromUrl}/`);
        console.log("Dados da loja obtidos:", response.data);

        const { street, number, neighborhood, city, complement } = response.data;
        const enderecoCompleto = [street, number, neighborhood, city, complement]
          .filter(Boolean) 
          .join(', '); 

        setLojaData({
          nome: response.data.full_name,
          categoria: response.data.company_category || "Categoria não definida",
          rating: "4,9", // TODO: Tornar este campo dinâmico
          status: "Aberto", 
          descricao: response.data.description || "Sem descrição disponível.",
          horario: response.data.operating_hours || "Horário não informado.",
          contato: response.data.phone || "Sem telefone.",
          endereco: enderecoCompleto || "Endereço não informado.",
          bannerUrl: response.data.cover_picture,
          profileUrl: response.data.profile_picture,
          mapUrl: null 
        });
      } catch (e) {
        console.error("Erro ao obter dados do usuário:", e);
      }
    };

    fetchDadosLoja();
  }, [profileIdFromUrl]); 

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
                onClick={() => navigate(-1)} // -1 = Voltar para a página anterior
                className="hover:cursor-pointer absolute top-4 left-4 text-black p-2 transition hover:opacity-80 bg-white/50 rounded-full"
              >
                <ChevronLeft size={28} />
              </button>

              {/* --- LÓGICA DO BOTÃO "EDITAR" VS "AVALIAR" (CORRIGIDA) --- */}
              
              {isOwner && visitanteTipo === 'empresa' ? (
                // 1. Se for o dono E for uma empresa, mostra "Editar perfil"
                <button
                  // A rota é estática, o componente 'EditarPerfilLoja' pega o ID do localStorage
                  onClick={() => navigate(`/EditarPerfilLoja/${localStorage.getItem("userId")}`)} 
                  className="hover:cursor-pointer absolute top-4 ring-2 ring-[#FD7702] right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50"
                >
                  Editar perfil
                </button>
              ) : visitanteTipo === 'cliente' ? (
                // 2. Se for um 'cliente', mostra "Avaliar loja"
                <>
                  <button
                    onClick={() => setPopupAberto(true)}
                    className="hover:cursor-pointer absolute top-4 ring-2 ring-[#FD7702] right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50"
                  >
                    Avaliar loja
                  </button>

                  {/* --- CORREÇÃO AQUI --- */}
                  <AvaliacaoPopup
                    aberto={popupAberto}
                    // Passa o ID da loja que está sendo vista
                    storeId={profileIdFromUrl} 
                    onFechar={() => setPopupAberto(false)}
                  />
                </>
              ) : (
                // 3. Se for outra 'empresa' ou anônimo, não mostra nada
                null
              )}
              {/* --- FIM DA LÓGICA DO BOTÃO --- */}


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

              <div className="mt-4 flex justify-end">
                <div className="flex items-center space-x-1.5">
                  <Store size={20} className="text-gray-700" />
                  <span className="font-medium text-gray-700">{lojaData.status}</span>
                </div>
              </div>
            </div>

            {/* Navegação das Abas */}
            <div className="border-b border-gray-200">
              <nav className="flex justify-center space-x-10">
                <button
                  onClick={() => setAbaAtiva('Informações')}
                  className={abaAtiva === 'Informações' ? abaAtivaClass : abaInativaClass}
                >
                  Informações
                </button>
                <Link
                  to={`/comunidade/${profileIdFromUrl}`}
                  className={abaInativaClass}
                >
                  Comunidade
                </Link>

                <Link
                  to={`/produtos/${profileIdFromUrl}`}
                  className={abaInativaClass}
                >
                  Produtos
                </Link>
              </nav>
            </div>

            {/* Conteúdo da Aba Informações */}
            {abaAtiva === 'Informações' && (
              <div className="p-4">
                <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-5">
                    
                    {/* Coluna Esquerda */}
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

                    {/* Coluna Direita (Endereço e Mapa) */}
                    <div className="w-full md:w-1/3">
                      <div className="mb-2">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Endereço</h3>
                        <p className="text-sm text-gray-600">{lojaData.endereco}</p>
                      </div>
                      
                      {lojaData.mapUrl ? (
                        <img
                          src={lojaData.mapUrl}
                          alt="Mapa"
                          className="h-28 w-full rounded-lg object-cover"
                        />
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilEmpresa;