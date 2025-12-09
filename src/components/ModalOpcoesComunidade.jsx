import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';

export default function ModalOpcoesComunidade({ isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose} // Fecha ao clicar fora
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche ele
      >
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col gap-4 mt-2">
          <button 
            onClick={onEdit} 
            // Adicionado w-full para o botão ocupar toda a largura
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
          >
            <Edit2 size={20} className="text-gray-700" />
            <span className="font-bold text-gray-900">Editar informações da comunidade</span>
          </button>

          <button 
            onClick={onDelete} 
            // Adicionado w-full para o botão ocupar toda a largura
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left group w-full"
          >
            <Trash2 size={20} className="text-gray-700 group-hover:text-red-600" />
            <span className="font-bold text-gray-900 group-hover:text-red-600">Excluir comunidade</span>
          </button>
        </div>
      </div>
    </div>
  );
}