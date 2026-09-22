import React, { useState } from 'react';
import { AuthProvider, useAuth, ROLE_SCREEN_MAP, ROLE_LABEL_MAP } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Screens
import LoginScreen from './components/screens/LoginScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import AiInspectionScreen from './components/screens/AiInspectionScreen';
import TraceabilityScreen from './components/screens/TraceabilityScreen';
import ConsumerPortalScreen from './components/screens/ConsumerPortalScreen';
import ConsumerDashboardScreen from './components/screens/ConsumerDashboardScreen';
import ReportsScreen from './components/screens/ReportsScreen';
import ManufacturerPortalScreen from './components/screens/ManufacturerPortalScreen';
import EcommerceScreen from './components/screens/EcommerceScreen';
import EvidenceVaultScreen from './components/screens/EvidenceVaultScreen';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p className="text-emerald-600 font-bold text-sm tracking-wide">SMARTTRACE</p>
        <p className="text-slate-500 text-xs mt-1 font-medium">Verifying credentials…</p>
      </div>
    </div>
  );
}

// ─── Inner App (has access to auth context) ───────────────────────────────────
function AppInner() {
  const { currentUser, userProfile, authLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("PRD-2024-000789");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading while Firebase auth resolves
  if (authLoading) return <AuthLoadingScreen />;

  // Not logged in → show login
  if (!currentUser || !userProfile) {
    return <LoginScreen />;
  }

  // Determine active screen — use profile role default if not set
  const defaultScreen = ROLE_SCREEN_MAP[userProfile.role] || "dashboard";
  const activeScreen = currentScreen || defaultScreen;

  // Role label for Navbar/Sidebar
  const currentRole = ROLE_LABEL_MAP[userProfile.role] || "Enforcement Officer";

  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          currentScreen={activeScreen}
          onNavigate={handleNavigate}
          currentRole={currentRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          userProfile={userProfile}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* Top Navigation Bar */}
          <Navbar
            currentRole={currentRole}
            onNavigate={handleNavigate}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            currentScreen={activeScreen}
            userProfile={userProfile}
          />

          {/* Dynamic Screen View */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
            {activeScreen === "dashboard" && (
              <DashboardScreen
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activeScreen === "inspection" && (
              <AiInspectionScreen
                selectedProductId={selectedProductId}
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activeScreen === "traceability" && (
              <TraceabilityScreen onNavigate={handleNavigate} />
            )}
            {activeScreen === "consumer-dashboard" && (
              <ConsumerDashboardScreen onNavigate={handleNavigate} />
            )}
            {activeScreen === "consumer" && (
              <ConsumerPortalScreen onNavigate={handleNavigate} initialTab="file" />
            )}
            {activeScreen === "grievances" && (
              <ConsumerPortalScreen onNavigate={handleNavigate} initialTab="grievances" />
            )}
            {activeScreen === "reports" && (
              <ReportsScreen onNavigate={handleNavigate} />
            )}
            {activeScreen === "manufacturer" && (
              <ManufacturerPortalScreen onNavigate={handleNavigate} />
            )}
            {activeScreen === "ecommerce" && (
              <EcommerceScreen onNavigate={handleNavigate} />
            )}
            {activeScreen === "complaints" && (
              <ConsumerPortalScreen onNavigate={handleNavigate} initialTab="grievances" />
            )}
            {activeScreen === "rights" && (
              <ConsumerPortalScreen onNavigate={handleNavigate} initialTab="rights" />
            )}
            {activeScreen === "vault" && (
              <EvidenceVaultScreen onNavigate={handleNavigate} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Root Export — wraps everything in AuthProvider ───────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
