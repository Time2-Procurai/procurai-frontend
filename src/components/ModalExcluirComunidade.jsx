import React from 'react';
import { X } from 'lucide-react';

export default function ModalExcluirComunidade({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-scaleIn">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Deseja excluir a comunidade?</h3>
        <p className="text-sm text-gray-500 mb-8">
          Se você apagar esse comunidade ela irá ser removida. Tem certeza da sua ação?
        </p>

        <div className="flex items-center justify-end gap-4">
          <button 
            onClick={onClose} 
            className="text-sm font-bold text-gray-900 hover:underline"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-[#FD7702] text-white text-sm font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}