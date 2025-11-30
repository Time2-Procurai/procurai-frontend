// src/components/FiltroLateral.jsx
import React, { useState } from "react";

function FiltroLateral({ onFilterChange }) {
  const [filtros, setFiltros] = useState({
    tipo: "",
    categorias: [],
    precoMin: "",
    precoMax: "",
    distancia: "",
    avaliacao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleCategoria = (categoria) => {
    const jaTem = filtros.categorias.includes(categoria);
    const novas = jaTem
      ? filtros.categorias.filter((c) => c !== categoria)
      : [...filtros.categorias, categoria];

    setFiltros({ ...filtros, categorias: novas });
  };

  const aplicar = () => {
    onFilterChange(filtros);
  };

  const limpar = () => {
    setFiltros({
      tipo: "",
      categorias: [],
      precoMin: "",
      precoMax: "",
      distancia: "",
      avaliacao: "",
    });
    onFilterChange(null);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-6">
      <h2 className="font-bold text-lg">Filtros</h2>

      {/* Tipo */}
      <div>
        <p className="font-semibold mb-1">Apenas por:</p>
        {["Produtos", "Empresas", "Comunidades"].map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="tipo"
              value={t}
              checked={filtros.tipo === t}
              onChange={handleChange}
            />
            {t}
          </label>
        ))}
      </div>

      {/* Categorias */}
      <div>
        <p className="font-semibold mb-1">Categorias:</p>
        {["Instalações", "Materiais de construção", "Diversos"].map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filtros.categorias.includes(c)}
              onChange={() => handleCategoria(c)}
            />
            {c}
          </label>
        ))}
      </div>

      {/* Preço */}
      <div>
        <p className="font-semibold mb-1">Faixa de preço:</p>
        <div className="flex gap-2">
          <input
            name="precoMin"
            placeholder="R$ mín."
            className="w-20 border rounded px-2 py-1 text-sm"
            value={filtros.precoMin}
            onChange={handleChange}
          />
          <input
            name="precoMax"
            placeholder="R$ máx."
            className="w-20 border rounded px-2 py-1 text-sm"
            value={filtros.precoMax}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Distância */}
      <div>
        <p className="font-semibold mb-1">Faixa de distância:</p>
        <input
          type="range"
          name="distancia"
          min="1"
          max="50"
          value={filtros.distancia}
          onChange={handleChange}
        />
        <p className="text-sm">{filtros.distancia || 0} km</p>
      </div>

      {/* Avaliação */}
      <div>
        <p className="font-semibold mb-1">Avaliação:</p>
        <select
          name="avaliacao"
          value={filtros.avaliacao}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Todas</option>
          <option value="5">⭐⭐⭐⭐⭐ +</option>
          <option value="4">⭐⭐⭐⭐ +</option>
          <option value="3">⭐⭐⭐ +</option>
        </select>
      </div>

      {/* Botões */}
      <button
        onClick={aplicar}
        className="w-full bg-[#FD7702] text-white py-2 rounded mt-2"
      >
        Aplicar
      </button>

      <button
        onClick={limpar}
        className="w-full border border-gray-400 py-2 rounded mt-1"
      >
        Limpar
      </button>
    </div>
  );
}

export default FiltroLateral;