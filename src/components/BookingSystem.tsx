import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, Clock, Video, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface Slot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

const SLOTS: Slot[] = [
  { id: "1", date: "Monday, May 11", time: "10:00 AM", available: true },
  { id: "2", date: "Monday, May 11", time: "11:30 AM", available: true },
  { id: "3", date: "Tuesday, May 12", time: "09:00 AM", available: true },
  { id: "4", date: "Wednesday, May 13", time: "02:00 PM", available: false },
  { id: "5", date: "Thursday, May 14", time: "04:30 PM", available: true },
];

export default function BookingSystem({ user }: { user: any }) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBook = () => {
    // In a real app, this would hit Firestore
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-12"
        >
          <div className="w-32 h-32 bg-brand text-white rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl">
             <CheckCircle2 className="w-16 h-16" strokeWidth={1} />
          </div>
          <div className="space-y-6">
             <h1 className="text-4xl md:text-6xl font-serif text-text-main leading-tight italic">Session <span className="font-script text-brand">Confirmed</span>.</h1>
             <p className="text-lg text-text-muted font-medium max-w-sm mx-auto leading-relaxed">
               Your journey continues! Your strategic session is locked in for <span className="text-brand font-bold">{selectedSlot?.date}</span> at <span className="text-text-main font-bold underline underline-offset-4 decoration-brand/30">{selectedSlot?.time}</span>.
             </p>
          </div>
          
          <div className="bg-white p-10 rounded-[40px] border border-brand-light/10 max-w-sm mx-auto flex items-center gap-8 text-left shadow-lg">
            <div className="w-16 h-16 bg-brand-light/10 text-brand flex items-center justify-center rounded-2xl">
              <Video className="w-8 h-8" strokeWidth={1} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">Secure Bridge</p>
              <p className="text-sm text-text-main font-medium truncate max-w-[180px]">zoom.us/j/123-catalyst</p>
            </div>
          </div>
          
          <button 
            onClick={() => { setIsSuccess(false); setSelectedSlot(null); }}
            className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] hover:text-text-main transition-colors border-b border-brand/20 pb-1"
          >
            Return to Schedule
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <header className="py-10">
        <p className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase mb-6">INTENTIONAL ALLIANCE</p>
        <h1 className="text-4xl md:text-6xl font-serif text-text-main leading-tight italic">Coaching <span className="font-script text-brand">Interface</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-12 xl:col-span-7 space-y-12">
          <div className="bg-white p-4 rounded-[50px] border border-brand-light/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-8 border-b border-brand-light/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-muted">Temporal Availability</h3>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand rounded-full shadow-[0_0_8px_rgba(192,125,100,0.5)]" />
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Status: Receptive</span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "w-full flex items-center justify-between p-8 transition-all duration-300 group rounded-[30px]",
                    !slot.available 
                      ? "opacity-30 cursor-not-allowed grayscale" 
                      : selectedSlot?.id === slot.id 
                        ? "bg-brand text-white shadow-xl shadow-brand/20 scale-[1.02]"
                        : "bg-surface hover:bg-white hover:shadow-lg hover:scale-[1.01]"
                  )}
                >
                  <div className="flex items-center gap-8 text-left">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                      selectedSlot?.id === slot.id ? "bg-white/20" : "bg-white text-text-muted shadow-sm group-hover:text-brand"
                    )}>
                      <Clock className="w-7 h-7" strokeWidth={1} />
                    </div>
                    <div>
                      <p className="text-lg font-serif font-medium">{slot.date}</p>
                      <p className={cn("text-[11px] font-bold uppercase tracking-widest mt-1", selectedSlot?.id === slot.id ? "text-brand-light" : "text-text-muted")}>
                        {slot.time}
                      </p>
                    </div>
                  </div>
                  {slot.available && <ChevronRight className={cn("w-6 h-6 transition-transform group-hover:translate-x-2", selectedSlot?.id === slot.id ? "text-brand-light" : "text-brand/30")} strokeWidth={1} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-5 relative">
          <div className="sticky top-32 space-y-12">
            <AnimatePresence mode="wait">
              {!selectedSlot ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-brand-light/10 border-dashed p-20 rounded-[50px] text-center flex flex-col items-center justify-center min-h-[500px] group"
                >
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500">
                    <CalendarIcon className="w-10 h-10 text-brand/30" strokeWidth={1} />
                  </div>
                  <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.3em]">Initialize Selection</h4>
                  <p className="text-sm text-text-muted font-medium max-w-[240px] mt-6 leading-relaxed italic">Select an available coordination window to begin your session deployment.</p>
                  <div className="mt-12 flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand/20 animate-pulse" />
                     <div className="w-1.5 h-1.5 rounded-full bg-brand/20 animate-pulse delay-75" />
                     <div className="w-1.5 h-1.5 rounded-full bg-brand/20 animate-pulse delay-150" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-2xl space-y-12"
                >
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold tracking-[0.4em] text-brand uppercase">SESSION SUMMARY</h3>
                    <p className="text-3xl font-serif text-text-main italic leading-tight">Catalyst <span className="font-script text-brand text-4xl">Sync</span> Alpha</p>
                  </div>

                  <div className="space-y-10">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-brand">
                        <CalendarIcon className="w-8 h-8" strokeWidth={1} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Temporal Datum</p>
                        <p className="text-xl font-medium text-text-main leading-none">{selectedSlot.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-brand">
                        <Clock className="w-8 h-8" strokeWidth={1} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Universal Time</p>
                        <p className="text-xl font-medium text-text-main leading-none">{selectedSlot.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-brand">
                        <Video className="w-8 h-8" strokeWidth={1} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Medium</p>
                        <p className="text-xl font-medium text-text-main leading-none italic uppercase tracking-tighter">1:1 Encrypted Bridge</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-brand-light/10 flex flex-col gap-6">
                    <button 
                      onClick={handleBook}
                      className="w-full py-6 bg-brand text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-brand-dark active:scale-95 transition-all shadow-xl shadow-brand/20"
                    >
                      Authenticate Session
                    </button>
                    <button 
                      onClick={() => setSelectedSlot(null)}
                      className="w-full py-4 text-text-muted font-bold uppercase tracking-[0.4em] text-[10px] hover:text-brand transition-colors"
                    >
                      Abort Procedure
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
