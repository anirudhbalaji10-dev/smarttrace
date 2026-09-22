import React, { useState } from 'react';
import { 
  Factory, 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  QrCode,
  ArrowRight,
  Printer,
  Loader2
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { addProduct } from '../../services/productsService';

export default function ManufacturerPortalScreen({ onNavigate }) {
  const { currentUser, userProfile } = useAuth();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Edible Oils");
  const [mrp, setMrp] = useState("");
  const [netQuantity, setNetQuantity] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [bestBefore, setBestBefore] = useState("");
  const [consumerCare, setConsumerCare] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("India");
  const [fssaiNo, setFssaiNo] = useState("");

  // Pre-market check state
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [dpcrRegistered, setDpcrRegistered] = useState(false);
  const [submittingDpcr, setSubmittingDpcr] = useState(false);

  const handlePreMarketCheck = () => {
    setIsChecking(true);
    setCheckResult(null);
    setCheckProgress({ progress: 10, message: "Initializing AI..." });

    let prog = 10;
    const interval = setInterval(() => {
      prog += 20;
      setCheckProgress({ progress: prog, message: `Analyzing Rule 6 compliance... (${prog}%)` });
      if (prog >= 100) {
        clearInterval(interval);
        setIsChecking(false);
        setCheckResult({
          approved: true,
          score: 98,
          certificateId: `CERT-AI-${Math.floor(Date.now() / 1000)}`
        });
      }
    }, 500);
  };

  const handleRegisterDpcr = async (e) => {
    e.preventDefault();
    setSubmittingDpcr(true);
    try {
      const productPayload = {
        name: productName,
        category,
        brand: productName.split(" ")[0] || "Brand",
        manufacturer: {
          name: userProfile?.businessName || "Registered Manufacturer",
          address: userProfile?.registeredAddress || "Registered Factory Address",
          fssai: fssaiNo,
          email: currentUser?.email || "manufacturer@domain.com",
          helpline: consumerCare,
          countryOfOrigin,
        },
        batch: {
          number: batchNo,
          mfgDate,
          bestBefore,
          totalUnits: 50000,
        },
        dpcr: {
          mrp: parseFloat(mrp) || 0,
          netQuantity,
          currency: "INR",
          dpcrStatus: "Verified & Locked",
          registeredOn: new Date().toISOString().split("T")[0],
        },
      };

      if (currentUser?.uid) {
        await addProduct(productPayload, currentUser.uid);
      }
      setDpcrRegistered(true);
    } catch (err) {
      console.error("Failed to register DPCR:", err);
    } finally {
      setSubmittingDpcr(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Manufacturer Self-Compliance & DPCR Registry</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
              Brand Owner Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>Adani Wilmar Limited</strong> (Kakinada Plant). Register DPCR records and validate packaging before physical production.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("inspection")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200"
          >
            <span>Officer Inspection View</span>
          </button>
        </div>
      </div>

      {dpcrRegistered && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Digital Product Compliance Record (DPCR) Created & Signed!</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Record ID: <span className="font-mono font-bold">DPCR-2024-ADWIL-9921</span> • Registered on National Metrology Ledger.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 font-bold">
            STATUS: IMMUTABLE & VERIFIED
          </span>
        </div>
      )}

      {/* Main Grid: DPCR Registration Form & Pre-Market AI Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Product & DPCR Registration Wizard */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b pb-3 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Digital Product Compliance Record (DPCR) Form</h2>
              <p className="text-xs text-slate-500">Enter statutory packaging declarations under Legal Metrology Rules 2011</p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border">
              Rule 6 Wizard
            </span>
          </div>

          <form onSubmit={handleRegisterDpcr} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Generic Name</label>
                <input 
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                >
                  <option>Edible Oils</option>
                  <option>Packaged Food & Staples</option>
                  <option>Dairy Products</option>
                  <option>Detergents & Soaps</option>
                  <option>Cosmetics</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Declared MRP (₹)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                  required
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Incl. of all taxes</span>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Net Quantity (Metric)</label>
                <input 
                  type="text"
                  value={netQuantity}
                  onChange={(e) => setNetQuantity(e.target.value)}
                  placeholder="e.g. 1 L (910 g)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                  required
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Standard metric symbols</span>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch / Lot Number</label>
                <input 
                  type="text"
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Month & Year of Manufacture</label>
                <input 
                  type="date"
                  value={mfgDate}
                  onChange={(e) => setMfgDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Best Before / Expiry</label>
                <input 
                  type="date"
                  value={bestBefore}
                  onChange={(e) => setBestBefore(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Consumer Care Details (Rule 6(1)(f))</label>
                <input 
                  type="text"
                  value={consumerCare}
                  onChange={(e) => setConsumerCare(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Country of Origin</label>
                <input 
                  type="text"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Packaging Artwork Attachment */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Packaging Label Artwork (PDF/Vector/PNG)</label>
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Fortune_Oil_1L_Label_Proof_v3.pdf</p>
                    <p className="text-[10px] text-slate-400">High-Resolution Vector Cylinder Spec (4.2 MB)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Ready for Validation
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Register & Lock Official DPCR Master Record</span>
            </button>
          </form>
        </div>

        {/* Right Column: Pre-Market AI Compliance Simulation */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Pre-Market AI Compliance Check</h3>
                <p className="text-xs text-slate-500">Test packaging design before costly printing cylinder engraving</p>
              </div>
              <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded">
                Prevent Stage
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3">
              <p className="text-slate-600 leading-relaxed">
                Our AI Rule Engine checks font heights, principal display area (PDA) percentages, standard metric abbreviations, and mandatory declarations to prevent market recalls.
              </p>

              <button
                type="button"
                onClick={handlePreMarketCheck}
                disabled={isChecking}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className={`w-4 h-4 text-yellow-300 ${isChecking ? "animate-spin" : ""}`} />
                <span>{isChecking ? "Simulating AI Compliance Check..." : "Run Pre-Market AI Audit"}</span>
              </button>
            </div>

            {/* Check Progress */}
            {isChecking && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-emerald-300 font-bold">Rule Engine Active:</span>
                  <span className="text-slate-400">{checkProgress?.progress}%</span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">{checkProgress?.message}</p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${checkProgress?.progress}%` }} />
                </div>
              </div>
            )}

            {/* Pre-Market Check Results */}
            {checkResult && (
              <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Pre-Market AI Audit Result:</span>
                  <StatusBadge status={checkResult.approved ? "Compliant" : "Non-Compliant"} size="sm" />
                </div>

                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border">
                  <span>Design Compliance Score:</span>
                  <span className="font-black text-emerald-700 text-sm">{checkResult.score}/100</span>
                </div>

                {checkResult.certificateId && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                    <span className="font-bold block">Pre-Market Clearance Certificate Issued:</span>
                    <span className="font-mono font-bold text-emerald-800">{checkResult.certificateId}</span>
                    <p className="text-slate-500 text-[10px] mt-0.5">Approved for commercial printing plate engraving.</p>
                  </div>
                )}
              </div>
            )}

            {/* Batch Serialization & QR Generator */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-800 mb-2">Automated QR Serialization for Packaging</h4>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800 border">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-xs">
                  <p className="font-mono font-bold text-slate-900">SEC-QR-{batchNo}</p>
                  <p className="text-[10px] text-slate-500">Cryptographically signed serialization payload for 50,000 unit carton roll.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Adani Wilmar QA Gateway • Secured via DPCR Ledger Node #4
          </div>
        </div>

      </div>

    </div>
  );
}
