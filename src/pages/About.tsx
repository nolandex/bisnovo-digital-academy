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