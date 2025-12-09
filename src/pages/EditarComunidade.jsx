import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral'; 
import BarraPesquisa from '../components/BarraPesquisa'; 
import { ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
// import api from '../api/api'; 

export default function EditarComunidade() {
  const navigate = useNavigate();
  const { comunidadeId } = useParams(); // Pega o ID da URL
  
  // Estados do formulário
  const [communityName, setCommunityName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // Imagem: coverPhoto é para visualização, coverFile é para envio (novo upload)
  const [coverPhoto, setCoverPhoto] = useState(null); 
  const [coverFile, setCoverFile] = useState(null);   

  const [isLoading, setIsLoading] = useState(true); // Começa carregando para buscar dados
  const [isFormDirty, setIsFormDirty] = useState(false); 

  const categories = [
    "Construção Civil",
    "Marcenaria",
    "Jardinagem",
    "Decoração",
    "Ferramentas",
    "Outros"
  ];

  // --- 1. CARREGAR DADOS INICIAIS ---
  useEffect(() => {
    const carregarDados = async () => {
      // Simula delay de API
      await new Promise(r => setTimeout(r, 500));

      // Busca no LocalStorage
      const comunidadesSalvas = JSON.parse(localStorage.getItem('minhas_comunidades') || '[]');
      
      // Encontra a comunidade pelo ID (convertendo para número se necessário)
      const comunidadeAlvo = comunidadesSalvas.find(c => c.id == comunidadeId);

      if (comunidadeAlvo) {
        setCommunityName(comunidadeAlvo.nome);
        setCategory(comunidadeAlvo.category);
        setDescription(comunidadeAlvo.description);
        setCoverPhoto(comunidadeAlvo.imagem); // Já está em Base64 ou URL
      } else {
        alert("Comunidade não encontrada!");
        navigate(-1);
      }
      setIsLoading(false);
    };

    if (comunidadeId) {
      carregarDados();
    }
  }, [comunidadeId, navigate]);

  // Monitora alterações para aviso de saída
  useEffect(() => {
    if (!isLoading) { // Só monitora depois que carregou os dados iniciais
       setIsFormDirty(true);
    }
  }, [communityName, category, description, coverFile]);

  const handleGoBack = () => {
    // Lógica simples: se o form estiver "sujo", avisa. 
    // (Pode refinar comparando com valores iniciais, mas isso já resolve)
    navigate(-1);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file)); 
      setCoverFile(file); 
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSave = async () => {
    if (!communityName.trim() || !category || !description.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsLoading(true);

      // --- ATUALIZAÇÃO NO LOCALSTORAGE ---
      const comunidadesSalvas = JSON.parse(localStorage.getItem('minhas_comunidades') || '[]');
      
      // Prepara a imagem: se tem arquivo novo, converte. Se não, mantém a antiga (coverPhoto)
      let imagemFinal = coverPhoto; 
      if (coverFile) {
        imagemFinal = await convertToBase64(coverFile);
      }

      // Cria a nova lista atualizando apenas o item correto
      const listaAtualizada = comunidadesSalvas.map(c => {
        if (c.id == comunidadeId) {
          return {
            ...c, // Mantém ID, ownerId, etc.
            nome: communityName,
            category: category,
            description: description,
            imagem: imagemFinal
          };
        }
        return c;
      });

      localStorage.setItem('minhas_comunidades', JSON.stringify(listaAtualizada));
      
      // Simula delay
      await new Promise(r => setTimeout(r, 800));

      setIsFormDirty(false); 
      alert("Alterações salvas com sucesso!");
      navigate(-1); // Volta para a lista

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações.");
    } finally {
      setIsLoading(false);
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

            {/* Se estiver carregando os dados iniciais, mostra loading no centro */}
            {isLoading && !communityName ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-[#FD7702]" size={40} />
               </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                
                <div className="mb-8">
                  <label htmlFor="cover-photo-upload" className="block cursor-pointer">
                    <div className={`w-full h-64 rounded-lg bg-gray-300 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-400 transition-colors relative overflow-hidden ${!coverPhoto ? 'border-2 border-dashed border-gray-400' : ''}`}>
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
                      disabled={isLoading}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Categoria <span className="text-red-500">*</span></label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isLoading}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FD7702] disabled:bg-gray-100"
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
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FD7702] disabled:bg-gray-100 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`bg-[#FD7702] text-white font-bold py-3 px-12 rounded-lg hover:bg-[#e66a00] transition-colors shadow-md w-full md:w-auto text-center flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
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