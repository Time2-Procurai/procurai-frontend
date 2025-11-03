import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";
import MultiUploadFoto from "../components/MultiUploadFoto";

export default function CadastrarProduto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria: "",
    descricao: "",
    novoValor: "",
    servico: false,
  });

  const [fotos, setFotos] = useState([]);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.nome || !formData.preco || !formData.categoria) {
      setStatus("Preencha os campos obrigatórios.");
      return;
    }

    const body = new FormData();
    body.append("nome", formData.nome);
    body.append("preco", formData.preco);
    body.append("categoria", formData.categoria);
    body.append("descricao", formData.descricao);
    body.append("novoValor", formData.novoValor);
    body.append("servico", formData.servico);

    fotos.forEach((foto, index) => {
      body.append(`foto_${index + 1}`, foto);
    });

    try {
      const res = await fetch("http://localhost:8000/api/produtos", {
        method: "POST",
        body,
      });

      if (res.ok) {
        setStatus("✅ Produto cadastrado com sucesso!");
        setFormData({
          nome: "",
          preco: "",
          categoria: "",
          descricao: "",
          novoValor: "",
          servico: false,
        });
        setFotos([]);
      } else {
        setStatus("❌ Erro ao cadastrar produto.");
      }
    } catch (err) {
      setStatus("⚠️ Falha de conexão com o servidor.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BarraLateral />
      <div className="flex flex-col w-full">
        <BarraPesquisa />

        <div className="p-8">
          {/* Botão de voltar */}
          <div
            className="flex items-center mb-6 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-2 text-gray-700 hover:text-orange-500 transition"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <h2 className="text-xl font-semibold hover:text-orange-500 transition">
              Adicionar produto
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-2xl p-6 max-w-5xl mx-auto"
          >
            <MultiUploadFoto onChange={setFotos} />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Selecione fotos do seu produto ou serviço
            </p>

            <div className="mt-6 grid grid-cols-2 gap-6">
              {/* Nome */}
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm mb-1">
                  Nome do produto
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome do produto"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  placeholder="Preço R$"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="servico"
                    checked={formData.servico}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-600">
                    Estou prestando um serviço
                  </span>
                </label>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Categoria do produto
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Eletrodomésticos">Eletrodomésticos</option>
                  <option value="Ferramentas">Ferramentas</option>
                  <option value="Móveis">Móveis</option>
                  <option value="Roupas">Roupas</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Descrição do produto
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Dê uma descrição para o produto"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Novo valor */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Novo valor (promoção)
                </label>
                <input
                  type="number"
                  name="novoValor"
                  value={formData.novoValor}
                  onChange={handleChange}
                  placeholder="Preço R$"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-full font-semibold transition-all"
              >
                Cadastrar
              </button>
              {status && (
                <p className="mt-3 text-sm text-gray-600">{status}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
