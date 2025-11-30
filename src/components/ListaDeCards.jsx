import React from "react";

function ListaDeCards({ titulo, children }) {
  return (
    <section className="mb-16">
      <h2 className="text-lg font-semibold mb-8">{titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </section>
  );
}

export default ListaDeCards;