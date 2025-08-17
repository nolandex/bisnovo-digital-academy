import { useEffect, useState, useMemo } from "react";
import { CourseCard, Course } from "@/components/course-card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CourseGridProps {
  selectedCategory: string;
}

export function CourseGrid({ selectedCategory }: CourseGridProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'Semua') return courses;
    
    if (selectedCategory === 'Populer') {
      return [...courses]
        .sort((a, b) => (b.rating * b.students) - (a.rating * a.students))
        .slice(0, 8);
    }
    
    return courses.filter(course => course.category === selectedCategory);
  }, [courses, selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-bisnovo-primary" />
        <span className="ml-2 text-muted-foreground">Memuat course...</span>
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Tidak ada course untuk kategori "{selectedCategory}"
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredCourses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}