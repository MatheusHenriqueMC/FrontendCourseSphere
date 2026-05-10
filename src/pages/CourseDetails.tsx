import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../services/api';
import { Course, Lesson, Section } from '../types';
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
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [newSectionName, setNewSectionName] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);

  const isCreator = course?.creator_id === user?.id;

  const visibleLessons = isCreator
    ? lessons
    : lessons.filter((l) => l.status === 'published');

  const filteredLessons = statusFilter === 'all'
    ? visibleLessons
    : visibleLessons.filter((l) => l.status === statusFilter);

  const unassignedLessons = filteredLessons.filter((l) => !l.section_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes, sectionsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons`),
          api.get(`/courses/${id}/sections`),
        ]);
        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
        setSections(sectionsRes.data);
      } catch {
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await api.post(`/courses/${id}/enroll`);
      setCourse((prev) => prev ? { ...prev, is_enrolled: true, enrollment_count: response.data.enrollment_count } : prev);
    } catch {
      setError('Failed to enroll');
    }
  };

  const handleUnenroll = async () => {
    try {
      const response = await api.delete(`/courses/${id}/unenroll`);
      setCourse((prev) => prev ? { ...prev, is_enrolled: false, enrollment_count: response.data.enrollment_count } : prev);
    } catch {
      setError('Failed to unenroll');
    }
  };

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

  const handleCreateSection = async () => {
    if (!newSectionName || newSectionName.length < 3) {
      setError('Section name must be at least 3 characters');
      return;
    }

    try {
      const response = await api.post(`/courses/${id}/sections`, { name: newSectionName });
      setSections([...sections, response.data]);
      setNewSectionName('');
      setShowNewSection(false);
    } catch {
      setError('Failed to create section');
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    try {
      await api.delete(`/courses/${id}/sections/${sectionId}`);
      setSections(sections.filter((s) => s.id !== sectionId));
    } catch {
      setError('Failed to delete section');
    }
  };

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <Navbar />
        <Loading message="Carregando curso..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <Navbar />
        <EmptyState message="Curso não encontrado" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />
      <CourseHeroBanner
        course={course}
        onEnroll={handleEnroll}
        onUnenroll={handleUnenroll}
        isCreator={isCreator}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isCreator && (
          <div className="flex gap-2 mb-6">
            <Button onClick={() => navigate(`/courses/${id}/edit`)}>Editar Curso</Button>
            <Button variant="danger" onClick={() => setDeleteConfirm(true)}>Excluir Curso</Button>
          </div>
        )}

        {deleteConfirm && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-danger mb-3">Tem certeza que deseja excluir este curso? Isso também excluirá todas as seções e lições.</p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={handleDeleteCourse}>Sim, excluir</Button>
              <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        <ErrorMessage message={error} />

        {/* Sections */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-pixel text-xs text-light-text dark:text-dark-text">Seções & Lições</h3>
            <div className="flex gap-3 items-center">
              {isCreator && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
                  className="px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas</option>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicada</option>
                </select>
              )}
              {isCreator && (
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewSection(true)}>+ Secao</Button>
                  <Button onClick={() => navigate(`/courses/${id}/lessons/new`)}>+ Lição</Button>
                </div>
              )}
            </div>
          </div>

          {/* New Section Form */}
          {showNewSection && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 mb-4 flex gap-3">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Section name (min. 3 characters)"
                className="flex-1 px-3 py-2 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleCreateSection}>Criar</Button>
              <Button variant="secondary" onClick={() => { setShowNewSection(false); setNewSectionName(''); }}>Cancelar</Button>
            </div>
          )}

          {/* Sections with accordion */}
          {sections.length > 0 && (
            <div className="space-y-3 mb-6">
              {sections.map((section, index) => {
                const sectionLessons = filteredLessons.filter((l) => l.section_id === section.id);
                const isOpen = openSections[section.id] ?? false;

                return (
                  <div key={section.id} className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-light-bg dark:hover:bg-dark-bg transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-light-text dark:text-dark-text">{section.name}</h4>
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          {sectionLessons.length} Liçoes
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCreator && (
                          <span
                            onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                            className="text-danger hover:text-danger-hover text-sm cursor-pointer"
                          >
                            Deletar
                          </span>
                        )}
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-light-border dark:border-dark-border p-4">
                        {sectionLessons.length === 0 ? (
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Sem lições nesta seção.</p>
                        ) : (
                          <div className="space-y-2">
                            {sectionLessons.map((lesson) => (
                              <div key={lesson.id} className="flex justify-between items-center py-2 border-b border-light-border/50 dark:border-dark-border/50 last:border-0">
                                <div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-light-text dark:text-dark-text">{lesson.title}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    lesson.status === 'published'
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  }`}>
                                    {lesson.status}
                                  </span>
                                </div>
                                {lesson.video_url && (
                                    <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-primary-hover mt-1 inline-block">
                                       Assista o vídeo
                                    </a>
                                  )}
                                </div>
                                {isCreator && (
                                  <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}/edit`)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeleteLesson(lesson.id)}>Deletar</Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Unassigned Lessons */}
          {unassignedLessons.length > 0 && (
            <>
              {sections.length > 0 && (
                <h4 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-3">Other Lessons</h4>
              )}
              <div className="space-y-3">
                {unassignedLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-light-border dark:border-dark-border p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-light-text dark:text-dark-text">{lesson.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        lesson.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {lesson.status}
                      </span>
                      {lesson.video_url && (
                        <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover ml-3">
                          Assista o vídeo
                        </a>
                      )}
                    </div>
                    {isCreator && (
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}/edit`)}>Editar</Button>
                        <Button variant="danger" onClick={() => handleDeleteLesson(lesson.id)}>Deletar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {sections.length === 0 && unassignedLessons.length === 0 && (
            <EmptyState message="Nenhum conteúdo ainda. Comece criando uma seção ou lição!" />
          )}
        </div>

        <div className="mt-6">
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← Volte para a lista de cursos
          </Button>
        </div>

        <ChatBot courseId={Number(id)} />
      </div>
    </div>
  );
}