import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, CheckCircle, Download, FileText, Monitor, Shield, Clock, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "@/components/ui/level-badge";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

  const getTotalQuantity = () => {
    return Object.values(features).flat().reduce((acc, feature) => acc + feature.quantity, 0);
  };

  const productBenefits = [
    "Download langsung setelah pembayaran selesai",
    "Update otomatis untuk versi terbaru",
    "Dukungan teknis profesional 24/7",
    "Dokumentasi lengkap dan tutorial",
    "Lisensi penggunaan komersial",
    "Akses komunitas pengguna eksklusif"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bisnovo-primary mx-auto"></div>
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
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-lg font-semibold text-foreground truncate">
            {product.name}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <LevelBadge level={product.level} />
                <Badge variant="secondary">{product.category}</Badge>
                {product.is_digital && <Badge variant="outline">Digital</Badge>}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <StarRating rating={product.rating} />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{formatCustomers(product.customers)} pengguna</span>
                </div>
                {!product.is_digital && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Stok: {product.stock || 100}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{Object.values(features).flat().length} komponen</span>
                </div>
              </div>
            </div>

            {/* Product Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8">
                  <img
                    src={product.image_url || '/api/placeholder/400/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Yang Anda Dapatkan</h3>
                <div className="space-y-3">
                  {Object.values(features).flat().slice(0, 4).map((feature, index) => (
                    <div key={feature.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      {feature.type === 'video' ? (
                        <Monitor className="h-5 w-5 text-primary" />
                      ) : feature.type === 'file' ? (
                        <Download className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                      <span className="text-sm font-medium">{feature.title}</span>
                      {feature.quantity > 1 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {feature.quantity}x
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Features & Specifications */}
            <div className="space-y-8">
              {/* Product Features */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Fitur Produk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {productBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Paket Lengkap</h3>
                <div className="grid gap-4">
                  {details.map((detail, index) => (
                    <Card key={detail.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-foreground">{detail.title}</h4>
                          <p className="text-muted-foreground mt-2">{detail.description}</p>
                        </div>
                        <Badge variant="secondary">{features[detail.id]?.length || 0} item</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {features[detail.id]?.map((feature) => (
                          <div key={feature.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            {feature.type === 'video' ? (
                              <Monitor className="h-4 w-4 text-primary" />
                            ) : feature.type === 'file' ? (
                              <Download className="h-4 w-4 text-primary" />
                            ) : feature.type === 'tool' ? (
                              <Monitor className="h-4 w-4 text-primary" />
                            ) : (
                              <FileText className="h-4 w-4 text-primary" />
                            )}
                            <div className="flex-1">
                              <span className="text-sm font-medium">{feature.title}</span>
                              {feature.quantity > 1 && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({feature.quantity}x)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Product Guarantees */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Jaminan Produk</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Shield className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">100% Aman</div>
                      <div className="text-sm text-green-600 dark:text-green-300">Garansi uang kembali</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-200">Akses Langsung</div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">Download instan</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Zap className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-800 dark:text-purple-200">Update Gratis</div>
                      <div className="text-sm text-purple-600 dark:text-purple-300">Seumur hidup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-bisnovo-primary hover:bg-bisnovo-primary/90 text-bisnovo-primary-foreground" size="lg">
                  Beli Sekarang
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Tambah ke Keranjang
                </Button>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{product.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium">{product.is_digital ? 'Digital Download' : 'Produk Fisik'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Akses</span>
                    <span className="font-medium">{product.is_digital ? 'Seumur Hidup' : 'Langsung'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Update</span>
                    <span className="font-medium">{product.is_digital ? 'Otomatis' : 'Manual'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;