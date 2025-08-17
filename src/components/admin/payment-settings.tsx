import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSettings {
  id?: string;
  qris_image_url: string;
}

export function PaymentSettings() {
  const [loading, setLoading] = useState(false);
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [qrisPreview, setQrisPreview] = useState<string>("");
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
        setQrisPreview(data.qris_image_url || "");
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

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

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `qris-${Date.now()}.${fileExt}`;
    const filePath = `payment/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let qrisUrl = settings?.qris_image_url || "";

      if (qrisFile) {
        qrisUrl = await uploadImage(qrisFile);
      }

      const paymentData = {
        qris_image_url: qrisUrl,
        updated_at: new Date().toISOString(),
      };

      if (settings?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('payment_settings')
          .update(paymentData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('payment_settings')
          .insert([paymentData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Payment settings updated successfully",
      });

      fetchPaymentSettings();
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