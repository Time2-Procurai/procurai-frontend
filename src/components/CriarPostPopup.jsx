import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react'; // <--- IMPORTANTE

const CriarPostPopup = ({ isOpen, onClose, userAvatar, userName, onPublicar }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemPreview, setImagemPreview] = useState(null); 
  const [arquivoImagem, setArquivoImagem] = useState(null); 
  
  // Estado para controlar se mostra ou esconde o painel de emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoImagem(file);
      setImagemPreview(URL.createObjectURL(file)); 
    }
  };

  const removerImagem = () => {
    setArquivoImagem(null);
    setImagemPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- LÓGICA DO EMOJI ---
  const handleEmojiClick = (emojiData) => {
    // Adiciona o emoji ao final do texto atual
    setDescricao((prevDescricao) => prevDescricao + emojiData.emoji);
    // Não fechamos o picker automaticamente para permitir adicionar vários
  };

  const handlePublicar = () => {
    if (!descricao.trim() && !arquivoImagem) {
      alert("Escreva algo ou adicione uma foto para publicar.");
      return;
    }

    if (onPublicar) {
      onPublicar({
        titulo,
        descricao,
        // --- CORREÇÃO AQUI ---
        // Antes estava: imagem: imagemPreview (Isso é apenas o link visual, o backend não aceita)
        // O correto é: imagem: arquivoImagem (Isso é o arquivo binário real)
        imagem: arquivoImagem 
      });
    }

    // Limpa tudo...
    setTitulo('');
    setDescricao('');
    setImagemPreview(null);
    setArquivoImagem(null);
    setShowEmojiPicker(false);
    onClose();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition bg-transparent p-1 cursor-pointer z-10"
        >
          <X size={24} />
        </button>

        <div className="p-6 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
          <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{userName}</h3>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título (Opcional)"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="No que você está pensando?"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-gray-700 placeholder-gray-400 resize-none"
            />
          </div>

          {imagemPreview && (
            <div className="relative mt-2">
              <img src={imagemPreview} alt="Preview" className="w-full h-auto max-h-60 object-cover rounded-lg border border-gray-200" />
              <button 
                onClick={removerImagem}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between flex-shrink-0 relative">
          <div className="flex items-center gap-4">
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*"
            />

            <button 
              onClick={() => fileInputRef.current.click()}
              className="text-gray-900 hover:text-orange-500 transition cursor-pointer p-2 rounded-full hover:bg-orange-50"
              title="Adicionar foto"
            >
              <ImageIcon size={24} strokeWidth={2} />
            </button>

            {/* --- BOTÃO EMOJI COM LOGICA DE TOGGLE --- */}
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`text-gray-900 hover:text-orange-500 transition cursor-pointer p-2 rounded-full hover:bg-orange-50 ${showEmojiPicker ? 'text-orange-500 bg-orange-50' : ''}`}
                title="Adicionar emoji"
              >
                <Smile size={24} strokeWidth={2} />
              </button>

              {/* O Painel de Emojis (Aparece só se o estado for true) */}
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-50 shadow-2xl">
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={350}
                    previewConfig={{ showPreview: false }} // Remove o preview grande embaixo pra economizar espaço
                  />
                </div>
              )}
            </div>

          </div>

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