import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Course } from '../types';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = search ? { search } : {};
        const response = await api.get<Course[]>('/courses', { params });
        setCourses(response.data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [search, isOpen]);

  const displayedCourses = search ? courses : courses.slice(0, 3);

  const handleCourseClick = (courseId: number) => {
    onClose();
    navigate(`/courses/${courseId}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-96 bg-light-card dark:bg-dark-card border-l border-light-border dark:border-dark-border shadow-2xl z-50 flex flex-col">
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, users, and more..."
              className="flex-1 bg-transparent text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary focus:outline-none text-sm"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-4">
            {search ? 'Search Results' : 'Popular Courses'}
          </h3>

          {loading && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Loading...</p>
          )}

          {!loading && displayedCourses.length === 0 && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">No courses found.</p>
          )}

          <div className="space-y-3">
            {displayedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-light-bg dark:hover:bg-dark-bg transition"
              >
                <img
                  src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'}
                  alt={course.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-light-text dark:text-dark-text">{course.name}</h4>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                    {course.description || 'No description'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}