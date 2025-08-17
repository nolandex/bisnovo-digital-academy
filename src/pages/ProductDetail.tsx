import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, FileText, Monitor, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "@/components/ui/level-badge";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/product-card";
import { QrisPaymentPopup } from "@/components/qris-payment-popup";

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
  const [showQrisPopup, setShowQrisPopup] = useState(false);

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

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Product Image */}
        <div className="w-full mb-6">
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

        {/* Product Info */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(product.price)}
            </div>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        {/* What You Get */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Yang Anda Dapatkan</h2>
          <div className="space-y-2">
            {Object.values(features).flat().map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature.title}</span>
                {feature.quantity > 1 && (
                  <span className="text-xs text-muted-foreground">({feature.quantity}x)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        {details.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Cara Kerja</h2>
            <div className="space-y-2">
              {details.map((detail, index) => (
                <div key={detail.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{detail.title}</h3>
                    <p className="text-muted-foreground text-xs">{detail.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            className="w-full h-12 text-lg" 
            size="lg"
            onClick={() => setShowQrisPopup(true)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Beli Sekarang - {formatPrice(product.price)}
          </Button>
        </div>

      </div>

      {/* QRIS Payment Popup */}
      <QrisPaymentPopup
        isOpen={showQrisPopup}
        onClose={() => setShowQrisPopup(false)}
        qrisImageUrl={product.qris_image_url}
        productName={product.name}
        price={product.price}
      />
    </div>
  );
};

export default ProductDetail;