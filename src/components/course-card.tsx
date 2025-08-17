import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/ui/level-badge";
import { StarRating } from "@/components/ui/star-rating";
import { Users, Clock, BookOpen } from "lucide-react";
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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatStudents = (students: number) => {
    if (students >= 1000) {
      return `${(students / 1000).toFixed(1)}k`;
    }
    return students.toString();
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-border bg-gradient-to-b from-card to-card/50">
      <Link to={`/courses/${course.id}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={course.image_url || '/api/placeholder/400/240'}
              alt={course.name}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <LevelBadge level={course.level} />
            </div>
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/90 text-foreground">
                {course.category}
              </Badge>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2 text-foreground group-hover:text-bisnovo-primary transition-colors">
              {course.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-3">
              {course.description}
            </p>
            
            <div className="flex items-center justify-between">
              <StarRating rating={course.rating} />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{formatStudents(course.students)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.modules || 3} Modul</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.lessons || 12} Pelajaran</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">
            {formatPrice(course.price)}
          </div>
          <Button size="sm" className="bg-bisnovo-primary hover:bg-bisnovo-primary/90 text-bisnovo-primary-foreground">
            Lihat Detail
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}