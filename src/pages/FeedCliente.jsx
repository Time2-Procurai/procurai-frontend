import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api'; // Importar a API
import { Store } from 'lucide-react'; // Ícone para quando não houver foto
import imgBob from '../assets/bob.jpg'; // Mantido para as comunidades (mock)

function FeedPageCliente() {
  const navigate = useNavigate();

  // --- DADOS MOCKADOS (Comunidades - Mantido conforme solicitado) ---
  const [comunidades, setComunidades] = useState([
    {
      id: 1,
      nome: "Zézinho Construções",
      categoria: "Armazém",
      seguidores: 500,
      imagem: imgBob,
    },
    {
      id: 2,
      nome: "Madeireira São José",
      categoria: "Materiais",
      seguidores: 340,
      imagem: imgBob,
    },
    {
      id: 3,
      nome: "Ferros Lima",
      categoria: "Serralheria",
      seguidores: 260,
      imagem: imgBob,
    },
    {
      id: 4,
      nome: "Construmax",
      categoria: "Construção",
      seguidores: 410,
      imagem: imgBob,
    },
  ]);

  // --- ESTADOS PARA DADOS REAIS ---
  const [lojas, setLojas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- BUSCAR LOJAS DA API ---
  useEffect(() => {
    const fetchLojas = async () => {
      try {
        // Busca todos os usuários e filtra apenas os lojistas

        const response = await api.get('/user/listar/empresas/');
        const apenasLojas = response.data.filter(user => user.is_lojista);

        // Pega apenas as 4 primeiras para exibir no feed (opcional)
        setLojas(apenasLojas.slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLojas();
  }, []);

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        {/* Área central */}
        <main className="flex-1 overflow-y-auto p-8 bg-white">

          {/* Comunidades sugeridas (Mock) */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8">
              Comunidades sugeridas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comunidades.map((comunidade) => (
                <div
                  key={comunidade.id}
                  className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <img
                    src={comunidade.imagem}
                    alt={comunidade.nome}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-gray-800">
                    {comunidade.nome}
                  </h3>
                  <p className="text-sm text-gray-500">{comunidade.categoria}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {comunidade.seguidores} seguidores
                  </p>
                  <button
                    className="mt-4 border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
                  >
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Lojas mais visitadas (DADOS REAIS) */}
          <section>
            <h2 className="text-lg font-semibold mb-8">Lojas recomendadas</h2>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-500 animate-pulse">Carregando lojas...</p>
              </div>
            ) : lojas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lojas.map((loja) => (
                  <div
                    key={loja.id}
                    className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    // Redireciona para o perfil correto da loja
                    onClick={() => navigate(`/perfil/empresa/${loja.id}`)}
                  >
                    {/* Foto da Loja Dinâmica */}
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

                    <h3 className="font-semibold text-gray-800 truncate" title={loja.full_name}>
                      {loja.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {loja.company_category || "Loja"}
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