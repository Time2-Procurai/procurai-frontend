import React from 'react';

const EnquetePost = ({ question, options, onVote }) => {
  // Calcula o total de votos para exibir no rodapé
  const totalVotes = options.reduce((acc, curr) => acc + (curr.votes || 0), 0);

  return (
    <div className="w-full">
      {/* Pergunta */}
      <h3 className="font-bold text-lg mb-4 text-gray-900">{question}</h3>

      {/* Lista de Opções */}
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="relative">
            <button
              onClick={() => onVote(option.id)}
              className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-[#FD7702] transition-all relative overflow-hidden group cursor-pointer"
            >
              {/* Barra de Progresso (Fundo) */}
              <div 
                className="absolute top-0 left-0 h-full bg-orange-100 transition-all duration-500 ease-out"
                style={{ width: option.barWidth || '0%' }}
              />
              
              {/* Texto e Porcentagem (Frente) */}
              <div className="relative z-10 flex justify-between items-center">
                {/* --- CORREÇÃO AQUI: Usar option.text --- */}
                <span className="font-medium text-gray-800">
                  {option.text || "Opção sem nome"} 
                </span>
                
                {/* Mostra porcentagem se houver votos */}
                {option.percent && (
                  <span className="text-sm font-bold text-[#FD7702]">
                    {option.percent}%
                  </span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
      
      {/* Rodapé da Enquete */}
      <div className="flex justify-between items-center mt-3 px-1">
        <span className="text-xs text-gray-500">
           Total: {totalVotes} votos
        </span>
        <span className="text-xs text-gray-400">Toque para votar</span>
      </div>
    </div>
  );
};

export default EnquetePost;