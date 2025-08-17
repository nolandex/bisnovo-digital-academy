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

  return (
    <Link to={`/courses/${course.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-20 overflow-hidden">
          <img
            src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop'}
            alt={course.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 right-1">
            <LevelBadge level={course.level} />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-2">
          <h3 className="text-xs font-semibold line-clamp-2 leading-tight mb-1">
            {course.name}
          </h3>
          
          <p className="text-xs text-gray-600 mb-1">
            by Bisnovo Expert
          </p>
          
          {/* Metadata Row */}
          <div className="flex items-center text-xs text-gray-600 space-x-1">
            <StarRating rating={course.rating} className="text-xs" />
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-0.5">
              <Users className="w-2.5 h-2.5" />
              <span>{formatStudents(course.students)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              <span>{formatDuration(course.lessons || 12)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}