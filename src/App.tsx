import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, User, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LayoutDashboard, BookOpen, Calendar, ShoppingBag, User as UserIcon, LogOut, ShieldCheck, Menu, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

// Components
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ProgramModules from "./components/ProgramModules";
import BookingSystem from "./components/BookingSystem";
import Store from "./components/Store";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import Chatbot from "./components/Chatbot";
import AIIdentityAudit from "./components/AIIdentityAudit";
import SisterhoodCircle from "./components/SisterhoodCircle";
import VitalityCheckin from "./components/VitalityCheckin";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check for admin role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin");
        } else {
          // If the user's email is the bootstrapped admin, create their profile with admin role
          const role = user.email === "jabpa87@gmail.com" ? "admin" : "user";
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role,
            createdAt: new Date().toISOString(),
          });
          setIsAdmin(role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-none"
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface text-text-main font-sans selection:bg-brand/20">
        {!user ? (
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        ) : (
          <AuthenticatedApp user={user} isAdmin={isAdmin} />
        )}
      </div>
    </BrowserRouter>
  );
}

function AuthenticatedApp({ user, isAdmin }: { user: User; isAdmin: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = () => signOut(auth);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Learning Paths", path: "/program", icon: BookOpen },
    { name: "Sisterhood", path: "/sisterhood", icon: Users },
    { name: "Coaching", path: "/booking", icon: Calendar },
    { name: "Blueprint Store", path: "/store", icon: ShoppingBag },
    { name: "Profile", path: "/profile", icon: UserIcon },
  ];

  if (isAdmin) {
    navItems.push({ name: "Admin Panel", path: "/admin", icon: ShieldCheck });
  }

  const activeTitle = navItems.find(item => item.path === location.pathname)?.name || "Blueprint Overview";

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-brand-light/20 relative">
        <div className="p-10">
          <Link to="/" className="flex flex-col">
            <span className="font-script text-xl text-text-main leading-none">The Christian Identity</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand uppercase mt-1">4F BLUEPRINT</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full",
                location.pathname === item.path 
                  ? "bg-brand text-white shadow-lg shadow-brand/20" 
                  : "text-text-muted hover:bg-brand-light/10 hover:text-text-main"
              )}
            >
              <item.icon className="w-4 h-4" strokeWidth={2} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-8 bg-brand-light/10 rounded-3xl mb-6 border border-brand-light/20">
            <p className="text-[10px] text-brand font-bold uppercase tracking-[0.2em] mb-4">YOUR PROGRESS</p>
            <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand h-full shadow-[0_0_8px_rgba(192,125,100,0.4)]" style={{ width: "85%" }}></div>
            </div>
            <p className="mt-4 text-[11px] font-bold text-text-main uppercase tracking-widest">Architect Level</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 w-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-brand transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 border-b border-brand-light/10 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 -ml-2 text-text-muted"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-lg text-text-main italic opacity-50 tracking-wide">{activeTitle}</h1>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden sm:block text-right">
              <p className="text-[11px] font-bold text-text-main uppercase tracking-[0.2em]">{user.displayName || "Catalyst"}</p>
              <p className="text-[9px] text-brand font-extrabold uppercase tracking-[0.3em] mt-0.5">AUTHENTICATED</p>
            </div>
            <div className="w-12 h-12 bg-brand-light/20 rounded-full flex items-center justify-center text-brand border border-brand-light/30">
               <UserIcon className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Navigation */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[60] md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 bottom-0 w-80 bg-surface z-[70] md:hidden shadow-2xl flex flex-col p-8"
              >
                <div className="flex flex-col mb-12">
                  <span className="font-script text-2xl text-text-main leading-none">The Christian Identity</span>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-brand uppercase mt-1">4F BLUEPRINT</span>
                </div>
                <nav className="flex-1 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-5 px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-full",
                        location.pathname === item.path 
                          ? "bg-brand text-white shadow-lg shadow-brand/20" 
                          : "text-text-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <button
                  onClick={handleSignOut}
                  className="mt-8 flex items-center gap-4 text-brand font-bold text-[11px] uppercase tracking-[0.2em] px-8"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-surface/50 p-8 md:p-14">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/program" element={<ProgramModules user={user} />} />
              <Route path="/booking" element={<BookingSystem user={user} />} />
              <Route path="/store" element={<Store user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/audit" element={<AIIdentityAudit user={user} />} />
              <Route path="/sisterhood" element={<SisterhoodCircle user={user} />} />
              <Route path="/vitality" element={<VitalityCheckin user={user} />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel user={user} />} />}
            </Routes>
          </div>
        </main>
        {/* Floating Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
}
