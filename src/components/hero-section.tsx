import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full px-4 py-2 mt-0">
      <div className="relative w-full h-[180px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-xl shadow-lg">
        {/* Background gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'var(--gradient-hero)'
          }}
        />
        {/* Background image dengan gradient overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
          <div className="text-center text-white mb-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Mulai Bisnis Digital Anda
            </h1>
            <p className="text-sm md:text-lg">
              Pelajari bisnis jasa digital dari modal minim hingga jutaan rupiah
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}