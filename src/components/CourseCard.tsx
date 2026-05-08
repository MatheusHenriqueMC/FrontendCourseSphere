import { useNavigate } from 'react-router-dom';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const LEVEL_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition group"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image_url || PLACEHOLDER_IMAGE}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.name}</h3>

        {course.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
        )}

        {course.level && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${LEVEL_STYLES[course.level] || 'bg-gray-100 text-gray-600'}`}>
            {course.level.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}