import LoginPage from "../pages/Login";
import { useNavigate } from 'react-router-dom';

function BarraLateral() {
  const navigate = useNavigate();
  const tipoUsuario = localStorage.getItem('usuario-tipo');
  {/* Barra lateral do Cliente */ }
  if (tipoUsuario === 'cliente') {
    return (
      <div className="inline-block align-top w-60 h-full border-r border-gray-200 bg-white p-6">
        <div className="space-y-6">
          {/*criar as rotas de navegacao */}
          <button onClick={() => navigate("/perfil/cliente")}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">👤</span>
            <span className="font-bold ml-2">Meu perfil</span>
          </button>

          <button onClick={() => navigate("/Notificacoes")}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">🔔</span>
            <span className="font-bold ml-2">Notificações</span>
          </button>

          <button onClick={() => navigate("/Promocoes")}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">🏷️</span>
            <span className="font-bold ml-2">Promoções</span>
          </button>

          <button onClick={() => navigate("/Favoritos")}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">❤️</span>
            <span className="font-bold ml-2">Favoritos</span>
          </button>

          <button onClick={() => navigate("/Configuracoes")}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">⚙️</span>
            <span className="font-bold ml-2">Configurações</span>
          </button>
        </div>
      </div>
    )
    {/* Barra lateral do Lojista */}

  } else  {
    return (
      <div className="inline-block align-top w-60 h-full border-r border-gray-200 bg-white p-6">
        <div className="space-y-6">
          {/*criar as rotas de navegacao */}
          <button onClick={() => navigate("/perfil/empresa")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">👤</span>
            <span className="font-bold ml-2">Meu perfil</span>
          </button>

          <button onClick={() => navigate("/Notificacoes")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">🔔</span>
            <span className="font-bold ml-2">Notificações</span>
          </button>

          <button onClick={() => navigate("/Promocoes")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">🏷️</span>
            <span className="font-bold ml-2">Promoções</span>
          </button>

          <button onClick={() => navigate("/Configuracoes")} className="flex items-center space-x-2 text-gray-700 hover:text-[#1A225F] hover:cursor-pointer">
            <span className="text-lg">⚙️</span>
            <span className="font-bold ml-2">Configurações</span>
          </button>
        </div>
      </div>
    )
  }
}

export default BarraLateral;