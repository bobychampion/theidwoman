import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User as UserIcon, Mail, Shield, Calendar, CreditCard, ChevronRight, Package, DollarSign, Clock, ShoppingBag } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { cn } from "../lib/utils";

interface PurchaseRecord {
  id: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: any;
}

export default function Profile({ user }: { user: User }) {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const q = query(
          collection(db, "purchases"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const records: PurchaseRecord[] = [];
        querySnapshot.forEach((doc) => {
          records.push({ id: doc.id, ...doc.data() } as PurchaseRecord);
        });
        setPurchases(records);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, [user.uid]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Processing...";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <header className="flex flex-col md:flex-row items-center gap-12 bg-white p-12 rounded-[60px] border border-brand-light/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 shrink-0">
          <div className="w-40 h-40 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden group bg-surface">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=c07d64&color=fff`} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
              alt="ProfileAvatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-brand p-4 text-white rounded-2xl shadow-xl border-4 border-white">
            <UserIcon className="w-6 h-6" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center md:text-left space-y-6 relative z-10">
          <div>
            <p className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] mb-3">IDENTITY BLUEPRINT</p>
            <h1 className="text-4xl md:text-5xl font-serif text-text-main leading-tight italic">{user.displayName || 'Unnamed Catalyst'}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 p-0.5">
            <span className="flex items-center gap-3 px-6 py-3 bg-surface rounded-full text-sm font-medium text-text-main border border-brand-light/10">
              <Mail className="w-4 h-4 text-brand" /> {user.email}
            </span>
            <span className="px-6 py-3 bg-brand-light/10 rounded-full text-[10px] font-bold text-brand uppercase tracking-[0.2em] italic">Verified Catalyst Protocol</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 space-y-10 group hover:shadow-2xl transition-all duration-500">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-main border-b border-brand-light/10 pb-8 flex items-center justify-between">
            <span>Identity Details</span>
            <Calendar className="w-5 h-5 text-brand" strokeWidth={1} />
          </h3>
          <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Temporal Entry</span>
              <span className="text-lg font-serif text-text-main italic">May 2026</span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Active Tier</span>
              <span className="px-6 py-2 bg-brand-light/10 text-brand text-[11px] font-bold rounded-full uppercase tracking-[0.1em]">Advanced Catalyst</span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Clearance</span>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Full Access
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 space-y-10 group hover:shadow-2xl transition-all duration-500">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-main border-b border-brand-light/10 pb-8 flex items-center justify-between">
            <span>Billing Architecture</span>
            <CreditCard className="w-5 h-5 text-brand" strokeWidth={1} />
          </h3>
          <div className="space-y-4">
             <button className="w-full flex items-center justify-between p-6 bg-surface hover:bg-brand hover:text-white transition-all rounded-3xl group/btn">
               <span className="text-[11px] font-bold uppercase tracking-[0.2em]">View Ledger</span>
               <ChevronRight className="w-5 h-5 opacity-30 group-hover/btn:opacity-100 transition-all group-hover/btn:translate-x-1" />
            </button>
            <button className="w-full flex items-center justify-between p-6 bg-surface hover:bg-brand hover:text-white transition-all rounded-3xl group/btn">
               <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Optimize Plan</span>
               <ChevronRight className="w-5 h-5 opacity-30 group-hover/btn:opacity-100 transition-all group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Purchase History Section */}
      <section className="bg-white p-12 rounded-[60px] border border-brand-light/10 shadow-sm space-y-10">
        <div className="flex items-center justify-between border-b border-brand-light/10 pb-8">
          <div>
            <p className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] mb-2">CHRONICLE</p>
            <h3 className="text-3xl font-serif text-text-main italic">Purchase History</h3>
          </div>
          <Package className="w-8 h-8 text-brand/20" strokeWidth={1} />
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-brand-light/20 border-t-brand rounded-full animate-spin" />
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Accessing Ledger...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-20 px-10 bg-surface rounded-[40px] border border-dashed border-brand-light/20">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-brand/30">
                <Shield className="w-10 h-10" strokeWidth={1} />
              </div>
              <p className="text-sm text-text-muted font-medium italic">No assets integrated into your legacy chronicle yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {purchases.map((purchase) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={purchase.id} 
                  className="group flex flex-col md:flex-row items-center justify-between p-8 bg-surface hover:bg-white border border-transparent hover:border-brand-light/20 rounded-[40px] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-8 mb-6 md:mb-0">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand shadow-sm">
                      <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text-main group-hover:text-brand transition-colors leading-tight italic">{purchase.productName}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> {formatDate(purchase.createdAt)}
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full uppercase tracking-widest">
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Exchange</p>
                    <p className="text-2xl font-serif text-text-main italic">${purchase.amount}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="text-center pt-8 border-t border-brand-light/10">
        <button className="px-10 py-6 text-brand font-bold hover:bg-brand-light/10 transition-all uppercase tracking-[0.4em] text-[10px] italic rounded-full">
          Request Legacy Erasure
        </button>
      </footer>
    </div>
  );
}
