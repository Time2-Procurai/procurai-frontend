import React from "react";

function Comentario({ usuario, data, estrelas, titulo, texto }) {
  const renderEstrelas = () => {
    const estrelasArray = [];
    for (let i = 0; i < estrelas; i++) {
      estrelasArray.push("⭐");
    }
    return estrelasArray.join("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-[#FD7702] font-bold text-lg">
          {usuario?.charAt(0).toUpperCase()}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">{usuario}</h4>
            <span className="text-sm text-gray-400">{data}</span>
          </div>

          {estrelas && (
            <p className="text-[#FD7702] text-sm mt-1">{renderEstrelas()}</p>
          )}

          {titulo && (
            <p className="font-semibold text-gray-800 mt-1">{titulo}</p>
          )}

          <p className="text-gray-600 text-sm mt-1 leading-relaxed">{texto}</p>
        </div>
      </div>
    </div>
  );
}

export default Comentario;
