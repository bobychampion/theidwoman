import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Bot, Loader2, Minus } from "lucide-react";
import { cn } from "../lib/utils";

const SYSTEM_PROMPT = `
You are the "Core Catalyst AI", a sophisticated assistant for the 4F Identity Blueprint application.
Your goal is to assist users with:
1. Course Content: Faith (Identity & Purpose), Family (Relational Legacy), Finances (Wealth Stewardship), Fitness (Body Fortification).
2. Booking Procedures: Users can book coaching sessions in the "Booking" section.
3. Payment Issues: Direct them to the administrator for complex refund issues, but help with basic billing navigation.

Tone: Professional, architecturally precise, inspiring, and elegant.
Constraint: If you cannot answer a specific question with high confidence, politely offer to connect the user with the administrator (admin@4fblueprint.com).
Context: The app uses a "Geometric Elegance" theme. Every user is called a "Catalyst".
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => m.text), userMessage].join("\n"),
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      const botText = response.text || "I apologize, Catalyst. I encountered a signal disruption. Would you like to connect with the administrator?";
      setMessages(prev => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "bot", text: "System error. Please contact admin@4fblueprint.com for manual assistance." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 bg-rose-600 text-white rounded-none shadow-2xl flex items-center justify-center z-50 transition-opacity duration-300",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <MessageSquare className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-none border-2 border-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-96 h-[600px] bg-white border border-stone-200 shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col z-[60]"
          >
            {/* Header */}
            <div className="bg-stone-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl font-light">⬡</div>
                <div>
                  <h3 className="text-white text-xs font-bold uppercase tracking-widest leading-none">Core Catalyst AI</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.2em]">Operational</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-stone-500 hover:text-white transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-stone-50/50"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                   <div className="text-rose-600/20 text-6xl">⬡</div>
                   <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-relaxed">
                     Systems optimized. <br/>Awaiting Catalyst inquiry.
                   </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex gap-4",
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 flex-shrink-0 flex items-center justify-center text-xs font-bold",
                    m.role === "user" ? "bg-stone-900 text-white" : "bg-rose-100 text-rose-600"
                  )}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 text-xs font-medium leading-relaxed border",
                    m.role === "user" 
                      ? "bg-stone-900 text-white border-stone-800" 
                      : "bg-white text-stone-800 border-stone-200 shadow-sm"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="max-w-[80%] p-4 bg-white border border-stone-100 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-stone-100 bg-white">
              <div className="flex gap-4 border border-stone-200 p-2 group focus-within:border-rose-300 transition-colors">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Inquire about the blueprint..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-medium py-2 px-2"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-stone-900 text-white p-3 hover:bg-rose-600 transition-colors disabled:opacity-20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
