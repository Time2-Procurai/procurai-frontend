import React, { useState, useRef } from 'react'; // Importar o useRef
import { useNavigate } from 'react-router-dom';

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

const CadastroEmpresaPage2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ cep: '', address: '', number: '', city: '', street: '', cplm: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Usar FormData para poder incluir o arquivo da imagem
    const submissionData = new FormData();
    submissionData.append('cep', formData.cep);
    submissionData.append('address', formData.address);
    submissionData.append('number', formData.number);
    submissionData.append('city', formData.city);
    submissionData.append('street', formData.street);
    submissionData.append('cplm', formData.cplm);

    try {
      const response = await simulateApiCall(submissionData);
      alert(response.message);
      navigate('/login');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl mx-auto p-6 sm:p-8">
        <div className="relative flex justify-center items-center mb-8">
          <button
            onClick={() => navigate('/cadastro/empresa')}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BackArrowIcon />
          </button>
          <h1 className="text-2xl font-bold">
            Adicione o endereço da sua empresa!
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cep" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              CEP
            </label>

            <input type="text" 
              id="cep" 
              name="cep" 
              value={formData.cep} 
              onChange={handleChange} 
              placeholder="00000000" 
              pattern="\d{8}"
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Endereço
            </label>

            <input type="text" 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              pattern="[\p{L}\s]+"
              placeholder="Rua, Travessa, Av." 
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="number" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Número
            </label>

            <input type="text" 
              id="number" 
              name="number" 
              value={formData.number} 
              onChange={handleChange} 
              placeholder="Número" 
              pattern="\d"
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Cidade
            </label>
            <input type="text" 
              id="city" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              placeholder="Cidade"
              pattern="[\p{L}\s]+"
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="street" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Bairro
            </label>

            <input type="text" 
              id="street" 
              name="street" 
              value={formData.street} 
              onChange={handleChange} 
              placeholder="Bairro" 
              pattern="[\p{L}\s]+"
              required 
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cplm" className="block text-sm font-bold mb-2 text-gray-800 text-[20px]">
              Complemento
            </label>

            <input type="text"
              id="cplm"
              name="cplm"
              value={formData.cplm}
              onChange={handleChange}
              placeholder="Complemento (Opcional)"
              className="shadow-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button type="submit" 
            disabled={isLoading} 
            className="shadow-lg cursor-pointer w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            Criar perfil
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroEmpresaPage2;