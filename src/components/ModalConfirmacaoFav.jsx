import React from 'react';

export default function ModalConfirmacaoFav({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scaleIn">

        <div className="flex flex-col items-center text-center">

          <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2">{title}</h3>
          <p className="text-gray-500 mb-6">
            {message}
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-[#FD7702] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-md"
            >
              {confirmText}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}