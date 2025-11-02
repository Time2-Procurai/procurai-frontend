import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import { Upload } from "lucide-react";
import { ChevronLeft, Star, Store, Map } from 'lucide-react';


function AdicionarProduto() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [precoPromocional, setPrecoPromocional] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isServico, setIsServico] = useState(false);
  const [imagens, setImagens] = useState([]);

  // lidar com imagens
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImagens((prev) => [...prev, ...newImages].slice(0, 4)); // máximo 4 fotos
  };

  // cadastrar produto
  const handleSubmit = (e) => {
    e.preventDefault();

    const novoProduto = {
      id: Date.now(),
      nome,
      preco: parseFloat(preco) || 0,
      precoPromocional: parseFloat(precoPromocional) || 0,
      categoria,
      descricao,
      isServico,
      imagem: imagens[0] || null, // exibe a primeira imagem no catálogo
    };

    // salvar no localStorage
    const produtosExistentes = JSON.parse(localStorage.getItem("produtos")) || [];
    const novosProdutos = [...produtosExistentes, novoProduto];
    localStorage.setItem("produtos", JSON.stringify(novosProdutos));

    // redirecionar para o catálogo
    navigate("/produtos");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <BarraPesquisa />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate('/perfil/empresa')}
            className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-xl font-semibold">Adicionar produto</h1>
        </div>

        {/* Upload de imagens */}
        <div className="flex gap-4 mb-8">
          {[...Array(4)].map((_, index) => {
            const hasImage = imagens[index];

            return (
              <div
                key={index}
                className="w-40 h-40 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 relative"
              >
                {hasImage ? (
                  <>
                    <img
                      src={imagens[index]}
                      alt={'Foto ${index + 1}'}
                      className="w-full h-full object-cover"
                    />
                    {/* Botão para remover imagem */}
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...imagens];
                        newImages.splice(index, 1); // Remove a imagem do array
                        setImagens(newImages);
                      }}
                      className="hover:cursor-pointer absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-100"
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  // Permite adicionar imagem apenas no próximo slot disponível
                  index === imagens.length && (
                    <label className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                      <Upload size={24} className="mb-1" />
                      <span className="text-sm">Adicionar fotos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )
                )}
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-600 mb-6 font-bold">
          Selecione fotos para o seu produto
        </p>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Nome do produto</label>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Categoria do produto</label>
            <input
              type="text"
              placeholder="Qual categoria desse produto?"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Preço</label>
            <input
              type="number"
              placeholder="Preço R$"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              required
            />
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={isServico}
                onChange={(e) => setIsServico(e.target.checked)}
              />
              Estou prestando um serviço
            </label>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">
              Digite o novo valor do produto, caso esteja em promoção
            </label>
            <input
              type="number"
              placeholder="Preço R$"
              value={precoPromocional}
              onChange={(e) => setPrecoPromocional(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="font-semibold mb-1">Descrição do produto</label>
            <textarea
              placeholder="Dê uma descrição para o produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#FD7702] text-white font-semibold px-10 py-3 rounded-md hover:cursor-pointer hover:opacity-90 transition"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdicionarProduto;
