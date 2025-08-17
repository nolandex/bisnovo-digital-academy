import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Clock, Users, BookOpen, Star, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "@/components/ui/level-badge";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/components/course-card";

interface Module {
  id: string;
  module_number: number;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  type: string;
  duration: number;
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('course_id', id)
          .order('module_number');

        if (modulesError) throw modulesError;
        setModules(modulesData || []);

        // Fetch lessons for each module
        if (modulesData && modulesData.length > 0) {
          const lessonsPromises = modulesData.map(async (module) => {
            const { data: lessonsData } = await supabase
              .from('course_lessons')
              .select('*')
              .eq('module_id', module.id)
              .order('lesson_number');
            
            return { moduleId: module.id, lessons: lessonsData || [] };
          });

          const lessonsResults = await Promise.all(lessonsPromises);
          const lessonsMap = lessonsResults.reduce((acc, { moduleId, lessons }) => {
            acc[moduleId] = lessons;
            return acc;
          }, {} as { [key: string]: Lesson[] });
          
          setLessons(lessonsMap);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

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

  const getTotalDuration = () => {
    return Object.values(lessons).flat().reduce((acc, lesson) => acc + lesson.duration, 0);
  };

  const learningOutcomes = [
    "Memahami konsep dasar bisnis digital dan peluang pasar di Indonesia",
    "Menguasai tools dan platform untuk membangun bisnis online",
    "Membuat strategi marketing yang efektif untuk menarik klien",
    "Mengatur sistem operasional dan keuangan bisnis",
    "Membangun portofolio dan personal branding yang kuat",
    "Mengembangkan skill negosiasi dan komunikasi dengan klien"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bisnovo-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat detail course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course tidak ditemukan</h1>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-lg font-semibold text-foreground truncate">
            {course.name}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <LevelBadge level={course.level} />
                <Badge variant="secondary">{course.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground">{course.name}</h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <StarRating rating={course.rating} />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{formatStudents(course.students)} siswa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getTotalDuration()} menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{modules.length} modul</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={course.image_url || '/api/placeholder/800/400'}
                alt={course.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Play className="mr-2 h-6 w-6" />
                  Preview Course
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
                <TabsTrigger value="outcomes">Hasil Belajar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="curriculum" className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {modules.map((module, index) => (
                    <AccordionItem key={module.id} value={`module-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-medium">
                            Modul {module.module_number}: {module.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {lessons[module.id]?.length || 0} pelajaran
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-4">
                          <p className="text-muted-foreground">{module.description}</p>
                          <div className="space-y-2">
                            {lessons[module.id]?.map((lesson) => (
                              <div key={lesson.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                                <div className="flex items-center gap-2 flex-1">
                                  {lesson.type === 'video' ? (
                                    <Play className="h-4 w-4 text-bisnovo-primary" />
                                  ) : (
                                    <Download className="h-4 w-4 text-bisnovo-primary" />
                                  )}
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {lesson.duration} min
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="outcomes" className="space-y-4">
                <div className="grid gap-3">
                  {learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-bisnovo-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="text-3xl font-bold text-foreground">
                  {formatPrice(course.price)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-bisnovo-primary hover:bg-bisnovo-primary/90 text-bisnovo-primary-foreground" size="lg">
                  Daftar Sekarang
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Tambah ke Wishlist
                </Button>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{getTotalDuration()} menit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modul</span>
                    <span className="font-medium">{modules.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sertifikat</span>
                    <span className="font-medium">Ya</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;