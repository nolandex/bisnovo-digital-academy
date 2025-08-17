import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[280px] md:h-[350px] bg-gradient-to-br from-bisnovo-primary via-bisnovo-primary to-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50" />
      
      <div className="relative h-full flex items-center justify-center px-4 md:px-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <TrendingUp className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Platform #1 Bisnis Digital Indonesia</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Mulai Bisnis Digital
            <span className="block bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
              Anda Hari Ini
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Pelajari bisnis jasa digital dari modal minim hingga jutaan rupiah. 
            Bergabung dengan ribuan entrepreneur sukses di Indonesia.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-white text-bisnovo-primary hover:bg-white/90 font-semibold shadow-xl w-full sm:w-auto"
            >
              Mulai Belajar Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm"
            >
              <Play className="mr-2 h-5 w-5" />
              Tonton Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-center">
            <div className="text-white">
              <div className="text-2xl md:text-3xl font-bold">18+</div>
              <div className="text-sm text-white/80">Course Bisnis</div>
            </div>
            <div className="text-white">
              <div className="text-2xl md:text-3xl font-bold">25k+</div>
              <div className="text-sm text-white/80">Siswa Aktif</div>
            </div>
            <div className="text-white">
              <div className="text-2xl md:text-3xl font-bold">4.8</div>
              <div className="text-sm text-white/80">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}