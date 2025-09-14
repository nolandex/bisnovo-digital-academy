import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";

const testimoniData = [
  {
    id: 1,
    name: "Budi Santoso",
    business: "Cafe & Bakery",
    rating: 5,
    comment: "Blueprint bisnis cafe yang saya beli sangat membantu dalam memulai usaha. Dalam 3 bulan sudah balik modal!",
    image: "BS"
  },
  {
    id: 2,
    name: "Maya Sari",
    business: "Online Shop Fashion",
    rating: 5,
    comment: "Template social media marketing benar-benar mengubah cara saya promosi. Engagement naik 300%!",
    image: "MS"
  },
  {
    id: 3,
    name: "Doni Prakoso",
    business: "Jasa Digital Marketing",
    rating: 5,
    comment: "Paket blueprint digital agency lengkap banget. Dari proposal sampai SOP semua ada. Recommended!",
    image: "DP"
  },
  {
    id: 4,
    name: "Lina Maharani",
    business: "Skincare Brand",
    rating: 5,
    comment: "Blueprint skincare business sangat detail. Dari riset produk sampai strategi pemasaran, semua dijelaskan step by step.",
    image: "LM"
  },
  {
    id: 5,
    name: "Andi Wijaya",
    business: "Food Truck",
    rating: 5,
    comment: "Berkat blueprint food truck, saya bisa merencanakan bisnis dengan matang. Sekarang punya 3 food truck!",
    image: "AW"
  },
  {
    id: 6,
    name: "Siti Nurhaliza",
    business: "Online Course Creator",
    rating: 4,
    comment: "Template course creation sangat membantu dalam membuat kelas online pertama saya. Mudah dipahami dan diterapkan.",
    image: "SN"
  }
];

const Testimoni = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Testimoni Pelanggan
            </h1>
            <p className="text-lg text-muted-foreground">
              Dengarkan pengalaman sukses dari pelanggan yang telah menggunakan produk kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimoniData.map((testimoni) => (
              <Card key={testimoni.id} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-sm">{testimoni.image}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{testimoni.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimoni.business}</p>
                    </div>
                  </div>
                  
                  <StarRating rating={testimoni.rating} className="mb-3" />
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{testimoni.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ingin Berbagi Pengalaman Anda?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Ceritakan kesuksesan bisnis Anda setelah menggunakan produk kami. 
                  Testimoni Anda bisa menginspirasi entrepreneur lain!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="text-primary text-lg mr-2">📧</span>
                    testimoni@bisnovo.com
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="text-primary text-lg mr-2">📱</span>
                    +62 812-3456-7890
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Testimoni;