import { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Heart, 
  Users, 
  Sparkles, 
  MessageCircle, 
  MoreHorizontal,
  Flame,
  Award,
  Crown
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  type: "win" | "prayer" | "general";
  createdAt: any;
  likes: number;
}

export default function SisterhoodCircle({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [messageType, setMessageType] = useState<"win" | "prayer" | "general">("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "sisterhood_messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs.reverse());
    }, (error) => {
      console.error("Sisterhood Circle Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      await addDoc(collection(db, "sisterhood_messages"), {
        text: inputText,
        userId: user.uid,
        userName: user.displayName || "Daughter of Grace",
        userPhoto: user.photoURL,
        type: messageType,
        likes: 0,
        createdAt: serverTimestamp()
      });
      setInputText("");
      setMessageType("general");
    } catch (error) {
      console.error("Failed to release frequency: ", error);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await updateDoc(doc(db, "sisterhood_messages", id), {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Failed to amplify victory: ", error);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col max-w-6xl mx-auto bg-white rounded-[50px] shadow-2xl border border-brand-light/10 overflow-hidden relative">
      {/* Community Header */}
      <div className="px-12 py-8 border-b border-brand-light/10 bg-white/50 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-text-main italic leading-tight">Sisterhood Circle</h2>
            <p className="text-[10px] font-bold text-brand uppercase tracking-[0.3em] mt-1">Global Legacy Frequency</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-brand/5 rounded-full border border-brand/10">
              <Flame className="w-4 h-4 text-brand" />
              <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest">12 Wins This Hour</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-white shadow-sm overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-2">+42 Online</span>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-start gap-6 max-w-[85%]",
                m.userId === user.uid ? "ml-auto flex-row-reverse text-right" : "mr-auto"
              )}
            >
              <div className="relative group">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-brand-light/20 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                  <img src={m.userPhoto || `https://ui-avatars.com/api/?name=${m.userName}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                {m.userId === user.uid && <Crown className="absolute -top-2 -right-2 w-5 h-5 text-amber-500 fill-current drop-shadow-md" />}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2">
                   <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">{m.userName}</span>
                   <span className="w-1 h-1 bg-brand-light/30 rounded-full" />
                   <span className="text-[9px] font-bold text-brand-light/60 uppercase tracking-tighter">
                    {m.createdAt?.toDate ? new Date(m.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                   </span>
                </div>
                
                <div className={cn(
                  "p-8 rounded-[36px] shadow-sm relative group",
                  m.userId === user.uid 
                    ? "bg-text-main text-white rounded-tr-none border border-white/10" 
                    : "bg-surface text-text-main rounded-tl-none border border-brand-light/10"
                )}>
                  {m.type === "win" && (
                    <div className="flex items-center gap-2 mb-3 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full w-fit">
                      <Award className="w-3 h-3" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Legacy Win Captured</span>
                    </div>
                  )}
                  {m.type === "prayer" && (
                    <div className="flex items-center gap-2 mb-4 bg-brand/10 text-brand px-3 py-1 rounded-full w-fit">
                      <Heart className="w-3 h-3 fill-current" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Petitions of Grace</span>
                    </div>
                  )}
                  <p className="text-[15px] font-medium leading-relaxed italic opacity-95">
                    {m.text}
                  </p>
                  
                  {/* Actions Area */}
                  <div className={cn(
                    "absolute top-full mt-3 flex items-center gap-4 transition-all opacity-0 group-hover:opacity-100",
                    m.userId === user.uid ? "right-4" : "left-4"
                  )}>
                    <button 
                      onClick={() => handleLike(m.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-light/10 shadow-sm text-rose-500 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Heart className={cn("w-3.5 h-3.5", m.likes > 0 && "fill-current")} />
                      <span className="text-[10px] font-bold">{m.likes || ""}</span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white border border-brand-light/10 flex items-center justify-center text-text-muted hover:text-brand">
                       <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Composer */}
      <div className="p-10 bg-white/50 backdrop-blur-xl border-t border-brand-light/10 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex gap-3 px-4">
             {[
               { id: "general", label: "General", icon: MessageCircle },
               { id: "win", label: "Legacy Win", icon: Award, color: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200" },
               { id: "prayer", label: "Prayer Request", icon: Heart, color: "hover:bg-brand/5 hover:text-brand hover:border-brand/20" }
             ].map(t => (
               <button
                  key={t.id}
                  onClick={() => setMessageType(t.id as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-3",
                    messageType === t.id 
                      ? "bg-text-main text-white border-text-main shadow-lg" 
                      : cn("bg-white text-text-muted border-brand-light/10", t.color)
                  )}
               >
                 <t.icon className="w-3 h-3" />
                 {t.label}
               </button>
             ))}
          </div>

          <div className="relative group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                messageType === "win" ? "Declare your divine victory..." :
                messageType === "prayer" ? "State your spiritual petition..." :
                "Speak into the legacy..."
              }
              className="w-full bg-white border border-brand-light/20 rounded-[32px] px-10 py-7 text-text-main placeholder:text-brand-light italic focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-sm group-hover:shadow-md"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-brand text-white rounded-[20px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 py-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand animate-pulse" />
              <span className="text-[9px] font-bold text-brand uppercase tracking-widest">Sisterhood Encryption Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
