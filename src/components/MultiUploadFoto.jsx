import React, { useState } from "react";

 function MultiUploadFoto({ onChange }) {
  const [imagens, setImagens] = useState([]);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const novasImagens = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const todas = [...imagens, ...novasImagens].slice(0, 4); // máx. 4 imagens
    setImagens(todas);
    onChange(todas.map((img) => img.file));
  };

  return (
    <div className="flex gap-4 justify-center mt-4">
      {imagens.map((img, index) => (
        <div
          key={index}
          className="w-28 h-28 rounded-md bg-gray-200 overflow-hidden border border-gray-300"
        >
          <img
            src={img.preview}
            alt={`Foto ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}

      {imagens.length < 4 && (
        <label className="w-28 h-28 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-50">
          <span className="text-gray-500 text-sm">+</span>
          <span className="text-xs text-gray-400">Adicionar</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      )}
    </div>
  );
}
export default MultiUploadFoto;