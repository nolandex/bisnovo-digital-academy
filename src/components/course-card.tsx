import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "@/components/ui/level-badge";
import { StarRating } from "@/components/ui/star-rating";
import { Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  rating: number;
  students: number;
  price: number;
  image_url?: string;
  modules?: number;
  lessons?: number;
  created_at?: string;
  updated_at?: string;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const formatStudents = (students: number) => {
    if (students >= 1000) {
      return `${(students / 1000).toFixed(1)}k`;
    }
    return students.toString();
  };

  const formatDuration = (lessons: number) => {
    const hours = Math.ceil(lessons * 0.5); // Estimate 30 min per lesson
    return `${hours}h`;
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Link to={`/courses/${course.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
        {/* Image Section */}
        <div className="relative">
          <div className="w-full h-20 bg-gradient-to-r from-blue-400 to-blue-600">
            {course.image_url && (
              <img
                src={course.image_url}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className={`absolute top-1 right-1 text-[0.5rem] px-1.5 py-0.5 rounded-full font-medium ${getLevelBadgeStyle(course.level)}`}>
            {course.level}
          </span>
        </div>
        
        {/* Content Section */}
        <div className="p-2 flex flex-col flex-grow">
          <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 leading-tight">
            {course.name}
          </h3>
          <p className="text-[0.6rem] text-gray-600 mb-2 truncate">
            by Bisnovo Expert
          </p>
          
          {/* Metadata Row */}
          <div className="flex items-center gap-1 text-[0.6rem] mt-auto">
            <div className="flex items-center gap-0.5">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-600">{course.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-0.5">
              <span className="text-gray-600">{formatStudents(course.students)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-0.5">
              <span className="text-gray-600">{formatDuration(course.lessons || 12)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}