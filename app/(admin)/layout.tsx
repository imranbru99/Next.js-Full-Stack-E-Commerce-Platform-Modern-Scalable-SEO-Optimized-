"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Settings, ShoppingBag, LayoutDashboard, Users, CreditCard,
  Layers, Sun, Moon, User, Menu, X, Bell, ChevronRight 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // UI toggle state

  // Sidebar Links Configuration
  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Pos", href: "/admin/pos", icon: CreditCard },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Users },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. SIDEBAR (Desktop & Mobile Overlay) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}
        border-r md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Branding */}
        <div className="h-24 flex items-center px-8 border-b border-inherit">
          <Link href="/" className="font-black text-xl italic tracking-tighter uppercase">
            NEXT<span className="text-slate-400">ECOMMERCE</span>
            <span className="block text-[8px] tracking-[0.4em] not-italic text-blue-500 font-bold">CONTROL PANEL</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-between group px-4 py-4 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? (isDarkMode ? "bg-white text-black" : "bg-black text-white shadow-lg shadow-slate-200") 
                    : (isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Support/User Info */}
        <div className="absolute bottom-0 w-full p-6 border-t border-inherit">
          <div className={`p-4 rounded-2xl flex items-center gap-3 ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}>
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">A</div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest">Admin User</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase">Store Manager</p>
             </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className={`
          h-24 px-8 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md
          ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}
        `}>
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
               {navItems.find(i => i.href === pathname)?.name || "Overview"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`
                p-3 rounded-2xl transition-all border
                ${isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-black"}
              `}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className={`p-3 rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className={`p-8 md:p-12 transition-colors duration-300 ${isDarkMode ? "bg-slate-950" : "bg-slate-50/50"}`}>
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}