import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Heart, 
  Zap, 
  Moon,
  Sun,
  Coffee,
  Brain,
  Scale
} from "lucide-react";
import { db } from "../lib/firebase";
import { doc, updateDoc, setDoc, getDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

interface Habit {
  id: string;
  name: string;
  category: "faith" | "family" | "finance" | "fitness";
  icon: any;
}

const HABITS: Habit[] = [
  { id: "devotional", name: "Daily Devotional", category: "faith", icon: Brain },
  { id: "prayer", name: "Intensive Prayer", category: "faith", icon: Zap },
  { id: "family_dinner", name: "Family Dinner", category: "family", icon: Coffee },
  { id: "legacy_talk", name: "Legacy Conversation", category: "family", icon: Heart },
  { id: "finance_audit", name: "Daily Budget Audit", category: "finance", icon: Scale },
  { id: "savings", name: "Pipeline Contribution", category: "finance", icon: Flame },
  { id: "workout", name: "Temple Optimization", category: "fitness", icon: Activity },
  { id: "sleep", name: "8hr Sovereign Rest", category: "fitness", icon: Moon },
];

export default function VitalityCheckin({ user }: { user: User }) {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(db, "users", user.uid, "vitality", today);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHasCheckedInToday(true);
        setSelectedHabits(docSnap.data().habits || []);
      }
    };
    checkStatus();
  }, [user]);

  const toggleHabit = (id: string) => {
    setSelectedHabits(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    const score = Math.round((selectedHabits.length / HABITS.length) * 100);

    try {
      // Save daily log
      await setDoc(doc(db, "users", user.uid, "vitality", today), {
        habits: selectedHabits,
        score,
        timestamp: serverTimestamp()
      });

      // Update aggregate progress for charts
      const progressRef = doc(db, "users", user.uid, "progress", "vitality_history");
      const progressSnap = await getDoc(progressRef);
      
      const newEntry = { date: today, velocity: score };
      
      if (progressSnap.exists()) {
        await updateDoc(progressRef, {
          history: arrayUnion(newEntry)
        });
      } else {
        await setDoc(progressRef, {
          history: [newEntry]
        });
      }

      setHasCheckedInToday(true);
    } catch (error) {
      console.error("Failed to log vitality: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasCheckedInToday) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-emerald-500 rounded-[40px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-4xl font-serif text-text-main italic">Vitality Recorded</h2>
          <p className="text-text-muted font-medium italic">Your daily frequency has been stabilized. Legacy is being built.</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="px-12 py-5 bg-brand text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-xl shadow-brand/20"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-16 space-y-4">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-[10px] font-bold text-text-muted hover:text-brand transition-colors uppercase tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase mb-4">DAILY FREQUENCY</p>
            <h1 className="text-5xl md:text-6xl font-serif text-text-main italic leading-tight">Vitality Check-in</h1>
          </div>
          <div className="flex items-center gap-4 px-8 py-4 bg-white rounded-3xl border border-brand-light/10 shadow-sm">
             <Sun className="w-6 h-6 text-amber-500" />
             <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">CURRENT PHASE</p>
                <p className="text-sm font-bold text-text-main mt-1">Growth Transition</p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {HABITS.map((habit, i) => {
          const isSelected = selectedHabits.includes(habit.id);
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleHabit(habit.id)}
              className={cn(
                "p-8 rounded-[40px] border transition-all cursor-pointer flex items-center justify-between group",
                isSelected 
                  ? "bg-brand text-white border-brand shadow-xl shadow-brand/20" 
                  : "bg-white border-brand-light/10 hover:border-brand/40 shadow-sm"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                  isSelected ? "bg-white/20" : "bg-surface text-brand group-hover:bg-brand-light group-hover:text-brand"
                )}>
                  <habit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={cn("text-lg font-bold italic", isSelected ? "text-white" : "text-text-main")}>
                    {habit.name}
                  </h3>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", isSelected ? "text-white/60" : "text-text-muted")}>
                    {habit.category} Alignment
                  </p>
                </div>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isSelected ? "bg-white text-brand" : "bg-surface text-brand/20 border border-brand-light/5"
              )}>
                {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-20 p-12 bg-text-main text-white rounded-[60px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 space-y-4 text-center md:text-left">
           <h3 className="text-3xl font-serif italic">Stabilize Your Frequency</h3>
           <p className="text-white/60 font-medium italic max-w-md">By recording these integrity steps, you are architecting a legacy that lasts beyond your lifetime.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || selectedHabits.length === 0}
          className="relative z-10 px-16 py-6 bg-brand text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 disabled:opacity-50"
        >
          {isSubmitting ? "Recording..." : "Seal Daily Alignment"}
        </button>
      </div>
    </div>
  );
}
