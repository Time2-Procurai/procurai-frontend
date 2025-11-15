import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import { Upload, ChevronLeft } from "lucide-react";
import api from "../api/api"; // 1. Importar a sua instância do api

function AdicionarProduto() {
  const navigate = useNavigate();

  // --- 2. Mapeamento das CATEGORY_CHOICES do seu models.py ---
  const categoryChoices = [
    { key: "eletronicos", label: "Eletrônicos" },
    { key: "vestuario", label: "Vestuário" },
    { key: "alimentos_bebidas", label: "Alimentos e Bebidas" },
    { key: "moveis_decoracao", label: "Móveis e Decoração" },
    { key: "livros_midia", label: "Livros e Mídia" },
    { key: "esportes_lazer", label: "Esportes e Lazer" },
    { key: "beleza_cuidados", label: "Beleza e Cuidados Pessoais" },
    { key: "automoveis_veiculos", label: "Automóveis e Veículos" },
    { key: "imoveis", label: "Imóveis" },
    { key: "servicos_profissionais", label: "Serviços Profissionais" },
    { key: "saude_bem_estar", label: "Saúde e Bem-estar" },
    { key: "educacao_cursos", label: "Educação e Cursos" },
    { key: "pets_animais", label: "Pets e Animais" },
    { key: "ferramentas_construcao", label: "Ferramentas e Construção" },
    { key: "arte_artesanato", label: "Arte e Artesanato" },
    { key: "brinquedos_jogos", label: "Brinquedos e Jogos" },
    { key: "joias_acessorios", label: "Jóias e Acessórios" },
    { key: "informatica", label: "Informática" },
    { key: "telefonia", label: "Telefonia" },
    { key: "eletrodomesticos", label: "Eletrodomésticos" },
    { key: "outros", label: "Outros" },
  ];

  // --- 3. Estados para os campos do formulário ---
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("outros"); // Padrão 'outros'
  const [descricao, setDescricao] = useState("");
  const [isServico, setIsServico] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false); // Campo do seu model

  // --- 4. Estados separados para arquivos (para envio) e pré-visualização (para UI) ---
  const [imageFiles, setImageFiles] = useState([]); // Guarda os File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Guarda as URLs de preview

  // --- 5. Estados de controle da API ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 6. Lógica de upload de imagem atualizada ---
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // Limita ao total de 4 imagens
    const newFiles = files.slice(0, 4 - imageFiles.length); 

    const newFileObjects = [...imageFiles, ...newFiles];
    const newPreviewURLs = newFileObjects.map((file) => URL.createObjectURL(file));

    setImageFiles(newFileObjects);
    setImagePreviews(newPreviewURLs);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 7. Lógica de envio para a API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Usar FormData para enviar arquivos
    const submissionData = new FormData();

    // Adiciona os campos do model
    submissionData.append("name", nome);
    submissionData.append("description", descricao);
    submissionData.append("price", preco);
    submissionData.append("category_name", categoria);
    submissionData.append("is_service", isServico);
    submissionData.append("is_negotiable", isNegotiable);
    
    // ATENÇÃO: Adicionando a primeira imagem.
    // O backend precisa esperar um campo chamado "product_image".
    if (imageFiles.length > 0) {
      submissionData.append("product_image", imageFiles[0]);
    }
    // (Se o seu backend suportar múltiplas imagens, você precisaria iterar)

    try {
      // Ajustado para bater com o seu urls.py (que usa '' para criar)
      const response = await api.post("/products/", submissionData, { // <--- CORRIGIDO
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("payload:" +response.data)
      // Redirecionar para o catálogo (ou perfil)
      navigate("/perfil/empresa/" + localStorage.getItem('userId'));

    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      setError("Houve um erro ao cadastrar o produto. Tente novamente.");
    } finally {
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <BarraPesquisa />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate('/perfil/empresa/' + localStorage.getItem('userId'))}
            className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-xl font-semibold">Adicionar produto</h1>
        </div>

        {/* Upload de imagens (UI) */}
        <div className="flex gap-4 mb-8">
          {[...Array(4)].map((_, index) => {
            const hasImage = imagePreviews[index];
            return (
              <div
                key={index}
                className="w-40 h-40 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 relative"
              >
                {hasImage ? (
                  <>
                    <img
                      src={imagePreviews[index]}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="hover:cursor-pointer absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-100"
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  index === imagePreviews.length && (
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

          {/* --- 8. Campo de Categoria (agora um <select>) --- */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Categoria do produto</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2 bg-white"
              required
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categoryChoices.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Preço</label>
            <input
              type="number"
              placeholder="Preço R$"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              step="0.01"
              min="0"
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

          {/* --- 9. Campo "Preço Promocional" trocado por "Negociável" --- */}
          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
              />
              Preço negociável
            </label>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="font-semibold mb-1">Descrição do produto</label>
            <textarea
              placeholder="Dê uma descrição para o produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2 h-32"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#FD7702] text-white font-semibold px-10 py-3 rounded-md hover:cursor-pointer hover:opacity-90 transition disabled:bg-orange-300"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
          
          {error && (
            <div className="md:col-span-2 text-center text-red-500">
              {error}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default AdicionarProduto;