import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Hubungi Kami</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Ada Pertanyaan?</h2>
            <p className="text-muted-foreground">
              Kami siap membantu Anda. Hubungi kami melalui salah satu cara berikut:
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </CardTitle>
                <CardDescription>Chat langsung dengan tim kami</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => window.open('https://wa.me/628123456789', '_blank')}
                >
                  Hubungi via WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
                <CardDescription>Kirim pertanyaan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'mailto:support@example.com'}
                >
                  support@example.com
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Jam Operasional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Senin - Jumat</span>
                <span className="font-medium">09:00 - 18:00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sabtu</span>
                <span className="font-medium">09:00 - 15:00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minggu</span>
                <span className="font-medium">Tutup</span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Kami akan merespons dalam waktu 1x24 jam (hari kerja)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
