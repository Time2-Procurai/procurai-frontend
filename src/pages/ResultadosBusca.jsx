// Crie este novo arquivo: pages/SearchPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import api from '../api/api';
import { Store } from 'lucide-react';

function ResultadosBusca() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // --- CORREÇÃO AQUI ---
  // Mude de searchParams.get("q") para searchParams.get("query")
  const query = searchParams.get("query");

  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResultados([]);
      setIsLoading(false);
      return;
    }

    const fetchResultados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // A API do Django espera o parâmetro 'search'
       const response = await api.get(`/user/listar/empresas/?search=${query}`);
        
        // Não precisa mais filtrar no React! A API já fez isso.
        setResultados(response.data);
        
      } catch (err) {
        console.error("Erro ao buscar:", err);
        setError("Não foi possível realizar a busca.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResultados();
  }, [query]); 

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa /> 

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />
        <main className="flex-1 overflow-y-auto p-8 bg-white">
          
          {isLoading ? (
            <p className="text-xl text-gray-500 animate-pulse">Buscando...</p>
          ) : error ? (
            <p className="text-xl text-red-500">{error}</p>
          ) : (
            <section>
              <h2 className="text-lg font-semibold mb-8">
                {resultados.length > 0
                  ? `Resultados da busca por "${query}"`
                  : `Nenhum resultado encontrado para "${query}"`
                }
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {resultados.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/perfil/empresa/${empresa.id}`)}
                  >
                    {empresa.profile_picture ? (
                      <img
                        src={empresa.profile_picture}
                        alt={empresa.full_name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                        <Store size={48} className="text-gray-400" />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-800">{empresa.full_name}</h3>
                    <p className="text-sm text-gray-500">{empresa.company_category || "Sem categoria"}</p>
                    <button
                      className="mt-4 border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
                    >
                      Visitar loja
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
export default ResultadosBusca;