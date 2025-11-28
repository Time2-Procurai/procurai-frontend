import React from 'react';
import { CheckCircle, Trash2, X } from 'lucide-react';

export default function FeedbackFav({ 
  visible, 
  type = 'add', // 'add' ou 'remove'
  onClose, 
  onAction, // Função do botão "VER"
  actionLabel = "VER"
}) {
  if (!visible) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeInDown">
      <div className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-4 border border-gray-100">
        
        {/* Ícone muda conforme o tipo */}
        {type === 'add' ? (
          <CheckCircle className="text-[#FD7702] fill-[#FD7702]/10" size={20} />
        ) : (
          <Trash2 className="text-[#FD7702] fill-[#FD7702]/10" size={20} />
        )}
        
        {/* Texto muda conforme o tipo */}
        <span className="font-medium text-sm">
          {type === 'add' ? 'Produto adicionado aos favoritos' : 'Produto removido dos favoritos'}
        </span>
        
        {/* Botão de Ação (Só aparece no 'add') */}
        {type === 'add' && onAction && (
          <>
            <div className="h-4 w-px bg-gray-300 mx-1"></div> 
            <button 
              onClick={onAction}
              className="text-[#FD7702] font-bold text-sm hover:underline hover:bg-[#FD7702]/10 px-2 py-1 rounded transition-colors uppercase"
            >
              {actionLabel}
            </button>
          </>
        )}

        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 ml-2 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}