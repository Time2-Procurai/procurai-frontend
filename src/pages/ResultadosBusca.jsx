import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api';
import { Store, ShoppingBag } from 'lucide-react'; // Ícone para produtos

function ResultadosBusca() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // Estados separados para cada tipo de resultado
  const [empresas, setEmpresas] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setEmpresas([]);
      setProdutos([]);
      setIsLoading(false);
      return;
    }

    const fetchResultados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fazemos as duas buscas ao mesmo tempo usando Promise.all
        const [resEmpresas, resProdutos] = await Promise.all([
          api.get(`/user/listar/empresas/?search=${query}`),
          api.get(`/products/?search=${query}`)
        ]);

        setEmpresas(resEmpresas.data);
        setProdutos(resProdutos.data);

      } catch (err) {
        console.error("Erro ao buscar:", err);
        setError("Não foi possível realizar a busca.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResultados();
  }, [query]); 

  // Verifica se não encontrou NADA em nenhuma das duas listas
  const semResultados = !isLoading && !error && empresas.length === 0 && produtos.length === 0;

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

              {/* --- MENSAGEM SE NÃO ACHAR NADA --- */}
              {semResultados && (
                <div className="text-center text-gray-500 py-10">
                  <p className="text-lg">Nenhum resultado encontrado.</p>
                  <p>Tente buscar por outro termo.</p>
                </div>
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