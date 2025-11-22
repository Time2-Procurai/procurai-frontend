import React, { useState } from 'react';
import { X, Image as ImageIcon, Smile } from 'lucide-react';

const CriarPostPopup = ({ isOpen, onClose, userAvatar, userName, onPublicar }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  if (!isOpen) return null;

  const handlePublicar = () => {
    // Validação: Se estiver vazio, mostra um alerta e para a função.
    if (!descricao.trim()) {
      alert("Por favor, escreva uma descrição para a publicação.");
      return;
    }

    // Envia os dados para o pai
    if (onPublicar) {
      onPublicar({
        titulo,
        descricao
      });
    }

    // Limpa e fecha
    setTitulo('');
    setDescricao('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">

        {/* Botão Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition bg-transparent p-1 cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{userName}</h3>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-base font-bold text-gray-900">
              Título da publicação
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título (Opcional)"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-bold text-gray-900">
              Descrição
            </label>
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Dê uma descrição para o produto"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-gray-700 placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-gray-900 hover:text-orange-500 transition cursor-pointer">
              <ImageIcon size={24} strokeWidth={2} />
            </button>
            <button className="text-gray-900 hover:text-orange-500 transition cursor-pointer">
              <Smile size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Botão Publicar - AGORA SEM O DISABLED */}
          <button
            className="bg-[#FD7702] hover:bg-[#e56b02] text-white font-bold py-2.5 px-8 rounded-full transition shadow-md active:scale-95 cursor-pointer"
            onClick={handlePublicar}
          >
            Publicar
          </button>
        </div>

      </div>
    </div>
  );
};

export default CriarPostPopup;