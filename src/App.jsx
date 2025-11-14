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
import PerfilEmpresa from './pages/PerfilEmpresa.jsx';
import PerfilCliente from './pages/PerfilCliente.jsx';
import CatalogoEmpresa from './pages/CatalogoEmpresa.jsx';
import AdicionarProduto from './pages/AdicionarProduto.jsx';
import EditarPerfilLoja from './pages/EditarPerfilLoja.jsx';
import EditarPerfilCliente from './pages/EditarPerfilCliente.jsx';

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-white">PROCUR<span className="text-[#FD7702]">AÍ</span></h1>
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
      <Route path="/feedcliente/:userId" element={<FeedPageCliente />}/>
      <Route path="/feedempresa/:userId" element={<FeedPageEmpresa />}/>
      <Route path="/configuracoes/:userId" element ={<ConfiguracoesPage/>}/>
      <Route path="/redefinicaosenha/:userId" element={<RedefinicaoSenhaPage/>}/>
      <Route path="/exclusaoconta/:userId" element={<ExclusaoContaPage/>}/>
      <Route path='/cadastro' element={<Cadastro />} />
      <Route path='/cadastro/cliente' element={<CadastroCliente />} />
      <Route path='/cadastro/empresa' element={<CadastroEmpresaPage />}/>
      <Route path='/cadastro/empresa/2' element={<CadastroEmpresaPage2 />}/>
      
      {/* --- CORREÇÃO AQUI --- */}
      {/* Agora a rota aceita um ID dinâmico (ex: /perfil/empresa/5) */}
      <Route path='/perfil/empresa/:userId' element={<PerfilEmpresa />}/>       
      
      {/* --- CORREÇÃO AQUI --- */}
      {/* Aplicado o mesmo para o perfil do cliente */}
      <Route path='/perfil/cliente/:userId' element={<PerfilCliente />}/>
      
      <Route path='/produtos/:userId' element={<CatalogoEmpresa />}/>
      <Route path='/produtos/adicionar/:userId' element ={<AdicionarProduto />}/>
      <Route path ='/EditarPerfilLoja/:userId' element={<EditarPerfilLoja/>}/>
      <Route path='/EditarPerfilCliente/:userId' element={<EditarPerfilCliente/>}/>
    </Routes>
  );
}

export default App;