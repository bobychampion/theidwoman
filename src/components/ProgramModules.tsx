import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, FileText, CheckCircle2, Lock, ArrowLeft, ChevronRight, Bookmark, Circle, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { getUserProgress, toggleModuleCompletion, toggleLessonCompletion } from "../lib/progress";

interface Lesson {
  id: string;
  title: string;
  duration: string;
}

interface Module {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  videoUrl: string;
  locked: boolean;
  lessons: Lesson[];
  image: string;
}

const MODULES_DATA: Module[] = [
  { 
    id: "1", 
    title: "The Sovereign Identity: Rooted in Faith", 
    duration: "45:00", 
    category: "Faith", 
    description: "Reclaim your divine authority and align your core values with eternal truth.", 
    videoUrl: "https://example.com/1", 
    locked: false,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    lessons: [
      { id: "1-1", title: "The Sovereign Identity", duration: "15:00" },
      { id: "1-2", title: "Breaking Secular Labels", duration: "15:00" },
      { id: "1-3", title: "Architectural Foundations", duration: "15:00" }
    ]
  },
  { 
    id: "2", 
    title: "Divine Alignment: The Soul Sync", 
    duration: "36:00", 
    category: "Faith", 
    description: "Master the rhythm of internal peace and external action in perfect harmony.", 
    videoUrl: "https://example.com/2", 
    locked: false,
    image: "https://images.unsplash.com/photo-1518241353349-35439977821c?q=80&w=800&auto=format&fit=crop",
    lessons: [
      { id: "2-1", title: "The Internal Compass", duration: "12:00" },
      { id: "2-2", title: "Emotional Intelligence in Grace", duration: "12:00" },
      { id: "2-3", title: "Physical Embodiment", duration: "12:00" }
    ]
  },
  { 
    id: "3", 
    title: "The Legacy Altar: Family Bonds", 
    duration: "40:00", 
    category: "Family", 
    description: "Build a generational fortress through intentional daily rhythms and covenant love.", 
    videoUrl: "https://example.com/3", 
    locked: false,
    image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?q=80&w=800&auto=format&fit=crop",
    lessons: [
      { id: "3-1", title: "Inheritance vs Legacy", duration: "10:00" },
      { id: "3-2", title: "Daily Rhythms of Grace", duration: "15:00" },
      { id: "3-3", title: "The Covenant Home", duration: "15:00" }
    ]
  },
  { 
    id: "4", 
    title: "Wealth Stewardship: The Pipeline", 
    duration: "50:00", 
    category: "Finances", 
    description: "Architect your financial future to fuel your kingdom mission and family impact.", 
    videoUrl: "https://example.com/4", 
    locked: false,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
    lessons: [
      { id: "4-1", title: "The Steward Mindset", duration: "15:00" },
      { id: "4-2", title: "Asset Allocation for Impact", duration: "20:00" },
      { id: "4-3", title: "Generational Wealth Pipelines", duration: "15:00" }
    ]
  },
  { 
    id: "5", 
    title: "High-Performance Temple: Vitality", 
    duration: "30:00", 
    category: "Fitness", 
    description: "Optimize your physical vessel for maximum longevity and sustained energy.", 
    videoUrl: "https://example.com/5", 
    locked: false,
    image: "https://images.unsplash.com/photo-1571019623124-432a51e18d6e?q=80&w=800&auto=format&fit=crop",
    lessons: [
      { id: "5-1", title: "The Physiology of Purpose", duration: "10:00" },
      { id: "5-2", title: "Bio-Harmonization for Duty", duration: "10:00" },
      { id: "5-3", title: "Rest as a Weapon", duration: "10:00" }
    ]
  },
];

export default function ProgramModules({ user }: { user: any }) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      getUserProgress(user.uid).then(progress => {
        setCompletedModules(progress.completedModules || []);
        setCompletedLessons(progress.completedLessons || []);
      });
    }
  }, [user]);

  const handleToggleModuleComplete = async (moduleId: string) => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    const isCurrentlyCompleted = completedModules.includes(moduleId);
    
    try {
      await toggleModuleCompletion(user.uid, moduleId, !isCurrentlyCompleted);
      setCompletedModules(prev => 
        isCurrentlyCompleted ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
      );
    } catch (error) {
      console.error("Failed to update module progress");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    const isCurrentlyCompleted = completedLessons.includes(lessonId);
    
    try {
      await toggleLessonCompletion(user.uid, lessonId, !isCurrentlyCompleted);
      setCompletedLessons(prev => 
        isCurrentlyCompleted ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
      );
    } catch (error) {
      console.error("Failed to update lesson progress");
    } finally {
      setIsUpdating(false);
    }
  };

  const categories = ["All", "Faith", "Family", "Finances", "Fitness"];
  const filteredModules = filter === "All" ? MODULES_DATA : MODULES_DATA.filter(m => m.category === filter);

  if (selectedModule) {
    const isCompleted = completedModules.includes(selectedModule.id);
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedModule(null)}
          className="flex items-center gap-3 text-[10px] font-bold text-text-muted hover:text-brand transition-colors uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Curriculum
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
          <div className="lg:col-span-8 space-y-12">
            <div className="aspect-video bg-text-main rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center group cursor-pointer border border-brand-light/10">
              <img 
                src={selectedModule.image} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000" 
                referrerPolicy="no-referrer"
                alt="Module Cover"
              />
              <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:bg-brand transition-all">
                <Play className="w-8 h-8 text-white fill-current translate-x-1" />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <span className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase">
                  {selectedModule.category}
                </span>
                <span className="w-1.5 h-1.5 bg-brand-light rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest leading-none flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> {selectedModule.duration}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <h1 className="text-4xl md:text-5xl font-serif text-text-main italic leading-tight">
                  {selectedModule.title}
                </h1>
                <button 
                  onClick={() => handleToggleModuleComplete(selectedModule.id)}
                  disabled={isUpdating}
                  className={cn(
                    "flex items-center justify-center gap-4 px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-full border shadow-lg",
                    isCompleted 
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20" 
                      : "bg-white text-text-main border-brand-light/20 hover:bg-surface"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  {isCompleted ? "Status: Optimized" : "Finalize Integrity"}
                </button>
              </div>
              <p className="text-xl text-text-muted font-medium leading-relaxed max-w-3xl italic">
                {selectedModule.description}
              </p>

              <div className="pt-12 space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand border-b border-brand-light/10 pb-6">Integrity Lessons</h3>
                <div className="space-y-4">
                  {selectedModule.lessons.map((lesson, idx) => {
                    const lessonCompleted = completedLessons.includes(lesson.id);
                    return (
                      <div 
                        key={lesson.id} 
                        className={cn(
                          "p-8 rounded-[30px] border transition-all flex items-center justify-between group",
                          lessonCompleted 
                            ? "bg-emerald-50/30 border-emerald-100" 
                            : "bg-white border-brand-light/10 hover:border-brand/40"
                        )}
                      >
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold",
                            lessonCompleted ? "bg-emerald-100 text-emerald-600" : "bg-surface text-text-muted"
                          )}>
                            0{idx + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-text-main group-hover:text-brand transition-colors italic">{lesson.title}</h4>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{lesson.duration}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggleLessonComplete(lesson.id)}
                          className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                          lessonCompleted ? "bg-emerald-500 text-white" : "bg-surface text-brand/30 hover:bg-brand/10 hover:text-brand"
                        )}>
                          {lessonCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-10 rounded-[50px] border border-brand-light/10 shadow-sm space-y-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-muted">Legacy Assets</h3>
              <div className="space-y-4">
                <button className="flex items-center gap-6 w-full p-8 bg-surface hover:bg-brand hover:text-white transition-all rounded-3xl text-left group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📄</div>
                  <div>
                    <p className="text-sm font-bold leading-tight">Transformation Workbook</p>
                    <p className="text-[10px] font-bold opacity-60 uppercase mt-1 tracking-widest">PDF Archive • 2.4 MB</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-brand text-white p-10 rounded-[50px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-light italic">Secure Intel Vault</h3>
                <textarea 
                  placeholder="Record your revelations here..."
                  className="w-full h-48 bg-white/10 border border-white/20 rounded-3xl p-6 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/20 transition-all resize-none font-medium text-sm leading-relaxed"
                />
                <button className="w-full py-5 bg-white text-brand text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-light hover:text-white transition-all shadow-xl">
                  Seal Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 py-10">
        <div>
          <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase mb-6">INTEGRITY CURRICULUM</p>
          <h1 className="text-5xl md:text-7xl font-serif text-text-main italic leading-tight">The <span className="font-script text-brand">4F</span> Blueprint</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-full border",
                filter === cat ? "bg-brand text-white border-brand shadow-lg shadow-brand/20" : "bg-white text-text-muted border-brand-light/20 hover:bg-surface"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredModules.map((m, i) => {
          const isCompleted = completedModules.includes(m.id);
          const moduleLessons = m.lessons;
          const completedLessonsInModule = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPercentage = Math.round((completedLessonsInModule / moduleLessons.length) * 100);

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => !m.locked && setSelectedModule(m)}
              className={cn(
                "group relative bg-white border border-brand-light/10 rounded-[50px] p-0 transition-all duration-700 overflow-hidden",
                m.locked ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-brand/30 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2"
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={m.image} 
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                  <span className="px-5 py-2 bg-white/80 backdrop-blur-md text-brand text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-sm">
                    {m.category}
                  </span>
                  {isCompleted && (
                    <motion.span 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-5 py-2 bg-emerald-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Optimized
                    </motion.span>
                  )}
                </div>
                {m.locked && (
                  <div className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] flex items-center justify-center">
                    <Lock className="w-10 h-10 text-white/40" />
                  </div>
                )}
              </div>
              <div className="p-10 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-3xl font-serif leading-tight text-text-main group-hover:text-brand transition-all duration-500 italic">
                    {m.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-[10px] font-bold text-brand/60 uppercase tracking-[0.4em] leading-none">
                    <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Investment: {m.duration}</span>
                  </div>

                  <p className="text-[13px] text-text-muted font-medium leading-relaxed line-clamp-2 italic border-l-2 border-brand-light/20 pl-6 py-1 opacity-90">
                    {m.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Integrity Level</span>
                    <span className="text-[10px] font-bold text-brand italic">{progressPercentage}%</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 shadow-sm",
                        progressPercentage === 100 ? "bg-emerald-500 shadow-emerald-500/20" : "bg-brand shadow-brand/20"
                      )}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-brand-light/10 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.3em] text-text-muted group-hover:text-brand transition-colors">
                  Investigate Module <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
