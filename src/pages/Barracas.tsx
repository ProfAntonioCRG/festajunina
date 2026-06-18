import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Store, ShoppingBag, User, DollarSign } from 'lucide-react';

type Barraca = {
  id: string;
  nome: string;
  descricao: string;
  responsavel: string;
  imagem: string | null;
  created_at: string;
};

type Produto = {
  id: string;
  nome: string;
  preco: number;
  barraca_id: string;
  created_at: string;
};

export default function Barracas() {
  const [barracas, setBarracas] = useState<Barraca[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [b, p] = await Promise.all([
        supabase.from('barracas').select('*'),
        supabase.from('produtos').select('*'),
      ]);
      if (b.data) setBarracas(b.data);
      if (p.data) setProdutos(p.data);
      setLoading(false);
    };
    fetch();
  }, []);

  const getProdutosByBarraca = (barracaId: string) =>
    produtos.filter((p) => p.barraca_id === barracaId);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="section-container">
        <div className="text-center mb-12">
          <h1 className="page-title flex items-center justify-center gap-3">
            <Store className="w-10 h-10" />
            Barracas
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Conheça as barracas da festa e o que cada uma oferece!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-500">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barracas.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 card-hover animate-slide-up"
              >
                <div className="h-56 bg-stone-200 overflow-hidden">
                  <img
                    src={b.imagem || 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg'}
                    alt={b.nome}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-5 h-5 text-junina-600" />
                    <h3 className="font-semibold text-xl text-stone-800">{b.nome}</h3>
                  </div>
                  <p className="text-stone-500 mb-4">{b.descricao}</p>
                  <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                    <User className="w-4 h-4" />
                    <span>Responsável: {b.responsavel}</span>
                  </div>

                  {/* Produtos */}
                  <div className="border-t border-stone-100 pt-4">
                    <h4 className="text-sm font-semibold text-stone-700 mb-3">Produtos</h4>
                    <div className="space-y-2">
                      {getProdutosByBarraca(b.id).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-lg"
                        >
                          <span className="text-sm text-stone-700">{p.nome}</span>
                          <div className="flex items-center gap-1 text-junina-600 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-sm">{p.preco.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                      {getProdutosByBarraca(b.id).length === 0 && (
                        <p className="text-sm text-stone-400 italic">Nenhum produto cadastrado</p>
                      )}
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
