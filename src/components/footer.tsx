import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Tentang Kami</h3>
            <p className="text-sm text-muted-foreground">
              Platform terpercaya untuk blueprint bisnis digital yang membantu Anda memulai dan mengembangkan usaha.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms-conditions" className="text-muted-foreground hover:text-foreground">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-muted-foreground hover:text-foreground">
                  Kebijakan Pengembalian Dana
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-muted-foreground hover:text-foreground">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Kontak</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@example.com</li>
              <li>WhatsApp: +62 812 3456 789</li>
              <li>Jam Kerja: Senin - Jumat, 09:00 - 18:00 WIB</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
