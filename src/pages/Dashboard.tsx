import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../services/api';
import { Course } from '../types';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CourseCard from '../components/CourseCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

const COURSES_PER_PAGE = 6;

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createdPage, setCreatedPage] = useState(1);
  const [enrolledPage, setEnrolledPage] = useState(1);
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
     
  }, []);

  const myCreatedCourses = courses.filter((c) => c.creator_id === user?.id);
  const myEnrolledCourses = courses.filter((c) => c.creator_id !== user?.id && c.is_enrolled);
  const exploreCourses = courses.filter((c) => c.creator_id !== user?.id && !c.is_enrolled);

  const createdTotalPages = Math.ceil(myCreatedCourses.length / COURSES_PER_PAGE);
  const enrolledTotalPages = Math.ceil(myEnrolledCourses.length / COURSES_PER_PAGE);
  const exploreTotalPages = Math.ceil(exploreCourses.length / COURSES_PER_PAGE);

  const paginatedCreatedCourses = myCreatedCourses.slice(
    (createdPage - 1) * COURSES_PER_PAGE,
    createdPage * COURSES_PER_PAGE
  );

  const paginatedEnrolledCourses = myEnrolledCourses.slice(
    (enrolledPage - 1) * COURSES_PER_PAGE,
    enrolledPage * COURSES_PER_PAGE
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
          Anterior
        </button>
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-border dark:hover:bg-dark-border transition"
        >
          Próxima
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />
      <HeroBanner />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading && <Loading message="Carregando cursos..." />}
        {error && <ErrorMessage message={error} />}

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-pixel text-sm text-light-text dark:text-dark-text">Meus Cursos Criados</h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Volte a editar ou adicionar novas aulas nos seus cursos criados!
            </p>
          </div>
          <Button onClick={() => navigate('/courses/new')}>Novo Curso</Button>
        </div>

        {!loading && myCreatedCourses.length === 0 && (
          <EmptyState message="Você ainda não criou nenhum curso. Crie o primeiro!" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCreatedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {renderPagination(createdPage, createdTotalPages, setCreatedPage)}

        {!loading && (
          <>
            <div className="mt-12 mb-6">
              <h2 className="font-pixel text-sm text-light-text dark:text-dark-text">Meus Cursos Inscritos</h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                Volte a estudar nos seus cursos inscritos favoritos agora!
              </p>
            </div>

            {myEnrolledCourses.length === 0 ? (
              <EmptyState message="Você ainda não se inscreveu em nenhum curso. Explore os cursos abaixo!" />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedEnrolledCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                {renderPagination(enrolledPage, enrolledTotalPages, setEnrolledPage)}
              </>
            )}
          </>
        )}

        {!loading && exploreCourses.length > 0 && (
          <>
            <div className="mt-12 mb-6">
              <h2 className="font-pixel text-sm text-light-text dark:text-dark-text">Explorar Cursos</h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                Visualize aqui todos os cursos disponíveis para você!
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