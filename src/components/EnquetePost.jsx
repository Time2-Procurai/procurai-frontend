import React, { useState } from 'react';

export default function EnquetePost({ question, options }) {
  // Proteção contra dados inválidos
  if (!options || !Array.isArray(options) || options.length === 0) return null;

  // Estados
  const [votos, setVotos] = useState(new Array(options.length).fill(0));
  const [totalVotos, setTotalVotos] = useState(0);
  const [votoUsuario, setVotoUsuario] = useState(null); // Índice da opção escolhida

  const handleVoto = (index) => {
    if (votoUsuario !== null) return; // Só vota uma vez

    const novosVotos = [...votos];
    novosVotos[index] += 1;
    setVotos(novosVotos);
    setTotalVotos(totalVotos + 1);
    setVotoUsuario(index);
  };

  return (
    <div className="w-full bg-white rounded-lg p-1">
      {/* Pergunta */}
      <h3 className="font-bold text-gray-900 mb-4 text-base block">
        {question || "Enquete sem título"}
      </h3>

      {/* Opções */}
      <div className="flex flex-col gap-3">
        {options.map((opcaoRaw, index) => {
          // Garante que o texto seja string (caso venha objeto por engano)
          const textoOpcao = typeof opcaoRaw === 'object' ? opcaoRaw.texto || "Opção" : opcaoRaw;
          
          // Cálculos
          const qtdVotos = votos[index];
          const percent = totalVotos > 0 ? Math.round((qtdVotos / totalVotos) * 100) : 0;
          const isSelected = votoUsuario === index;
          const showResults = votoUsuario !== null; // Mostra resultados após votar

          return (
            <button
              key={index}
              onClick={() => handleVoto(index)}
              disabled={showResults}
              className={`
                relative w-full text-left px-4 py-3 rounded-lg border transition-all overflow-hidden min-h-[48px] flex items-center justify-between
                ${isSelected 
                  ? 'border-[#FD7702] ring-1 ring-[#FD7702] bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                }
              `}
            >
              {/* BARRA DE PROGRESSO (Fundo) */}
              {showResults && (
                <div 
                  className="absolute top-0 left-0 h-full bg-orange-200/50 transition-all duration-700 ease-out z-0"
                  style={{ width: `${percent}%` }}
                />
              )}

              {/* CONTEÚDO (Texto e Resultados) - Z-INDEX ALTO PARA FICAR NA FRENTE */}
              <div className="relative z-10 w-full flex justify-between items-center gap-4">
                
                {/* Nome da Opção */}
                <span className={`font-medium text-sm truncate ${isSelected ? 'text-[#FD7702]' : 'text-gray-800'}`}>
                  {textoOpcao} {isSelected && '(Você)'}
                </span>

                {/* Resultados (Votos e %) */}
                {showResults && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">
                      {qtdVotos} {qtdVotos === 1 ? 'voto' : 'votos'}
                    </span>
                    <span className="font-bold text-gray-900 bg-white/50 px-1.5 py-0.5 rounded">
                      {percent}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Rodapé */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-medium px-1">
        <span>Total: {totalVotos} votos</span>
        <span>{votoUsuario !== null ? 'Voto registrado' : 'Toque para votar'}</span>
      </div>
    </div>
  );
}