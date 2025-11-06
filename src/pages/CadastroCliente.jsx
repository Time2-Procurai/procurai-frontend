import React, { useState, useRef, useEffect } from 'react'; // Importar o useRef
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

// Ícone de seta
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="font-bold cursor-pointer w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

// Lista de interesses
const interestsOptions = ['Tecnologia', 'Esportes', 'Construção', 'Saúde', 'Beleza', 'Culinária', 'Decoração', 'Papelaria',
  'Livros', 'Brinquedos', 'Alimentos e Bebidas'
];

// Função que simula uma chamada de API (agora modificada para FormData)
/*const simulateApiCall = (formData) => {
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
};*/

const CadastroClientePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', username: '', cpf: '', phone: '' });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState("");

  // Adicionar estados para a imagem e uma ref para o input
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState(null); 

  
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

  const handleInterestClick = (interest) => {
    setSelectedInterests(prevInterests =>
      prevInterests.includes(interest)
        ? prevInterests.filter(item => item !== interest)
        : [...prevInterests, interest]
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

    if (!userId) {
      setError("Erro: ID do utilizador não encontrado. Por favor, tente novamente.");
      setIsLoading(false);
      return;
    }

    // Usar FormData para poder incluir o arquivo da imagem
    const submissionData = new FormData();
    submissionData.append('fullName', formData.fullName);
    submissionData.append('username', formData.username);
    submissionData.append('cpf', formData.cpf);
    submissionData.append('phone', formData.phone);
    submissionData.append('interests', JSON.stringify(selectedInterests));

    if (profileImageFile) {
      submissionData.append('profile_picture', profileImageFile);
    }

    try {
      console.log("Dados a serem enviados:", submissionData);
      const response = await api.post(
        `user/register/tela2/cliente/${userId}/`,
        submissionData, // Envia o FormData
        
      );

      console.log("Resposta da API:", response.data);
      
      
      sessionStorage.removeItem("user_id");
      navigate('/cadastro/empresa/2');

    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      let errorMessage = 'Erro ao finalizar o cadastro. Tente novamente.';

      if (error.response && error.response.data) {
        const errors = error.response.data;
        // Tenta extrair o primeiro erro
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey && Array.isArray(errors[firstErrorKey])) {
          errorMessage = `${firstErrorKey}: ${errors[firstErrorKey][0]}`;
        }
      }
      setError(errorMessage);
      alert(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl mx-auto p-6 sm:p-8">
        <div className="relative flex justify-center items-center mb-8">
          <button
            onClick={() => navigate('/cadastro')}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BackArrowIcon />
          </button>
          <h1 className="text-2xl font-bold">Crie o seu perfil!</h1>
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
            <label htmlFor="fullName" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Nome completo
            </label>

            <input type="text" 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="Nome completo" 
              pattern="[\p{L}\s]+"
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Nome de usuário
            </label>

            <input type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Digite um nome de usuário" 
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
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
              placeholder="00000000000" 
              pattern="\d{11}"
              required 
              className="invalid:border-red-500 invalid:focus:ring-red-500 shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
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
              placeholder="00 00000-0000"
              pattern="\d"
              required 
              className="invalid:border-red-500 invalid:focus:ring-red-500 shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Seus interesses
            </label>

            <div className="flex flex-wrap justify-center gap-2">
              {interestsOptions.map((interest) => (
                <button key={interest} 
                  type="button" 
                  onClick={() => handleInterestClick(interest)} 
                  className={`shadow-sm cursor-pointer px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 
                  ${selectedInterests.includes(interest) ? 'bg-orange-500 text-white border border-orange-500' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'}`}>
                  {interest}
                </button>

              ))}
            </div>
          </div>

          <button type="submit" 
            disabled={isLoading} 
            className="shadow-lg cursor-pointer w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-orange-300 disabled:cursor-not-allowed">
            {isLoading ? 'Criando perfil...' : 'Criar perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroClientePage;