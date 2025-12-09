import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { ChevronLeft, MoreVertical, Loader2, Image as ImageIcon } from 'lucide-react';
import BarraLateral from '../components/BarraLateral';
import BarraPesquisa from '../components/BarraPesquisa';
import api from '../api/api'; // 1. Importar API

// Imports dos Modais
import ModalOpcoesComunidade from '../components/ModalOpcoesComunidade';
import ModalExcluirComunidade from '../components/ModalExcluirComunidade';

export default function CommunidadesCliente() {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  const [comunidades, setComunidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [modalOpcoesAberto, setModalOpcoesAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [comunidadeSelecionada, setComunidadeSelecionada] = useState(null);

  // --- 2. BUSCAR DADOS DA API ---
  useEffect(() => {
    const fetchComunidades = async () => {
      setIsLoading(true);
      try {
        // Chama a rota de listagem do ViewSet
        const response = await api.get('/customer-community/comunidades/');
        
        // O endpoint retorna todas. Filtramos no front apenas as que o usuário criou.
        // O serializer já manda o campo 'is_criador' boolean.
        const minhasComunidades = response.data.filter(c => c.is_criador);
        
        setComunidades(minhasComunidades);
      } catch (error) {
        console.error("Erro ao buscar comunidades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComunidades();
  }, [userId]);

  const handleEntrarNaComunidade = (idComunidade) => {
    navigate(`/comunidade/${idComunidade}`);
  };

  const abrirOpcoes = (e, comunidade) => {
    e.stopPropagation(); 
    setComunidadeSelecionada(comunidade);
    setModalOpcoesAberto(true);
  };

  const abrirConfirmacaoExclusao = () => {
    setModalOpcoesAberto(false); 
    setModalExcluirAberto(true); 
  };

  // --- 3. EXCLUIR VIA API ---
  const confirmarExclusao = async () => {
    if (!comunidadeSelecionada) return;

    try {
      await api.delete(`/customer-community/comunidades/${comunidadeSelecionada.id}/`);
      
      // Atualiza a lista local removendo o item excluído
      const novaLista = comunidades.filter(c => c.id !== comunidadeSelecionada.id);
      setComunidades(novaLista);
      
      setModalExcluirAberto(false);
      setComunidadeSelecionada(null);
      alert("Comunidade excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir comunidade. Tente novamente.");
    }
  };

  const handleEditar = () => {
    if (comunidadeSelecionada) {
      setModalOpcoesAberto(false);
      // Ajuste a rota conforme suas rotas de edição
      navigate(`/editarComunidade/${comunidadeSelecionada.id}`); 
    }
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-white">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Minhas comunidades</h1>
            </div>

            <button
              onClick={() => navigate('/criarComunidade/cliente')} // Certifique-se que essa rota leva ao componente CriarComunidadeCliente
              className="mb-8 px-6 py-2 border-2 border-[#FD7702] text-[#FD7702] font-bold rounded-full hover:bg-orange-50 transition-colors"
            >
              Crie uma nova comunidade
            </button>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-[#FD7702]" size={40} />
              </div>
            ) : comunidades.length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>Você ainda não criou nenhuma comunidade.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comunidades.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleEntrarNaComunidade(item.id)}
                    className="rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer group"
                  >
                    
                    <div className="h-48 bg-white flex items-center justify-center p-4 relative border-b border-gray-100">
                      {/* 4. AJUSTE: O campo no serializer é 'imagem_capa', não 'imagem' */}
                      {item.imagem_capa ? (
                        <img 
                          src={item.imagem_capa} 
                          alt={item.nome} 
                          className="max-h-full max-w-full object-contain" 
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-300">
                          <ImageIcon size={48} />
                          <span className="text-xs mt-2">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-100 p-4 flex items-center justify-between mt-auto group-hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col overflow-hidden pr-2">
                        <span className="font-bold text-gray-900 truncate">
                          {item.nome}
                        </span>
                        {/* Mostra a categoria pequena abaixo do nome */}
                        <span className="text-xs text-gray-500 capitalize">
                          {item.categoria}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => abrirOpcoes(e, item)} 
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-600 flex-shrink-0"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      <ModalOpcoesComunidade 
        isOpen={modalOpcoesAberto}
        onClose={() => setModalOpcoesAberto(false)}
        onEdit={handleEditar}
        onDelete={abrirConfirmacaoExclusao}
      />

      <ModalExcluirComunidade 
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={confirmarExclusao}
      />

    </div>
  );
}