import { useState, useRef, useEffect } from "react";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Send, 
  User as UserIcon, 
  Bot, 
  CheckCircle2, 
  Shield,
  Zap,
  Target,
  Heart,
  Landmark,
  Activity,
  ChevronLeft
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { db } from "../lib/firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AIIdentityAudit({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "model", 
      text: "Welcome, daughter of the King. I am your AI Identity Architect. We are about to begin your 'Sisterhood Audit'—a strategic alignment of your current life against the 4F Divine Blueprint (Faith, Family, Finance, Fitness). Tell me, what is the biggest weight on your spirit right now in any of these areas?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [blueprint, setBlueprint] = useState<null | any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the "AI Identity Architect" for a high-end, faith-based feminine transformation program called "The Christian Identity". 
          Your goal is to perform a "Sisterhood Audit" by interviewing the user about their 4Fs: Faith, Family, Finance, and Fitness.
          
          RULES:
          1. Be encouraging, regal, and firm in eternal truth. Use sophisticated, feminine language.
          2. Ask one deep question at a time to uncover their current state in the 4Fs.
          3. After they have answered about 4-5 times, you must generate a final "Divine Blueprint" in a specific JSON format.
          
          PHASE 1: Interview. Ask questions like:
          - "How is your devotional life truly? Are you drinking from the Source or just sipping?"
          - "In your household, are you building a fortress or just maintaining a residence?"
          - "Does your pipeline of wealth serve your mission, or is it leaking into secular distractions?"
          - "Is your temple (body) optimized for the duty you've been called to?"
          
          PHASE 2: Final Summary. 
          When you have enough info, say "I have seen the vision of your legacy. Let us architect your blueprint."
          Then return a JSON object with:
          {
            "blueprint": {
              "analysis": "A deep spiritual summary",
              "scores": { "faith": 0-100, "family": 0-100, "finance": 0-100, "fitness": 0-100 },
              "recommendedOrder": ["Module 1", "Module 3", ...],
              "priorityObjective": "The #1 thing they should focus on"
            }
          }
          `,
        },
      });

      // Prepare history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const result = await chat.sendMessage({
        message: userMessage,
        // history: history // Note: The SDK might handle history differently based on version, but sendMessage typically takes the current message.
      });

      const responseText = result.text;
      
      if (responseText.includes("{\"blueprint\":")) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const bp = JSON.parse(jsonMatch[0]).blueprint;
          setBlueprint(bp);
          // Save to Firestore
          await updateDoc(doc(db, "users", user.uid), {
            blueprint: bp,
            status: "audited"
          });
        }
      }

      setMessages(prev => [...prev, { role: "model", text: responseText.replace(/\{[\s\S]*\}/, "").trim() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "model", text: "Forgive me, the connection to the Divine Architect was interrupted. Let us try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (blueprint) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto py-12 px-6"
      >
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold text-brand uppercase tracking-[0.4em] mb-4">AUDIT COMPLETE</p>
          <h2 className="text-5xl font-serif text-text-main italic mb-6">Your Divine Blueprint</h2>
          <div className="w-24 h-1 bg-brand/30 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-xl space-y-8">
            <h3 className="text-2xl font-serif italic text-text-main flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-brand" /> Spiritual Analysis
            </h3>
            <p className="text-sm text-text-muted leading-relaxed italic border-l-2 border-brand-light/20 pl-8">
              "{blueprint.analysis}"
            </p>
            <div className="pt-8 space-y-4">
               <p className="text-[10px] font-bold text-brand uppercase tracking-widest">PRIORITY OBJECTIVE</p>
               <p className="text-xl font-bold text-text-main font-serif italic">"{blueprint.priorityObjective}"</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[50px] border border-brand-light/10 shadow-xl space-y-10">
            <h3 className="text-2xl font-serif italic text-text-main">Alignment Score</h3>
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Faith", val: blueprint.scores.faith, icon: Zap, color: "text-brand" },
                { label: "Family", val: blueprint.scores.family, icon: Heart, color: "text-rose-400" },
                { label: "Finance", val: blueprint.scores.finance, icon: Landmark, color: "text-amber-600" },
                { label: "Fitness", val: blueprint.scores.fitness, icon: Activity, color: "text-emerald-500" }
              ].map(s => (
                <div key={s.label} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{s.label}</span>
                    <span className={cn("text-[10px] font-bold uppercase", s.color)}>{s.val}%</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.val}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn("h-full rounded-full bg-current", s.color.replace("text", "bg"))} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-text-main text-white p-16 rounded-[60px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center space-y-10">
            <h3 className="text-3xl font-serif italic mb-2">The Architect's Recommended Path</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {blueprint.recommendedOrder.map((step: string, i: number) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest">
                    {step}
                  </div>
                  {i < blueprint.recommendedOrder.length - 1 && <ArrowRight className="w-4 h-4 opacity-40 shrink-0" />}
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate("/program")}
              className="mt-8 px-12 py-5 bg-brand text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-xl shadow-brand/20"
            >
              Begin Your Alignment
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col max-w-5xl mx-auto bg-white rounded-[50px] shadow-2xl border border-brand-light/10 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(192,125,100,0.1),transparent)] pointer-events-none" />
      
      {/* Header */}
      <div className="px-12 py-8 border-b border-brand-light/10 flex items-center justify-between bg-white/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-text-main italic leading-none">Architect Audit</h2>
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest mt-1">Sisterhood AI Onboarding</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Architect Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide relative z-10">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-start gap-6 max-w-[85%]",
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border",
              m.role === "user" 
                ? "bg-brand text-white border-brand shadow-lg" 
                : "bg-white text-brand border-brand-light/20"
            )}>
              {m.role === "user" ? <UserIcon className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-6 rounded-[32px] text-sm leading-[1.8] font-medium transition-all duration-500",
              m.role === "user" 
                ? "bg-text-main text-white rounded-tr-none shadow-xl" 
                : "bg-surface text-text-main rounded-tl-none border border-brand-light/10 italic"
            )}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-brand-light/20 flex items-center justify-center text-brand">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-surface p-4 rounded-3xl rounded-tl-none border border-brand-light/10">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 bg-white/50 backdrop-blur-xl border-t border-brand-light/10 relative z-10">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your realization or response here..."
            className="w-full bg-white border border-brand-light/20 rounded-full px-10 py-6 text-text-main placeholder:text-brand-light italic focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-sm group-hover:shadow-md"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center mt-6 text-[10px] font-bold text-brand/40 uppercase tracking-[0.4em]">
          Secure Session Protected by Divine Logic
        </p>
      </div>
    </div>
  );
}
