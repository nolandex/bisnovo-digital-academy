import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Tentang Kami
            </h1>
            <p className="text-lg text-muted-foreground">
              Platform terdepan untuk produk digital dan blueprint bisnis berkualitas tinggi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Visi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menjadi platform utama yang menghubungkan entrepreneur dengan solusi bisnis digital terbaik 
                  untuk mewujudkan kesuksesan bisnis mereka.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Misi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menyediakan akses mudah ke blueprint bisnis, template, dan produk digital berkualitas 
                  yang telah terbukti efektif untuk mengembangkan bisnis.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Mengapa Memilih Kami?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold mb-2">Produk Berkualitas</h3>
                  <p className="text-sm text-muted-foreground">
                    Setiap produk telah diuji dan terbukti efektif dalam praktik bisnis nyata
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold mb-2">Akses Instan</h3>
                  <p className="text-sm text-muted-foreground">
                    Download langsung setelah pembelian, tanpa menunggu
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold mb-2">Dukungan Penuh</h3>
                  <p className="text-sm text-muted-foreground">
                    Tim support siap membantu kesuksesan bisnis Anda
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tim Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-bold">AS</span>
                  </div>
                  <h3 className="font-semibold">Ahmad Sutrisno</h3>
                  <p className="text-sm text-muted-foreground">Founder & CEO</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-bold">SP</span>
                  </div>
                  <h3 className="font-semibold">Sari Pratiwi</h3>
                  <p className="text-sm text-muted-foreground">Head of Products</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-bold">RH</span>
                  </div>
                  <h3 className="font-semibold">Rizki Hakim</h3>
                  <p className="text-sm text-muted-foreground">Head of Marketing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Syarat dan Ketentuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Ketentuan Umum</h3>
                <p className="text-muted-foreground mb-2">
                  Dengan mengakses dan menggunakan platform ini, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang berlaku.
                </p>
                <p className="text-muted-foreground">
                  Platform ini menyediakan produk digital berupa blueprint bisnis, template, dan panduan yang telah diverifikasi kualitasnya.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Pembelian dan Pembayaran</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Semua harga yang tercantum dalam Rupiah (IDR) dan sudah termasuk PPN</li>
                  <li>Pembayaran dapat dilakukan melalui QRIS atau transfer bank</li>
                  <li>Produk akan dikirimkan maksimal 24 jam setelah pembayaran dikonfirmasi</li>
                  <li>Tidak ada pengembalian dana kecuali ada kesalahan teknis dari pihak kami</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Hak Cipta dan Penggunaan</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Produk yang dibeli hanya untuk penggunaan pribadi atau bisnis Anda</li>
                  <li>Dilarang mendistribusikan ulang, menjual kembali, atau membagikan produk</li>
                  <li>Hak cipta tetap dimiliki oleh penyedia produk</li>
                  <li>Pelanggaran dapat dikenakan sanksi hukum</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">4. Dukungan dan Garansi</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Dukungan teknis tersedia melalui email atau WhatsApp</li>
                  <li>Kami berkomitmen memberikan produk berkualitas tinggi</li>
                  <li>Jika ada masalah dengan produk, hubungi tim support dalam 7 hari</li>
                  <li>Update produk akan diberikan secara gratis jika tersedia</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">5. Privasi dan Data</h3>
                <p className="text-muted-foreground mb-2">
                  Kami menghormati privasi Anda dan berkomitmen melindungi data pribadi sesuai dengan peraturan yang berlaku.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Data pribadi hanya digunakan untuk proses transaksi</li>
                  <li>Informasi tidak akan dibagikan kepada pihak ketiga tanpa persetujuan</li>
                  <li>Email hanya digunakan untuk komunikasi terkait pembelian</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">6. Kontak dan Bantuan</h3>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-muted-foreground mb-3">
                    Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi kami:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-primary mr-2">📧</span>
                      <span>support@bisnovo.com</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-primary mr-2">📱</span>
                      <span>+62 812-3456-7890</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-primary mr-2">🕒</span>
                      <span>Senin - Jumat, 09:00 - 17:00 WIB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Syarat dan ketentuan ini dapat berubah sewaktu-waktu. 
                  Pembaruan akan diinformasikan melalui platform ini.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Terakhir diperbarui: 15 September 2025
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Kebijakan & Bantuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/terms-conditions">
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8" />
                    <span className="font-semibold">Syarat & Ketentuan</span>
                    <span className="text-xs text-muted-foreground">Baca ketentuan lengkap</span>
                  </Button>
                </Link>
                <Link to="/refund-policy">
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                    <ShieldCheck className="h-8 w-8" />
                    <span className="font-semibold">Kebijakan Pengembalian Dana</span>
                    <span className="text-xs text-muted-foreground">Pelajari kebijakan refund</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default About;