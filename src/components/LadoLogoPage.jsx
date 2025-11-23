import React from "react";
import Logo from "../assets/Logo.png"

function LadoLogoPage() {
  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-main text-white p-12 text-center h-full">
      <div className="select-none w-full max-w-sm">
        <img className="rounded-lg" src={Logo} alt="Logo" />

        <h2 className="font-bold text-7xl mb-10 relative mt-10">
          PROCUR<span className="text-[#FD7702]">AÍ</span>
        </h2>

        <h3 className="text-2xl text-[#FD7702] font-bold mb-8">
          Conecte-se a clientes e fortaleça seu negócio local.
        </h3>
      </div>
    </div>
  );
}

export default LadoLogoPage;