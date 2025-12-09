import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function BarraPesquisa() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function LogoFeed() {
    const tipoUsuario = localStorage.getItem('userRole');

    if (tipoUsuario === "cliente") {
      navigate("/feedcliente/" + localStorage.getItem('userId'));
    } else if (tipoUsuario === "lojista") {
      navigate("/feedempresa/" + localStorage.getItem('userId'));
    } else {
      navigate("/"); // fallback
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="w-full bg-[#1A225F] text-white flex items-center px-4 py-4">
      <h1 onClick={LogoFeed} className="text-[28px] font-bold tracking-wide pl-4 cursor-pointer select-none">
        PROCUR<span className="text-[#FD7702]">AÍ</span>
      </h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        // Ajustei o texto para refletir a nova busca
        placeholder="Busque por empresas, produtos e comunidades..."
        className="w-300 bg-gray-100 text-gray-700 rounded-[20px] px-8 py-2 ml-18 focus:outline-none focus:ring-2 focus:ring-[#FD7702]"
      />
    </div>
  )
}

export default BarraPesquisa;