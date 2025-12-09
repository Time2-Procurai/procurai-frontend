import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { ChevronLeft, MoreVertical, Edit2, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import BarraLateral from '../components/BarraLateral';
import BarraPesquisa from '../components/BarraPesquisa';

// Imports dos Modais (Certifique-se que os arquivos existem na pasta components)
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

  useEffect(() => {
    const fetchComunidades = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const dadosSalvos = localStorage.getItem('minhas_comunidades');
      
      if (dadosSalvos) {
        setComunidades(JSON.parse(dadosSalvos));
      } else {
        const mocksIniciais = [
          { id: 1, nome: 'Exemplo: Construção Civil', imagem: null },
        ];
        setComunidades(mocksIniciais);
      }
      
      setIsLoading(false);
    };

    if (userId) { 
        fetchComunidades();
    }
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

  const confirmarExclusao = () => {
    if (!comunidadeSelecionada) return;
    const novaLista = comunidades.filter(c => c.id !== comunidadeSelecionada.id);
    setComunidades(novaLista);
    localStorage.setItem('minhas_comunidades', JSON.stringify(novaLista));
    setModalExcluirAberto(false);
    setComunidadeSelecionada(null);
  };

  // --- AQUI ESTÁ A MUDANÇA ---
  const handleEditar = () => {
    if (comunidadeSelecionada) {
      setModalOpcoesAberto(false); // Fecha o modal primeiro
      navigate(`/editarComunidade/${comunidadeSelecionada.id}`); // Vai para a tela de edição
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
              onClick={() => navigate('/criarComunidade/cliente')}
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
                      {item.imagem ? (
                        <img 
                          src={item.imagem} 
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
                      <span className="font-bold text-gray-900 truncate pr-2">
                        {item.nome}
                      </span>
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

      {/* MODAIS COMPONENTIZADOS */}
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