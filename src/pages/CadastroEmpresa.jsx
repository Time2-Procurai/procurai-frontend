import React, { useState, useRef } from 'react'; // Importar o useRef
import { useNavigate } from 'react-router-dom';

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

const categoriesOptions = ['Tecnologia', 'Esportes', 'Construção', 'Saúde', 'Beleza', 'Culinária', 'Decoração', 'Papelaria',
  'Livros', 'Brinquedos', 'Alimentos e Bebidas'
];

// Função que simula uma chamada de API (agora modificada para FormData)
const simulateApiCall = (formData) => {
  // Em um app real, o objeto FormData seria enviado. Aqui, apenas logamos os dados.
  for (let [key, value] of formData.entries()) {
    console.log(`Enviando para a API: ${key}`, value);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve({ success: true, message: 'Perfil criado com sucesso! Você será redirecionado.' });
      } else {
        reject({ success: false, message: 'Erro: O nome de usuário já existe. Tente outro.' });
      }
    }, 1500);
  });
};

const CadastroEmpresaPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ companyName: '', fullName: '', cpf: '', cnpj: '', phone: '', hour: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Adicionar estados para a imagem e uma ref para o input
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(item => item !== category)
        : [...prevCategories, category]
    );
  };

  // Adicionar funções para lidar com o clique e a seleção do arquivo
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Usar FormData para poder incluir o arquivo da imagem
    const submissionData = new FormData();
    submissionData.append('companyName', formData.companyName);
    submissionData.append('fullName', formData.fullName);
    submissionData.append('cpf', formData.cpf);
    submissionData.append('cpnj', formData.cnpj);
    submissionData.append('description', formData.description);
    submissionData.append('phone', formData.phone);
    submissionData.append('categories', JSON.stringify(selectedCategories));
    submissionData.append('hour', formData.hour);

    if (profileImageFile) {
      submissionData.append('profileImage', profileImageFile);
    }

    try {
      const response = await simulateApiCall(submissionData);
      alert(response.message);
      navigate('/cadastro/empresa/2');
    } catch (error) {
      alert(error.message);
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

        {/* Tornar o bloco da foto clicável e exibir o preview */}
        <div
          className="flex flex-col items-center mb-8 cursor-pointer"
          onClick={handleImageContainerClick}
        >
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="Prévia do perfil"
              className="w-42 h-42 rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-200 rounded-full mb-3"></div>
          )}
          <span className="block text-sm font-bold mt-2 text-gray-800 text-[20px]">Adicione uma foto de perfil</span>
        </div>

        {/* Adicionar o input de arquivo escondido */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
        />

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
              Nome completo
            </label>

            <input type="text" 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="Nome completo do usuário" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cpf" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              CPF
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

          {/* NÃO OBRIGATÓRIO */}
          <div className="mb-4">
            <label htmlFor="cnpj" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              CNPJ
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

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Suas categorias
            </label>

            <div className="flex flex-wrap justify-center gap-2">
              {categoriesOptions.map((category) => (
                <button key={category} 
                type="button" 
                onClick={() => handleCategoryClick(category)} 
                className={`cursor-pointer px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 
                ${selectedCategories.includes(category) ? 'bg-orange-500 text-white border border-orange-500' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Descrição da empresa
            </label>

            <input type="description" 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Dê uma descrição do seu negócio" 
              required 
              className="w-full px-4 py-2 pb-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Telefone
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

            <input type="hour"
              id="hour"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder="00:00 - 00:00"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button type="submit" 
            disabled={isLoading} 
            onClick={() => navigate("/cadastro/empresa/2")}
            className="cursor-pointer w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            Avançar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroEmpresaPage;