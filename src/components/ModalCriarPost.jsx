import React from "react";

export default function ModalCriarPost({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[450px] rounded-xl shadow-xl p-6 relative">

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl font-bold text-gray-700 hover:text-black"
        >
          ×
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src=""
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">Zézinho Construções</span>
        </div>

        {/* Título */}
        <label className="font-semibold text-gray-800">Título da publicação</label>
        <input
          type="text"
          placeholder="Título (Opcional)"
          className="w-full bg-gray-100 border rounded-lg px-3 py-2 mt-1 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Descrição */}
        <label className="font-semibold text-gray-800">Descrição</label>
        <textarea
          placeholder="Dê uma descrição para o produto"
          className="w-full bg-gray-100 border rounded-lg px-3 py-2 mt-1 h-28 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Rodapé */}
        <div className="flex justify-between items-center mt-5">
          <div className="flex gap-4 text-xl text-gray-600">
            <button>📷</button>
            <button>🙂</button>
          </div>

          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600">
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}