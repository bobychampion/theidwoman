import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, DollarSign, Calendar, MessageSquare, TrendingUp, Plus, 
  Search, Filter, BookOpen, Settings, CreditCard, ShieldCheck,
  ChevronRight, Trash2, Edit3, Save, X
} from "lucide-react";
import { cn } from "../lib/utils";

export default function AdminPanel({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "finance" | "users">("overview");

  const stats = [
    { label: "Aggregate Catalysts", value: "1,284", change: "+12.4%", icon: Users, color: "text-brand" },
    { label: "Vault Revenue", value: "$42,500", change: "+8.1%", icon: DollarSign, color: "text-rose-400" },
    { label: "Deployment Rate", value: "68.2%", change: "+5.0%", icon: TrendingUp, color: "text-brand-dark" },
    { label: "Booking Density", value: "82.4%", change: "+15.2%", icon: Calendar, color: "text-emerald-500" },
  ];

  const [modules, setModules] = useState([
    { id: "1", title: "The Sovereign Identity: Rooted in Faith", category: "Faith", students: 842, status: "Active" },
    { id: "2", title: "Divine Alignment: The Soul Sync", category: "Faith", students: 615, status: "Active" },
    { id: "3", title: "The Legacy Altar: Family Bonds", category: "Family", students: 529, status: "Draft" }
  ]);

  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Faith",
    description: "",
    image: "",
    duration: ""
  });

  const handleOpenProvision = (mod?: any) => {
    if (mod) {
      setEditingModule(mod);
      setFormData({
        title: mod.title,
        category: mod.category,
        description: mod.description || "",
        image: mod.image || "",
        duration: mod.duration || ""
      });
    } else {
      setEditingModule(null);
      setFormData({
        title: "",
        category: "Faith",
        description: "",
        image: "",
        duration: ""
      });
    }
    setIsAddingModule(true);
  };

  const handleSaveModule = () => {
    if (editingModule) {
      setModules(prev => prev.map(m => m.id === editingModule.id ? { ...m, ...formData } : m));
    } else {
      setModules(prev => [...prev, { ...formData, id: Date.now().toString(), students: 0, status: "Active" }]);
    }
    setIsAddingModule(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 py-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase mb-6">SYSTEM CORE OPERATIONS</p>
          <h1 className="text-4xl md:text-6xl font-serif text-text-main leading-tight italic">Governance <span className="font-script text-brand">Dashboard</span></h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex bg-surface p-1.5 rounded-full border border-brand-light/10 shadow-inner">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "courses", label: "Courses", icon: BookOpen },
              { id: "users", label: "Ledger", icon: Users },
              { id: "finance", label: "Finance", icon: CreditCard }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-brand shadow-lg border border-brand-light/5" 
                    : "text-text-muted hover:text-brand"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {/* Admin Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div 
                  key={stat.label}
                  className="bg-white p-10 rounded-[40px] border border-brand-light/10 group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center bg-brand-light/10 transition-colors group-hover:bg-brand group-hover:text-white shadow-sm shadow-brand/5 font-serif text-2xl", stat.color)}>
                      <stat.icon className="w-7 h-7" strokeWidth={1} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">{stat.change}</span>
                  </div>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.3em] mb-3">{stat.label}</p>
                  <h3 className="text-4xl font-serif text-text-main group-hover:text-brand transition-colors italic">{stat.value}</h3>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-8 bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-xl">
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-main mb-10">Real-time Progression Matrix</h3>
                 <div className="h-96 w-full flex items-center justify-center bg-surface/50 rounded-[40px] border border-dashed border-brand-light/20">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-brand/20 mx-auto mb-6" strokeWidth={1} />
                      <p className="text-sm font-medium text-text-muted italic">Predictive Analytics Processing...</p>
                    </div>
                 </div>
              </div>
              <div className="xl:col-span-4 bg-brand text-white p-12 rounded-[50px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-10">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-light">System Vitality</h3>
                  <div className="space-y-6">
                    {[
                      { label: "API Efficiency", val: "99.8%" },
                      { label: "Cloud Storage", val: "42GB/100GB" },
                      { label: "Concurrent Souls", val: "84" }
                    ].map(h => (
                      <div key={h.label} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0 font-bold uppercase tracking-widest text-[10px]">
                        <span className="opacity-60">{h.label}</span>
                        <span>{h.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "courses" && (
          <motion.div
            key="courses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-center bg-white p-10 rounded-[50px] border border-brand-light/10 shadow-sm">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand mb-2">COURSE ARCHITECTURE</h3>
                <p className="text-2xl font-serif text-text-main italic">Transformation Modules Manager</p>
              </div>
              <button 
                onClick={() => handleOpenProvision()}
                className="flex items-center gap-3 px-8 py-4 bg-brand text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-brand/20 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" /> Provision New Module
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map(mod => (
                <div key={mod.id} className="bg-white p-10 rounded-[50px] border border-brand-light/10 shadow-sm group hover:border-brand/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="px-5 py-2 bg-brand-light/10 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full">{(mod as any).category}</span>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                        mod.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-stone-50 text-stone-400"
                      )}>{mod.status}</span>
                    </div>
                    <h4 className="text-2xl font-serif text-text-main group-hover:text-brand transition-colors italic leading-snug mb-6">{mod.title}</h4>
                    <p className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                       <Users className="w-4 h-4 opacity-40" strokeWidth={1} /> {mod.students} Catalysts Enrolled
                    </p>
                  </div>
                  <div className="flex gap-4 mt-12 pt-8 border-t border-brand-light/10">
                    <button 
                      onClick={() => handleOpenProvision(mod)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-surface text-brand font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-brand hover:text-white transition-all shadow-sm"
                    >
                       <Edit3 className="w-4 h-4" strokeWidth={1.5} /> Modify
                    </button>
                    <button 
                      onClick={() => setModules(prev => prev.filter(m => m.id !== mod.id))}
                      className="w-14 flex items-center justify-center rounded-2xl border border-rose-100 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                    >
                       <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
           <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[50px] border border-brand-light/10 overflow-hidden shadow-xl"
          >
            <div className="p-12 border-b border-brand-light/10 flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand mb-2">CATALYST DIRECTORY</h3>
                <p className="text-2xl font-serif text-text-main italic">Active Practitioner Ledger</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-surface rounded-2xl text-brand/40 hover:text-brand cursor-pointer transition-all hover:scale-105"><Search className="w-5 h-5" strokeWidth={1} /></div>
                <div className="p-4 bg-surface rounded-2xl text-brand/40 hover:text-brand cursor-pointer transition-all hover:scale-105"><Filter className="w-5 h-5" strokeWidth={1} /></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface/50 text-[11px] font-bold uppercase tracking-[0.3em] text-text-muted border-b border-brand-light/10">
                    <th className="px-12 py-10">Identity</th>
                    <th className="px-12 py-10">Clearance</th>
                    <th className="px-12 py-10">Progression</th>
                    <th className="px-12 py-10 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/5">
                  {[
                    { name: "Sarah Johnson", email: "sarah@example.com", status: "Premium", progress: "85%" },
                    { name: "Michael Chen", email: "micheal@example.com", status: "Basic", progress: "14%" },
                    { name: "Elena Rodriguez", email: "elena@example.com", status: "Premium", progress: "45%" },
                    { name: "David Smith", email: "david@example.com", status: "Premium", progress: "92%" },
                  ].map((u) => (
                    <tr key={u.email} className="group hover:bg-brand-light/5 transition-all">
                      <td className="px-12 py-10 flex items-center gap-8">
                        <div className="w-16 h-16 bg-brand-light/10 text-brand font-serif text-2xl italic flex items-center justify-center rounded-2xl group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-xl font-serif text-text-main group-hover:text-brand transition-colors italic leading-tight">{u.name}</p>
                          <p className="text-[11px] text-brand/40 font-bold uppercase tracking-[0.2em] mt-1">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <span className={cn(
                          "text-[10px] font-bold px-5 py-2 rounded-full border uppercase tracking-widest",
                          u.status === "Premium" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-text-muted/10 text-text-muted border-text-muted/20"
                        )}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-8">
                          <div className="flex-1 max-w-[150px] h-2 bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-brand shadow-lg shadow-brand/20" style={{ width: u.progress }} />
                          </div>
                          <span className="text-sm font-bold text-text-main italic">{u.progress}</span>
                        </div>
                      </td>
                      <td className="px-12 py-10 text-right">
                        <button className="text-[11px] font-bold text-brand hover:text-text-main uppercase tracking-[0.4em] italic border-b border-brand/20 pb-2">Command</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "finance" && (
          <motion.div
            key="finance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-4 space-y-12">
               <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-sm space-y-12">
                 <div>
                   <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand mb-3">CONFIG</h3>
                   <p className="text-2xl font-serif text-text-main italic">Financial Integrity</p>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-surface rounded-3xl group cursor-pointer hover:border-brand border border-transparent transition-all">
                       <div className="flex items-center gap-5">
                          <DollarSign className="w-6 h-6 text-brand" />
                          <span className="text-sm font-bold uppercase tracking-widest">Stripe Live</span>
                       </div>
                       <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-surface opacity-40 grayscale rounded-3xl cursor-not-allowed">
                       <div className="flex items-center gap-5">
                          <DollarSign className="w-6 h-6 text-text-muted" />
                          <span className="text-sm font-bold uppercase tracking-widest">PayPal</span>
                       </div>
                       <div className="w-12 h-6 bg-stone-300 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full" />
                       </div>
                    </div>
                 </div>
               </div>

               <div className="bg-text-main text-white p-12 rounded-[50px] shadow-2xl space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase">Audit Trail</h3>
                  <div className="space-y-6">
                    {[
                      { act: "Sub Renewal", user: "Sarah J.", amt: "+$299" },
                      { act: "Legacy Store", user: "Michael C.", amt: "+$89" },
                      { act: "Coaching Sync", user: "Elena R.", amt: "+$150" }
                    ].map((tx, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase border-b border-white/5 pb-4 last:border-0">
                         <span className="opacity-40">{tx.act} • {tx.user}</span>
                         <span className="text-emerald-400">{tx.amt}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-8 bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand">EXCHANGE PERFORMANCE</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand" /> Projected</span>
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-200" /> Realized</span>
                  </div>
               </div>
               <div className="h-[400px] w-full flex items-end justify-between gap-4 px-4 pb-4">
                  {[45, 62, 58, 84, 75, 92, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                       <div className="relative w-full">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1, duration: 1 }}
                            className="w-full bg-brand/10 group-hover:bg-brand/20 transition-all rounded-t-2xl relative"
                          >
                             <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${h * 0.8}%` }}
                               transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                               className="absolute bottom-0 inset-x-0 bg-brand rounded-t-2xl shadow-lg shadow-brand/20"
                             />
                          </motion.div>
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Day 0{i+1}</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingModule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-text-main/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-[60px] shadow-2xl overflow-hidden"
            >
              <div className="p-12 border-b border-brand-light/10 flex justify-between items-center bg-surface/50">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand mb-2">SYSTEM PROVISIONING</h3>
                  <p className="text-3xl font-serif text-text-main italic capitalize">{editingModule ? "Modify" : "Architect"} Module</p>
                </div>
                <button onClick={() => setIsAddingModule(false)} className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-brand-light/20 text-text-muted hover:text-rose-400 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-12 space-y-10 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-5">Module Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Identity Architecture..." 
                      className="w-full bg-surface border border-brand-light/10 rounded-full px-8 py-5 text-text-main placeholder:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-5">Core Pillar</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-surface border border-brand-light/10 rounded-full px-8 py-5 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium appearance-none"
                    >
                       <option>Faith</option>
                       <option>Family</option>
                       <option>Finances</option>
                       <option>Fitness</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-5">Visual Assets (Unsplash URL)</label>
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..." 
                      className="w-full bg-surface border border-brand-light/10 rounded-full px-8 py-5 text-text-main placeholder:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-5">Runtime Duration</label>
                    <input 
                      type="text" 
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="45:00" 
                      className="w-full bg-surface border border-brand-light/10 rounded-full px-8 py-5 text-text-main placeholder:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-5">Transformation Promise</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="The concise summary of impact..." 
                    className="w-full bg-surface border border-brand-light/10 rounded-[30px] px-8 py-6 text-text-main placeholder:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium h-32 resize-none" 
                  />
                </div>
                <div className="flex gap-6 pt-4">
                   <button 
                     onClick={handleSaveModule}
                     className="flex-1 py-6 bg-brand text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-full shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all"
                   >
                     {editingModule ? "Update Global Vault" : "Seal Module Into Vault"}
                   </button>
                   <button onClick={() => setIsAddingModule(false)} className="px-10 py-6 border border-brand-light/10 text-text-muted font-bold text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-surface transition-all">
                     Abort
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
