import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Layers, 
  LogOut, 
  AlertTriangle,
  Menu,
  Sparkles,
  BookOpen
} from 'lucide-react';
import MasterRulesModal from '../modals/MasterRulesModal';

export default function Navbar({ 
  currentRole, 
  onRoleChange, 
  onNavigate, 
  onToggleSidebar, 
  currentScreen 
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const roles = [
    { id: "Enforcement Officer", label: "Enforcement Officer", desc: "Legal Metrology Inspector", color: "bg-emerald-600" },
    { id: "Manufacturer/Packer", label: "Manufacturer / Brand", desc: "Adani Wilmar QA Team", color: "bg-blue-600" },
    { id: "Consumer", label: "Consumer / Citizen", desc: "Public Grievance Portal", color: "bg-amber-600" },
    { id: "E-commerce platform", label: "E-Commerce Auditor", desc: "Digital Marketplace Monitor", color: "bg-purple-600" },
    { id: "Distributor/Wholesaler", label: "Distributor Node", desc: "Carrying & Forwarding Hub", color: "bg-cyan-600" },
    { id: "Retailer", label: "Retail Storefront", desc: "Point-of-Sale Audit", color: "bg-stone-600" }
  ];

  const notifications = [
    { id: 1, title: "High-Risk Overcharging Detected", desc: "Fortune Oil Batch #B12345A flagged at Vishal Mart (+₹20 over MRP)", time: "10 mins ago", unread: true },
    { id: 2, title: "Underweight Batch Seizure", desc: "XYZ Besan 500g found deficient by 38g in Jaipur", time: "1 hour ago", unread: true },
    { id: 3, title: "New Citizen Grievance #CMP-8842", desc: "Dual MRP sticker complaint assigned to your zone", time: "2 hours ago", unread: false }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Toggle & Brand / Emblem */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">SMART<span className="text-emerald-700">TRACE</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">GovTech</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Legal Metrology Compliance & Traceability Ecosystem
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search / Quick Lookup */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Product ID, Batch No, DPCR or Location (e.g. B12345A)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications & Role Switcher */}
        <div className="flex items-center gap-2.5">
          
          {/* Master Rules Library Quick Button */}
          <button
            onClick={() => setIsRulesOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-500 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Statutory Master Rules</span>
          </button>

          <MasterRulesModal 
            isOpen={isRulesOpen} 
            onClose={() => setIsRulesOpen(false)} 
          />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Alerts & Notifications</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">2 High Priority</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setShowNotificationMenu(false);
                        onNavigate("inspection");
                      }}
                      className={`p-3 hover:bg-slate-50 cursor-pointer text-xs transition-colors ${n.unread ? "bg-emerald-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Static Role Indicator */}
          <div className="relative">
            <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs shadow-sm">
              <div className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">
                {currentRole === "Enforcement Officer" ? "EO" : currentRole === "Consumer" ? "CN" : "MF"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-slate-800 text-xs leading-tight mt-0.5">{currentRole}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
