import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../services/api';
import { Course } from '../types';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Course[]>('/courses');
        setCourses(response.data);
      } catch {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">CourseSphere</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <button
            onClick={() => navigate('/courses/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + New Course
          </button>
        </div>

        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No courses yet. Create your first one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
              <p className="text-sm text-gray-500">
                {course.start_date} → {course.end_date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}