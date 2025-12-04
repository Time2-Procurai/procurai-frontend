import React, { useState } from 'react';

export default function EnquetePost({ question, options, onVote, totalVotes: initialTotalVotes }) {
  const [votedOption, setVotedOption] = useState(null);
  
  // Calcula o total localmente para evitar divisão por zero ou undefined
  const safeOptions = options || [];
  const total = safeOptions.reduce((acc, op) => acc + (op.votes || 0), 0);

  const handleVote = (optionId) => {
    if (votedOption) return; // Já votou
    setVotedOption(optionId);
    if (onVote) onVote(optionId);
  };

  return (
    <div className="w-full">
      <h3 className="font-bold text-gray-900 mb-3 text-base">{question}</h3>
      
      <div className="space-y-2">
        {safeOptions.map((option) => {
          const votes = option.votes || 0;
          const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;
          const isSelected = votedOption === option.id;

          return (
            <div 
              key={option.id}
              onClick={(e) => {
                  e.stopPropagation(); // Impede abrir o post ao votar
                  handleVote(option.id);
              }}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all overflow-hidden ${
                isSelected ? 'border-[#FD7702] bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {/* Barra de Progresso (Fundo) */}
              {votedOption && (
                <div 
                  className="absolute top-0 left-0 h-full bg-orange-100 transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Conteúdo */}
              <div className="relative flex justify-between items-center z-10">
                <span className={`text-sm font-medium ${isSelected ? 'text-[#FD7702]' : 'text-gray-700'}`}>
                  {option.text}
                </span>
                
                {votedOption && (
                  <span className="text-xs font-bold text-gray-500">
                    {percentage}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 text-xs text-gray-400 text-right">
        {total} votos • {votedOption ? 'Voto registrado' : 'Clique para votar'}
      </div>
    </div>
  );
}