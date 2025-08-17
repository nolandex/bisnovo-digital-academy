import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-44 md:h-60 mx-4 mt-4 rounded-lg overflow-hidden shadow-hero animate-fade-in">
      {/* Modern gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'var(--gradient-hero)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <div className="text-white max-w-sm mx-auto">
          <h1 className="text-headline font-heading font-bold leading-tight mb-3 text-shadow-sm">
            Tingkatkan Skill Digital Anda
          </h1>
          <p className="text-small opacity-95 mb-4 leading-relaxed">
            Belajar dari expert dan raih karir impian di era digital
          </p>
          <div className="flex items-center justify-center gap-2 text-tiny font-medium opacity-90">
            <span>18+ kursus tersedia</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </section>
  );
}