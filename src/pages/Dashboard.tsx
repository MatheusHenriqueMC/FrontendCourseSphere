import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../services/api';
import { Course } from '../types';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = search ? { search } : {};
        const response = await api.get<Course[]>('/courses', { params });
        setCourses(response.data);
      } catch {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [search]);

  const myCourses = courses.filter((c) => c.creator_id === user?.id);
  const exploreCourses = courses.filter((c) => c.creator_id !== user?.id);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <Button onClick={() => navigate('/courses/new')}>+ New Course</Button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <Loading message="Loading courses..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && myCourses.length === 0 && (
          <EmptyState message="No courses yet. Create your first one!" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {!loading && exploreCourses.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-12 mb-6">Explore Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exploreCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}