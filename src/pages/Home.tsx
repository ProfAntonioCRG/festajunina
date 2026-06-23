import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Countdown from '../components/Countdown';
import { Flame, Music, Store, Calendar, Users, ChevronRight, Send, CheckCircle } from 'lucide-react';

type Quadrilha = { id: string; nome: string; quadrilha: string; aprovada: boolean };
type Barraca = { id: string; nome: string; descricao: string; imagem: string | null };
type Apresentacao = { id: string; titulo: string; horario: string; local: string; categoria: string };

export default function Home() {
  const [quadrilhas, setQuadrilhas] = useState<Quadrilha[]>([]);
  const [barracas, setBarracas] = useState<Barraca[]>([]);
  const [apresentacoes, setApresentacoes] = useState<Apresentacao[]>([]);
  const [formData, setFormData] = useState({ nome: '', telefone: '', quadrilha: '', participantes: '' });
  const [formMsg, setFormMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [q, b, a] = await Promise.all([
        supabase.from('quadrilhas').select('id, nome, quadrilha, aprovada').eq('aprovada', true),
        supabase.from('barracas').select('id, nome, descricao, imagem').limit(3),
        supabase.from('apresentacoes').select('id, titulo, horario, local, categoria').limit(4),
      ]);
      if (q.data) setQuadrilhas(q.data);
      if (b.data) setBarracas(b.data);
      if (a.data) setApresentacoes(a.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from('quadrilhas').insert({
      nome: formData.nome,
      telefone: formData.telefone,
      quadrilha: formData.quadrilha,
      participantes: formData.participantes,
      aprovada: false,
    });
    setSending(false);
    if (error) {
      setFormMsg('Erro ao enviar. Tente novamente.');
    } else {
      setFormMsg('Cadastro enviado com sucesso! Aguarde aprovação.');
      setFormData({ nome: '', telefone: '', quadrilha: '', participantes: '' });
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-junina-600 via-junina-500 to-junina-700">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("https://images.pexels.com/photos/9211779/pexels-photo-9211779.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <Flame className="w-16 h-16 text-junina-200 animate-pulse-slow" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-display mb-4">
              Festa Junina Escolar
            </h1>
            <p className="text-xl md:text-2xl text-junina-100 mb-8">
              Venha celebrar as tradições juninas com alegria, comida e dança!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/programacao" className="btn-primary text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Ver Programação
              </Link>
              <Link to="/barracas" className="btn-secondary text-lg flex items-center gap-2">
                <Store className="w-5 h-5" />
                Explorar Barracas
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      {/* Countdown */}
      <section className="section-container -mt-12 relative z-10">
        <Countdown />
      </section>

      {/* Programação */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="page-title text-center flex items-center justify-center gap-2">
            <Music className="w-8 h-8" />
            Programação
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">Confira os horários e locais das apresentações da nossa festa!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apresentacoes.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-6 shadow-md card-hover border border-stone-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full bg-junina-100 text-junina-700 text-xs font-semibold uppercase">
                  {a.categoria}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-stone-800 mb-1">{a.titulo}</h3>
              <p className="text-sm text-stone-500 mb-1">{a.horario}</p>
              <p className="text-sm text-stone-400">{a.local}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/programacao" className="inline-flex items-center gap-2 text-junina-600 hover:text-junina-700 font-medium">
            Ver programação completa <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Barracas */}
      <section className="bg-junina-50 py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="page-title text-center flex items-center justify-center gap-2">
              <Store className="w-8 h-8" />
              Barracas
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Delícias típicas e muita diversão em nossas barracas!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {barracas.map((b) => (
              <div key={b.id} className="bg-white rounded-xl overflow-hidden shadow-md card-hover">
                <div className="h-48 bg-stone-200 overflow-hidden">
                  <img src={b.imagem || 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg'} alt={b.nome} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-stone-800 mb-2">{b.nome}</h3>
                  <p className="text-sm text-stone-500">{b.descricao}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/barracas" className="inline-flex items-center gap-2 text-junina-600 hover:text-junina-700 font-medium">
              Ver todas as barracas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Apresentações - Quadrilhas */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="page-title text-center flex items-center justify-center gap-2">
            <Users className="w-8 h-8" />
            Apresentações - Quadrilhas
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">Equipes inscritas e aprovadas para as apresentações!</p>
        </div>
        {quadrilhas.length === 0 ? (
          <div className="text-center text-stone-500 py-8">
            <p>Nenhuma quadrilha aprovada ainda. Seja o primeiro a se inscrever!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadrilhas.map((q) => (
              <div key={q.id} className="bg-white rounded-xl p-6 shadow-md card-hover border border-stone-100">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Aprovada</span>
                </div>
                <h3 className="font-semibold text-lg text-stone-800">{q.quadrilha}</h3>
                <p className="text-sm text-stone-500">Responsável: {q.nome}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Formulário de Cadastro de Quadrilhas */}
      <section className="bg-stone-900 py-16">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white font-display mb-2">Inscreva sua Quadrilha</h2>
              <p className="text-stone-400">Preencha o formulário para participar das apresentações. Inclua 1 responsável + 11 participantes.</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-stone-800 rounded-xl p-6 md:p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Nome do Responsável</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="input-field bg-stone-700 border-stone-600 text-white placeholder-stone-500"
                  placeholder="Nome completo do responsável"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="input-field bg-stone-700 border-stone-600 text-white placeholder-stone-500"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Nome da Quadrilha</label>
                <input
                  type="text"
                  value={formData.quadrilha}
                  onChange={(e) => setFormData({ ...formData, quadrilha: e.target.value })}
                  className="input-field bg-stone-700 border-stone-600 text-white placeholder-stone-500"
                  placeholder="Nome da equipe/quadrilha"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Participantes (1 responsável + 11 participantes)</label>
                <textarea
                  value={formData.participantes}
                  onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
                  className="input-field bg-stone-700 border-stone-600 text-white placeholder-stone-500 min-h-[120px]"
                  placeholder="Liste os nomes dos participantes, separados por vírgula ou linha"
                  required
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                <Send className="w-4 h-4" />
                {sending ? 'Enviando...' : 'Enviar Inscrição'}
              </button>
              {formMsg && (
                <div className={`text-center text-sm py-2 px-4 rounded-lg ${formMsg.includes('sucesso') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {formMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
