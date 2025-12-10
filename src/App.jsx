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
import { AuthProvider } from './context/AuthContext';
import TelaProduto from './pages/TelaProduto.jsx';
import ResultadosBusca from './pages/ResultadosBusca.jsx';
import EsqueciSenha from './pages/EsqueciSenha.jsx';
import RedefinirSenhaConfirmacao from './pages/RedefinirSenhaConfirmacao';
import PostDetalhes from './pages/PostDetalhes.jsx';
import TelaAvaliacoes from './pages/TelaAvaliacoes.jsx';
import EsqueciSenha2 from './pages/EsqueciSenha2.jsx';
import EsqueciSenha3 from './pages/EsqueciSenha3.jsx';
import TelaFavoritos from './pages/TelaFavoritos.jsx';
import PesquisaProduto from './pages/PesquisaProduto.jsx'
import TelaPromocoes from './pages/TelaPromocoes.jsx';
import TelaAdicionarPromocao from './pages/TelaAdicionarPromocao.jsx';
import Notificacoes from './pages/Notificacoes.jsx';
import TelaEditarProduto from './pages/TelaEditarProduto.jsx';
import CriarComunidadeCliente from './pages/CriarComunidadeCliente.jsx';
import CommunidadesCliente from './pages/ComunidadesCliente.jsx';
import FeedComunidadeCliente from './pages/FeedComunidadeCliente.jsx';
import EditarComunidade from './pages/EditarComunidade.jsx';
import LandingPage from './pages/LandingPage.jsx';



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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feedcliente/:userId" element={<FeedPageCliente />} />
        <Route path="/feedempresa/:userId" element={<FeedPageEmpresa />} />
        <Route path="/configuracoes/:userId" element={<ConfiguracoesPage />} />
        <Route path="/redefinicaosenha/:userId" element={<RedefinicaoSenhaPage />} />
        <Route path="/exclusaoconta/:userId" element={<ExclusaoContaPage />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/cadastro/cliente' element={<CadastroCliente />} />
        <Route path='/cadastro/empresa' element={<CadastroEmpresaPage />} />
        <Route path='/cadastro/empresa/2' element={<CadastroEmpresaPage2 />} />
        <Route path='/produto/:produtoId' element={<TelaProduto />} />
        <Route path='/redefinirSenha' element={<EsqueciSenha />} />
        <Route path="/redefinirSenha/2" element={<EsqueciSenha2 />} />
        <Route path="/redefinirSenha/3" element={<EsqueciSenha3 />} /> {/* Adicionar lógica de ID dinâmico se necessário */}

        {/* --- CORREÇÃO AQUI --- */}
        {/* Agora a rota aceita um ID dinâmico (ex: /perfil/empresa/5) */}
        <Route path='/perfil/empresa/:userId' element={<PerfilEmpresa />} />

        {/* --- CORREÇÃO AQUI --- */}
        {/* Aplicado o mesmo para o perfil do cliente */}
        <Route path='/perfil/cliente/:userId' element={<PerfilCliente />} />
        <Route path='/post/:postId' element={<PostDetalhes />} />
        <Route path='/produtos/:userId' element={<CatalogoEmpresa />} />
        <Route path='/produtos/adicionar/' element={<AdicionarProduto />} />
        <Route path='/EditarPerfilLoja/:userId' element={<EditarPerfilLoja />} />
        <Route path='/EditarPerfilCliente/' element={<EditarPerfilCliente />} />
        <Route path="/search/" element={<ResultadosBusca />} />
        <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenhaConfirmacao />} />
        <Route path='/produto/:produtoId/avaliacoes' element={<TelaAvaliacoes />} />
        <Route path='/favoritos/:userId' element={<TelaFavoritos />} />
        <Route path='/PesquisarProduto' element={<PesquisaProduto />} />
        <Route path="/promocoes/:userId" element={<TelaPromocoes />} />
        <Route path="/promocoes/adicionar" element={<TelaAdicionarPromocao />} />
        <Route path='/produto/:produtoId/avaliacoes' element={<TelaAvaliacoes/>}/>
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path='/produto/editar/:produtoId' element={<TelaEditarProduto />} />
        <Route path='/criarComunidade/cliente' element={<CriarComunidadeCliente/>}/>
        <Route path='/minhasComunidades/:userId' element={<CommunidadesCliente/>}/>
        <Route path='/comunidade/:id' element={<FeedComunidadeCliente/>}/>
        <Route path='/editarComunidade/:comunidadeId' element={<EditarComunidade/>} />
        
      </Routes>

    </AuthProvider>
  );
}

export default App;