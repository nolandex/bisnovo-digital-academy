import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Users, BookOpen, CheckCircle, Download, FileText, Monitor } from "lucide-react";
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
    "Akses instan setelah pembelian - langsung gunakan",
    "Update produk seumur hidup tanpa biaya tambahan",
    "Dukungan teknis 24/7 dari tim expert",
    "Panduan lengkap dan dokumentasi terbaru",
    "Akses ke komunitas pengguna premium",
    "Lisensi komersial untuk penggunaan bisnis"
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
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{details.length} detail</span>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={product.image_url || '/api/placeholder/800/400'}
                alt={product.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Play className="mr-2 h-6 w-6" />
                  Preview Produk
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detail Produk</TabsTrigger>
                <TabsTrigger value="benefits">Keuntungan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {details.map((detail, index) => (
                    <AccordionItem key={detail.id} value={`detail-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-medium">
                            Detail {detail.detail_number}: {detail.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {features[detail.id]?.length || 0} fitur
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-4">
                          <p className="text-muted-foreground">{detail.description}</p>
                          <div className="space-y-2">
                             {features[detail.id]?.map((feature) => (
                               <div key={feature.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                                 <div className="flex items-center gap-2 flex-1">
                                   {feature.type === 'video' ? (
                                     <Play className="h-4 w-4 text-bisnovo-primary" />
                                   ) : feature.type === 'file' ? (
                                     <Download className="h-4 w-4 text-bisnovo-primary" />
                                   ) : feature.type === 'tool' ? (
                                     <Monitor className="h-4 w-4 text-bisnovo-primary" />
                                   ) : (
                                     <FileText className="h-4 w-4 text-bisnovo-primary" />
                                   )}
                                   <span className="text-sm">{feature.title}</span>
                                 </div>
                                 <div className="text-xs text-muted-foreground">
                                   {feature.quantity > 1 ? `${feature.quantity} item` : '1 item'}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-4">
                <div className="grid gap-3">
                  {productBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-bisnovo-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
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