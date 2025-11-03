import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/Login.jsx';
import FeedPageCliente from './pages/FeedCliente.jsx';
import FeedPageEmpresa from './pages/FeedEmpresa.jsx';
import Cadastro from './pages/Cadastro.jsx';
import ConfiguracoesPage from './pages/Configuracoes.jsx';
import RedefinicaoSenhaPage from './pages/RedefinicaoSenha.jsx';
import ExclusaoContaPage from './pages/ExclusaoConta.jsx';
import CadastroCliente from './pages/CadastroCliente.jsx';
import CadastroEmpresaPage from './pages/CadastroEmpresa.jsx';
import CadastroEmpresaPage2 from './pages/CadastroEmpresa2.jsx';
import PerfilCliente from './pages/PerfilCliente.jsx';
import CadastrarProduto from './pages/CadastroProduto.jsx';


function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-white">PROCUR<span class="text-[#FD7702]">AÍ</span></h1>
      <Link
        to="/login"
        className="mt-6 px-6 py-3 font-bold text-white bg-orange-400 rounded-md hover:bg-orange-500">
        Login
      </Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/feedcliente" element={<FeedPageCliente />}/>
      <Route path="/feedempresa" element={<FeedPageEmpresa />}/>
      <Route path="/configuracoes" element ={<ConfiguracoesPage/>}/>
      <Route path="/redefinicaosenha" element={<RedefinicaoSenhaPage/>}/>
      <Route path="/exclusaoconta" element={<ExclusaoContaPage/>}/>
      <Route path='/cadastro' element={<Cadastro />} />
      <Route path='/cadastro/cliente' element={<CadastroCliente />} />
      <Route path='/cadastro/empresa' element={<CadastroEmpresaPage />}/>
      <Route path='/cadastro/empresa/2' element={<CadastroEmpresaPage2 />}/>
      <Route path='/PerfilCliente' element={<PerfilCliente/>}/>
      <Route path='/cadastroProduto' element={<CadastrarProduto/>}/>
    </Routes>
  );
}

export default App;
