import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function LessonForm() {
  const { id: courseId, lessonId } = useParams();
  const isEditing = Boolean(lessonId);

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('draft');
  const [videoUrl, setVideoUrl] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sections, setSections] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchLesson = async () => {
        try {
          const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
          const lesson = response.data;
          setTitle(lesson.title);
          setStatus(lesson.status);
          setVideoUrl(lesson.video_url || '');
          setSectionId(lesson.section_id ? String(lesson.section_id) : '');
        } catch {
          setError('Failed to load lesson');
        } finally {
          setPageLoading(false);
        }
      };

      fetchLesson();
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [courseId, lessonId, isEditing]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/sections`);
        setSections(response.data);
      } catch {
        // sections are optional
      }
    };

    fetchSections();
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Title is required');
      return;
    }

    if (title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      const payload = { title, status, video_url: videoUrl || null, section_id: sectionId ? Number(sectionId) : null };

      if (isEditing) {
        await api.put(`/courses/${courseId}/lessons/${lessonId}`, payload);
      } else {
        await api.post(`/courses/${courseId}/lessons`, payload);
      }

      navigate(`/courses/${courseId}`);
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { errors?: string[] } } };
        const message = axiosError.response?.data?.errors?.[0] || 'Failed to save lesson';
        setError(message);
      } else {
        setError('Failed to save lesson');
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <Navbar />
        <Loading message="Carregando lição..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="font-pixel text-sm text-light-text dark:text-dark-text mb-6">
          {isEditing ? 'Editar Lição' : 'Nova Lição'}
        </h2>

        <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6">
          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Título"
              value={title}
              onChange={setTitle}
              placeholder="Min. 3 characteres"
            />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicada</option>
              </select>
            </div>

            <FormInput
              label="Video URL"
              value={videoUrl}
              onChange={setVideoUrl}
              placeholder="https://example.com/video (optional)"
            />

            {sections.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-1">Section</label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione uma seção (opcional)</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : isEditing ? 'Atualizar Lição' : 'Criar Lição'}
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/courses/${courseId}`)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}