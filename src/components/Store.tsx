import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowRight, Star, Shield, Zap, CheckCircle2, X } from "lucide-react";
import { cn } from "../lib/utils";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  features: string[];
  image: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  { id: "1", name: "The 4F Blueprint Masterclass", price: 497, category: "COURSE", description: "The complete digital transformation system. Lifetime access to all modules, workbooks, and community updates.", features: ["24+ Video Lessons", "Digital Action Planner", "Identity Audit Tool", "Private Community Access"], image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop", badge: "BEST SELLER" },
  { id: "2", name: "1:1 Strategic Alignment Call", price: 197, category: "COACHING", description: "60 minutes of deep-dive strategic coaching with an expert to audit your 4F systems and scale your impact.", features: ["60 Min Live Session", "Session Recording", "Custom Action Plan", "1-Week Chat Support"], image: "https://images.unsplash.com/photo-1552664730-d307ce884978?q=80&w=1000&auto=format&fit=crop" },
  { id: "3", name: "Legacy Planner (Physical)", price: 47, category: "PRODUCT", description: "Our custom-designed daily planner built specifically to keep your 4Fs in constant sync. Shipped to your door.", features: ["Hardcover Premium Build", "12-Month Flow System", "Goal Tracking Framework", "Gratitude Journal"], image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop" },
];

const CATEGORIES = ["ALL", "COURSE", "COACHING", "PRODUCT"];

export default function Store({ user }: { user: any }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [productToPurchase, setProductToPurchase] = useState<Product | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const filteredProducts = selectedCategory === "ALL" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const handleConfirmPurchase = async () => {
    if (!productToPurchase || !user) return;
    
    setIsPurchasing(true);
    try {
      await addDoc(collection(db, "purchases"), {
        userId: user.uid,
        productId: productToPurchase.id,
        productName: productToPurchase.name,
        amount: productToPurchase.price,
        currency: "USD",
        status: "completed",
        createdAt: serverTimestamp()
      });
      
      // In a real app, you might trigger Stripe here
      alert("In a production environment, you would now be redirected to Stripe. For this demo, the purchase has been recorded in your legacy chronicle.");
      setProductToPurchase(null);
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Verification failed. Please ensure your access protocol is active.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="space-y-20">
      <header className="py-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase mb-6">RESOURCES & CURRICULUM</p>
          <h1 className="text-4xl md:text-6xl font-serif text-text-main leading-tight italic">The Blueprint <span className="font-script text-brand">Collection</span></h1>
        </div>
        <div className="hidden lg:block text-right">
           <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">Global Access</p>
           <p className="text-sm font-bold text-brand uppercase tracking-widest px-6 py-2 bg-brand-light/20 rounded-full">System Active</p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 border-b border-brand-light/10 pb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300",
              selectedCategory === cat 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "bg-surface text-text-muted hover:bg-brand-light/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, i) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white rounded-[50px] border border-brand-light/10 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center"
            >
              <div className="aspect-[4/5] w-full relative overflow-hidden bg-brand-light/10">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                  alt={product.name}
                />
                <div className="absolute top-8 right-8">
                  <span className="px-6 py-3 bg-white/80 backdrop-blur-md text-brand text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-lg">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-12 space-y-10 flex-1 flex flex-col items-center text-center">
                <div className="space-y-4">
                  <h3 className="font-script text-4xl text-text-main group-hover:text-brand transition-colors leading-none">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-muted font-medium leading-relaxed line-clamp-2 px-4">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-4 w-full">
                  {product.features.map(f => (
                    <div key={f} className="flex items-center justify-center gap-4 text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] group-hover:text-text-main transition-colors">
                      <div className="w-1.5 h-1.5 bg-brand rounded-full" /> {f}
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-brand-light/10 mt-auto flex flex-col items-center gap-8 w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">Value Exchange</span>
                    <span className="text-4xl font-serif text-text-main italic">${product.price}</span>
                  </div>
                  <button 
                    onClick={() => setProductToPurchase(product)}
                    className="w-full bg-brand text-white py-5 px-10 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 active:scale-95 flex items-center justify-center gap-4"
                  >
                    Acquire Asset
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {productToPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-text-main/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[60px] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <button 
                onClick={() => setProductToPurchase(null)}
                className="absolute top-8 right-8 text-text-muted hover:text-brand transition-colors"
                disabled={isPurchasing}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase">ASSET VERIFICATION</p>
                  <h3 className="text-4xl font-serif text-text-main leading-tight italic">Confirm <span className="font-script text-brand">Acquisition</span>?</h3>
                </div>

                <div className="bg-surface p-8 rounded-[40px] flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <img src={productToPurchase.image} className="w-full h-full object-cover grayscale" alt="" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-main leading-tight">{productToPurchase.name}</h4>
                    <p className="text-2xl font-serif text-brand italic mt-1">${productToPurchase.price}</p>
                  </div>
                </div>

                <p className="text-sm text-text-muted leading-relaxed font-medium">
                  By confirming, you are initiating the deployment of this asset to your legacy chronicle. Secure encryption will be initialized.
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleConfirmPurchase}
                    disabled={isPurchasing}
                    className="w-full bg-brand text-white py-6 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all disabled:opacity-50"
                  >
                    {isPurchasing ? "Securing Asset..." : "Confirm & Acquire"}
                  </button>
                  <button
                    onClick={() => setProductToPurchase(null)}
                    disabled={isPurchasing}
                    className="w-full py-4 text-text-muted font-bold text-[11px] uppercase tracking-[0.2em] hover:text-brand transition-colors"
                  >
                    Cancel Procedure
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Trust Framework */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20">
        {[
          { icon: Shield, title: "Secure Gateway", desc: "Enterprise-grade encryption for all financial deployments." },
          { icon: Zap, title: "Instant Access", desc: "Immediate fulfillment of digital assets upon verification." },
          { icon: Star, title: "Bespoke Support", desc: "Direct coordinate with our team for asset integration." }
        ].map((item) => (
          <div key={item.title} className="text-center space-y-6">
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-brand shadow-lg border border-brand-light/10">
              <item.icon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-main mb-3">{item.title}</h4>
              <p className="text-sm text-text-muted font-medium leading-relaxed px-10">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
