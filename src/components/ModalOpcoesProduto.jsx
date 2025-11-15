import { Link } from 'react-router-dom';
import { Edit, Trash2, X } from 'lucide-react';

export default function ModalOpcoesProduto({ onClose, onExcluirClick, produtoId }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-lg bg-white p-8 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col gap-6">
          <Link
            to={`/produto/${produtoId}/editar`} //futura rota de edição do produto
            className="flex items-center gap-3 text-lg font-medium text-gray-800 hover:text-[#FD7702]"
          >
            <Edit size={24} />
            <span>Editar informações do produto</span>
          </Link>
          <button
            onClick={onExcluirClick}
            className="flex items-center gap-3 text-lg font-medium text-red-600 hover:text-red-800"
          >
            <Trash2 size={24} />
            <span>Excluir produto</span>
          </button>
        </div>
      </div>
    </div>
  );
}