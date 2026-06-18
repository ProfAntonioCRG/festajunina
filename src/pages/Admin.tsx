import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard, Store, ShoppingBag, Music, Users, Settings, CheckCircle, XCircle,
  Plus, Pencil, Trash2, Save, X, AlertCircle, Flame, Loader2
} from 'lucide-react';

type Tab = 'dashboard' | 'barracas' | 'produtos' | 'apresentacoes' | 'voluntarios' | 'quadrilhas' | 'configuracoes';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [counts, setCounts] = useState({ barracas: 0, produtos: 0, apresentacoes: 0, voluntarios: 0, quadrilhas: 0 });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [barracasList, setBarracasList] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchDashboard();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (activeTab !== 'dashboard') fetchData();
    if (activeTab === 'produtos') fetchBarracasList();
  }, [activeTab, user]);

  const fetchDashboard = async () => {
    const [b, p, a, v, q] = await Promise.all([
      supabase.from('barracas').select('id', { count: 'exact', head: true }),
      supabase.from('produtos').select('id', { count: 'exact', head: true }),
      supabase.from('apresentacoes').select('id', { count: 'exact', head: true }),
      supabase.from('voluntarios').select('id', { count: 'exact', head: true }),
      supabase.from('quadrilhas').select('id', { count: 'exact', head: true }),
    ]);
    setCounts({
      barracas: b.count ?? 0,
      produtos: p.count ?? 0,
      apresentacoes: a.count ?? 0,
      voluntarios: v.count ?? 0,
      quadrilhas: q.count ?? 0,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: d } = await supabase.from(activeTab).select('*').order('created_at', { ascending: false });
    if (d) setData(d);
    setLoading(false);
  };

  const fetchBarracasList = async () => {
    const { data } = await supabase.from('barracas').select('id, nome');
    if (data) setBarracasList(data);
  };

  const handleSave = async () => {
    setLoading(true);
    if (editing) {
      await supabase.from(activeTab).update(formData).eq('id', editing);
    } else {
      await supabase.from(activeTab).insert(formData);
    }
    setShowForm(false);
    setEditing(null);
    setFormData({});
    setMessage(editing ? 'Atualizado com sucesso!' : 'Criado com sucesso!');
    setTimeout(() => setMessage(''), 3000);
    await fetchData();
    if (activeTab !== 'dashboard') await fetchDashboard();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    setLoading(true);
    await supabase.from(activeTab).delete().eq('id', id);
    await fetchData();
    await fetchDashboard();
    setLoading(false);
  };

  const handleApprove = async (id: string, aprovada: boolean) => {
    setLoading(true);
    await supabase.from('quadrilhas').update({ aprovada }).eq('id', id);
    await fetchData();
    setLoading(false);
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'barracas' as Tab, label: 'Barracas', icon: Store },
    { id: 'produtos' as Tab, label: 'Produtos', icon: ShoppingBag },
    { id: 'apresentacoes' as Tab, label: 'Apresentações', icon: Music },
    { id: 'voluntarios' as Tab, label: 'Voluntários', icon: Users },
    { id: 'quadrilhas' as Tab, label: 'Quadrilhas', icon: Flame },
    { id: 'configuracoes' as Tab, label: 'Configurações', icon: Settings },
  ];

  const getColumns = () => {
    switch (activeTab) {
      case 'barracas': return ['nome', 'descricao', 'responsavel', 'imagem'];
      case 'produtos': return ['nome', 'preco', 'barraca_id'];
      case 'apresentacoes': return ['titulo', 'horario', 'local', 'categoria'];
      case 'voluntarios': return ['nome', 'telefone', 'funcao'];
      case 'quadrilhas': return ['nome', 'telefone', 'quadrilha', 'participantes', 'aprovada'];
      case 'configuracoes': return ['chave', 'valor'];
      default: return [];
    }
  };

  const getColumnLabel = (col: string) => {
    const labels: Record<string, string> = {
      nome: 'Nome', descricao: 'Descrição', responsavel: 'Responsável', imagem: 'Imagem URL',
      preco: 'Preço', barraca_id: 'Barraca', titulo: 'Título', horario: 'Horário',
      local: 'Local', categoria: 'Categoria', telefone: 'Telefone', funcao: 'Função',
      quadrilha: 'Quadrilha', participantes: 'Participantes', aprovada: 'Aprovada',
      chave: 'Chave', valor: 'Valor',
    };
    return labels[col] || col;
  };

  const getInputType = (col: string) => {
    if (col === 'preco') return 'number';
    if (col === 'imagem') return 'url';
    if (col === 'aprovada') return 'checkbox';
    return 'text';
  };

  const DashboardCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
    <div className={`bg-white rounded-xl p-6 shadow-md border-l-4 ${color} card-hover`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-stone-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color.replace('border-', 'bg-').replace('500', '100')} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color.replace('border-', 'text-').replace('500', '600')}`} />
        </div>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-junina-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-6 px-2">
                <Settings className="w-5 h-5 text-junina-600" />
                <h2 className="font-semibold text-stone-800">Painel Admin</h2>
              </div>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-junina-50 text-junina-700'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {message && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                {message}
              </div>
            )}

            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-bold text-stone-800 mb-6">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DashboardCard label="Barracas" value={counts.barracas} icon={Store} color="border-junina-500" />
                  <DashboardCard label="Produtos" value={counts.produtos} icon={ShoppingBag} color="border-blue-500" />
                  <DashboardCard label="Apresentações" value={counts.apresentacoes} icon={Music} color="border-green-500" />
                  <DashboardCard label="Voluntários" value={counts.voluntarios} icon={Users} color="border-purple-500" />
                  <DashboardCard label="Quadrilhas" value={counts.quadrilhas} icon={Flame} color="border-red-500" />
                </div>
              </div>
            )}

            {/* Data Tables */}
            {activeTab !== 'dashboard' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-stone-800">{tabs.find(t => t.id === activeTab)?.label}</h1>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditing(null);
                      setFormData({});
                    }}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>

                {/* Form */}
                {showForm && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-stone-200">
                    <h3 className="font-semibold text-lg text-stone-800 mb-4">
                      {editing ? 'Editar' : 'Novo'} {tabs.find(t => t.id === activeTab)?.label}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getColumns().map((col) => (
                        <div key={col}>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            {getColumnLabel(col)}
                          </label>
                          {col === 'barraca_id' ? (
                            <select
                              value={formData[col] || ''}
                              onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                              className="input-field"
                              required
                            >
                              <option value="">Selecione uma barraca</option>
                              {barracasList.map((b) => (
                                <option key={b.id} value={b.id}>{b.nome}</option>
                              ))}
                            </select>
                          ) : col === 'aprovada' ? (
                            <select
                              value={formData[col] ?? 'false'}
                              onChange={(e) => setFormData({ ...formData, [col]: e.target.value === 'true' })}
                              className="input-field"
                            >
                              <option value="false">Pendente</option>
                              <option value="true">Aprovada</option>
                            </select>
                          ) : (
                            <input
                              type={getInputType(col)}
                              value={formData[col] || ''}
                              onChange={(e) => setFormData({ ...formData, [col]: col === 'preco' ? parseFloat(e.target.value) : e.target.value })}
                              className="input-field"
                              placeholder={getColumnLabel(col)}
                              required={col !== 'imagem'}
                              step={col === 'preco' ? '0.01' : undefined}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
                        <Save className="w-4 h-4" />
                        {loading ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button onClick={() => { setShowForm(false); setEditing(null); setFormData({}); }} className="btn-secondary flex items-center gap-2 text-sm">
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Table */}
                {loading ? (
                  <div className="text-center py-12 text-stone-500">Carregando...</div>
                ) : data.length === 0 ? (
                  <div className="text-center py-12 text-stone-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                    <p>Nenhum registro encontrado.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                          <tr>
                            {getColumns().map((col) => (
                              <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                                {getColumnLabel(col)}
                              </th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {data.map((row) => (
                            <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                              {getColumns().map((col) => (
                                <td key={col} className="px-4 py-3 text-sm text-stone-700">
                                  {col === 'aprovada' ? (
                                    <div className="flex items-center gap-2">
                                      {row[col] ? (
                                        <span className="flex items-center gap-1 text-green-600">
                                          <CheckCircle className="w-4 h-4" /> Aprovada
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-amber-600">
                                          <AlertCircle className="w-4 h-4" /> Pendente
                                        </span>
                                      )}
                                    </div>
                                  ) : col === 'preco' ? (
                                    `R$ ${row[col]?.toFixed(2)}`
                                  ) : col === 'barraca_id' ? (
                                    barracasList.find((b) => b.id === row[col])?.nome || row[col]
                                  ) : (
                                    row[col]
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {activeTab === 'quadrilhas' && (
                                    <button
                                      onClick={() => handleApprove(row.id, !row.aprovada)}
                                      className={`p-2 rounded-lg transition-colors ${row.aprovada ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                                      title={row.aprovada ? 'Reprovar' : 'Aprovar'}
                                    >
                                      {row.aprovada ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditing(row.id);
                                      setFormData(row);
                                      setShowForm(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(row.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
