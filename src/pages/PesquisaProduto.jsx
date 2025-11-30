// src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";
import FiltroLateral from "../components/FiltroLateral";

function PesquisaProduto() {
  const [produtos, setProdutos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    // MOCK - lista de produtos simulada
    const items = [
      {
        id: 1,
        nome: "Parafusadeira DEWALT LT3",
        preco: 215,
        img: "/dewalt.png",
        categoria: "Materiais de construção",
        avaliacao: 4,
        distancia: 5,
      },
      {
        id: 2,
        nome: "Kit Instalação Elétrica",
        preco: 90,
        img: "/dewalt.png",
        categoria: "Instalações",
        avaliacao: 5,
        distancia: 12,
      },
      // coloque quantos quiser
    ];

    setProdutos(items);
    setFiltrados(items);
  }, []);

  function aplicarFiltros(f) {
    if (!f) {
      setFiltrados(produtos);
      return;
    }

    let resultado = [...produtos];

    // Tipo → ignorado porque produtos não têm tipo aqui

    if (f.categorias.length > 0) {
      resultado = resultado.filter((p) =>
        f.categorias.includes(p.categoria)
      );
    }

    if (f.precoMin) {
      resultado = resultado.filter((p) => p.preco >= Number(f.precoMin));
    }

    if (f.precoMax) {
      resultado = resultado.filter((p) => p.preco <= Number(f.precoMax));
    }

    if (f.distancia) {
      resultado = resultado.filter(
        (p) => p.distancia <= Number(f.distancia)
      );
    }

    if (f.avaliacao) {
      resultado = resultado.filter(
        (p) => p.avaliacao >= Number(f.avaliacao)
      );
    }

    setFiltrados(resultado);
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <FiltroLateral onFilterChange={aplicarFiltros} />

        {/* Conteúdo principal */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="font-bold text-lg mb-4">
            Resultados ({filtrados.length})
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {filtrados.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl shadow p-4"
              >
                <img
                  src={item.img}
                  alt={item.nome}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="font-semibold mt-2">{item.nome}</p>
                <p className="text-[#FD7702] font-bold">
                  R$ {item.preco.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {item.categoria}
                </p>
                <p className="text-sm text-yellow-500">
                  {"⭐".repeat(item.avaliacao)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PesquisaProduto;