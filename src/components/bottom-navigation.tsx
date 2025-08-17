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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-xl z-50 md:hidden">
      <div className="max-w-sm mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 min-h-[52px] min-w-[52px] justify-center btn-press"
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "text-primary scale-110" : "text-muted-foreground"
                  )}
                />
                <span 
                  className={cn(
                    "text-tiny font-medium transition-all duration-200",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}