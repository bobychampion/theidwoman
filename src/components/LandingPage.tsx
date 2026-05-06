import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Cross, 
  Heart, 
  DollarSign, 
  Activity, 
  Users, 
  Landmark, 
  HeartHandshake, 
  ShoppingBag, 
  Sparkles, 
  PlayCircle, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  Compass
} from "lucide-react";
import { cn } from "../lib/utils";

export default function LandingPage() {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const pillars = [
    { 
      title: "Faith", 
      desc: "Deepen your spiritual connection and trust in God's plan.", 
      icon: Cross,
      image: "https://images.unsplash.com/photo-1540321251318-791771120286?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      title: "Family", 
      desc: "Nurture strong, loving relationships with your loved ones.", 
      icon: HeartHandshake,
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      title: "Finances", 
      desc: "Achieve financial freedom and steward your resources wisely.", 
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      title: "Fitness", 
      desc: "Honor your body with health and wellness for vitality.", 
      icon: Activity,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const featuredAssets = [
    {
      id: "1",
      name: "The 4F Blueprint Masterclass",
      price: "497",
      category: "Digital Course",
      icon: PlayCircle,
      desc: "The complete system for holistic identity transformation.",
      benefits: ["24+ Video Lessons", "Identity Audit Tool", "Private Circle Access"],
      image: "https://images.unsplash.com/photo-1434039390530-fa1d4e0e561a?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "2",
      name: "1:1 Strategic Alignment",
      price: "197",
      category: "Coaching",
      icon: Compass,
      desc: "Deep-dive session to audit your systems and scale impact.",
      benefits: ["60 Min Live Call", "Custom Action Plan", "Week of Support"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f4] selection:bg-brand/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-white/50 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="font-script text-2xl text-text-main leading-none">The Christian Identity</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">WOMAN</span>
            <span className="h-px w-8 bg-brand-light" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-brand uppercase mt-1">4F IDENTITY BLUEPRINT™</span>
        </div>
        
        <div className="hidden md:flex items-center gap-12 text-[13px] font-medium tracking-wide text-text-muted">
          <button className="text-text-main border-b-2 border-brand pb-1">Home</button>
          <a href="#pillars" className="hover:text-text-main transition-colors">The 4Fs</a>
          <a href="#assets" className="hover:text-text-main transition-colors">Asset Collection</a>
          <button className="hover:text-text-main transition-colors">Testimonials</button>
        </div>

        <button 
          onClick={handleLogin}
          className="px-10 py-3 bg-brand text-white font-semibold text-sm rounded-full hover:bg-brand-dark transition-all active:scale-95 shadow-lg shadow-brand/20"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        {/* Watercolor Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-brand-light blur-[120px] rounded-full opacity-30" />
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-brand blur-[150px] rounded-full opacity-10" />
          <img 
            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-10 mix-blend-multiply"
            alt=""
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-script text-6xl md:text-8xl text-text-main mb-8 leading-tight"
          >
            Uncover Your True Self & Live Purposefully
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted mb-12 font-medium leading-relaxed"
          >
            Join the 4F Identity Blueprint™ Challenge: A Digital Transformation Journey for Women focusing on Faith, Family, Finances, and Fitness.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleLogin}
            className="px-14 py-6 bg-brand text-white font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:bg-brand-dark transition-all shadow-2xl shadow-brand/30 active:scale-95"
          >
            Join the Challenge Now
          </motion.button>
        </div>
      </section>

      {/* The 4Fs of Transformation */}
      <section id="pillars" className="py-32 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdf8f4] to-white" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-script text-5xl md:text-6xl text-text-main mb-4">The 4Fs of Transformation</h2>
            <div className="w-24 h-px bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center flex flex-col items-center group"
              >
                <div className="relative mb-10">
                  <div className="w-56 h-56 rounded-full overflow-hidden border-8 border-surface shadow-2xl transition-transform duration-700 group-hover:scale-105">
                    <img 
                      src={pillar.image} 
                      alt={pillar.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-dark shadow-lg">
                    <pillar.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="font-script text-4xl text-text-main mb-4">{pillar.title}</h3>
                <p className="text-sm text-text-muted font-medium leading-relaxed mb-6 px-4">
                  {pillar.desc}
                </p>
                <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand border-b border-brand/20 pb-1 hover:border-brand transition-all">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Collection Showcase */}
      <section id="assets" className="py-40 bg-[#fdf8f4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase mb-6">CURATED RESOURCES</p>
              <h2 className="text-5xl md:text-7xl font-serif text-text-main leading-tight italic">
                Equip Your <span className="font-script text-brand">Legacy</span>
              </h2>
            </div>
            <button 
              onClick={handleLogin}
              className="text-[13px] font-bold text-text-main uppercase tracking-[0.2em] flex items-center gap-4 hover:text-brand transition-colors group"
            >
              Explore Full Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {featuredAssets.map((asset, i) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-[60px] p-10 flex flex-col md:flex-row gap-12 border border-brand-light/10 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-light/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="w-full md:w-1/2 aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-lg">
                  <img 
                    src={asset.image} 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent" />
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 relative z-10">
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-brand-light/20 text-brand text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">
                      {asset.category}
                    </span>
                    <h3 className="text-3xl font-serif text-text-main leading-tight mb-4 group-hover:text-brand transition-colors">{asset.name}</h3>
                    <p className="text-sm text-text-muted font-medium leading-relaxed">{asset.desc}</p>
                  </div>

                  <div className="space-y-4">
                    {asset.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-4 text-xs font-bold text-text-main border-b border-brand-light/10 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Value</span>
                      <span className="text-3xl font-serif italic text-text-main leading-none mt-2">${asset.price}</span>
                    </div>
                    <button 
                      onClick={handleLogin}
                      className="w-16 h-16 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 active:scale-95"
                    >
                      <ShoppingBag className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, text: "Bespoke Curriculum" },
              { icon: Users, text: "Exclusive Circle" },
              { icon: BookOpen, text: "Resource Vault" },
              { icon: Calendar, text: "Live Integration" }
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-4 group cursor-default">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand shadow-sm border border-brand-light/10 group-hover:bg-brand group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  <item.icon className="w-8 h-8" strokeWidth={1} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-[100px] shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Transformation"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-light/30 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-40 h-40 border border-brand/20 rounded-full" />
            </div>

            <div className="space-y-12">
              <span className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase">CORE PHILOSOPHY</span>
              <h2 className="text-5xl md:text-6xl font-serif text-text-main leading-[1.1]">
                Redefine Your Identity. <br/>
                <span className="font-script text-brand text-7xl inline-block mt-4">Gracefully.</span>
              </h2>
              <div className="grid gap-10">
                {[
                  { title: "Identity First", body: "We rebuild the foundation of your self-view based on your unique calling." },
                  { title: "Holistic Sync", body: "Aligning your habits across all 4 pillars for a life of zero friction." }
                ].map((item) => (
                  <div key={item.title} className="flex gap-6">
                    <div className="w-12 h-12 bg-[#fdf8f4] rounded-full flex-shrink-0 flex items-center justify-center shadow-lg text-brand border border-brand-light/10">
                      <div className="w-2 h-2 bg-brand rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text-main mb-2">{item.title}</h4>
                      <p className="text-text-muted leading-relaxed font-medium">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-[#fdf8f4] border-t border-brand-light/20 text-center px-6">
        <div className="font-script text-4xl text-text-main mb-8">The Christian Identity Woman</div>
        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] opacity-60">
          © 2026 • 4F Identity Blueprint™ • Engineered for Grace
        </div>
      </footer>
    </div>
  );
}
