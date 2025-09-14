import { Home, BookOpen, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpen, label: "About", path: "/my-courses" },
  { icon: User, label: "Testimoni", path: "/profile" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg py-2 px-4 md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 text-xs font-medium"
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-600"
                )}
              />
              <span 
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-600"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}