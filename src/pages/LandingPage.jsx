import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MessageCircle, Users, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const colors = {
    primary: '#1A225F',
    secondary: '#FD7702',
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden" style={{ backgroundColor: colors.primary }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FD7702] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Star size={12} className="fill-current" />
              O App do seu bairro
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white tracking-tight">
              O comércio local <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7702] to-orange-300">
                na sua mão.
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Conectamos <strong>clientes</strong> que buscam interação a <strong>pequenos lojistas</strong> que oferecem qualidade. Tudo isso fortalecido por <strong>comunidades</strong> reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                className="cursor-pointer text-white text-lg font-bold px-10 py-4 rounded-xl transition shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1 transform flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{ backgroundColor: colors.secondary }}
                onClick={() => navigate('/cadastro')}
              >
                Começar agora
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <div className="relative animate-in slide-in-from-right duration-1000 delay-200 hidden lg:block">
            <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-gray-900 rotate-2 hover:rotate-0 transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop"
                alt="Interação em comércio local"
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition"
              />

              <div className="absolute -left-12 bottom-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs animate-bounce-slow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 p-2 rounded-lg text-[#FD7702]">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Nova Comunidade</p>
                    <p className="text-sm font-bold text-gray-900">Ofertas do Centro</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-[#1A225F] text-white flex items-center justify-center text-xs font-bold border-2 border-white">+200</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A225F] mb-4">Um ecossistema de interação.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            O PROCURAÍ vai muito além de comprar e vender. É sobre criar laços e fortalecer o relacionamento entre vizinhos e comerciantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-[#1A225F] transition-colors duration-300">
              <MessageCircle size={28} className="text-[#1A225F] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Clientes Interativos</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Você tem voz! Crie suas próprias comunidades sobre interesses locais e converse diretamente com os lojistas. Tire dúvidas em tempo real e peça produtos específicos.
            </p>
          </div>

          <div className="bg-[#1A225F] p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
              <span className="bg-[#FD7702] text-white text-[10px] font-bold px-3 py-1 rounded-full">CONEXÃO</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Users size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Comunidades Ativas</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              O ponto de encontro entre quem vende e quem compra. Lojistas e clientes juntos em espaços dedicados para trocar experiências, dicas e ofertas exclusivas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-[#FD7702] transition-colors duration-300">
              <Store size={28} className="text-[#FD7702] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pequenos Negócios</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Feito para pequenas e médias empresas locais. Digitalize seu negócio, gerencie seu catálogo e fidelize a vizinhança sem complicações ou taxas abusivas.
            </p>
          </div>

        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

            <div className="flex-1 space-y-6 relative z-10">
              <div className="flex items-center gap-2 text-[#FD7702] font-bold text-sm uppercase tracking-wider">
                <Zap size={18} />
                Comércio Local Forte
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A225F] leading-tight">
                Mais que vendas, <br />
                relacionamentos.
              </h2>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><ShieldCheck size={16} className="text-green-600" /></div>
                  <span className="text-gray-700 font-medium">Interação direta Cliente-Lojista</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><ShieldCheck size={16} className="text-green-600" /></div>
                  <span className="text-gray-700 font-medium">Comunidades criadas por usuários</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><ShieldCheck size={16} className="text-green-600" /></div>
                  <span className="text-gray-700 font-medium">Apoio real ao empreendedorismo local</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 w-full relative">
              <div className="relative z-10 transform rotate-2 hover:rotate-0 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop"
                  alt="Feira local movimentada e vibrante"
                  className="rounded-2xl shadow-2xl border-4 border-white w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-[#1A225F] transform translate-x-4 translate-y-4 rounded-2xl -z-0"></div>
            </div>

          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#1A225F] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 opacity-80">
            <Store size={24} />
            <span className="font-bold text-xl tracking-wide">PROCURAÍ</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2025 PROCURAÍ. Feito com ❤️ para o comércio local.
          </p>

        </div>
      </footer>

    </div>
  );
}