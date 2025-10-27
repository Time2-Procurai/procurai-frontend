import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

// Ícone de seta
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="cursor-pointer w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);


const categoriesOptions = [
  { key: 'ROUP', name: 'Roupas e Acessórios' },
  { key: 'ELET', name: 'Eletrônicos' },
  { key: 'COSM', name: 'Cosméticos' },
  { key: 'REST', name: 'Restaurantes' },
  { key: 'Construção', name: 'Construção' },
  { key: 'Saúde', name: 'Saúde' }
];

const CadastroEmpresaPage = () => {
  const navigate = useNavigate();  
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '', // Para o User
    cpf: '',        // Para o User
    cnpj: '',
    phone: '',
    hour: '',
    description: '' 
  });
  
  const [selectedCategory, setSelectedCategory] = useState(''); 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [userId, setUserId] = useState(null); // Estado para o ID

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Carrega o ID do utilizador quando a página abre
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("ID do utilizador não encontrado na sessão.");
      setError("Erro: ID do utilizador não encontrado. Por favor, volte ao passo anterior.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };


  const handleCategoryClick = (categoryKey) => {
    setSelectedCategory(prevCategory =>      
      prevCategory === categoryKey ? '' : categoryKey
    );
  };

  // Funções para a imagem
  const handleImageContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // --- FUNÇÃO DE SUBMISSÃO UNIFICADA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!userId) {
      setError("Erro: ID do utilizador não encontrado. Tente novamente.");
      setIsLoading(false);
      return;
    }

    
    const submissionData = new FormData();

   
    submissionData.append('company_name', formData.companyName);
    submissionData.append('full_name', formData.fullName); // Campo para o User
    submissionData.append('cpf', formData.cpf);         // Campo para o User
    submissionData.append('cnpj', formData.cnpj);
    submissionData.append('description', formData.description);
    submissionData.append('phone', formData.phone); 
    submissionData.append('operating_hours', formData.hour);

   
    if (selectedCategory) {
      submissionData.append('company_category', selectedCategory);
    } else {
      
      setError("Por favor, selecione uma categoria para a empresa.");
      setIsLoading(false);
      return;
    }

    
    if (profileImageFile) {
      submissionData.append('profile_picture', profileImageFile);
    }
    

    try {
      // 5. Enviar o FormData
      const response = await api.post(
        `user/register/tela2/lojista/${userId}/`,
        submissionData
        
      );

      console.log("Resposta da API:", response.data);
      alert("Perfil criado com sucesso!");

      
      navigate('/cadastro/empresa/2');

    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error.response?.data || error.message);
      setError("Erro ao cadastrar. Verifique os dados informados.");
      alert("Erro ao cadastrar. Verifique os dados informados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white font-sans w-full max-w-2xl mx-auto p-6 sm:p-8">
        <div className="relative flex justify-center items-center mb-8">
          <button
            onClick={() => navigate('/cadastro')}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BackArrowIcon />
          </button>
          <h1 className="text-2xl font-bold">
            Crie o seu perfil!
          </h1>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Bloco da Foto */}
        <div
          className="flex flex-col items-center mb-8 cursor-pointer"
          onClick={handleImageContainerClick}
        >
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="Prévia do perfil"
              className="w-32 h-32 rounded-full object-cover" // Ajustei o tamanho
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-3"></div> // Ajustei o tamanho
          )}
          <span className="block text-sm font-bold mt-2 text-gray-800 text-[20px]">Adicione uma foto de perfil</span>
        </div>

        {/* Input de ficheiro escondido */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
        />

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Nome da sua empresa
            </label>
            <input type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Nome da empresa"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Nome completo (Responsável)
            </label>
            <input type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nome completo do responsável"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cpf" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              CPF (Responsável)
            </label>
            <input type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cnpj" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              CNPJ (Opcional)
            </label>
            <input type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="Digite o CNPJ da sua empresa (Opcional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Descrição da empresa
            </label>
            <textarea // Mudei para <textarea> para melhor digitação
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Dê uma descrição do seu negócio"
              required
              rows={4} // Altura do campo
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Telefone (Comercial)
            </label>
            <input type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="81 XXXXX-XXXX"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hour" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Horário de Funcionamento
            </label>
            <input type="text" // Mudei de 'hour' para 'text'
              id="hour"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder="Ex: Seg a Sex, 08:00 - 18:00"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Categoria da Empresa
            </label>
            <div className="flex flex-wrap justify-center gap-2">

              {/* --- MUDANÇA IMPORTANTE ---
                  Atualizei o map para usar os objetos (key/name) */}
              {categoriesOptions.map((category) => (
                <button key={category.key}
                  type="button"
                  onClick={() => handleCategoryClick(category.key)} // Passa a CHAVE (ex: 'ELET')
                  className={`cursor-pointer px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 
                  ${selectedCategory === category.key ? 'bg-orange-500 text-white border border-orange-500' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'}`}>
                  {category.name} {/* Mostra o NOME (ex: 'Eletrônicos') */}
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'A avançar...' : 'Avançar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroEmpresaPage;

