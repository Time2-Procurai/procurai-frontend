import React, { useState } from "react";

export default function UploadFoto() {
  const [preview, setPreview] = useState(null);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="relative w-28 h-28">
      <label
        htmlFor="upload"
        className="cursor-pointer flex items-center justify-center w-full h-full rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300 hover:brightness-95 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Pré-visualização"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-gray-500 text-xs text-center px-2">
            Clique para enviar
          </span>
        )}
        <input
          id="upload"
          type="file"
          accept="image/*"
          onChange={handleImagemChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
