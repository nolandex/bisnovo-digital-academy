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
    <Link to={`/courses/${course.id}`} className="block animate-scale-in card-hover card-tap">
      <div className="bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 ease-out overflow-hidden border border-border/50">
        {/* Modern Image Section */}
        <div className="relative h-24 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <img
            src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop'}
            alt={course.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute top-2 right-2">
            <LevelBadge level={course.level} className="shadow-sm" />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-3 space-y-2">
          <h3 className="text-tiny font-semibold line-clamp-2 leading-tight text-card-foreground">
            {course.name}
          </h3>
          
          <p className="text-tiny text-muted-foreground font-medium">
            by Bisnovo Expert
          </p>
          
          {/* Modern Metadata Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <StarRating rating={course.rating} className="text-tiny" />
            </div>
            
            <div className="flex items-center gap-3 text-tiny text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="font-medium">{formatStudents(course.students)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{formatDuration(course.lessons || 12)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}