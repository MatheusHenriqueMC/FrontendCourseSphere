import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function CourseForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [imageUrl, setImageUrl] = useState('');
  const [level, setLevel] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          const response = await api.get(`/courses/${id}`);
          const course = response.data;
          setName(course.name);
          setDescription(course.description || '');
          setStartDate(course.start_date);
          setEndDate(course.end_date);
          setImageUrl(course.image_url || '');
          setLevel(course.level || '');
        } catch {
          setError('Failed to load course');
        } finally {
          setPageLoading(false);
        }
      };

      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !startDate || !endDate) {
      setError('Name, start date and end date are required');
      return;
    }

    if (name.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    if (endDate < startDate) {
      setError('End date must be equal to or after start date');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        image_url: imageUrl || null,
        level: level || null,
      };

      if (isEditing) {
        await api.put(`/courses/${id}`, payload);
      } else {
        await api.post('/courses', payload);
      }

      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { errors?: string[] } } };
        const message = axiosError.response?.data?.errors?.[0] || 'Failed to save course';
        setError(message);
      } else {
        setError('Failed to save course');
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <Navbar />
        <Loading message="Loading course..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="font-pixel text-sm text-light-text dark:text-dark-text mb-6">
          {isEditing ? 'Edit Course' : 'Novo Curso'}
        </h2>

        <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6">
          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome do Curso"
              value={name}
              onChange={setName}
              placeholder="Min. 3 caracteres"
            />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-1">Descricao</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Descricao do curso"
                rows={4}
              />
            </div>

            <FormInput
              label="Data Inicial"
              type="date"
              value={startDate}
              onChange={setStartDate}
            />

            <FormInput
              label="Data Final"
              type="date"
              value={endDate}
              onChange={setEndDate}
            />

            <FormInput
              label="URL da Imagem"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://example.com/image.jpg"
            />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione o Level (opcional)</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediario</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}