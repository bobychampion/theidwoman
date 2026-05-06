import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Video, 
  ChevronRight, 
  Cross, 
  Heart, 
  Landmark, 
  Activity,
  Target,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area
} from "recharts";
import { cn } from "../lib/utils";
import { getUserProgress } from "../lib/progress";

export default function Dashboard({ user }: { user: User }) {
  const [progData, setProgData] = useState<{ completedModules: string[] }>({ completedModules: [] });

  useEffect(() => {
    if (user) {
      getUserProgress(user.uid).then(setProgData);
    }
  }, [user]);

  const totalModules = 5;
  const totalCompleted = progData.completedModules.length;
  const overallPercentage = Math.round((totalCompleted / totalModules) * 100);

  const stats = [
    { label: "Faith Journey", progress: progData.completedModules.filter(id => ["1", "2"].includes(id)).length * 50, icon: Cross, color: "text-brand" },
    { label: "Family Bonds", progress: progData.completedModules.includes("3") ? 100 : 0, icon: Heart, color: "text-rose-400" },
    { label: "Asset Growth", progress: progData.completedModules.includes("4") ? 100 : 0, icon: Landmark, color: "text-amber-600" },
    { label: "Vitality Score", progress: progData.completedModules.includes("5") ? 100 : 0, icon: Activity, color: "text-emerald-500" }
  ];

  const chartData = [
    { subject: 'Faith', A: stats[0].progress, fullMark: 100 },
    { subject: 'Family', A: stats[1].progress, fullMark: 100 },
    { subject: 'Finance', A: stats[2].progress, fullMark: 100 },
    { subject: 'Fitness', A: stats[3].progress, fullMark: 100 },
  ];

  const trendData = [
    { name: 'Start', progress: 0 },
    { name: 'Week 1', progress: 15 },
    { name: 'Week 2', progress: 30 },
    { name: 'Week 3', progress: 45 },
    { name: 'Current', progress: overallPercentage },
  ];

  const recentActivities = [
    { id: 1, title: "Identity Masterclass: The Core", type: "Video", time: "2 hrs ago", status: "completed" },
    { id: 2, title: "Monthly Financial Steward Sync", type: "Coaching", time: "Tomorrow", status: "upcoming" },
    { id: 3, title: "Family Alignment Workshop", type: "Blueprint", time: "3 days ago", status: "completed" },
  ];

  return (
    <div className="space-y-16">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] mb-6">WELCOME BACK, CATALYST</p>
          <h2 className="text-4xl md:text-6xl font-serif text-text-main leading-tight">
            Building Your <span className="font-script text-brand italic">Legacy</span>,<br/>
            One Pillar at a Time.
          </h2>
        </div>
        <div className="flex gap-4">
          <button className="px-10 py-5 bg-white border border-brand-light/20 text-[11px] font-bold uppercase tracking-[0.2em] text-text-main rounded-full hover:bg-surface transition-all active:scale-95">
            Legacy Settings
          </button>
          <button className="px-10 py-5 bg-brand text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 active:scale-95">
            New Objective
          </button>
        </div>
      </div>

      {/* Dynamic Insights - Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-10">
              <p className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] mb-3">4F BALANCE</p>
              <h3 className="text-3xl font-serif text-text-main italic">Identity Alignment</h3>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#f1e0d8" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#c07d64', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar
                    name="Progress"
                    dataKey="A"
                    stroke="#c07d64"
                    fill="#c07d64"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
           <div className="relative z-10 flex flex-col h-full">
            <div className="mb-10 flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] mb-3">PROGRESS TREND</p>
                <h3 className="text-3xl font-serif text-text-main italic">Growth Velocity</h3>
              </div>
              <div className="flex items-center gap-2 bg-brand-light/10 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Active Growth</span>
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c07d64" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c07d64" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(192,125,100,0.1)' }}
                    itemStyle={{ color: '#c07d64', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="progress" stroke="#c07d64" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[40px] border border-brand-light/10 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-brand-light/10", stat.color)}>
              <stat.icon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">{stat.label}</p>
            <p className="text-4xl font-serif text-text-main group-hover:text-brand transition-colors">{stat.progress}%</p>
            <div 
              className="absolute bottom-0 left-0 h-1 bg-brand/30 transition-all duration-1000" 
              style={{ width: `${stat.progress}%` }} 
            />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Active Learning Path */}
        <div className="lg:col-span-2 space-y-10 bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-serif text-text-main mb-2 italic">Current Transformation Path</h3>
              <p className="text-xs text-text-muted font-medium tracking-tight">Stage {totalCompleted + 1} of {totalModules}: Foundations of Authority</p>
            </div>
            <Link to="/program" className="w-12 h-12 rounded-full border border-brand-light/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </Link>
          </div>

          <div className="aspect-[21/9] bg-surface rounded-[40px] relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1518063311540-064010d7a0ee?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              alt="Course cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/80 to-transparent flex items-end p-12">
              <div className="flex items-center gap-6 text-white w-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Video className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">UP NEXT</p>
                  <h4 className="text-xl font-medium tracking-tight">Module {totalCompleted + 1}: Reclaiming Time Sovereignty</h4>
                </div>
                <Link to="/program" className="px-10 py-4 bg-white text-brand font-bold text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-surface transition-all active:scale-95">
                  Resume
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Timeline */}
        <div className="space-y-10 bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-sm">
          <div className="flex flex-col">
            <h3 className="text-2xl font-serif text-text-main mb-2 italic tracking-tight">Timeline</h3>
            <p className="text-xs text-text-muted font-medium">Synced with your 4F Blueprint</p>
          </div>

          <div className="space-y-8">
            {recentActivities.map((activity, i) => (
              <div key={activity.id} className="flex gap-6 group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full z-10",
                    activity.status === 'completed' ? 'bg-brand' : 'bg-brand-light ring-4 ring-brand-light/20'
                  )} />
                  {i !== recentActivities.length - 1 && (
                    <div className="w-px h-full bg-brand-light/20 absolute top-3" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">{activity.type} • {activity.time}</p>
                  <h4 className="text-sm font-bold text-text-main group-hover:text-brand transition-colors leading-tight">{activity.title}</h4>
                </div>
                <ChevronRight className="w-4 h-4 text-brand/20 group-hover:text-brand transition-colors" />
              </div>
            ))}
          </div>

          <button className="w-full py-5 border border-brand-light/20 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-brand hover:border-brand transition-all rounded-full">
            View Full Chronicle
          </button>
        </div>
      </div>

      {/* Recommended Area */}
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-serif text-text-main italic">Strategic Recommendations</h3>
          <button className="text-[11px] font-bold text-brand uppercase tracking-[0.3em] border-b border-brand/20 pb-1">Analyze My Data</button>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
           {[
             { title: "Financial Steward Handbook", cat: "Assets", icon: Target },
             { title: "90-Day Vitality Protocol", cat: "Fitness", icon: Activity },
             { title: "The Relational Legacy Guide", cat: "Family", icon: Heart }
           ].map((rec) => (
             <div key={rec.title} className="bg-white p-10 rounded-[40px] border border-brand-light/10 hover:border-brand/40 transition-all group cursor-pointer">
               <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-brand-dark mb-8 group-hover:bg-brand group-hover:text-white transition-all">
                 <rec.icon className="w-6 h-6" strokeWidth={1.5} />
               </div>
               <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-3">{rec.cat}</p>
               <h4 className="text-lg font-bold text-text-main group-hover:text-brand transition-colors leading-tight">{rec.title}</h4>
               <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5 text-brand" />
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
