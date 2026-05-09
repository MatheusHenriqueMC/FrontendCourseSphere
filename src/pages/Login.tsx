import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        const message = axiosError.response?.data?.error || 'Login failed';
        setError(message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="bg-light-card dark:bg-dark-card p-8 rounded-xl shadow-md border border-light-border dark:border-dark-border w-full max-w-md">
        <h1 className="font-pixel text-lg text-primary text-center mb-6">CourseSphere</h1>
        <h2 className="text-xl font-bold text-center mb-6 text-light-text dark:text-dark-text">Login</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <FormInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <FormInput label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover">Register</Link>
        </p>
      </div>
    </div>
  );
}