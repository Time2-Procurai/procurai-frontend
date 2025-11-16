import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";
import api from "../api/api";
import { ChevronLeft, User, Camera } from "lucide-react";

const TIPO_EMPRESA_CHOICES = [
  { key: 'TECH', label: 'Tecnologia' },
  { key: 'FOOD', label: 'Alimentação' },
  // Adicione mais se houver
];

const CATEGORIA_EMPRESA_CHOICES = [
  { key: 'ROUP', label: 'Roupas e Acessórios' },
  { key: 'ELET', label: 'Eletrônicos' },
  { key: 'COSM', label: 'Cosméticos' },
  { key: 'REST', label: 'Restaurantes' },
  { key: 'Construção', label: 'Construção' },
  { key: 'Saúde', label: 'Saúde' },
  // Adicione mais se houver
];


const ProfileImageUpload = ({ preview, onClick }) => (
  <div 
    className="relative w-32 h-32 cursor-pointer"
    onClick={onClick}
  >
    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
      {preview ? (
        <img src={preview} alt="Foto de perfil" className="w-full h-full object-cover" />
      ) : (
        <User size={64} className="text-gray-500" />
      )}
    </div>
  </div>
);

function EditarPerfilLoja() {
  const navigate = useNavigate();
  const profilePicRef = useRef(null);
  const coverPicRef = useRef(null);

  const [dados, setDados] = useState({
    nomeLoja: "",
    tipoLoja: "",
    categoria: "",
    descricao: "",
    telefone: "",
    horario: "",
    cep: "",
    endereco: "",
    numero: "",
    cidade: "",
    bairro: "",
    complemento: "",
  });
  
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [coverPicFile, setCoverPicFile] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState(null);

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentData = async () => {
      setIsFetching(true);
      try {
        const response = await api.get('/user/profile/'); 
        const { user, profile } = response.data;
        
        setDados({
          nomeLoja: user.full_name || '',
          telefone: user.phone || '',
          // --- CORREÇÃO AQUI: Define um valor padrão caso esteja vazio ---
          tipoLoja: profile?.company_type || TIPO_EMPRESA_CHOICES[0].key, 
          categoria: profile?.company_category || CATEGORIA_EMPRESA_CHOICES[0].key,
          descricao: profile?.description || '',
          horario: profile?.operating_hours || '',
          cep: profile?.cep || '',
          endereco: profile?.street || '',
          numero: profile?.number || '',
          cidade: profile?.city || '',
          bairro: profile?.neighborhood || '',
          complemento: profile?.complement || '',
        });
        
        if (profile?.profile_picture) {
          setProfilePicPreview(profile.profile_picture);
        }
        if (profile?.cover_picture) {
          setCoverPicPreview(profile.cover_picture);
        }
        
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        setError("Não foi possível carregar seus dados.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCurrentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPicFile(file);
      setCoverPicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const submissionData = new FormData();
    
    submissionData.append('full_name', dados.nomeLoja);
    submissionData.append('phone', dados.telefone);
    submissionData.append('company_type', dados.tipoLoja);
    submissionData.append('company_category', dados.categoria);
    submissionData.append('description', dados.descricao);
    submissionData.append('operating_hours', dados.horario);
    submissionData.append('cep', dados.cep);
    submissionData.append('street', dados.endereco);
    submissionData.append('number', dados.numero);
    submissionData.append('city', dados.cidade);
    submissionData.append('neighborhood', dados.bairro);
    submissionData.append('complement', dados.complemento);

    if (profilePicFile) {
      submissionData.append('profile_picture', profilePicFile);
    }
    if (coverPicFile) {
      submissionData.append('cover_picture', coverPicFile);
    }
    
    try {
      await api.patch('/user/profile/', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert("Perfil atualizado com sucesso!");
      navigate(-1); 

    } catch (err) {
      const errorData = err.response?.data;
      console.error("Erro ao atualizar perfil:", errorData || err);

      if (errorData) {
        const firstErrorKey = Object.keys(errorData)[0];
        setError(`Erro no campo ${firstErrorKey}: ${errorData[firstErrorKey][0]}`);
      } else {
        setError("Erro ao atualizar. Verifique os campos e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
     return (
       <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <div className="flex-1 flex justify-center items-center">
            <p className="text-xl text-gray-500 animate-pulse">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <div className="flex flex-col flex-1 py-8 overflow-y-auto relative">
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="w-full max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6 text-center">Editar Perfil da Loja</h1>

            <div className="relative w-full mb-12">
              <label 
                htmlFor="cover-pic-input"
                className="w-full h-40 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition"
              >
                {coverPicPreview ? (
                  <img src={coverPicPreview} alt="Capa" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera size={24} />
                    <span>Alterar foto de capa</span>
                  </div>
                )}
              </label>
              <div className="absolute -bottom-16 left-8">
                <ProfileImageUpload 
                  preview={profilePicPreview}
                  onClick={() => profilePicRef.current.click()}
                />
              </div>
            </div>

            <input
              type="file" accept="image/*" ref={profilePicRef}
              onChange={handleProfilePicChange} className="hidden"
            />
            <input
              type="file" accept="image/*" ref={coverPicRef}
              onChange={handleCoverPicChange} className="hidden"
            />

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-xl p-6 w-full flex flex-col gap-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    name="nomeLoja"
                    type="text"
                    placeholder="Digite o nome da empresa"
                    value={dados.nomeLoja}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Tipo de Empresa
                  </label>
                  <select
                    name="tipoLoja"
                    value={dados.tipoLoja}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    {/* --- CORREÇÃO AQUI: Removida a opção "Selecione..." --- */}
                    {TIPO_EMPRESA_CHOICES.map(choice => (
                      <option key={choice.key} value={choice.key}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    name="categoria"
                    value={dados.categoria}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    {/* --- CORREÇÃO AQUI: Removida a opção "Selecione..." --- */}
                    {CATEGORIA_EMPRESA_CHOICES.map(choice => (
                      <option key={choice.key} value={choice.key}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block font-bold text-gray-700 mb-1">
                  Descrição da Empresa
                </label>
                <textarea
                  name="descricao"
                  placeholder="Escreva uma breve descrição da empresa"
                  value={dados.descricao}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={dados.telefone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Horário de Funcionamento
                  </label>
                  <input
                    name="horario"
                    type="text"
                    placeholder="Ex: 08:00 às 18:00"
                    value={dados.horario}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    name="cep"
                    type="text"
                    placeholder="00000-000"
                    value={dados.cep}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="flex flex-col col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    name="endereco"
                    type="text"
                    placeholder="Rua, Avenida..."
                    value={dados.endereco}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    name="numero"
                    type="text"
                    placeholder="Nº"
                    value={dados.numero}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    type="text"
                    placeholder="Cidade"
                    value={dados.cidade}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    name="bairro"
                    type="text"
                    placeholder="Bairro"
                    value={dados.bairro}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block font-bold text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    name="complemento"
                    type="text"
                    placeholder="Ex: Sala 2, Bloco B..."
                    value={dados.complemento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shadow-lg cursor-pointer w-full bg-[#FD7702] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 disabled:bg-orange-300"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfilLoja;