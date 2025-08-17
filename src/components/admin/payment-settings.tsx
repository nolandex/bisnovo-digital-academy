import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSettings {
  qris_image_url: string;
}

export function PaymentSettings() {
  const [loading, setLoading] = useState(false);
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [qrisPreview, setQrisPreview] = useState<string>("");
  const [settings, setSettings] = useState<PaymentSettings>({ qris_image_url: "" });
  const { toast } = useToast();

  useEffect(() => {
    // Load QRIS from localStorage for now
    const savedQris = localStorage.getItem('global-qris-url');
    if (savedQris) {
      setSettings({ qris_image_url: savedQris });
      setQrisPreview(savedQris);
    }
  }, []);

  const handleQrisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrisFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setQrisPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just save to localStorage
      // In the future, this will be saved to the payment_settings table
      if (qrisFile) {
        // Convert file to base64 and save locally for now
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          localStorage.setItem('global-qris-url', result);
          setSettings({ qris_image_url: result });
          toast({
            title: "Success",
            description: "Payment settings updated successfully",
          });
        };
        reader.readAsDataURL(qrisFile);
      } else if (qrisPreview) {
        localStorage.setItem('global-qris-url', qrisPreview);
        setSettings({ qris_image_url: qrisPreview });
        toast({
          title: "Success",
          description: "Payment settings updated successfully",
        });
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: "Error",
        description: "Failed to save payment settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Settings</h2>
        <p className="text-muted-foreground">
          Configure QRIS payment image for all products
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>QRIS Payment Image</Label>
          <div className="mt-2">
            {qrisPreview ? (
              <div className="relative inline-block max-w-sm">
                <img
                  src={qrisPreview}
                  alt="QRIS preview"
                  className="w-full h-64 object-contain rounded-lg border bg-white"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => {
                    setQrisFile(null);
                    setQrisPreview("");
                    localStorage.removeItem('global-qris-url');
                    setSettings({ qris_image_url: "" });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center max-w-sm">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Upload QRIS image</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleQrisChange}
              className="mt-2 max-w-sm"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary/90"
        >
          {loading ? "Saving..." : "Save Payment Settings"}
        </Button>
      </form>
    </div>
  );
}