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
      const payload = { title, status, video_url: videoUrl || null };

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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Loading message="Loading lesson..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Lesson' : 'New Lesson'}
        </h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="Min. 3 characters"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <FormInput
              label="Video URL"
              value={videoUrl}
              onChange={setVideoUrl}
              placeholder="https://example.com/video (optional)"
            />

            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Lesson' : 'Create Lesson'}
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/courses/${courseId}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}