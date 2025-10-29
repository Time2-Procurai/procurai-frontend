import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BarraPesquisa from '../components/BarraPesquisa';
import BarraLateral from '../components/BarraLateral';
// instalem a biblioteca de icons lucide-react
// npm install lucide-react
import { ChevronLeft, Star, Store, Map } from 'lucide-react';

// atualmente usando import
import imgParafusadeira from '../assets/parafusadeira.jpg';
import imgFuradeira from '../assets/furadeira.png';
import imgCaixaFerramenta from '../assets/caixaferramenta.jpg'

function CatalogoEmpresa() {
  const navigate = useNavigate();

  // produtos (3 por linha)
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Parafusadeira DEWALT LT3",
      preco: 180.9,
      desconto: 20,
      imagem: imgParafusadeira,
    },
    {
      id: 2,
      nome: "Furadeira DEWALT 500W",
      preco: 230.5,
      desconto: 10,
      imagem: imgFuradeira,
    },
    {
      id: 3,
      nome: "Caixa de ferramentas Vonder",
      preco: 89.9,
      desconto: 0,
      imagem: imgCaixaFerramenta,
    },
  ]);


  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <BarraPesquisa />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {/* cabeçalho do catálogo */}
          <div className="flex items-center justify-start mb-6">
            <button
              onClick={() => navigate('/perfil/empresa')}
              className="hover:cursor-pointer text-black p-2 pr-4 transition hover:opacity-80"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Todos os produtos
            </h1>
          </div>
          
          {/* botões de ação */}
          <div className="justify-center flex gap-40 mb-8">
            <button
              onClick={() => navigate('/AdicionarProduto')}
              className="shadow-md border-2 border-[#FD7702] font-medium py-3 px-8 rounded-sm hover:bg-[#FD7702] hover:text-white hover:cursor-pointer transition-colors"
            >
              Adicionar novo produto
            </button>
            <button
              onClick={() => navigate('/Estatisticas')}
              className="shadow-md border-2 border-[#FD7702] font-medium py-3 px-8 rounded-sm hover:bg-[#FD7702] hover:text-white hover:cursor-pointer transition-colors"
            >
              Acessar minhas estatísticas
            </button>
          </div>

          {/* grid de produtos dinâmico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="hover:cursor-pointer shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="py-4 w-full h-48 object-contain justify-center"
                />
                <div className="p-4">
                  <h2 className="text-sm font-medium text-gray-800 mb-1">
                    {produto.nome}
                  </h2>
                  <p className="text-gray-700 font-semibold">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </p>
                  {produto.desconto > 0 && (
                    <p className="text-[#FD7702] font-semibold text-sm mt-1">
                      {produto.desconto}% OFF
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CatalogoEmpresa;