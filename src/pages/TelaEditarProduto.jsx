import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import { Upload, ChevronLeft, X, ShoppingBag } from "lucide-react";
import api from "../api/api";

function TelaEditarProduto() {
  const navigate = useNavigate();
  const { produtoId } = useParams();
  const fileInputRef = useRef(null);

  // Opções de Categoria (Mesmas do AdicionarProduto)
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

  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isServico, setIsServico] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);

  // Estados de Imagem
  // 'currentImage' guarda a URL da imagem que já existe no banco
  // 'newImageFile' guarda o arquivo se o usuário trocar a foto
  // 'previewUrl' guarda o preview da nova foto
  const [currentImage, setCurrentImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. BUSCAR DADOS DO PRODUTO ---
  useEffect(() => {
    const fetchProduto = async () => {
      if (!produtoId) return;
      
      try {
        const response = await api.get(`/products/${produtoId}/`);
        const data = response.data;

        setNome(data.name);
        setPreco(data.price);
        setCategoria(data.category_name);
        setDescricao(data.description);
        setIsServico(data.is_service);
        setIsNegotiable(data.is_negotiable);
        setCurrentImage(data.product_image);

      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError("Não foi possível carregar os dados do produto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduto();
  }, [produtoId]);

  // --- 2. LÓGICA DE IMAGEM ---
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveNewImage = () => {
    setNewImageFile(null);
    setPreviewUrl(null);
    // Volta a mostrar a imagem antiga (se existir)
  };

  // --- 3. SALVAR ALTERAÇÕES (PATCH) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const submissionData = new FormData();
    submissionData.append("name", nome);
    submissionData.append("description", descricao);
    submissionData.append("price", preco);
    submissionData.append("category_name", categoria);
    submissionData.append("is_service", isServico);
    submissionData.append("is_negotiable", isNegotiable);

    // Só envia a imagem se o usuário tiver selecionado uma NOVA
    if (newImageFile) {
      submissionData.append("product_image", newImageFile);
    }

    try {
      // Usa PATCH para atualizar
      await api.patch(`/products/${produtoId}/`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produto atualizado com sucesso!");
      navigate(-1); // Volta para a tela anterior (detalhes do produto)

    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setError("Erro ao salvar alterações. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <BarraPesquisa />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate(-1)}
            className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
          >
            <ChevronLeft size={28} className="cursor-pointer mr-3 text-gray-900 hover:text-[#FD7702] transition-colors"/>
          </button>
          <h1 className="text-xl font-semibold">Editar Produto</h1>
        </div>

        {/* --- ÁREA DE IMAGEM --- */}
        <div className="mb-8">
            <p className="text-sm font-bold text-gray-800 mb-2">Foto do Produto</p>
            
            <div className="w-40 h-40 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                
                {/* Mostra o Preview Novo OU a Imagem Atual OU o Placeholder */}
                {previewUrl ? (
                    <img src={previewUrl} alt="Nova Foto" className="w-full h-full object-cover" />
                ) : currentImage ? (
                    <img src={currentImage} alt="Foto Atual" className="w-full h-full object-cover" />
                ) : (
                    <ShoppingBag className="text-gray-400" size={40} />
                )}

                {/* Botão para Remover a NOVA imagem (se houver) */}
                {previewUrl && (
                    <button
                        type="button"
                        onClick={handleRemoveNewImage}
                        className="cursor-pointer absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-100"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Botão para Adicionar/Trocar (Overlay) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                     onClick={() => fileInputRef.current.click()}>
                    <div className="text-white flex flex-col items-center">
                        <Upload size={24} />
                        <span className="text-xs mt-1">Alterar</span>
                    </div>
                </div>
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
            />
        </div>

        {/* --- FORMULÁRIO --- */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Nome do produto</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2 bg-white"
              required
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categoryChoices.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Preço</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2"
              step="0.01"
              min="0"
              required
            />
            
            <div className="mt-3 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                    type="checkbox"
                    checked={isServico}
                    onChange={(e) => setIsServico(e.target.checked)}
                />
                Estou prestando um serviço
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                />
                Preço negociável
                </label>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="font-semibold mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="shadow-md rounded-lg border-gray-100 border p-2 h-32"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer bg-[#FD7702] text-white font-semibold px-10 py-3 rounded-md hover:cursor-pointer hover:opacity-90 transition disabled:bg-orange-300"
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
          
          {error && (
            <div className="md:col-span-2 text-center text-red-500 mt-4">
              {error}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default TelaEditarProduto;