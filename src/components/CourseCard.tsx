import { useNavigate } from 'react-router-dom';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const LEVEL_STYLES: Record<string, { dark: string; light: string }> = {
  beginner: {
    light: 'bg-[#F1F5F9] text-grey-700',
    dark: 'dark:bg-[#1E293B] text-grey-600',
  },
  intermediate: {
    light: 'bg-[#F1F5F9] text-grey-700',
    dark: 'dark:bg-[#1E293B] dark:text-grey-600',
  },
  advanced: {
    light: 'bg-[#F1F5F9] text-grey-700',
    dark: 'dark:bg-[#1E293B] text-grey-700',
  },
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm border border-light-border dark:border-dark-border overflow-hidden cursor-pointer hover:shadow-lg transition group"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={course.image_url || PLACEHOLDER_IMAGE}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="font-pixel text-xs text-light-text dark:text-dark-text mb-2">{course.name}</h3>

        {course.description && (
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3 line-clamp-2">{course.description}</p>
        )}

        {course.level && (
          <span className={`font-pixel text-[10px] font-semibold px-3 py-1 rounded-full ${LEVEL_STYLES[course.level]?.light || 'bg-[#F1F5F9] text-gray-600'} ${LEVEL_STYLES[course.level]?.dark || 'dark:bg-[#1E293B] dark:text-gray-400'}`}>
            {course.level.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}