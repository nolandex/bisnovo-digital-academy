import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, FileText, Monitor, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "@/components/ui/level-badge";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/product-card";

interface ProductDetail {
  id: string;
  detail_number: number;
  title: string;
  description: string;
}

interface ProductFeature {
  id: string;
  feature_number: number;
  title: string;
  type: string;
  quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [details, setDetails] = useState<ProductDetail[]>([]);
  const [features, setFeatures] = useState<{ [key: string]: ProductFeature[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch product details
        const { data: detailsData, error: detailsError } = await supabase
          .from('product_details')
          .select('*')
          .eq('product_id', id)
          .order('detail_number');

        if (detailsError) throw detailsError;
        setDetails(detailsData || []);

        // Fetch features for each detail
        if (detailsData && detailsData.length > 0) {
          const featuresPromises = detailsData.map(async (detail) => {
            const { data: featuresData } = await supabase
              .from('product_features')
              .select('*')
              .eq('detail_id', detail.id)
              .order('feature_number');
            
            return { detailId: detail.id, features: featuresData || [] };
          });

          const featuresResults = await Promise.all(featuresPromises);
          const featuresMap = featuresResults.reduce((acc, { detailId, features }) => {
            acc[detailId] = features;
            return acc;
          }, {} as { [key: string]: ProductFeature[] });
          
          setFeatures(featuresMap);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatCustomers = (customers: number) => {
    if (customers >= 1000) {
      return `${(customers / 1000).toFixed(1)}k`;
    }
    return customers.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produk tidak ditemukan</h1>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          
          {/* 1. Title & Subtitle */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              <LevelBadge level={product.level} />
            </div>
            <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {product.description}
            </p>
          </div>

          {/* 2. Hero Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image_url || '/api/placeholder/600/400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.is_digital && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Digital Product
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </div>
              <p className="text-muted-foreground">
                Solusi lengkap untuk kebutuhan bisnis digital Anda dengan {formatCustomers(product.customers)} pelanggan yang sudah merasakan manfaatnya.
              </p>
            </div>
          </div>

          {/* 3. Core Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Yang Anda Dapatkan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(features).flat().map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  {feature.type === 'video' ? (
                    <Monitor className="h-5 w-5 text-primary" />
                  ) : feature.type === 'file' ? (
                    <Download className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <span className="font-medium">{feature.title}</span>
                    {feature.quantity > 1 && (
                      <span className="text-sm text-muted-foreground ml-2">({feature.quantity}x)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Detailed Description */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Deskripsi Lengkap</h2>
            <div className="space-y-4">
              {details.map((detail) => (
                <div key={detail.id}>
                  <h3 className="text-lg font-semibold mb-2">{detail.title}</h3>
                  <p className="text-muted-foreground">{detail.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Deliverables */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Apa Yang Akan Anda Terima</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">File Digital</h4>
                <p className="text-sm text-muted-foreground">Download langsung setelah pembayaran</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Dokumentasi</h4>
                <p className="text-sm text-muted-foreground">Panduan lengkap penggunaan</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Monitor className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Tutorial</h4>
                <p className="text-sm text-muted-foreground">Video panduan step-by-step</p>
              </div>
            </div>
          </Card>

          {/* 6. How It Works */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Cara Kerja</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                <div>
                  <h4 className="font-semibold">Pesan Sekarang</h4>
                  <p className="text-muted-foreground">Klik tombol "Beli Sekarang" dan lakukan pembayaran</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                <div>
                  <h4 className="font-semibold">Download Instant</h4>
                  <p className="text-muted-foreground">Dapatkan akses download langsung setelah pembayaran berhasil</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                <div>
                  <h4 className="font-semibold">Mulai Gunakan</h4>
                  <p className="text-muted-foreground">Ikuti dokumentasi dan mulai implementasi sesuai kebutuhan</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 9. CTA */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Siap Untuk Memulai?</h2>
              <p className="text-muted-foreground">
                Bergabunglah dengan {formatCustomers(product.customers)} pelanggan yang sudah merasakan manfaatnya
              </p>
              <div className="space-y-3 max-w-md mx-auto">
                <Button className="w-full h-12 text-lg font-semibold" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Beli Sekarang - {formatPrice(product.price)}
                </Button>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Download langsung</span>
                  <span>•</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Garansi 30 hari</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;