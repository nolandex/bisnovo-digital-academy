import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, TrendingUp, ArrowLeft } from "lucide-react";

const MyCourses = () => {
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
          <h1 className="ml-4 text-xl font-bold text-foreground">
            Course Saya
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-bisnovo-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-bisnovo-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Belum Ada Course
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Mulai perjalanan belajar Anda dengan memilih course yang sesuai dengan tujuan bisnis digital Anda.
          </p>
          <Link to="/">
            <Button className="bg-bisnovo-primary hover:bg-bisnovo-primary/90 text-bisnovo-primary-foreground">
              <TrendingUp className="mr-2 h-5 w-5" />
              Jelajahi Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;