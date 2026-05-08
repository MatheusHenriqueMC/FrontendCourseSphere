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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Loading message="Loading course..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Course' : 'New Course'}
        </h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Course Name"
              value={name}
              onChange={setName}
              placeholder="Min. 3 characters"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description"
                rows={4}
              />
            </div>

            <FormInput
              label="Start Date"
              type="date"
              value={startDate}
              onChange={setStartDate}
            />

            <FormInput
              label="End Date"
              type="date"
              value={endDate}
              onChange={setEndDate}
            />
            
            <FormInput
              label="Image URL"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://example.com/image.jpg (optional)"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level (optional)</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
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