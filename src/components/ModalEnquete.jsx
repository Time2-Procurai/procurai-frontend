import React, { useState } from 'react';
import { X, Smile, Store } from 'lucide-react';

export default function ModalEnquete({ isOpen, onClose, userName, userAvatar, onConfirm }) {
  if (!isOpen) return null;

  const [pergunta, setPergunta] = useState('');
  const [opcoes, setOpcoes] = useState(['', '', '']); // 3 opções iniciais

  const handleOptionChange = (index, value) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = value;
    setOpcoes(novasOpcoes);
  };

  const handleSubmit = () => {
    if (!pergunta.trim()) {
      alert("Por favor, digite a pergunta da enquete.");
      return;
    }

    const opcoesValidas = opcoes.filter(opcao => opcao.trim() !== "");
    if (opcoesValidas.length < 2) {
      alert("Por favor, preencha pelo menos 2 opções para a enquete.");
      return;
    }

    onConfirm({ pergunta, opcoes: opcoesValidas });
    setPergunta('');
    setOpcoes(['', '', '']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-scaleIn">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
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

          <div className="mb-6">
            <label className="block text-base font-bold text-gray-900 mb-2">
              Pergunta da enquete
            </label>
            <input
              type="text"
              placeholder="Digite a pergunta da enquete"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all"
            />
          </div>

          <div className="mb-8 space-y-4">
            <label className="block text-base font-bold text-gray-900">
              Opções
            </label>
            {opcoes.map((opcao, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Opção ${index + 1}`}
                value={opcao}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all"
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button className="text-gray-500 hover:text-[#FD7702] transition-colors p-2 rounded-full hover:bg-orange-50">
              <Smile size={28} />
            </button>

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