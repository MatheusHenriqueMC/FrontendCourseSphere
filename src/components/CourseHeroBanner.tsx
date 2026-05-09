/* eslint-disable react-hooks/purity */
import { Course } from '../types';

interface CourseHeroBannerProps {
  course: Course;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop';

const LEVEL_STYLES: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-300 border border-green-500/30',
  intermediate: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  advanced: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
};

export default function CourseHeroBanner({ course }: CourseHeroBannerProps) {
  return (
    <div className="relative w-full h-72 overflow-hidden">
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

          <div className="flex items-center gap-6 text-sm text-white/60">
            <span>📅 {course.start_date} → {course.end_date}</span>
            <span>👥 {Math.floor(Math.random() * 500) + 50} learners</span>
          </div>
        </div>
      </div>
    </div>
  );
}