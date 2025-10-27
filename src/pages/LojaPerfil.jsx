import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
// instalem a biblioteca de icons lucide-react
// npm install lucide-react
import { ChevronLeft, Star, Store, Map } from 'lucide-react';

function LojaPerfil() {
  const navigate = useNavigate();

  // dados dinâmicos
  const [lojaData, setLojaData] = useState({
    nome: "Zézinho Construções",
    categoria: "Armazém",
    rating: "4,9",
    status: "Aberto",
    descricao: "A Zézinho Construções é uma loja dedicada a oferecer produtos e ferramentas de qualidade para profissionais e amantes da construção. Nosso compromisso é com a durabilidade, o bom atendimento e a satisfação de cada cliente",
    horario: "08:00 às 18:00",
    contato: "Telefone: 81 9 9999 - 9999",
    endereco: "Rua Serra Talhada, 90 Dois Irmãos, Recife - PE",
    // placeholders das imagens
    bannerUrl: null,
    profileUrl: null,
    mapUrl: null
  });

  const [abaAtiva, setAbaAtiva] = useState('Informações');

  const abaAtivaClass = "whitespace-nowrap border-b-2 border-orange-500 py-4 px-1 text-base font-semibold text-orange-500";
  const abaInativaClass = "whitespace-nowrap border-b-2 border-transparent py-4 px-1 text-base font-semibold text-gray-500 hover:text-gray-700";

  if (!lojaData) {
    return (
      <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
        <BarraPesquisa />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral />
          <main className="flex-1 overflow-y-auto bg-white flex items-center justify-center">
            <p>Carregando...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <main className="flex-1 overflow-y-auto bg-white">

          {/*perfil*/}
          <div>
            <div className="relative">  
              {/*placeholder dinâmico da capa*/}
              {lojaData.bannerUrl ? (
                <div
                  className="h-40 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${lojaData.bannerUrl})` }}
                />
              ) : (
                <div className="h-40 w-full bg-gray-400" />
              )}

              {/*botão de voltar*/}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 text-black p-2 transition hover:opacity-80"
              >
                <ChevronLeft size={28} />
              </button>

              {/*editar perfil*/}
              <button className="absolute top-4 ring-2 ring-[#FD7702] right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50">
                Editar perfil
              </button>

              {/*placeholder dinâmico do icon*/}
              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                {lojaData.profileUrl ? (
                  <img
                    src={lojaData.profileUrl}
                    alt="Logo"
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                    <Store size={48} className="text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/*infos principais da loja*/}
            <div className="px-6 pt-14 pb-4">
              <div className="text-center">
                {/*dinâmicos*/}
                <h1 className="text-3xl font-bold text-gray-900">{lojaData.nome}</h1>
                <p className="text-lg text-gray-500">{lojaData.categoria}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="text-xl font-bold">{lojaData.rating}</span>
                  <Star size={20} className="fill-current text-orange-500" />
                </div>
              </div>

              {/*status da loja (aberta ou fehcada)*/}
              <div className="mt-4 flex justify-end">
                <div className="flex items-center space-x-1.5">
                  <Store size={20} className="text-gray-700" />
                  <span className="font-medium text-gray-700">{lojaData.status}</span>
                </div>
              </div>
            </div>

            {/*abas de infos, comunidade e produtos*/}
            <div className="border-b border-gray-200">
              <nav className="flex justify-center space-x-10">
                <button
                  onClick={() => setAbaAtiva('Informações')}
                  className={abaAtiva === 'Informações' ? abaAtivaClass : abaInativaClass}
                >
                  Informações
                </button>
                <Link
                  to="/comunidade"
                  className={abaInativaClass}
                >
                  Comunidade
                </Link>

                <Link
                  to="/produtos"
                  className={abaInativaClass}
                >
                  Produtos
                </Link>
              </nav>
            </div>

            {/* infos */}
            {abaAtiva === 'Informações' && (
              <div className="p-4">
                <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex flex-row gap-5">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Descrição</h3>
                        {/*descrição é dinâmica*/}
                        <p className="text-sm text-gray-600">{lojaData.descricao}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Horário de funcionamento:</h3>
                        {/*horario de funcionamento é dinâmico*/}
                        <p className="text-sm text-gray-600">{lojaData.horario}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-base font-bold text-gray-900">Contato</h3>
                        {/*contato é dinâmico*/}
                        <p className="text-sm text-gray-600">{lojaData.contato}</p>
                      </div>
                    </div>
                    {/*endereço e mapa*/}
                    <div className="w-1/3">
                      <div className="mb-2">
                        <h3 className="mb-1 text-base font-bold text-gray-900">Endereço</h3>
                        {/*endereço dinâmico*/}
                        <p className="text-sm text-gray-600">{lojaData.endereco}</p>
                      </div>
                      {/* placeholder dinâmico do mapa*/}
                      {lojaData.mapUrl ? (
                        <img
                          src={lojaData.mapUrl}
                          alt="Mapa"
                          className="h-28 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-28 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                          <Map size={32} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LojaPerfil;