import { Home, BookOpen, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/my-courses" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-1"
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-blue-600" : "text-gray-600"
                  )}
                />
                <span 
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-blue-600" : "text-gray-600"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}