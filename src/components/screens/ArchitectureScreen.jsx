import React from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Globe, 
  Box, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Atom,
  Server,
  Cloud,
  FileCode,
  Zap,
  Sparkles,
  Camera,
  Network,
  FileText,
  BellRing
} from 'lucide-react';
const techStackData = [
  {
    category: "Frontend Web & Mobile", badgeColor: "bg-blue-100 text-blue-800",
    items: [
      { name: "React + Vite", desc: "Lightning fast UI rendering with HMR" },
      { name: "Tailwind CSS", desc: "Utility-first styling & dark mode" },
      { name: "React Leaflet", desc: "Live geo-spatial mapping for enforcement" }
    ]
  },
  {
    category: "Backend & Data", badgeColor: "bg-emerald-100 text-emerald-800",
    items: [
      { name: "Firebase Firestore", desc: "Real-time NoSQL document database" },
      { name: "Firebase Auth", desc: "Secure RBAC (Role-Based Access Control)" },
      { name: "Cloud Storage", desc: "Cryptographic evidence vault for images" }
    ]
  },
  {
    category: "Computer Vision & AI", badgeColor: "bg-purple-100 text-purple-800",
    items: [
      { name: "PaddleOCR", desc: "Multi-language optical character extraction" },
      { name: "OpenCV Pipeline", desc: "Perspective deskew & binarization pre-processing" },
      { name: "Rule Engine (Rule 6)", desc: "Algorithmic compliance validation logic" }
    ]
  }
];

const howItWorksSteps = [
  { step: 1, title: "DPCR Registration", desc: "Manufacturers digitize packaging specs." },
  { step: 2, title: "E-Commerce Scrape", desc: "Bots check online specs vs DPCR." },
  { step: 3, title: "Field AI Inspection", desc: "Officers scan physical packs via OCR." },
  { step: 4, title: "Cryptographic Evidence", desc: "Violations are hashed & geotagged." },
  { step: 5, title: "Automated Notice", desc: "Rule 6/36 digital notices issued instantly." }
];

export default function ArchitectureScreen({ onNavigate }) {
  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">System Architecture & Technology Stack</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              SIH 2026 Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise microservices topology supporting high-throughput optical character recognition, digital rules validation, and cryptographic audit ledgers.
          </p>
        </div>

        <button
          onClick={() => onNavigate("inspection")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-800/20 transition-all"
        >
          <span>Launch Interactive Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Visual Schema Grid matching user's Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tech Stack Layers (9 Cols) */}
        <div className="lg:col-span-9 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            
            <div className="text-center pb-2 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                TECHNOLOGY STACK
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Modern full-stack architecture designed for seamless FastAPI & Firebase Cloud integration
              </p>
            </div>

            {/* Stack Category Rows */}
            <div className="space-y-3">
              {techStackData.map((layer, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  
                  {/* Layer Label Pill */}
                  <div className={`sm:w-44 p-3 flex items-center justify-center font-extrabold text-[11px] tracking-wider uppercase text-center shrink-0 ${layer.badgeColor}`}>
                    {layer.category}
                  </div>

                  {/* Layer Items Strip */}
                  <div className="flex-1 p-3 flex items-center flex-wrap gap-2.5 bg-white">
                    {layer.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx} 
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-xs group cursor-default"
                        title={item.desc}
                      >
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>{item.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Slogan matching Image 1 */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white py-3.5 px-6 rounded-xl text-center shadow-inner flex items-center justify-center gap-2">
              <span className="text-emerald-400 font-bold">🎯</span>
              <span className="text-xs font-bold tracking-wide">
                Modern Technologies. Intelligent Compliance. End-to-End Traceability.
              </span>
            </div>

          </div>

          {/* FastAPI & Firebase Integration Guide for Developers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Pluggable Architecture (FastAPI + Firebase Integration Ready)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              This prototype is built with a strictly decoupled service layer (<code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">src/services/mockAiService.js</code>). In production, this file swaps directly with real async <code className="font-mono text-slate-800 font-bold">fetch('/api/v1/inspect')</code> endpoints pointing to a <strong>FastAPI</strong> microservice executing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">1. OpenCV Pipeline</p>
                <p className="text-[11px] text-slate-500 mt-1">CLAHE adaptive contrast, Otsu binarization, Hough skew deskewing.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">2. PaddleOCR / TrOCR</p>
                <p className="text-[11px] text-slate-500 mt-1">Multi-lingual character box segmentation with 98.6% character recall.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">3. Firebase & Cloud Firestore</p>
                <p className="text-[11px] text-slate-500 mt-1">Real-time sync of DPCR master documents and citizen complaint queues.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: "HOW IT WORKS" Flow matching Image 1 (3 Cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-20">
            
            <div className="text-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                HOW IT WORKS
              </h3>
              <p className="text-[10px] text-slate-400">Step-by-step enforcement cycle</p>
            </div>

            <div className="space-y-4 relative">
              {howItWorksSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative group">
                  
                  {/* Connecting vertical line */}
                  {idx < howItWorksSteps.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -z-0" />
                  )}

                  {/* Step Icon Circle */}
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm relative z-10">
                    <span className="font-bold text-xs">{step.step}</span>
                  </div>

                  {/* Step Text */}
                  <div className="space-y-0.5 pt-0.5">
                    <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate("dashboard")}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
