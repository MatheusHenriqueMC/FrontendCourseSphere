import { Course } from '../types';
import Button from './Button';

interface CourseHeroBannerProps {
  course: Course;
  onEnroll?: () => void;
  onUnenroll?: () => void;
  isCreator: boolean;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop';

const LEVEL_STYLES: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-300 border border-green-500/30',
  intermediate: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  advanced: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
};

export default function CourseHeroBanner({ course, onEnroll, onUnenroll, isCreator }: CourseHeroBannerProps) {
  return (
    <div className="relative w-full h-80 overflow-hidden">
      <img
        src={course.image_url || PLACEHOLDER_IMAGE}
        alt={course.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            {course.level && (
              <span className={`font-pixel text-[10px] px-3 py-1 rounded-full ${LEVEL_STYLES[course.level] || 'bg-gray-500/20 text-gray-300'}`}>
                {course.level.toUpperCase()}
              </span>
            )}
            <span className="text-white/60 text-sm">COURSE</span>
          </div>

          <h1 className="font-pixel text-xl md:text-2xl text-white mb-3">{course.name}</h1>

          {course.description && (
            <p className="text-white/70 text-sm md:text-base max-w-lg mb-4">
              {course.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-white/60 mb-4">
            <span>📅 {course.start_date} → {course.end_date}</span>
            <span>👥 {course.enrollment_count} {course.enrollment_count === 1 ? 'inscrito' : 'inscritos'}</span>
          </div>

          {!isCreator && (
            <div>
              {course.is_enrolled ? (
                <button
                  onClick={onUnenroll}
                  className="bg-white/20 text-white px-6 py-2 rounded-lg border border-white/30 hover:bg-red-500/30 hover:border-red-400/50 transition text-sm font-semibold cursor-pointer"
                >
                  ✓ Inscrito — Clique para desinscrever
                </button>
              ) : (
                <Button onClick={onEnroll}>
                  Iniciar Curso
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}