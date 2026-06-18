import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Music, Clock, MapPin, Filter } from 'lucide-react';

type Apresentacao = {
  id: string;
  titulo: string;
  horario: string;
  local: string;
  categoria: string;
  created_at: string;
};

const categorias = [
  { value: 'todas', label: 'Todas', color: 'bg-stone-200 text-stone-700' },
  { value: 'quadrilha', label: 'Quadrilha', color: 'bg-junina-100 text-junina-700' },
  { value: 'musica', label: 'Música', color: 'bg-blue-100 text-blue-700' },
  { value: 'danca', label: 'Dança', color: 'bg-green-100 text-green-700' },
  { value: 'teatro', label: 'Teatro', color: 'bg-purple-100 text-purple-700' },
];

export default function Programacao() {
  const [apresentacoes, setApresentacoes] = useState<Apresentacao[]>([]);
  const [categoria, setCategoria] = useState('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('apresentacoes').select('*').order('horario');
      if (categoria !== 'todas') {
        query = query.eq('categoria', categoria);
      }
      const { data } = await query;
      if (data) setApresentacoes(data);
      setLoading(false);
    };
    fetch();
  }, [categoria]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="section-container">
        <div className="text-center mb-12">
          <h1 className="page-title flex items-center justify-center gap-3">
            <Music className="w-10 h-10" />
            Programação
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Confira todos os horários e locais das apresentações da Festa Junina!
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-stone-500 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtrar por:</span>
          </div>
          {categorias.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoria(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoria === cat.value
                  ? `${cat.color} ring-2 ring-offset-2 ring-current`
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-junina-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-12 text-stone-500">Carregando...</div>
        ) : apresentacoes.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <p>Nenhuma apresentação encontrada para esta categoria.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {apresentacoes.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl p-6 shadow-md border border-stone-100 card-hover flex items-start gap-4 animate-slide-up"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-junina-100 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-junina-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      categorias.find(c => c.value === a.categoria)?.color || 'bg-stone-100 text-stone-600'
                    }`}>
                      {a.categoria}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-stone-800">{a.titulo}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{a.horario}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{a.local}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
