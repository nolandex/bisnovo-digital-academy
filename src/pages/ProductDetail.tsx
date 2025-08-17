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

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* 1. Title & Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="text-lg text-muted-foreground">{product.description}</p>
        </div>

        {/* 2. Product Image & Price */}
        <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image_url || '/api/placeholder/600/400'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_digital && (
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                  Digital
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </div>
            <p className="text-muted-foreground">
              Dengan {formatCustomers(product.customers)} pelanggan yang puas
            </p>
          </div>
        </div>

        {/* 3. What You Get */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Yang Anda Dapatkan</h2>
          <div className="grid gap-3">
            {Object.values(features).flat().map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>{feature.title}</span>
                {feature.quantity > 1 && (
                  <span className="text-sm text-muted-foreground">({feature.quantity}x)</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Simple Description */}
        {details.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Detail Produk</h2>
            <div className="space-y-3">
              {details.map((detail) => (
                <div key={detail.id}>
                  <h3 className="font-medium">{detail.title}</h3>
                  <p className="text-muted-foreground text-sm">{detail.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 5. CTA Section */}
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Siap Memulai?</h2>
          <p className="text-muted-foreground mb-4">
            Dapatkan akses langsung setelah pembayaran
          </p>
          <Button className="w-full max-w-sm h-12 text-lg" size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Beli Sekarang - {formatPrice(product.price)}
          </Button>
        </Card>

      </div>
    </div>
  );
};

export default ProductDetail;