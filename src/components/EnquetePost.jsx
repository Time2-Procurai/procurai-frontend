import React, { useState } from 'react';

export default function EnquetePost({ question, options }) {
  // Estado para controlar se o usuário já votou
  const [votoUsuario, setVotoUsuario] = useState(null);
  
  const [contagemVotos, setContagemVotos] = useState(
    new Array(options.length).fill(0) // Cria array [0, 0, 0...] baseado nas opções
  );

  const totalVotos = contagemVotos.reduce((a, b) => a + b, 0);

  const handleVotar = (index) => {
    const novaContagem = [...contagemVotos];
    novaContagem[index] += 1;
    
    setContagemVotos(novaContagem);
    setVotoUsuario(index);
  };

  return (
    <div className="w-full">
      <h3 className="font-bold text-lg text-gray-900 mb-3">{question}</h3>
      
      <div className="flex flex-col gap-2">
        {options.map((opcao, index) => {
          if (!opcao) return null;
          if (votoUsuario !== null) {
            // Lógica da Porcentagem
            const porcentagem = totalVotos === 0 ? 0 : Math.round((contagemVotos[index] / totalVotos) * 100);
            const isSelected = votoUsuario === index;

            return (
              <div key={index} className="relative h-10 w-full rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-500 ${isSelected ? 'bg-[#FD7702]/30' : 'bg-gray-200'}`}
                  style={{ width: `${porcentagem}%` }}
                />
                
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between px-3 z-10">
                  <span className={`text-sm font-medium ${isSelected ? 'text-[#FD7702] font-bold' : 'text-gray-700'}`}>
                    {opcao} {isSelected && '(Você)'}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{porcentagem}%</span>
                </div>
              </div>
            );
          } else {
            return (
              <button 
                key={index}
                onClick={() => handleVotar(index)}
                className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-[#FD7702] transition text-sm text-gray-700 font-medium active:scale-[0.99]"
              >
                {opcao}
              </button>
            );
          }
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {totalVotos} votos • {votoUsuario !== null ? 'Voto computado' : 'Enquete aberta'}
      </p>
    </div>
  );
}