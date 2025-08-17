import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QrisPaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  qrisImageUrl?: string;
  productName: string;
  price: number;
}

export function QrisPaymentPopup({ 
  isOpen, 
  onClose, 
  qrisImageUrl, 
  productName, 
  price 
}: QrisPaymentPopupProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get global QRIS from localStorage if qrisImageUrl is not provided
  const globalQris = localStorage.getItem('global-qris-url');
  const displayQris = qrisImageUrl || globalQris;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCopyPrice = async () => {
    try {
      await navigator.clipboard.writeText(price.toString());
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Nominal telah disalin ke clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyalin nominal",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQris = () => {
    if (!displayQris) return;
    
    const link = document.createElement('a');
    link.href = displayQris;
    link.download = `qris-${productName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Pembayaran QRIS</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Info */}
          <div className="text-center border-b pb-4">
            <h3 className="font-semibold text-lg">{productName}</h3>
            <p className="text-2xl font-bold text-primary">{formatPrice(price)}</p>
          </div>

          {/* QRIS Code */}
          <div className="text-center">
            {displayQris ? (
              <div className="space-y-3">
                <img
                  src={displayQris}
                  alt="QRIS Code"
                  className="mx-auto max-w-full h-64 object-contain border rounded-lg"
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadQris}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QRIS
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed rounded-lg text-center">
                <p className="text-muted-foreground">QRIS belum tersedia</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Hubungi admin untuk informasi pembayaran
                </p>
              </div>
            )}
          </div>

          {/* Payment Instructions */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold">Cara Pembayaran:</h4>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">1</span>
                <span>Buka aplikasi e-wallet atau mobile banking Anda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">2</span>
                <span>Scan QRIS code di atas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">3</span>
                <div className="flex items-center gap-2">
                  <span>Masukkan nominal: </span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{formatPrice(price)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPrice}
                      className="h-auto p-1"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">4</span>
                <span>Konfirmasi pembayaran</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">5</span>
                <span>Screenshot bukti pembayaran dan kirim ke admin</span>
              </li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="bg-muted p-3 rounded-lg text-center text-sm">
            <p className="text-muted-foreground">
              Setelah pembayaran, kirim bukti transfer ke admin untuk verifikasi
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}