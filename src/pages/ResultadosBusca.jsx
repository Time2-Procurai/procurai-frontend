import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api';
import { Store, ShoppingBag, Users, Image as ImageIcon } from 'lucide-react'; 

function ResultadosBusca() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // Estados para cada tipo de resultado
  const [empresas, setEmpresas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  // 1. Novo estado para comunidades
  const [comunidades, setComunidades] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setEmpresas([]);
      setProdutos([]);
      setComunidades([]);
      setIsLoading(false);
      return;
    }

    const fetchResultados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 2. Adicionamos a busca de comunidades no Promise.all
        const [resEmpresas, resProdutos, resComunidades] = await Promise.all([
          api.get(`/user/listar/empresas/?search=${query}`),
          api.get(`/products/?search=${query}`),
          // Ajuste a rota se necessário (ex: filtro 'search' deve estar habilitado no backend)
          api.get(`/customer-community/comunidades/?search=${query}`) 
        ]);

        setEmpresas(resEmpresas.data);
        setProdutos(resProdutos.data);
        setComunidades(resComunidades.data);

      } catch (err) {
        console.error("Erro ao buscar:", err);
        setError("Não foi possível realizar a busca.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResultados();
  }, [query]); 

  const semResultados = !isLoading && !error && 
                        empresas.length === 0 && 
                        produtos.length === 0 && 
                        comunidades.length === 0;

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />
        <main className="flex-1 overflow-y-auto p-8 bg-white">

          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {query ? `Resultados para "${query}"` : "Faça uma busca"}
          </h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-xl text-gray-500 animate-pulse">Buscando...</p>
            </div>
          ) : error ? (
            <p className="text-xl text-red-500">{error}</p>
          ) : (
            <div className="space-y-12">

              {semResultados && (
                <div className="text-center text-gray-500 py-10">
                  <p className="text-lg">Nenhum resultado encontrado.</p>
                  <p>Tente buscar por outro termo.</p>
                </div>
              )}

              {/* --- 3. SEÇÃO DE COMUNIDADES (NOVA) --- */}
              {comunidades.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Users className="text-[#FD7702]" size={20} />
                    Comunidades encontradas ({comunidades.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {comunidades.map((comunidade) => (
                      <div
                        key={comunidade.id}
                        className="shadow-md rounded-lg p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-50 flex flex-col"
                        onClick={() => navigate(`/comunidade/${comunidade.id}`)}
                      >
                        {/* Imagem de Capa */}
                        <div className="h-32 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                            {comunidade.imagem_capa ? (
                                <img src={comunidade.imagem_capa} alt={comunidade.nome} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-400" size={32} />
                            )}
                        </div>
                        
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-gray-800 truncate text-lg mb-1">{comunidade.nome}</h3>
                            <p className="text-xs text-gray-500 bg-gray-100 self-start px-2 py-0.5 rounded-full mb-3 uppercase font-bold tracking-wide">
                                {comunidade.categoria}
                            </p>
                            
                            {/* Descrição curta (opcional) */}
                            {comunidade.descricao && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                    {comunidade.descricao}
                                </p>
                            )}

                            <button className="w-full mt-auto border border-[#FD7702] text-[#FD7702] text-sm font-bold py-2 rounded-lg hover:bg-[#FD7702] hover:text-white transition-colors">
                              Ver comunidade
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* --- SEÇÃO DE EMPRESAS --- */}
              {empresas.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Store className="text-[#FD7702]" size={20} />
                    Empresas encontradas ({empresas.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {empresas.map((empresa) => (
                      <div
                        key={empresa.id}
                        className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-50"
                        onClick={() => navigate(`/perfil/empresa/${empresa.id}`)}
                      >
                        {empresa.profile_picture ? (
                          <img
                            src={empresa.profile_picture}
                            alt={empresa.company_name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                            <Store size={40} className="text-gray-400" />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-800 truncate">{empresa.company_name}</h3>
                        <p className="text-sm text-gray-500 mb-4 truncate">{empresa.company_category || "Loja"}</p>
                        <button className="w-full border border-[#FD7702] text-[#FD7702] text-sm font-medium py-1.5 rounded-full hover:bg-[#FD7702] hover:text-white transition-colors">
                          Visitar
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* --- SEÇÃO DE PRODUTOS --- */}
              {produtos.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <ShoppingBag className="text-[#FD7702]" size={20} />
                    Produtos encontrados ({produtos.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {produtos.map((produto) => (
                      <div
                        key={produto.id}
                        className="shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white group border border-gray-50"
                        onClick={() => navigate(`/produto/${produto.id}`)}
                      >
                        <div className="h-40 bg-gray-50 p-4 flex items-center justify-center relative overflow-hidden">
                          {produto.product_image ? (
                            <img
                              src={produto.product_image}
                              alt={produto.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <ShoppingBag size={40} className="text-gray-300" />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate" title={produto.name}>
                            {produto.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[#FD7702] font-bold">
                              R$ {parseFloat(produto.price).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          {produto.is_negotiable && (
                            <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
                              Negociável
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default ResultadosBusca;