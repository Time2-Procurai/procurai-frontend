import React, { useState } from "react";
import { X, Star } from "lucide-react";

function AvaliacaoPopup({ aberto, onFechar }) {
  const [avaliacao, setAvaliacao] = useState(0);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center relative">
        <button
          onClick={onFechar}
          className="absolute top-3 right-3 text-gray-500 hover:text-black hover:cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="font-semibold text-lg mb-4">Avalie a loja</h2>

        {/* Estrelas */}
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button
              key={estrela}
              onClick={() => setAvaliacao(estrela)}
              className="hover:cursor-pointer focus:outline-none"
            >
              <Star
                size={32}
                stroke="#ff8000"
                fill={estrela <= avaliacao ? "#ff8000" : "none"}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            alert(`Você avaliou com ${avaliacao} estrelas!`);
            onFechar();
          }}
          className="hover:cursor-pointer bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
        >
          Avaliar
        </button>
      </div>
    </div>
  );
}

export default AvaliacaoPopup;