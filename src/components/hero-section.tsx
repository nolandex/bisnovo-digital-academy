import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-45 md:h-62 mx-2 mt-2 rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
        style={{
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)'
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="text-white">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2">
            Tingkatkan Skill Digital Anda
          </h1>
          <p className="text-sm md:text-lg opacity-90 max-w-md mx-auto">
            Belajar dari expert dan raih karir impian di era digital
          </p>
        </div>
      </div>
    </section>
  );
}