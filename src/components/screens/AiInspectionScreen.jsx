import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  GitFork, 
  Send, 
  RefreshCw, 
  Eye, 
  Cpu, 
  Layers, 
  ExternalLink,
  Lock,
  MapPin,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getProducts } from '../../services/productsService';
import { submitInspection } from '../../services/inspectionsService';
import { useAuth } from '../../contexts/AuthContext';
import InspectionReportModal from '../modals/InspectionReportModal';
import NoticeModal from '../modals/NoticeModal';
import EvidenceDossierModal from '../modals/EvidenceDossierModal';

export default function AiInspectionScreen({ 
  selectedProductId = "PRD-2024-000789", 
  onNavigate,
  onSelectProduct 
}) {
  const { currentUser, userProfile } = useAuth();
  const [productsList, setProductsList] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState("ocr");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [noticeSentNotice, setNoticeSentNotice] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const liveProducts = await getProducts();
        if (liveProducts && liveProducts.length > 0) {
          setProductsList(liveProducts);
          const found = liveProducts.find(p => p.id === selectedProductId) || liveProducts[0];
          setCurrentProduct(found);
        }
      } catch (err) {
        console.warn("Using default products:", err);
      }
    }
    loadProducts();
  }, [selectedProductId]);

  const handleProductSelect = (product) => {
    setCurrentProduct(product);
    if (onSelectProduct) onSelectProduct(product.id);
    setAnalysisCompleted(true);
  };

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisCompleted(false);

    // Replace simulateAiInspection with an actual delay for now since it's just a UI loader
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);

      // Save real inspection record into Firestore
      submitInspection({
        productId: currentProduct.id,
        product: currentProduct.name,
        manufacturer: typeof currentProduct.manufacturer === 'object' ? currentProduct.manufacturer?.name : (currentProduct.manufacturer || 'Registered Brand'),
        batch: currentProduct.batch?.number || currentProduct.batch || 'B101',
        result: currentProduct.currentPhysicalScan?.overallCompliance || 'Compliant',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        inspector: userProfile?.fullName || currentUser?.email || 'Field Officer',
        inspectorUid: currentUser?.uid || 'anonymous',
        violationType: currentProduct.currentPhysicalScan?.overallCompliance === 'Non-Compliant' ? 'MRP Mismatch / Overcharging' : null,
      }).catch(err => console.error("Error persisting inspection to Firestore:", err));
    });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Modals */}
      <InspectionReportModal 
        product={currentProduct} 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
      <EvidenceDossierModal 
        product={currentProduct} 
        isOpen={isDossierOpen} 
        onClose={() => setIsDossierOpen(false)} 
      />
      <NoticeModal 
        product={currentProduct} 
        isOpen={isNoticeOpen} 
        onClose={() => setIsNoticeOpen(false)}
        onNoticeSent={() => setNoticeSentNotice(true)}
      />

      {!currentProduct ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
            <Scan className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800">No Products Registered</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Please register a product in the Manufacturer DPCR Portal before conducting an AI Packaging Inspection.
          </p>
        </div>
      ) : (
        <>
          {/* Screen Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">AI Packaging Inspection & OCR Audit</h1>
            <StatusBadge status={currentProduct.currentPhysicalScan.overallCompliance} size="md" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span>Inspection ID: <strong className="font-mono text-slate-700">{currentProduct.evidence?.inspectionId || 'INSP-LIVE'}</strong></span>
            <span>•</span>
            <span>Product SKU: <strong className="text-slate-800">{currentProduct.name}</strong></span>
            <span>•</span>
            <span>Batch: <strong className="font-mono text-emerald-800">{typeof currentProduct.batch === 'object' ? currentProduct.batch?.number : currentProduct.batch}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsDossierOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Courtroom Evidence Dossier</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Official Report</span>
          </button>

          <button
            onClick={() => onNavigate("traceability")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 transition-colors shadow-sm"
          >
            <GitFork className="w-4 h-4 text-blue-700" />
            <span>View Traceability</span>
          </button>

          <button
            onClick={() => setIsNoticeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-900/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Case Escalation / Notice</span>
          </button>
        </div>
      </div>

      {noticeSentNotice && (
        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Statutory Notice under Section 36 successfully served to retailer and registered brand entity.</span>
          </div>
          <button onClick={() => setNoticeSentNotice(false)} className="text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Package Selector Carousel / Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Select Product for AI Inspection:</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {productsList.map((p) => {
            const isSelected = currentProduct.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleProductSelect(p)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected 
                    ? "border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/50 scale-[1.02]" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{p.batch.number}</span>
                  <StatusBadge status={p.currentPhysicalScan.overallCompliance} size="sm" />
                </div>
                <p className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{p.manufacturer.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Processing Simulation Banner (when running) */}
      {isAnalyzing && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-emerald-700/50 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center animate-spin">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Neural Packaging Analysis Pipeline Active</h4>
                <p className="text-xs text-emerald-300 font-mono mt-0.5">{analysisStep?.message}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              Stage {analysisStep?.step || 1} of 5 ({analysisStep?.progress || 20}%)
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-500 rounded-full" 
              style={{ width: `${analysisStep?.progress || 20}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Canvas with OCR Bounding Boxes */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Captured Package Specimen</h3>
                <p className="text-xs text-slate-500">Optical capture with OCR detected declaration zones</p>
              </div>
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                <span>Re-Analyze</span>
              </button>
            </div>

            {/* Simulated Label Canvas with Interactive Bounding Boxes */}
            <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 aspect-[4/3] flex items-center justify-center p-4">
              
              {/* Mock Label Graphic Representation */}
              <div className="w-full h-full bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-4 flex flex-col justify-between text-slate-800 font-sans shadow-inner relative select-none">
                
                {/* Brand Header */}
                <div className="border-b border-amber-300 pb-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">
                      {currentProduct.brand}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{currentProduct.name}</h4>
                  </div>
                  <div className="w-8 h-8 rounded bg-amber-200 flex items-center justify-center font-bold text-xs text-amber-900">
                    🌻
                  </div>
                </div>

                {/* Bounding Box 1: Net Qty (Compliant Zone) */}
                <div className="my-1.5 p-1.5 border-2 border-emerald-500 bg-emerald-500/10 rounded relative group">
                  <span className="absolute -top-2.5 left-1 text-[8px] font-mono bg-emerald-600 text-white px-1 py-0.2 rounded font-bold uppercase">
                    OCR: Net Qty [✓ 98.4%]
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    Net Quantity: {currentProduct.currentPhysicalScan.detectedNetQuantity}
                  </p>
                </div>

                {/* Bounding Box 2: MRP (NON-COMPLIANT Overcharging Alert Zone) */}
                <div className={`p-1.5 border-2 rounded relative group ${
                  currentProduct.currentPhysicalScan.detectedMrp > currentProduct.dpcr.mrp 
                    ? "border-rose-600 bg-rose-600/15 animate-pulse" 
                    : "border-emerald-500 bg-emerald-500/10"
                }`}>
                  <span className={`absolute -top-2.5 left-1 text-[8px] font-mono text-white px-1 py-0.2 rounded font-bold uppercase ${
                    currentProduct.currentPhysicalScan.detectedMrp > currentProduct.dpcr.mrp ? "bg-rose-600" : "bg-emerald-600"
                  }`}>
                    {currentProduct.currentPhysicalScan.detectedMrp > currentProduct.dpcr.mrp ? "OCR: MRP [VIOLATION ✕]" : "OCR: MRP [✓ 99.1%]"}
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-900">
                      MRP: ₹{currentProduct.currentPhysicalScan.detectedMrp.toFixed(2)} (Incl. of all taxes)
                    </p>
                    {currentProduct.currentPhysicalScan.detectedMrp > currentProduct.dpcr.mrp && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-200 px-1 rounded">
                        +₹20 Exceeded
                      </span>
                    )}
                  </div>
                </div>

                {/* Bounding Box 3: Batch & Date */}
                <div className="my-1.5 p-1.5 border border-blue-500 bg-blue-500/10 rounded relative">
                  <span className="absolute -top-2.5 left-1 text-[8px] font-mono bg-blue-600 text-white px-1 py-0.2 rounded font-bold uppercase">
                    OCR: Batch & Dates
                  </span>
                  <div className="grid grid-cols-2 text-[10px] text-slate-700 font-medium">
                    <span>Batch: <strong>{currentProduct.currentPhysicalScan.detectedBatch}</strong></span>
                    <span>Mfg: <strong>{currentProduct.currentPhysicalScan.detectedMfgDate}</strong></span>
                  </div>
                </div>

                {/* Bounding Box 4: Manufacturer & Barcode */}
                <div className="pt-1 border-t border-amber-300 flex items-center justify-between text-[9px] text-slate-600">
                  <div className="max-w-[180px]">
                    <p className="font-bold text-slate-800 truncate">{currentProduct.manufacturer.name}</p>
                    <p className="truncate">FSSAI: {currentProduct.currentPhysicalScan.detectedFssai}</p>
                  </div>
                  <div className="font-mono text-center bg-white px-2 py-1 rounded border border-slate-300">
                    <span className="tracking-widest">||||||||||||</span>
                    <p className="text-[8px]">890123456789</p>
                  </div>
                </div>

              </div>

            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>Resolution: <strong>4032 x 3024 (12MP)</strong></span>
              <span>Algorithm: <strong>PaddleOCR + TrOCR</strong></span>
            </div>
          </div>

          {/* Quick Camera / Upload Switcher */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button 
              onClick={handleRunAiAnalysis}
              className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload New Pack</span>
            </button>
            <button 
              onClick={handleRunAiAnalysis}
              className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>Capture via Camera</span>
            </button>
          </div>
        </div>

        {/* Right Column: OCR Extraction & DPCR Comparison Matrix */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Header with Overall Compliance Score */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Legal Metrology Compliance Engine</h3>
                <p className="text-xs text-slate-500">Cross-verified against Digital Product Compliance Record (DPCR)</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Rule Match Score</p>
                  <p className={`text-lg font-black leading-none ${
                    currentProduct.currentPhysicalScan.complianceScore >= 90 ? "text-emerald-600" :
                    currentProduct.currentPhysicalScan.complianceScore >= 75 ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {currentProduct.currentPhysicalScan.complianceScore}%
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                  currentProduct.currentPhysicalScan.overallCompliance === "Compliant" ? "bg-emerald-600 shadow-emerald-500/20" :
                  currentProduct.currentPhysicalScan.overallCompliance === "Warning" ? "bg-amber-600 shadow-amber-500/20" : "bg-rose-600 shadow-rose-500/20"
                }`}>
                  {currentProduct.currentPhysicalScan.overallCompliance === "Compliant" ? "✓" :
                   currentProduct.currentPhysicalScan.overallCompliance === "Warning" ? "⚠" : "✕"}
                </div>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                <span>Extracted Declaration Parameter</span>
                <span>DPCR Baseline vs Pack Scan</span>
              </div>
              
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {currentProduct.currentPhysicalScan.checks.map((chk, idx) => (
                  <div key={idx} className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors ${
                    chk.status === "Non-Compliant" ? "bg-rose-50/60" : ""
                  }`}>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{chk.label}</p>
                      <p className="text-[11px] text-slate-500">{chk.note}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={chk.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offense Detail Card if Non-Compliant */}
            {currentProduct.currentPhysicalScan.violations.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Statutory Violation Detected: {currentProduct.currentPhysicalScan.violations[0].title}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {currentProduct.currentPhysicalScan.violations[0].detail}
                </p>
                <div className="pt-1 text-[11px] font-semibold text-rose-800 flex items-center justify-between">
                  <span>Governing Act: Legal Metrology (Packaged Commodities) Rules 2011</span>
                  <span>Action: Compound Offense Notice</span>
                </div>
              </div>
            )}

          </div>

          {/* Cryptographic Evidence Locker Details */}
          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Evidence Package Generated</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Tamper-Proof Geotagged
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Timestamp</span>
                <span className="font-semibold text-slate-800">{new Date(currentProduct.evidence.timestamp).toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                <span className="font-semibold text-slate-800 truncate block">{currentProduct.evidence.location.split(',')[0]}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">GPS Coords</span>
                <span className="font-mono text-slate-800">{currentProduct.evidence.coordinates}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Terminal ID</span>
                <span className="font-mono text-slate-800">{currentProduct.evidence.deviceId}</span>
              </div>
            </div>

            <div className="pt-1 font-mono text-[9px] text-slate-500 truncate">
              SHA-256 Hash: <span className="text-slate-800">{currentProduct.evidence.sha256Hash}</span>
            </div>
          </div>

        </div>

      </div>
        </>
      )}
    </div>
  );
}
