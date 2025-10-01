import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Kebijakan Pengembalian Dana</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Kebijakan Umum</h2>
            <p className="text-muted-foreground">
              Untuk produk digital, pengembalian dana dapat dilakukan dalam kondisi tertentu sesuai dengan kebijakan kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Syarat Pengembalian Dana</h2>
            <p className="text-muted-foreground">
              Pengembalian dana dapat diajukan dalam waktu 7 hari setelah pembelian jika produk tidak sesuai dengan deskripsi atau terdapat masalah teknis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Proses Pengembalian</h2>
            <p className="text-muted-foreground">
              Untuk mengajukan pengembalian dana, silakan hubungi tim support kami melalui halaman kontak dengan menyertakan detail pembelian dan alasan pengembalian.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Waktu Pemrosesan</h2>
            <p className="text-muted-foreground">
              Pengembalian dana akan diproses dalam waktu 3-7 hari kerja setelah permintaan disetujui.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Pengecualian</h2>
            <p className="text-muted-foreground">
              Produk yang telah diunduh atau diakses sepenuhnya tidak dapat dikembalikan kecuali terdapat masalah teknis yang signifikan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Hubungi Kami</h2>
            <p className="text-muted-foreground">
              Untuk pertanyaan lebih lanjut tentang kebijakan pengembalian dana, silakan hubungi tim support kami.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
