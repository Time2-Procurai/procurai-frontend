import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BarraPesquisa from "../components/BarraPesquisa";
import BarraLateral from "../components/BarraLateral";
import UploadFoto from "../components/UploadFoto";
import api from "../api/api";

function EditarPerfilLoja() {
  const navigate = useNavigate();

  // Estado único com todos os dados da loja
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

  // Foto de perfil da loja
  const [profileImageFile, setprofileImageFile] = useState(null);
  const [profileImagePreview, setprofileImagePreview] = useState(null);

  // Função genérica para lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  // Upload da foto de perfil
  const handleFotoPerfil = (file) => {
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  // Estados de Controle
  const [isFetching, setIsFetching] = useState(true); // Para o carregamento inicial
  const [isLoading, setIsLoading] = useState(false);   // Para o envio (submit)
  const [error, setError] = useState(null);

  // useEffect: Buscar dados atuais da loja
  useEffect(() => {
    const fetchCurrentData = async () => {
      setIsFetching(true);
      try {
        // O backend (UserProfileView) usa o token para saber quem é o usuário
        const response = await api.get("/user/profile/");
        const { user, profile } = response.data;
        console.log("Dados obtidos da loja:", response.data);

        setDados({
          nomeLoja: profile?.company_name || "",
          tipoLoja: profile?.company_type || "",
          categoria: profile?.company_category || "",
          descricao: profile?.description || "",
          telefone: user?.phone || "",
          horario: profile?.operating_hours || "",
          cep: profile?.cep || "",
          endereco: profile?.street || "",
          numero: profile?.number || "",
          cidade: profile?.city || "",
          bairro: profile?.neighborhood || "",
          complemento: profile?.complement || "",
        });

        // Define a foto de perfil *existente*
        if (profile?.profile_picture) {
          setProfileImagePreview(profile.profile_picture);
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

  // (Futuramente) enviar dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const submissionData = new FormData();

    if (dados.nomeLoja) submissionData.append("company_name", dados.nomeLoja);
    if (dados.tipoLoja) submissionData.append("company_type", dados.tipoLoja);
    if (dados.categoria) submissionData.append("company_category", dados.categoria);
    if (dados.descricao) submissionData.append("description", dados.descricao);
    if (dados.horario) submissionData.append("operating_hours", dados.horario);

    if (dados.cep) submissionData.append("cep", dados.cep);
    if (dados.endereco) submissionData.append("street", dados.endereco);
    if (dados.numero) submissionData.append("number", dados.numero);
    if (dados.cidade) submissionData.append("city", dados.cidade);
    if (dados.bairro) submissionData.append("neighborhood", dados.bairro);
    if (dados.complemento) submissionData.append("complement", dados.complemento);

    if (profileImageFile) {
      submissionData.append("profile_picture", profileImageFile);
    }

    try {

      await api.patch(
        `/user/profile/`,
        submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      }
      );

      alert("Perfil atualizado com sucesso!");
      navigate(-1);

    } catch (error) {
      console.error("Erro ao atualizar o perfil da loja:", error);
      alert("Erro ao atualizar o perfil. Tente novamente.");

    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      {/* Barra superior */}
      <BarraPesquisa />

      <div className="flex flex-1 overflow-hidden">
        {/* Menu lateral */}
        <BarraLateral />

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1 items-center py-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6">Editar Perfil da Loja</h1>

          {/* Área de upload da capa + foto */}
          <div className="relative w-full max-w-4xl mb-8">
            <div className="w-full h-40 bg-gray-200 rounded-xl mb-4">
              {profileImageFile ? (
                <img src={profileImagePreview} className="w-full h-full object-cover" />
              ) : (
                <p className="text-center text-gray-500 mt-16">Foto da Loja</p>
              )}
            </div>
            <div className="absolute -bottom-8 left-8">
              <UploadFoto />
            </div>
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl flex flex-col gap-4"
          >
            {/* Nome / Tipo / Categoria */}
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-bold text-gray-700 mb-1">
                  Tipo de Empresa
                </label>
                <input
                  name="tipoLoja"
                  type="text"
                  placeholder="Digite o tipo da empresa"
                  value={dados.tipoLoja}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-bold text-gray-700 mb-1">
                  Categoria
                </label>
                <input
                  name="categoria"
                  type="text"
                  placeholder="Digite a categoria"
                  value={dados.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="flex flex-col">
              <label className="block font-bold text-gray-700 mb-1">
                Descrição da Empresa
              </label>
              <textarea
                name="descricao"
                placeholder="Escreva uma breve descrição da empresa"
                value={dados.descricao}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Telefone e horário */}
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Endereço */}
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Botão de salvar */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="shadow-lg cursor-pointer w-full bg-[#FD7702] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfilLoja;