import React, { useState, useRef } from 'react';
import api from '../api/api';
import { Star, X, Camera } from 'lucide-react';

// Componente de Estrelas (copiado da sua TelaProduto)
const RatingStarsInput = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHoverRating(ratingValue)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star 
              size={32} 
              className={`transition-colors ${
                ratingValue <= (hoverRating || rating)
                  ? 'text-[#FD7702] fill-[#FD7702]'
                  : 'text-gray-300'
              }`} 
            />
          </button>
        );
      })}
    </div>
  );
};

// O Popup
function AvaliacaoPopup({ aberto, onFechar, storeId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]); // Guarda os File objects
  const [photoPreviews, setPhotoPreviews] = useState([]); // Guarda as URLs de preview
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!aberto) return null;

  // Lida com a seleção de arquivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Limita a 4 fotos
    const newFiles = files.slice(0, 4 - photos.length);
    
    const updatedFiles = [...photos, ...newFiles];
    setPhotos(updatedFiles);
    
    const newPreviews = updatedFiles.map(file => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);
  };

  // Remove uma foto do preview
  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Por favor, selecione uma nota (de 1 a 5 estrelas).");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('store', storeId); // O ID da loja que está sendo avaliada
    formData.append('rating', rating);
    formData.append('comment', comment);

    // Adiciona cada arquivo de foto ao FormData
    // O nome 'uploaded_photos' deve bater com o serializer
    photos.forEach((photo) => {
      formData.append('uploaded_photos', photo);
    });

    try {
      // Usa a rota da sua StoreEvaluationView
      await api.post(`/evaluations/stores/${storeId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Sucesso
      setIsLoading(false);
      onFechar(); // Fecha o modal
      // Opcional: mostrar um alerta de sucesso
      alert("Avaliação enviada com sucesso!");

    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      setError("Houve um erro ao enviar sua avaliação. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button 
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Avaliar a loja</h2>
        
        <form onSubmit={handleSubmit}>
          {/* 1. Seleção de Estrelas */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sua nota</label>
            <RatingStarsInput rating={rating} setRating={setRating} />
          </div>

          {/* 2. Comentário */}
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
              Comentário (opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte mais sobre a sua experiência..."
              className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* 3. Upload de Fotos */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fotos (opcional)
            </label>
            <div className="flex gap-2">
              {/* Previews das fotos */}
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* Botão de Adicionar */}
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  <Camera size={24} />
                  <span className="text-xs mt-1">Adicionar</span>
                </button>
              )}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Erro e Botão de Envio */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading || rating === 0}
            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AvaliacaoPopup;