import React from "react";

function CardItem({ imagem, nome, categoria, seguidores, botaoTexto, onClick }) {
  return (
    <div className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      <img
        src={imagem}
        alt={nome}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />

      <h3 className="font-semibold text-gray-800">{nome}</h3>
      <p className="text-sm text-gray-500">{categoria}</p>

      {seguidores !== undefined && (
        <p className="text-sm text-gray-600 mt-2">{seguidores} seguidores</p>
      )}

      <button
        onClick={onClick}
        className="mt-4 border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
      >
        {botaoTexto}
      </button>
    </div>
  );
}

export default CardItem;
