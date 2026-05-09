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
import CourseHeroBanner from '../components/CourseHeroBanner';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  const isCreator = course?.creator_id === user?.id;

  const filteredLessons = statusFilter === 'all'
    ? lessons
    : lessons.filter((l) => l.status === statusFilter);

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
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />
      <CourseHeroBanner course={course} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isCreator && (
          <div className="flex gap-2 mb-6">
            <Button onClick={() => navigate(`/courses/${id}/edit`)}>Edit Course</Button>
            <Button variant="danger" onClick={() => setDeleteConfirm(true)}>Delete Course</Button>
          </div>
        )}

        {deleteConfirm && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-danger mb-3">Are you sure you want to delete this course? This will also delete all lessons.</p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={handleDeleteCourse}>Yes, delete</Button>
              <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <ErrorMessage message={error} />

        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-pixel text-xs text-light-text dark:text-dark-text">Lessons</h3>
            <div className="flex gap-3 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
                className="px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {isCreator && (
                <Button onClick={() => navigate(`/courses/${id}/lessons/new`)}>+ New Lesson</Button>
              )}
            </div>
          </div>

          {filteredLessons.length === 0 && (
            <EmptyState message={statusFilter === 'all' ? 'No lessons yet. Create your first one!' : `No ${statusFilter} lessons found.`} />
          )}

          <div className="space-y-3">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-light-border dark:border-dark-border p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold text-light-text dark:text-dark-text">{lesson.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      lesson.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}
                  >
                    {lesson.status}
                  </span>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-hover ml-3"
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

        <ChatBot courseId={Number(id)} />
      </div>
    </div>
  );
}