import React, { useState } from 'react';
import { X, Smile, Store } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function ModalEnquete({ isOpen, onClose, userName, userAvatar, onConfirm }) {
  if (!isOpen) return null;

  const [pergunta, setPergunta] = useState('');
  const [opcoes, setOpcoes] = useState(['', '', '']); 
  
  // Controle do Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Rastreia onde digitar o emoji: { tipo: 'pergunta' ou 'opcao', index: numero }
  const [focoAtual, setFocoAtual] = useState({ tipo: 'pergunta', index: null });

  const handleOptionChange = (index, value) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = value;
    setOpcoes(novasOpcoes);
  };

  // Adiciona o emoji no campo que estiver "em foco"
  const handleEmojiClick = (emojiData) => {
    if (focoAtual.tipo === 'pergunta') {
      setPergunta((prev) => prev + emojiData.emoji);
    } else if (focoAtual.tipo === 'opcao' && focoAtual.index !== null) {
      const novasOpcoes = [...opcoes];
      novasOpcoes[focoAtual.index] = novasOpcoes[focoAtual.index] + emojiData.emoji;
      setOpcoes(novasOpcoes);
    }
  };

  const handleSubmit = () => {
    if (!pergunta.trim()) {
      alert("Por favor, digite a pergunta da enquete.");
      return;
    }
    const opcoesValidas = opcoes.filter(opcao => opcao.trim() !== "");
    if (opcoesValidas.length < 2) {
      alert("Por favor, preencha pelo menos 2 opções.");
      return;
    }

    onConfirm({ pergunta, opcoes: opcoesValidas });
    
    // Limpa tudo
    setPergunta('');
    setOpcoes(['', '', '']);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-scaleIn flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <Store className="text-gray-400" size={24} />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{userName || "Sua Empresa"}</h2>
          </div>

          {/* INPUT PERGUNTA */}
          <div className="mb-6">
            <label className="block text-base font-bold text-gray-900 mb-2">Pergunta</label>
            <input
              type="text"
              placeholder="Digite a pergunta..."
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onFocus={() => setFocoAtual({ tipo: 'pergunta', index: null })} // <--- Captura o foco
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FD7702] transition-all"
            />
          </div>

          {/* INPUTS OPÇÕES */}
          <div className="mb-8 space-y-4">
            <label className="block text-base font-bold text-gray-900">Opções</label>
            {opcoes.map((opcao, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Opção ${index + 1}`}
                value={opcao}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                onFocus={() => setFocoAtual({ tipo: 'opcao', index: index })} // <--- Captura o foco
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FD7702] transition-all"
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 relative">
            
            {/* BOTÃO EMOJI */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`transition-colors p-2 rounded-full ${showEmojiPicker ? 'bg-orange-50 text-[#FD7702]' : 'text-gray-500 hover:text-[#FD7702]'}`}
              >
                <Smile size={28} />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-lg overflow-hidden">
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={350}
                    previewConfig={{ showPreview: false }} 
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#FD7702] text-white font-bold py-3 px-8 rounded-full hover:bg-[#e66a00] transition-colors shadow-md"
            >
              Criar enquete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}