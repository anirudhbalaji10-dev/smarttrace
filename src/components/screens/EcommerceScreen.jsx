import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Search, 
  ShieldCheck, 
  Globe, 
  Store,
  Sparkles,
  ArrowRight,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getEcommerceListings } from '../../services/ecommerceService';

export default function EcommerceScreen({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("single"); // "single" or "batch"
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [noticeSent, setNoticeSent] = useState(false);
  const [isBatchScanning, setIsBatchScanning] = useState(false);
  const [batchScanDone, setBatchScanDone] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function loadListings() {
      try {
        const liveListings = await getEcommerceListings();
        if (liveListings && liveListings.length > 0) {
          setListings(liveListings);
          setSelectedListingId(liveListings[0].id);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.warn("Error loading e-commerce listings:", err);
        setListings([]);
      }
    }
    loadListings();
  }, []);

  const currentListing = listings.find(l => l.id === selectedListingId) || listings[0] || null;

  const batchFlaggedItems = listings.filter(l => l.status === "Non-Compliant" || l.status === "Warning");

  const handleIssueNotice = () => {
    setNoticeSent(true);
    setTimeout(() => {
      setNoticeSent(false);
    }, 4000);
  };

  const handleRunBatchScan = () => {
    setIsBatchScanning(true);
    setBatchScanDone(false);
    setTimeout(() => {
      setIsBatchScanning(false);
      setBatchScanDone(true);
    }, 1500);
  };

  if (!currentListing && activeTab === "single") {
    return (
      <div className="space-y-6 pb-16">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">E-Commerce Marketplace Monitor</h1>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab("single")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "single" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Single Listing Audit
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "batch" ? "bg-white text-purple-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
              <span>Bulk Imports</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4 border border-purple-100 shadow-inner">
            <Globe className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800">No Web Scrapes Active</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            The automated web scraper has not ingested any live marketplace URLs yet. Initiate a batch crawl to populate E-Commerce listings.
          </p>
          <button 
            onClick={() => setActiveTab("batch")}
            className="mt-6 px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Go to Bulk Import
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">E-Commerce Marketplace Compliance Monitor</h1>
            {currentListing && <StatusBadge status={currentListing.status} size="sm" />}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data Ingestion & Rule 6(10) Catalog Scanner for <strong>QuickBlink, MegaCart, and ZeptoSpeed</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab("single")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "single" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Single Listing Audit
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "batch" ? "bg-white text-purple-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
              <span>Batch Catalog Import (50 SKUs)</span>
            </button>
          </div>

          {currentListing && (
            <button
              onClick={handleIssueNotice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Issue Rule 6(10) Notice</span>
            </button>
          )}
        </div>
      </div>

      {noticeSent && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-950 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Digital Statutory Notice Served to Marketplace & Merchant Entities!</p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Notice served to <strong>{currentListing?.platform}</strong> and merchant <strong>{currentListing?.sellerName}</strong>. 7-day de-listing mandate initiated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Concept Explainer Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white p-4 rounded-2xl border border-purple-800 shadow-md flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 text-purple-200" />
          </div>
          <div>
            <p className="font-bold text-purple-300">Preventative Pre-Delivery Digital Enforcement</p>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Legal Metrology violations (inflated MRP, fake discounts, missing country of origin) are caught directly on the webpage before the product ever ships to a citizen.
            </p>
          </div>
        </div>
      </div>

      {/* TAB 1: SINGLE LISTING AUDIT */}
      {activeTab === "single" && currentListing && (
        <>
          {/* Select Sample Marketplace Listing */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Marketplace Web Crawl Listings:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {listings.map((l) => {
                const isSelected = currentListing?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedListingId(l.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? "border-purple-600 bg-purple-50/70 ring-2 ring-purple-400 shadow-md" 
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-800">{l.platformLogo || l.platform}</span>
                      <StatusBadge status={l.status} size="sm" />
                    </div>
                    <p className="font-bold text-xs text-slate-900 line-clamp-1">{l.productName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Seller: {l.sellerName}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Grid: E-Commerce Listing vs Registered DPCR */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Comparison Header */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Listing Web Crawl vs Official DPCR Baseline
                </h3>
                <p className="text-xs text-slate-500">
                  Web Crawled URL: <span className="font-mono text-purple-700 font-semibold">{currentListing.listingUrl}</span>
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Crawled: {currentListing.crawledAt}
              </span>
            </div>

            {/* Detailed Side-by-Side Parameter Matrix */}
            <div className="divide-y divide-slate-100 text-xs">
              
              {/* MRP Comparison Row */}
              <div className={`p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
                !currentListing.comparison?.mrp?.isMatch ? "bg-rose-50/70" : ""
              }`}>
                <div className="md:col-span-3">
                  <span className="font-bold text-slate-900 block text-xs">Maximum Retail Price (MRP)</span>
                  <span className="text-[10px] text-slate-500">Rule 18(2) Anti-Price Gouging</span>
                </div>

                <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Registered DPCR MRP</span>
                  <span className="font-black text-slate-900 text-sm">₹{currentListing.comparison?.mrp?.dpcrValue?.toFixed(2)}</span>
                </div>

                <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">E-Commerce Webpage Price</span>
                  <span className={`font-black text-sm ${!currentListing.comparison?.mrp?.isMatch ? "text-rose-600" : "text-emerald-700"}`}>
                    ₹{currentListing.comparison?.mrp?.listingValue?.toFixed(2)}
                  </span>
                </div>

                <div className="md:col-span-3 text-right md:text-left">
                  <StatusBadge status={currentListing.comparison?.mrp?.status || 'Unknown'} size="sm" />
                  <p className="text-[10px] text-slate-600 mt-1">{currentListing.comparison?.mrp?.issueNote}</p>
                </div>
              </div>

              {/* Net Quantity Row */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3">
                  <span className="font-bold text-slate-900 block text-xs">Net Quantity</span>
                  <span className="text-[10px] text-slate-500">Rule 6(1)(b) Standard Metric</span>
                </div>

                <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Registered DPCR</span>
                  <span className="font-bold text-slate-900 text-xs">{currentListing.comparison?.netQuantity?.dpcrValue}</span>
                </div>

                <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Listing Declared Qty</span>
                  <span className="font-bold text-slate-900 text-xs">{currentListing.comparison?.netQuantity?.listingValue}</span>
                </div>

                <div className="md:col-span-3 text-right md:text-left">
                  <StatusBadge status={currentListing.comparison?.netQuantity?.status || 'Unknown'} size="sm" />
                  <p className="text-[10px] text-slate-600 mt-1">{currentListing.comparison?.netQuantity?.issueNote}</p>
                </div>
              </div>

              {/* Country of Origin Row */}
              <div className={`p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
                !currentListing.comparison?.countryOfOrigin?.isMatch ? "bg-rose-50/70" : ""
              }`}>
                <div className="md:col-span-3">
                  <span className="font-bold text-slate-900 block text-xs">Country of Origin</span>
                  <span className="text-[10px] text-slate-500">Rule 6(10) Mandatory Display</span>
                </div>

                <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Registered DPCR</span>
                  <span className="font-bold text-slate-900 text-xs">{currentListing.comparison?.countryOfOrigin?.dpcrValue}</span>
                </div>

                <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Webpage Specification</span>
                  <span className={`font-bold text-xs ${!currentListing.comparison?.countryOfOrigin?.isMatch ? "text-rose-600" : "text-emerald-700"}`}>
                    {currentListing.comparison?.countryOfOrigin?.listingValue}
                  </span>
                </div>

                <div className="md:col-span-3 text-right md:text-left">
                  <StatusBadge status={currentListing.comparison?.countryOfOrigin?.status || 'Unknown'} size="sm" />
                  <p className="text-[10px] text-slate-600 mt-1">{currentListing.comparison?.countryOfOrigin?.issueNote}</p>
                </div>
              </div>

            </div>

            {/* Action Recommendation Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Recommended Legal Action</span>
                <p className="font-bold text-slate-800">{currentListing.recommendedAction}</p>
              </div>

              <button
                onClick={() => onNavigate("inspection")}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Physical Pack in Retail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </>
      )}

      {/* TAB 2: BATCH IMPORT & BULK CATALOG INGESTION SCANNER */}
      {activeTab === "batch" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Batch Toolbar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Marketplace Batch Catalog Ingestion Layer</h3>
              <p className="text-xs text-slate-500">Automated crawlers check listings against registered DPCR specifications.</p>
            </div>

            <button
              onClick={handleRunBatchScan}
              disabled={isBatchScanning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-900/20 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBatchScanning ? "animate-spin" : ""}`} />
              <span>{isBatchScanning ? "Connecting to Scraper API..." : "Run Web Scraper Importer"}</span>
            </button>
          </div>

          {!batchScanDone && listings.length === 0 ? (
            <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center shadow-sm">
               <Globe className="w-12 h-12 text-slate-200 mx-auto mb-3" />
               <h3 className="text-sm font-bold text-slate-700">No batch scan results available.</h3>
               <p className="text-xs text-slate-400 mt-1 mt-2">Run the web scraper importer to begin checking listings.</p>
            </div>
          ) : (
            <>
              {/* Batch KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase block">Total SKUs Ingested</span>
                   <p className="text-2xl font-black text-slate-900 mt-1">{listings.length || 0}</p>
                   <span className="text-[11px] text-slate-500">Edible oils, pulses, dairy & packaged staples</span>
                </div>

                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <span className="text-xs font-bold text-slate-400 uppercase block">Fully Compliant Listings</span>
                   <p className="text-2xl font-black text-emerald-700 mt-1">{listings.length - batchFlaggedItems.length || 0}</p>
                   <span className="text-[11px] text-emerald-600 font-bold">Rule 6(10) passed</span>
                 </div>

                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <span className="text-xs font-bold text-slate-400 uppercase block">Non-Compliant Listings</span>
                   <p className="text-2xl font-black text-rose-600 mt-1">{batchFlaggedItems.length || 0}</p>
                   <span className="text-[11px] text-rose-600 font-bold">Flagged for automated notice</span>
                 </div>
              </div>

               {/* Flagged Items Table */}
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
                 <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                   <h4 className="font-bold text-slate-900">Listings Flagged for Non-Compliance in Latest Crawl</h4>
                   {batchFlaggedItems.length > 0 && (
                     <button
                       onClick={() => alert(`Batch Statutory Show-Cause Notices served to ${batchFlaggedItems.length} seller entities!`)}
                       className="px-3 py-1.5 bg-rose-700 text-white font-bold rounded-lg text-xs hover:bg-rose-600"
                     >
                       Serve Batch Section 36 Notices ({batchFlaggedItems.length})
                     </button>
                   )}
                 </div>

                 <table className="w-full text-left">
                   <thead className="bg-slate-100/70 text-slate-500 uppercase text-[10px] font-bold border-b">
                     <tr>
                       <th className="p-3">SKU ID</th>
                       <th className="p-3">Product Name</th>
                       <th className="p-3">Platform & Seller</th>
                       <th className="p-3">Detected Offense</th>
                       <th className="p-3 text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {batchFlaggedItems.map((item, idx) => (
                       <tr key={idx} className="hover:bg-slate-50">
                         <td className="p-3 font-mono text-slate-400">{item.sku}</td>
                         <td className="p-3 font-bold text-slate-900">{item.title}</td>
                         <td className="p-3 text-slate-600">
                           <strong>{item.platform}</strong> • {item.seller}
                         </td>
                         <td className="p-3 text-rose-700 font-semibold">{item.issue}</td>
                         <td className="p-3 text-right">
                           <StatusBadge status={item.status} size="sm" />
                         </td>
                       </tr>
                     ))}
                     {batchFlaggedItems.length === 0 && (
                       <tr><td colSpan={5} className="p-4 text-center text-slate-400 italic">No non-compliant listings found.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
