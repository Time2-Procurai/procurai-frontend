import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
import imgBob from '../assets/bob.jpg'

function FeedPageCliente() {
  const navigate = useNavigate();

  // dados de comunidades sugeridas
  const [comunidades, setComunidades] = useState([
    {
      id: 1,
      nome: "Zézinho Construções",
      categoria: "Armazém",
      seguidores: 500,
      imagem: imgBob,
    },
    {
      id: 2,
      nome: "Madeireira São José",
      categoria: "Materiais",
      seguidores: 340,
      imagem: imgBob,
    },
    {
      id: 3,
      nome: "Ferros Lima",
      categoria: "Serralheria",
      seguidores: 260,
      imagem: imgBob,
    },
    {
      id: 4,
      nome: "Construmax",
      categoria: "Construção",
      seguidores: 410,
      imagem: imgBob,
    },
  ]);

  // dados de lojas mais visitadas
  const [lojas, setLojas] = useState([
    {
      id: 1,
      nome: "Zézinho Construções",
      categoria: "Armazém",
      imagem: imgBob,
    },
    {
      id: 2,
      nome: "Ferros Lima",
      categoria: "Serralheria",
      imagem: imgBob,
    },
    {
      id: 3,
      nome: "Tijolos Oliveira",
      categoria: "Materiais",
      imagem: imgBob,
    },
    {
      id: 4,
      nome: "Casa do Pedreiro",
      categoria: "Ferramentas",
      imagem: imgBob,
    },
  ]);

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        {/* Área central */}
        <main className="flex-1 overflow-y-auto p-8 bg-white">
          {/* Comunidades sugeridas */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8">
              Comunidades sugeridas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comunidades.map((comunidade) => (
                <div
                  key={comunidade.id}
                  className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <img
                    src={comunidade.imagem}
                    alt={comunidade.nome}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-gray-800">
                    {comunidade.nome}
                  </h3>
                  <p className="text-sm text-gray-500">{comunidade.categoria}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {comunidade.seguidores} seguidores
                  </p>
                  <button
                    className="mt-4 border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
                  >
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Lojas mais visitadas */}
          <section>
            <h2 className="text-lg font-semibold mb-8">Lojas mais visitadas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lojas.map((loja) => (
                <div
                  key={loja.id}
                  className="shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <img
                    src={loja.imagem}
                    alt={loja.nome}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-gray-800">{loja.nome}</h3>
                  <p className="text-sm text-gray-500">{loja.categoria}</p>
                  <button
                    onClick={() => navigate('/loja/${loja.id}')}
                    className="mt-4 border-2 border-[#FD7702] text-[#FD7702] font-medium py-1.5 px-6 rounded-full hover:cursor-pointer hover:bg-[#FD7702] hover:text-white transition-colors"
                  >
                    Visitar loja
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default FeedPageCliente;