import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../services/api';
import { Course, Lesson } from '../types';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ChatBot from '../components/ChatBot';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isCreator = course?.creator_id === user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons`),
        ]);
        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
      } catch {
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [id]);

  const handleDeleteCourse = async () => {
    try {
      await api.delete(`/courses/${id}`);
      navigate('/');
    } catch {
      setError('Failed to delete course');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await api.delete(`/courses/${id}/lessons/${lessonId}`);
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch {
      setError('Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Loading message="Loading course..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <EmptyState message="Course not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{course.name}</h2>
            {course.description && (
              <p className="text-gray-600 mt-2">{course.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {course.start_date} → {course.end_date}
            </p>
          </div>

          {isCreator && (
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/courses/${id}/edit`)}>Edit</Button>
              <Button variant="danger" onClick={() => setDeleteConfirm(true)}>Delete</Button>
            </div>
          )}
        </div>

        {deleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 mb-3">Are you sure you want to delete this course? This will also delete all lessons.</p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={handleDeleteCourse}>Yes, delete</Button>
              <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <ErrorMessage message={error} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Lessons</h3>
            {isCreator && (
              <Button onClick={() => navigate(`/courses/${id}/lessons/new`)}>+ New Lesson</Button>
            )}
          </div>

          {lessons.length === 0 && <EmptyState message="No lessons yet. Create your first one!" />}

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{lesson.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      lesson.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {lesson.status}
                  </span>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline ml-3"
                    >
                      Watch video
                    </a>
                  )}
                </div>

                {isCreator && (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteLesson(lesson.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← Back to courses
          </Button>
        </div>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← Back to courses
          </Button>
        </div>
        <ChatBot courseId={Number(id)} />
      </div>
    </div>
  );
}