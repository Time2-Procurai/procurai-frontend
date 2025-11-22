import { X } from 'lucide-react';

export default function ModalExcluirProduto({ onClose, onConfirm }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Deseja excluir produto?
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Se você apagar esse produto ele irá ser removido do seu catálogo. Tem
            certeza da sua ação?
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="rounded-lg px-8 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-[#FD7702] px-8 py-2 text-base font-semibold text-white hover:bg-[#e66a00]"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}