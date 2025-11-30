import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/UseAuth.jsx';
import BarraLateral from '../components/BarraLateral';
import BarraPesquisa from '../components/BarraPesquisa';
import ModalConfirmacaoFav from '../components/ModalConfirmacaoFav';

export default function TelaFavoritos() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [favoritos, setFavoritos] = useState([]);

  // estados para controle de interação
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('meusFavoritos');
    if (dadosSalvos) {
      setFavoritos(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleTrashClick = (id) => {
    setItemToDelete(id);
    setShowModal(true);
    setShowSuccess(false);
  };

  const confirmarExclusao = () => {
    if (itemToDelete) {
      const novaLista = favoritos.filter((item) => item.id !== itemToDelete);
      setFavoritos(novaLista);

      localStorage.setItem('meusFavoritos', JSON.stringify(novaLista));

      setShowModal(false);
      setItemToDelete(null);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const cancelarExclusao = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] relative">

      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="w-full">

            <header className="flex items-center mb-4">
              <button
                onClick={() => navigate(-1)}
                className="mr-3 text-gray-900 hover:text-[#FD7702] transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Produtos favoritos</h1>
            </header>

            {showSuccess && (
              <div className="mb-6 flex items-center gap-2 animate-fadeIn">
                <span className="font-bold text-black text-lg">Produto removido com sucesso!</span>
                <Check strokeWidth={4} className="text-[#FD7702] w-6 h-6" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoritos.length > 0 ? (
                favoritos.map((produto) => (
                  <div key={produto.id} className="relative flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">

                    <div className="relative flex h-56 items-center justify-center bg-white p-4">
                      <img src={produto.imagem} alt={produto.nome} className="max-h-full max-w-full object-contain" />

                      <button
                        onClick={() => handleTrashClick(produto.id)}
                        className="absolute bottom-0 right-4 translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-orange-400 bg-white text-gray-600 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all shadow-sm z-10"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col justify-between bg-gray-200 p-4 pt-8">
                      <h3 className="mb-2 text-sm font-bold text-gray-900 line-clamp-2">{produto.nome}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">{produto.preco}</span>
                        <span className="text-sm font-bold text-[#FD7702]">{produto.desconto}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                  <p className="text-lg">Você ainda não tem produtos favoritos.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <ModalConfirmacaoFav
        isOpen={showModal}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
        title="Remover favorito?"
        message="O item será removido da sua lista de favoritos. Tem certeza da sua ação?"
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

    </div>
  );
}