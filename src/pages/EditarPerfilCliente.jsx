import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";

function EditarPerfilCliente() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    nomeCliente: "",
    nomeUsuario: "",
    interesse: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState(null); // estado da foto

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", dados);
    alert("Perfil atualizado com sucesso!");
  };

  // Função para fazer upload da foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFotoPerfil(imageUrl);
    }
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      {/* Barra superior */}
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral */}
        <BarraLateral />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col items-center justify-start py-8 overflow-y-auto">
                      <h1 className="text-2xl font-semibold mb-6">Editar Perfil</h1>

          {/* FOTO DE PERFIL */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              {/* Círculo de fundo */}
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">Alterar foto</span>
                )}
              </div>

              {/* Input invisível sobreposto ao círculo */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-6 w-full max-w-xl flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label className="font-bold mb-1">Nome completo</label>
              <input
                name="nomeCliente"
                type="text"
                placeholder="Digite seu nome completo"
                value={dados.nomeCliente}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold mb-1">Nome de usuário</label>
              <input
                name="nomeUsuario"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={dados.nomeUsuario}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold mb-1">Seus interesses</label>
              <input
                name="interesse"
                type="text"
                placeholder="Categorias que são do seu interesse"
                value={dados.interesse}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Botão */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-[#FD7702] text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfilCliente;
