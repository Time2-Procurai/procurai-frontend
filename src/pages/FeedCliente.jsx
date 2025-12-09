import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api';
import { Store, UserCheck, Heart } from 'lucide-react';

function FeedPageCliente() {
  const navigate = useNavigate();

  // Estados
  const [lojasSeguidas, setLojasSeguidas] = useState([]);
  const [lojasRecomendadas, setLojasRecomendadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true);
      try {
        // 1. Buscar Lojas que o usuário SEGUE
        // Rota criada anteriormente: /api/community/following/
        try {
            const responseSeguindo = await api.get('/community/following/');
            setLojasSeguidas(responseSeguindo.data);
        } catch (err) {
            console.error("Erro ao buscar lojas seguidas:", err);
        }

        // 2. Buscar TODAS as lojas para recomendação
        // (Aqui poderíamos filtrar no front para não mostrar as que já segue, se quiser)
        const responseEmpresas = await api.get('/user/listar/empresas/');
        
        // Pega apenas as 4 primeiras para exibir como recomendação
        setLojasRecomendadas(responseEmpresas.data.slice(0, 4));

      } catch (error) {
        console.error("Erro ao carregar feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDados();
  }, []);

  const handleUnfollow = async (e, comunidadeId) => {
      e.stopPropagation();
      if(window.confirm("Deseja deixar de seguir esta loja?")) {
          try {
              await api.post(`/community/${comunidadeId}/unfollow/`);
              // Remove da lista visualmente
              setLojasSeguidas(prev => prev.filter(loja => loja.id !== comunidadeId));
          } catch (err) {
              alert("Erro ao deixar de seguir.");
          }
      }
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        {/* Área central */}
        <main className="flex-1 overflow-y-auto p-8 bg-white">

          {/* --- SEÇÃO 1: LOJAS QUE EU SIGO --- */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
               
               Lojas que você segue
            </h2>

            {isLoading ? (
               <div className="flex justify-center py-10">
                 <p className="text-gray-500 animate-pulse">Carregando suas lojas...</p>
               </div>
            ) : lojasSeguidas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lojasSeguidas.map((loja) => (
                  <div
                    key={loja.id}
                    onClick={() => navigate(`/perfil/empresa/${loja.id}`)}
                    className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow bg-white-50 border border-orange-100 cursor-pointer relative group"
                    
                  >
                    {/* Imagem */}
                    {loja.profile_picture ? (
                      <img
                        src={loja.profile_picture}
                        alt={loja.full_name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                        <Store size={40} className="text-gray-400" />
                      </div>
                    )}

                    <h3 className="font-semibold text-gray-800 truncate">
                      {loja.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 truncate">
                      {loja.company_category || "Loja"}
                    </p>
                    
                   <button
                      className="mt-auto border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
                    >
                      Visitar
                    </button>

                    {/* Botão discreto para deixar de seguir (aparece no hover) */}
                    <button 
                        onClick={(e) => handleUnfollow(e, loja.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Deixar de seguir"
                    >
                        <UserCheck size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Store className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500 font-medium">Você ainda não segue nenhuma loja.</p>
                <p className="text-sm text-gray-400">Explore as recomendações abaixo!</p>
              </div>
            )}
          </section>

          {/* --- SEÇÃO 2: LOJAS RECOMENDADAS --- */}
          <section>
            <h2 className="text-lg font-semibold mb-8">Lojas recomendadas</h2>

            {isLoading ? (
               <div className="flex justify-center py-10">
                 <p className="text-gray-500 animate-pulse">Carregando recomendações...</p>
               </div>
            ) : lojasRecomendadas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lojasRecomendadas.map((loja) => (
                  <div
                    key={loja.id}
                    className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    onClick={() => navigate(`/perfil/empresa/${loja.id}`)}
                  >
                    {loja.profile_picture ? (
                      <img
                        src={loja.profile_picture}
                        alt={loja.full_name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                        <Store size={40} className="text-gray-400" />
                      </div>
                    )}

                    <h3 className="font-semibold text-gray-800 truncate" title={loja.company_name}>
                      {loja.company_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 truncate">
                      {loja.company_category || "Geral"}
                    </p>
                    
                    <button
                      className="mt-auto border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
                    >
                      Visitar loja
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Nenhuma loja encontrada no momento.</p>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default FeedPageCliente;