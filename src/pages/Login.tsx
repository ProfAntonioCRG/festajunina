import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Flame, AlertCircle } from 'lucide-react';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    const result = isRegister
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 pt-20">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Flame className="w-12 h-12 text-junina-600" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 font-display">
              {isRegister ? 'Criar Conta' : 'Painel Administrativo'}
            </h1>
            <p className="text-stone-500 mt-2">
              {isRegister ? 'Cadastre-se para gerenciar a festa' : 'Faça login para acessar o painel'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isRegister ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {loading ? 'Entrando...' : 'Entrar'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-junina-600 hover:text-junina-700 font-medium"
            >
              {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
