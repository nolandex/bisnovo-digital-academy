import { useState, useEffect } from "react";
import { CourseManager } from "@/components/admin/course-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { AdminLogin } from "@/components/admin/admin-login";
import { Button } from "@/components/ui/button";
import { BookOpen, Tags, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AdminTab = "courses" | "categories";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("courses");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem("admin-authenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    setIsAuthenticated(false);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari Admin Panel",
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-bisnovo-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("courses")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors
                ${activeTab === "courses" 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <BookOpen className="h-4 w-4" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors
                ${activeTab === "categories" 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <Tags className="h-4 w-4" />
              Categories
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {activeTab === "courses" && <CourseManager />}
        {activeTab === "categories" && <CategoryManager />}
      </main>
    </div>
  );
}