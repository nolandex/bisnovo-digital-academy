import { useState } from "react";
import { CourseManager } from "@/components/admin/course-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { Button } from "@/components/ui/button";
import { BookOpen, Tags, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type AdminTab = "courses" | "categories";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("courses");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
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
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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