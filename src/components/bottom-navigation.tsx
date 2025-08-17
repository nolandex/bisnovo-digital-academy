import { Home, BookOpen, User, Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: 'Beranda', href: '/' },
  { icon: Search, label: 'Cari', href: '/search' },
  { icon: BookOpen, label: 'Course Saya', href: '/my-courses' },
  { icon: User, label: 'Profil', href: '/profile' },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-bisnovo-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5",
                  isActive && "text-bisnovo-primary"
                )} 
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}