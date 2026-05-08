import { useNavigate } from 'react-router-dom';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
      <p className="text-sm text-gray-500">
        {course.start_date} → {course.end_date}
      </p>
    </div>
  );
}