import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral'; 
import BarraPesquisa from '../components/BarraPesquisa'; 
import { ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function CriarComunidadeCliente() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [communityName, setCommunityName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null); 
  const [coverFile, setCoverFile] = useState(null);   

  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false); 

  const categories = [
    "Construção Civil",
    "Marcenaria",
    "Jardinagem",
    "Decoração",
    "Ferramentas",
    "Outros"
  ];

  useEffect(() => {
    if (communityName || category || description || coverFile) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [communityName, category, description, coverFile]);

  const handleGoBack = () => {
    if (isFormDirty) {
      const confirmLeave = window.confirm("Você tem alterações não salvas. Se sair agora, perderá os dados. Deseja continuar?");
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file)); 
      setCoverFile(file); 
    }
  };

  // Função auxiliar para converter imagem em texto (Base64) para salvar no LocalStorage
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    // 1. VALIDAÇÃO
    if (!communityName.trim() || !category || !description.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsLoading(true);

      // --- SIMULAÇÃO DE BACK-END COM LOCALSTORAGE ---
      
      // 1. Converte a imagem (se tiver)
      let imageBase64 = null;
      if (coverFile) {
        imageBase64 = await convertToBase64(coverFile);
      }

      // 2. Cria o objeto da nova comunidade
      const novaComunidade = {
        id: Date.now(), // ID único baseado no tempo
        ownerId: userId,
        nome: communityName,
        category: category,
        description: description,
        imagem: imageBase64 // Salva a imagem como texto
      };

      // 3. Pega o que já existe no navegador
      const comunidadesSalvas = JSON.parse(localStorage.getItem('minhas_comunidades') || '[]');
      
      // 4. Adiciona a nova e salva de volta
      const listaAtualizada = [...comunidadesSalvas, novaComunidade];
      localStorage.setItem('minhas_comunidades', JSON.stringify(listaAtualizada));

      // 5. Simula um delay de rede (pra ver o loading)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // --- FIM DA SIMULAÇÃO ---

      setIsFormDirty(false); 
      
      // --- CORREÇÃO AQUI: ADICIONADO O ID NA URL ---
      navigate(`/minhasComunidades/${userId}`); 

    } catch (error) {
      console.error("Erro ao criar comunidade:", error);
      alert("Ocorreu um erro ao criar a comunidade.");
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
              <h1 className="text-2xl font-bold text-gray-900">Crie sua comunidade</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              
              <div className="mb-8">
                <label htmlFor="cover-photo-upload" className="block cursor-pointer">
                  <div className={`w-full h-64 rounded-lg bg-gray-300 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-400 transition-colors relative overflow-hidden ${!coverPhoto ? 'border-2 border-dashed border-gray-400' : ''}`}>
                    {coverPhoto ? (
                      <img src={coverPhoto} alt="Capa da Comunidade" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <span className="font-semibold">Adicione uma foto de capa</span>
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
                  <label htmlFor="community-name" className="block text-sm font-bold text-gray-900 mb-2">
                    Nome da comunidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="community-name"
                    placeholder="Nome da sua comunidade"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="community-category" className="block text-sm font-bold text-gray-900 mb-2">
                    Categoria da comunidade <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="community-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                    className={`w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all appearance-none bg-white disabled:bg-gray-100 ${category === '' ? 'text-gray-400' : ''}`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem' }}
                  >
                    <option value="" disabled hidden>Escolha uma categoria</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat} className="text-gray-700">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="community-description" className="block text-sm font-bold text-gray-900 mb-2">
                  Descrição da comunidade <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="community-description"
                  rows="6"
                  placeholder="Descrição da sua comunidade"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FD7702] focus:ring-1 focus:ring-[#FD7702] transition-all resize-none disabled:bg-gray-100"
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`bg-[#FD7702] text-white font-bold py-3 px-12 rounded-lg hover:bg-[#e66a00] transition-colors shadow-md w-full md:w-auto text-center flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Criando...
                    </>
                  ) : (
                    "Criar comunidade"
                  )}
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}