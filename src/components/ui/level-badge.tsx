import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LevelBadgeProps {
  level: string;
  className?: string;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Easy':
      return 'bg-easy text-easy-foreground hover:bg-easy/90';
    case 'Medium':
      return 'bg-medium text-medium-foreground hover:bg-medium/90';
    case 'Hard':
      return 'bg-hard text-hard-foreground hover:bg-hard/90';
    default:
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
  }
};

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <Badge 
      className={cn(getLevelColor(level), className)}
      variant="secondary"
    >
      {level}
    </Badge>
  );
}