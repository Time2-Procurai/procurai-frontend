import React from 'react';
import { X, Check } from 'lucide-react';

const ModalDefinirPromocao = ({
  isOpen,
  onClose,
  produto,
  porcentagem,
  setPorcentagem,
  onConfirm
}) => {
  if (!isOpen || !produto) return null;

  // Função interna para formatar preço (ou você pode receber via props se preferir)
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const precoOriginal = parseFloat(produto.price);

  // Cálculo seguro do preço com desconto
  const precoComDesconto = porcentagem
    ? precoOriginal * (1 - (parseInt(porcentagem) / 100))
    : precoOriginal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Nova Promoção</h2>
        <p className="text-sm text-gray-500 mb-6">
          Defina o desconto para <span className="font-semibold text-gray-800">{produto.name}</span>
        </p>

        {/* Inputs de Preço e Porcentagem */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Preço Original</label>
            <div className="p-3 bg-gray-100 rounded-lg text-gray-500 font-medium border border-gray-200">
              {formatPrice(precoOriginal)}
            </div>
          </div>

          <div className="w-24">
            <label className="block text-xs font-semibold text-[#FD7702] uppercase mb-1">Desconto (%)</label>
            <input
              type="number"
              value={porcentagem}
              min="1"
              max="99"
              onChange={(e) => setPorcentagem(e.target.value)}
              placeholder="20"
              className="w-full p-3 text-center font-bold text-xl border-2 border-[#FD7702] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-900"
              autoFocus
            />
          </div>
        </div>

        {/* Preview do Preço Final */}
        <div className="mb-8 p-4 bg-green-50 rounded-xl border border-green-100 text-center">
          <p className="text-xs text-green-600 font-semibold uppercase mb-1">Preço com Oferta</p>
          <p className="text-3xl font-extrabold text-green-700">
            {porcentagem ? formatPrice(precoComDesconto) : '---'}
          </p>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={onConfirm}
          className="cursor-pointer w-full py-3.5 bg-[#FD7702] hover:bg-[#e66a00] text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Confirmar Promoção
        </button>
      </div>
    </div>
  );
};

export default ModalDefinirPromocao;