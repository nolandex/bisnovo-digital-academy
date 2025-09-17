import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full px-4 py-2 mt-0">
      <div className="relative w-full h-[180px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-xl shadow-lg">
        {/* Background image + gradient overlay */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
              url('https://ik.imagekit.io/nf7nyedso/1000376923.png?updatedAt=1758076777922')
            `,
          }}
        />

        {/* Konten */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Toko Online Terpercaya
            </h1>
            <p className="text-sm md:text-lg mb-4">
              Belanja produk digital dan fisik berkualitas dengan harga terbaik
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
              Mulai Belanja
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
