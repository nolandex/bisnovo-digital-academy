import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, CheckCircle, Download, FileText, Monitor, Shield, Clock, Zap, Star, Heart, Share2, ShoppingCart, CreditCard, Truck, RotateCcw } from "lucide-react";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    "Download langsung setelah pembayaran",
    "Update gratis seumur hidup",
    "Dukungan teknis 24/7",
    "Dokumentasi lengkap",
    "Lisensi komersial",
    "Garansi 30 hari uang kembali"
  ];

  const productImages = [
    product?.image_url || '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
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
      {/* Breadcrumb Header */}
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
            <Link to="/" className="hover:text-foreground">Products</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover hover-scale"
              />
              {product.is_digital && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Digital Product
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <LevelBadge level={product.level} />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsWishlisted(!isWishlisted)}>
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{formatCustomers(product.customers)} customers</span>
                <span className="text-muted-foreground">•</span>
                <button className="text-primary hover:underline">See reviews</button>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground line-through">
                    {formatPrice(product.price * 1.3)}
                  </span>
                  <Badge variant="destructive">Save 23%</Badge>
                </div>
              </div>

              {/* Stock Status */}
              {!product.is_digital && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-sm font-medium ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock && product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4 p-6 bg-muted/50 rounded-lg border">
              {!product.is_digital && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button className="w-full h-12 text-lg font-semibold" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full h-12 text-lg font-semibold" size="lg">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
              </div>

              {/* Security & Shipping Info */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure payment & buyer protection</span>
                </div>
                {product.is_digital ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Download className="h-4 w-4 text-blue-600" />
                    <span>Instant download after payment</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Free shipping on orders over Rp 500,000</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-4 w-4 text-orange-600" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Category</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Level</span>
                      <span className="text-muted-foreground">{product.level}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Type</span>
                      <span className="text-muted-foreground">{product.is_digital ? 'Digital Download' : 'Physical Product'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Components</span>
                      <span className="text-muted-foreground">{Object.values(features).flat().length} items</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">License</span>
                      <span className="text-muted-foreground">Commercial Use</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Updates</span>
                      <span className="text-muted-foreground">Lifetime Free</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Support</span>
                      <span className="text-muted-foreground">24/7 Technical</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Rating</span>
                      <span className="text-muted-foreground">{product.rating}/5 ⭐</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {productBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {details.map((detail, index) => (
                  <Card key={detail.id} className="p-6">
                    <h4 className="font-semibold text-lg mb-4">{detail.title}</h4>
                    <p className="text-muted-foreground mb-4">{detail.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {features[detail.id]?.map((feature) => (
                        <div key={feature.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          {feature.type === 'video' ? (
                            <Monitor className="h-4 w-4 text-primary" />
                          ) : feature.type === 'file' ? (
                            <Download className="h-4 w-4 text-primary" />
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
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-8 p-6 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{product.rating}</div>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{formatCustomers(product.customers)} reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-2">{stars}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '5%' : stars === 2 ? '3%' : '2%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">U{review}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">User {review}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">2 days ago</span>
                            </div>
                            <p className="text-sm">Great product! Exactly what I needed. The quality is excellent and the documentation is very helpful.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="mt-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Product Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Need Help?</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Monitor className="mr-2 h-4 w-4" />
                        Video Tutorials
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Community Forum
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Support</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>24/7 Technical Support</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>30-day Money Back Guarantee</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>Free Lifetime Updates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;