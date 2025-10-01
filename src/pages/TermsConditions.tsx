import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Syarat & Ketentuan</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Penerimaan Syarat</h2>
            <p className="text-muted-foreground">
              Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Penggunaan Layanan</h2>
            <p className="text-muted-foreground">
              Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Hak Kekayaan Intelektual</h2>
            <p className="text-muted-foreground">
              Semua konten yang tersedia di platform ini adalah milik kami dan dilindungi oleh hak cipta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Pembatasan Tanggung Jawab</h2>
            <p className="text-muted-foreground">
              Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Perubahan Syarat</h2>
            <p className="text-muted-foreground">
              Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Kontak</h2>
            <p className="text-muted-foreground">
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui halaman kontak.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
