import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  GitFork, 
  AlertOctagon, 
  MessageSquareWarning, 
  FileBarChart2, 
  Factory, 
  ShoppingBag, 
  Layers, 
  Package, 
  Settings, 
  ShieldCheck,
  UserCheck,
  LogOut,
  X,
  History,
  Archive,
  WifiOff
} from 'lucide-react';

export default function Sidebar({ 
  currentScreen, 
  onNavigate, 
  currentRole, 
  isOpen, 
  onClose,
  onLogout,
  userProfile
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Command Dashboard",
      icon: LayoutDashboard,
      badge: null,
      forRoles: ["Enforcement Officer", "Distributor/Wholesaler", "Retailer"]
    },
    {
      id: "inspection",
      label: "AI Packaging Inspection",
      icon: Scan,
      badge: null,
      forRoles: ["Enforcement Officer", "Manufacturer/Packer"]
    },
    {
      id: "traceability",
      label: "Product Traceability",
      icon: GitFork,
      badge: null,
      forRoles: ["Enforcement Officer", "Distributor/Wholesaler", "Retailer"]
    },
    {
      id: "ecommerce",
      label: "E-Commerce Monitor",
      icon: ShoppingBag,
      badge: null,
      forRoles: ["Enforcement Officer", "E-commerce platform"]
    },
    {
      id: "complaints",
      label: "Consumer Grievances",
      icon: MessageSquareWarning,
      badge: null,
      forRoles: ["Enforcement Officer"]
    },
    {
      id: "consumer-dashboard",
      label: "Citizen Dashboard",
      icon: LayoutDashboard,
      badge: null,
      forRoles: ["Consumer"]
    },
    {
      id: "consumer",
      label: "Action Center",
      icon: UserCheck,
      badge: null,
      forRoles: ["Consumer"]
    },
    {
      id: "grievances",
      label: "Active Grievances",
      icon: History,
      badge: null,
      forRoles: ["Consumer"]
    },
    {
      id: "rights",
      label: "Know Your Rights",
      icon: ShieldCheck,
      badge: null,
      forRoles: ["Consumer"]
    },
    {
      id: "manufacturer",
      label: "Manufacturer DPCR Portal",
      icon: Factory,
      badge: "Pre-Market",
      badgeColor: "bg-cyan-100 text-cyan-800",
      forRoles: ["Manufacturer/Packer"]
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: FileBarChart2,
      badge: null,
      forRoles: ["Enforcement Officer"]
    },
    {
      id: "vault",
      label: "Evidence Vault & Drafts",
      icon: Archive,
      badge: null,
      forRoles: ["Enforcement Officer"]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Aside */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight">SMARTTRACE</h2>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Legal Metrology Dept</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Persona Card */}
        <div className="mx-3 my-3 p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0 uppercase">
            {userProfile?.displayName ? userProfile.displayName.substring(0, 2) : currentRole.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">
              {userProfile?.displayName || "Guest User"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentRole === "Enforcement Officer" ? `Badge: ${userProfile?.employeeId || 'LM-OFFICER'}` : currentRole === "Consumer" ? "Citizen Complainant" : "Authorized Business"}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Modules
          </div>

          {menuItems.filter(item => item.forRoles.includes(currentRole)).map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-emerald-100" : "text-slate-400 group-hover:text-emerald-400"
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status / Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>DPCR Engine v2.4</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                Online
              </span>
            </div>

            {currentRole === "Enforcement Officer" && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <WifiOff className="w-3 h-3 text-emerald-500" />
                  <span>Auth Token</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                  Cached / Offline Ready
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 border border-rose-900/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Role / Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}
