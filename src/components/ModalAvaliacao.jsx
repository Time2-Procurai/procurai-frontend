import { useState, useRef, useEffect } from 'react';
import { Star, Plus, X } from 'lucide-react';

const InteractiveRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={28}
            className={`cursor-pointer transition-colors ${
              starValue <= rating
                ? 'text-[#FD7702] fill-[#FD7702]'
                : 'text-gray-300'
            }`}
            onClick={() => setRating(starValue)}
          />
        );
      })}
    </div>
  );
};

export default function ModalAvaliacao({ productName, produtoId, onClose }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setImages(prevImages => [...prevImages, ...newImages].slice(0, 4));
  };

  const handleRemoveImage = (indexToRemove) => {
    const imageToRemove = images[indexToRemove];
    URL.revokeObjectURL(imageToRemove.previewUrl);
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      produtoId,
      rating,
      reviewText,
      files: images.map(img => img.file)
    });
    alert('avaliação postada');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h1 className="mb-6 text-xl font-semibold text-gray-900">
          Avaliar produto
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
          />

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {productName}
            </h2>
            <div className="mt-2">
              <InteractiveRating rating={rating} setRating={setRating} />
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              Fotos do produto
            </h3>

            <div className="mt-4 grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative h-24 w-full">
                  <img
                    src={image.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                  <Plus size={24} />
                  <span className="mt-1 text-xs">Adicionar arquivo</span>
                </button>
              )}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              Escreva sua avaliação
            </h3>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="O que você achou do produto?"
              className="mt-4 h-40 w-full rounded-lg border border-gray-300 p-4 focus:border-[#FD7702] focus:ring-[#FD7702]"
              required
            />
          </section>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#FD7702] py-3 text-lg font-bold text-white transition-colors hover:bg-[#e66a00]"
          >
            Postar
          </button>
        </form>
      </div>
    </div>
  );
}
