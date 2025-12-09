import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral'; 
import BarraPesquisa from '../components/BarraPesquisa'; 
import { ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../api/api'; 

export default function EditarComunidade() {
  const navigate = useNavigate();
  const { comunidadeId } = useParams();
  const fileInputRef = useRef(null);
  
  // Estados do formulário
  const [communityName, setCommunityName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // Imagem: coverPhoto é para visualização (URL), coverFile é para envio (File)
  const [coverPhoto, setCoverPhoto] = useState(null); 
  const [coverFile, setCoverFile] = useState(null);   

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false); 

  // Mesmas opções do CriarComunidadeCliente e do Model
  const categories = [
    "esportes", "bairro", "musica", "jogos", "educacao", "outros"
  ];

  // --- 1. CARREGAR DADOS DA API (GET) ---
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await api.get(`/customer-community/comunidades/${comunidadeId}/`);
        const dados = response.data;

        setCommunityName(dados.nome);
        setCategory(dados.categoria);
        setDescription(dados.descricao);
        setCoverPhoto(dados.imagem_capa); // URL da imagem atual
        
      } catch (error) {
        console.error("Erro ao carregar comunidade:", error);
        alert("Erro ao carregar os dados da comunidade.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    if (comunidadeId) {
      carregarDados();
    }
  }, [comunidadeId, navigate]);

  // Monitora alterações
  useEffect(() => {
    if (!isLoading) {
       setIsFormDirty(true);
    }
  }, [communityName, category, description, coverFile]);

  const handleGoBack = () => {
    if (isFormDirty) {
        // Lógica opcional de confirmação se quiser manter
    }
    navigate(-1);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file)); 
      setCoverFile(file); 
    }
  };

  // --- 2. SALVAR ALTERAÇÕES NA API (PATCH) ---
  const handleSave = async () => {
    if (!communityName.trim() || !category || !description.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsSaving(true);

      const dataToSend = new FormData();
      dataToSend.append('nome', communityName);
      dataToSend.append('categoria', category);
      dataToSend.append('descricao', description);
      
      // Só envia a imagem se o usuário tiver selecionado uma nova
      if (coverFile) {
        dataToSend.append('imagem_capa', coverFile);
      }

      // PATCH para atualizar apenas os campos enviados
      await api.patch(`/customer-community/comunidades/${comunidadeId}/`, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsFormDirty(false); 
      alert("Alterações salvas com sucesso!");
      navigate(-1); // Volta para a lista

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={handleGoBack} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Editar comunidade</h1>
            </div>

            {isLoading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-[#FD7702]" size={40} />
               </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                
                <div className="mb-8">
                  <label htmlFor="cover-photo-upload" className="block cursor-pointer">
                    <div 
                        onClick={handleImageClick}
                        className={`w-full h-64 rounded-lg bg-gray-300 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-400 transition-colors relative overflow-hidden ${!coverPhoto ? 'border-2 border-dashed border-gray-400' : ''}`}
                    >
                      {coverPhoto ? (
                        <img src={coverPhoto} alt="Capa da Comunidade" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon size={48} className="mb-2 opacity-50" />
                          <span className="font-semibold">Alterar foto de capa</span>
                          <span className="text-sm opacity-75">Clique para fazer upload</span>
                        </>
                      )}
                    </div>
                    <input 
                      id="cover-photo-upload" 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Nome da comunidade <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      disabled={isSaving}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Categoria <span className="text-red-500">*</span></label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isSaving}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FD7702] disabled:bg-gray-100 uppercase"
                    >
                      <option value="" disabled hidden>Escolha uma categoria</option>
                      {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Descrição <span className="text-red-500">*</span></label>
                  <textarea
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSaving}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FD7702] disabled:bg-gray-100 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`bg-[#FD7702] text-white font-bold py-3 px-12 rounded-lg hover:bg-[#e66a00] transition-colors shadow-md w-full md:w-auto text-center flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Salvando...
                      </>
                    ) : (
                      "Salvar alterações"
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}