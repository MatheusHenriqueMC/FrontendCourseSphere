import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useTheme } from '../contexts/useTheme';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { errors?: string[]; error?: string } } };
        const message = axiosError.response?.data?.errors?.[0] || axiosError.response?.data?.error || 'Falha no registro';
        setError(message);
      } else {
        setError('Falha no registro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        src={isDark ? '/login-bg-dark.gif' : '/login-bg-light.gif'}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-black/30" />

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 p-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
      >
        {isDark ? (
          <img src="/sun-icon.png" alt="Light mode" className="w-8 h-8" />
        ) : (
          <img src="/moon-icon.png" alt="Dark mode" className="w-8 h-8" />
        )}
      </button>

      <div className="relative z-10 bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-md">
        <h1 className="font-pixel text-lg text-primary text-center mb-6">CourseSphere</h1>
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Registrar</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
              placeholder="Seu nome"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
              placeholder="Mín. 6 caracteres"
            />
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover">Login</Link>
        </p>
      </div>
    </div>
  );
}