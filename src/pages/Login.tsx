import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useTheme } from '../contexts/useTheme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        const message = axiosError.response?.data?.error || 'Falha no login';
        setError(message);
      } else {
        setError('Falha no login');
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
        className="absolute top-6 right-6 z-20 p-2 rounded-lg hover:bg-white/20 transition"
      >
        {isDark ? (
          <img src="/sun-icon.png" alt="Light mode" className="w-8 h-8" />
        ) : (
          <img src="/moon-icon.png" alt="Dark mode" className="w-8 h-8" />
        )}
      </button>

      <div className="relative z-10 bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-md">
        <h1 className="font-pixel text-lg text-primary text-center mb-6">CourseSphere</h1>
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
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
              placeholder="Sua senha"
            />
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Logando...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Não possui uma conta?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover">Registre-se</Link>
        </p>
      </div>
    </div>
  );
}