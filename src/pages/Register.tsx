import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { errors?: string[]; error?: string } } };
        const message = axiosError.response?.data?.errors?.[0] || axiosError.response?.data?.error || 'Registration failed';
        setError(message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="bg-light-card dark:bg-dark-card p-8 rounded-xl shadow-md border border-light-border dark:border-dark-border w-full max-w-md">
        <h1 className="font-pixel text-lg text-primary text-center mb-6">CourseSphere</h1>
        <h2 className="text-xl font-bold text-center mb-6 text-light-text dark:text-dark-text">Register</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <FormInput label="Name" value={name} onChange={setName} placeholder="Your name" />
          <FormInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <FormInput label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary mt-4">
          Already have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover">Login</Link>
        </p>
      </div>
    </div>
  );
}