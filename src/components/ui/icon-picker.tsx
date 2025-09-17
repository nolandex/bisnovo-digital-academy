import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Get all Lucide icons and filter out non-icon exports
const lucideIconNames = Object.keys(LucideIcons).filter(
  (name) => 
    name !== 'default' && 
    name !== 'createLucideIcon' && 
    name !== 'IconNode' &&
    typeof LucideIcons[name as keyof typeof LucideIcons] === 'function'
);

interface IconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function IconPicker({ value, onValueChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = lucideIconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelectedIcon = LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<any>;
  const DefaultIcon = LucideIcons.Star;

  return (
    <div className="space-y-2">
      <Label>Icon</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              {SelectedIcon ? (
                <SelectedIcon className="h-4 w-4" />
              ) : (
                <DefaultIcon className="h-4 w-4" />
              )}
              {value || "Select icon..."}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-80">
            <div className="grid grid-cols-6 gap-1 p-3">
              {filteredIcons.map((iconName) => {
                const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
                return (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "ghost"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => {
                      onValueChange(iconName);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    title={iconName}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          <div className="p-3 border-t text-xs text-gray-500">
            {filteredIcons.length} icons found
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}