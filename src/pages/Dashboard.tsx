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
import HeroBanner from '../components/HeroBanner';

const COURSES_PER_PAGE = 6;

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myPage, setMyPage] = useState(1);
  const [explorePage, setExplorePage] = useState(1);

  const { user } = useAuth();
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

  const myCourses = courses.filter((c) => c.creator_id === user?.id);
  const exploreCourses = courses.filter((c) => c.creator_id !== user?.id);

  const myTotalPages = Math.ceil(myCourses.length / COURSES_PER_PAGE);
  const exploreTotalPages = Math.ceil(exploreCourses.length / COURSES_PER_PAGE);

  const paginatedMyCourses = myCourses.slice(
    (myPage - 1) * COURSES_PER_PAGE,
    myPage * COURSES_PER_PAGE
  );

  const paginatedExploreCourses = exploreCourses.slice(
    (explorePage - 1) * COURSES_PER_PAGE,
    explorePage * COURSES_PER_PAGE
  );

  const renderPagination = (currentPage: number, totalPages: number, setPage: (page: number) => void) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-border dark:hover:bg-dark-border transition"
        >
          Previous
        </button>
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-border dark:hover:bg-dark-border transition"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />
      <HeroBanner />

      <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-pixel text-sm text-light-text dark:text-dark-text">Meus Cursos</h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Aqui você irá visualizar seus últimos cursos iniciados, volte a estudar!
            </p>
          </div>
          <Button onClick={() => navigate('/courses/new')}>+ New Course</Button>
        </div>

        {loading && <Loading message="Loading courses..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && myCourses.length === 0 && (
          <EmptyState message="No courses yet. Create your first one!" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedMyCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {renderPagination(myPage, myTotalPages, setMyPage)}

        {!loading && exploreCourses.length > 0 && (
          <>
            <div className="mt-12 mb-6">
              <h2 className="font-pixel text-sm text-light-text dark:text-dark-text">Explore todos os cursos</h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                Visualize aqui todos os cursos disponíveis para você estudar e aprender cada vez mais!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedExploreCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {renderPagination(explorePage, exploreTotalPages, setExplorePage)}
          </>
        )}
      </div>
    </div>
  );
}