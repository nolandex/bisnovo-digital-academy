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
        .sort((a, b) => (b.rating * b.students) - (a.rating * a.students));
    }
    
    return courses.filter(course => course.category === selectedCategory);
  }, [courses, selectedCategory]);

  if (loading) {
    return (
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-card overflow-hidden border border-border/50">
              <div className="h-24 skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-3 skeleton w-1/2" />
                <div className="flex justify-between pt-1">
                  <div className="h-3 skeleton w-1/4" />
                  <div className="h-3 skeleton w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-16 px-4 animate-fade-in">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-muted-foreground text-small">
          Tidak ada course untuk kategori "{selectedCategory}"
        </p>
      </div>
    );
  }

  return (
    <section className="px-4 pb-20">
      <div className="grid grid-cols-2 gap-4">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            style={{ animationDelay: `${0.1 * index}s` }}
            className="animate-scale-in"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </section>
  );
}