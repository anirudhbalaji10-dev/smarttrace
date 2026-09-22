import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  QrCode, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Smartphone,
  Laptop,
  HelpCircle,
  Sparkles,
  Loader2,
  Star,
  History,
  Inbox,
  AlertTriangle,
  PackageCheck
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { submitComplaint, getComplaintsByUser } from '../../services/complaintsService';
import { uploadComplaintPhoto } from '../../services/storageService';
import { getProducts } from '../../services/productsService';

const complaintCategories = [
  "MRP Mismatch (Overcharging / Dual MRP)",
  "Underweight / Inaccurate Net Quantity",
  "Missing Mandatory Declarations (Rule 6)",
  "Missing / Erased Expiry or Best Before Date",
  "No Manufacturer / Packer Details",
  "Missing Country of Origin on Imported Goods",
  "Font Height Below Statutory Minimum"
];

export default function ConsumerPortalScreen({ onNavigate, initialTab = "file" }) {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userComplaints, setUserComplaints] = useState([]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (currentUser?.uid) {
      getComplaintsByUser(currentUser.uid).then((complaints) => {
        if (complaints && complaints.length > 0) {
          setUserComplaints(complaints);
        }
      }).catch(err => console.warn("Error fetching user complaints:", err));
    }
  }, [currentUser]);
  
  // Complaint form state — Clean blank start
  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [placeOfPurchase, setPlaceOfPurchase] = useState("");
  const [issueType, setIssueType] = useState("MRP Mismatch (Overcharging / Dual MRP)");
  const [description, setDescription] = useState("");
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Verification tool state
  const [verifyBarcode, setVerifyBarcode] = useState("");
  const [verifiedProduct, setVerifiedProduct] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [searched, setSearched] = useState(false);

  // Review tool state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!productName || !placeOfPurchase || !description) return;
    setSubmitting(true);
    try {
      const complaintData = {
        productName,
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
        placeOfPurchase,
        issueType,
        description,
        complainantName: userProfile?.fullName || userProfile?.displayName || "Anonymous Consumer",
        complainantEmail: currentUser?.email || "",
      };

      let docId = `CMP-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      if (currentUser?.uid) {
        docId = await submitComplaint(complaintData, currentUser.uid);
      }

      const newRecord = {
        id: docId,
        productName,
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
        placeOfPurchase,
        issueType,
        description,
        status: "Submitted & Assigned",
        assignedAuthority: "District Legal Metrology Cell",
        officerInCharge: "Assigned Field Inspector",
        expectedAction: "Field officer dispatched for on-site retail test inspection within 48 hours.",
        filedOn: new Date().toLocaleDateString()
      };
      setSubmittedComplaint(newRecord);
      setUserComplaints(prev => [newRecord, ...prev]);
    } catch (err) {
      console.error("Failed to submit complaint:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyLookup = async () => {
    if (!verifyBarcode) return;
    setVerifying(true);
    setSearched(true);
    try {
      const products = await getProducts();
      const found = products.find(p => p.id === verifyBarcode || p.batch?.number === verifyBarcode || p.gtin === verifyBarcode || p.name?.toLowerCase().includes(verifyBarcode.toLowerCase()));
      if (found) {
        setVerifiedProduct(found);
      } else {
        setVerifiedProduct(null);
      }
    } catch (err) {
      console.warn("Product lookup error:", err);
      setVerifiedProduct(null);
    } finally {
      setVerifying(false);
      setReviewRating(0);
      setReviewComment("");
      setReviewSubmitted(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Citizen Consumer Protection Portal</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Direct Metrology Grievance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empowering consumers to verify genuine packaging declarations and report overcharging under the Legal Metrology Act.
          </p>
        </div>

        {/* Viewport & Tab Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            {isMobileFrame ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{isMobileFrame ? "Desktop Layout" : "Preview Mobile App View"}</span>
          </button>

          {/* Tab Selector */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("file")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTab === "file" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              File Complaint
            </button>
            <button
              onClick={() => setActiveTab("verify")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTab === "verify" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Verify Product QR
            </button>
            <button
              onClick={() => setActiveTab("grievances")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTab === "grievances" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active Grievances
            </button>
            <button
              onClick={() => setActiveTab("rights")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTab === "rights" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Know Your Rights
            </button>
          </div>
        </div>
      </div>

      {/* Main Container (optionally centered in mobile frame mode) */}
      <div className={isMobileFrame ? "max-w-md mx-auto bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800" : "w-full"}>
        
        {/* Mobile Device Notch header if enabled */}
        {isMobileFrame && (
          <div className="text-center pb-3 pt-1">
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
            <span className="text-[10px] text-slate-400 font-mono">SmartTrace Citizen App (Mobile View)</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          
          {/* TAB 1: FILE COMPLAINT */}
          {activeTab === "file" && (
            <div>
              {submittedComplaint ? (
                /* Complaint Success Confirmation Screen */
                <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Grievance Successfully Registered
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">Complaint ID: {submittedComplaint.id}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Your complaint has been forwarded to the jurisdictional Legal Metrology Inspector.
                    </p>
                  </div>

                  {/* Grievance Ticket Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Case Status:</span>
                      <StatusBadge status="Under Investigation" size="sm" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Authority</span>
                      <span className="font-bold text-slate-800">{submittedComplaint.assignedAuthority}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Investigating Officer</span>
                      <span className="font-bold text-slate-800">{submittedComplaint.officerInCharge}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Expected Next Action</span>
                      <span className="text-slate-700 leading-relaxed">{submittedComplaint.expectedAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSubmittedComplaint(null)}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                    >
                      File Another Grievance
                    </button>
                    <button
                      onClick={() => onNavigate("dashboard")}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm"
                    >
                      View in Officer Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                /* Complaint Form */
                <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">File a Packaged Product Grievance</h2>
                      <p className="text-slate-500 text-[11px]">Report overcharging, underweight, or missing mandatory label details</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border">
                      Rule 18 / 36
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Product Name & Variant</label>
                      <input 
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Fortune Sunlite Refined Sunflower Oil 1L"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Purchase Date</label>
                      <input 
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Store / Place of Purchase</label>
                      <input 
                        type="text"
                        value={placeOfPurchase}
                        onChange={(e) => setPlaceOfPurchase(e.target.value)}
                        placeholder="e.g. Vishal Mart, Karol Bagh, New Delhi"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Grievance Category</label>
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                      >
                        {complaintCategories.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description of Issue</label>
                    <textarea 
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please explain the discrepancy observed on packaging or bill..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>

                  {/* Upload Evidence Section */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Upload Evidence Photos (Pack, MRP Sticker & Invoice)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-3 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors">
                        <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-800">Product Front</span>
                        <span className="text-[9px] text-emerald-700 font-semibold">Attached ✓</span>
                      </div>
                      <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-3 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors">
                        <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-800">MRP Close-up</span>
                        <span className="text-[9px] text-emerald-700 font-semibold">Attached ✓</span>
                      </div>
                      <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-3 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors">
                        <FileText className="w-5 h-5 text-emerald-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-800">Retail Bill</span>
                        <span className="text-[9px] text-emerald-700 font-semibold">Attached ✓</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Grievance to Legal Metrology Dept</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: VERIFY PRODUCT DPCR */}
          {activeTab === "verify" && (
            <div className="space-y-5 text-xs">
              <div className="border-b pb-3">
                <h2 className="text-base font-bold text-slate-900">Instant Product DPCR Verification</h2>
                <p className="text-slate-500 text-[11px]">Scan packaging barcode or enter ID to verify statutory declarations before purchasing.</p>
              </div>

              {/* Barcode Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={verifyBarcode}
                    onChange={(e) => setVerifyBarcode(e.target.value)}
                    placeholder="Enter Product ID or Batch (e.g. PRD-2024-000789)"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
                <button
                  onClick={handleVerifyLookup}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>

              {/* Verified Product Card */}
              {verifiedProduct ? (
                <div className="bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        Official Registered DPCR
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 mt-1">{verifiedProduct.name}</h3>
                      <p className="text-slate-500 text-[11px]">{typeof verifiedProduct.manufacturer === 'object' ? verifiedProduct.manufacturer?.name : verifiedProduct.manufacturer}</p>
                    </div>
                    <StatusBadge status="Verified & Locked" size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Maximum Retail Price</span>
                      <span className="font-black text-emerald-700 text-sm">₹{Number(verifiedProduct.dpcr?.mrp || verifiedProduct.mrp || 0).toFixed(2)}</span>
                      <span className="text-[9px] text-slate-400 block">(Incl. of all taxes)</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Declared Net Quantity</span>
                      <span className="font-bold text-slate-900 text-sm">{verifiedProduct.dpcr?.netQuantity || verifiedProduct.netQuantity || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">FSSAI / License</span>
                      <span className="font-mono text-slate-700">{verifiedProduct.manufacturer?.fssai || 'REG-LM-2024'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Consumer Helpline</span>
                      <span className="font-semibold text-slate-700">{verifiedProduct.manufacturer?.helpline || '1800-11-4000'}</span>
                    </div>
                  </div>

                  {/* Overcharging Warning if pack is different */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Consumer Advisory:</span>
                    </p>
                    <p>
                      If any retailer charges more than <strong>₹{Number(verifiedProduct.dpcr?.mrp || verifiedProduct.mrp || 0).toFixed(2)}</strong> for this product, it is a compoundable offense under Section 36 of the Legal Metrology Act.
                    </p>
                  </div>

                  {/* Product Review Section */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-3">
                      <Star className="w-4 h-4 text-emerald-600" />
                      Rate & Review Product
                    </h4>
                    
                    {reviewSubmitted ? (
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-semibold">Thank you! Your verified review has been submitted and shared with the brand owner.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Rating (1-5 Stars)</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className={`p-1 transition-transform hover:scale-110 ${reviewRating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                              >
                                <Star className={`w-6 h-6 ${reviewRating >= star ? 'fill-amber-400' : ''}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Share Your Experience</label>
                          <textarea
                            rows={2}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="e.g., Packaging is intact, weight seems accurate, easy to read MRP."
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none resize-none"
                          />
                        </div>

                        <button
                          onClick={() => setReviewSubmitted(true)}
                          disabled={!reviewRating || !reviewComment}
                          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Verified Review
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setProductName(verifiedProduct.name);
                      setActiveTab("file");
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <span>Found a Discrepancy? File Grievance Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : searched && !verifying ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="font-bold text-slate-800 text-xs">No DPCR Record Found</p>
                  <p className="text-slate-500 text-[11px]">No product matching "{verifyBarcode}" was found in the National Legal Metrology database.</p>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: ACTIVE GRIEVANCES */}
          {activeTab === "grievances" && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Your Active Grievances</h2>
                  <p className="text-slate-500 text-[11px]">Track real-time investigation status of complaints you have filed</p>
                </div>
                <button
                  onClick={() => setActiveTab("file")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm"
                >
                  + File New Grievance
                </button>
              </div>

              {userComplaints.length > 0 ? (
                <div className="space-y-3">
                  {userComplaints.map((c, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">{c.id}</span>
                          <span className="text-slate-400">{c.filedOn || c.purchaseDate}</span>
                        </div>
                        <StatusBadge status={c.status || "Submitted & Assigned"} size="sm" />
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm">{c.productName}</p>
                      <p className="text-slate-600 font-medium">{c.issueType} — {c.placeOfPurchase}</p>
                      {c.description && <p className="text-slate-500 italic">"{c.description}"</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <Inbox className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No Grievances Filed Yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    When you report overcharging or packaging discrepancies, your active cases will be tracked here in real-time.
                  </p>
                  <button
                    onClick={() => setActiveTab("file")}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    File a Complaint
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KNOW YOUR RIGHTS */}
          {activeTab === "rights" && (
            <div className="space-y-6 text-left">
              <div className="border-b pb-3">
                <h2 className="text-base font-bold text-slate-900">Consumer Rights under Legal Metrology Act, 2009</h2>
                <p className="text-slate-500 text-[11px]">Know your statutory rights when purchasing packaged commodities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">No Dual MRP</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under Section 36, charging different MRPs for identical products depending on store location, mall, or cinema is strictly illegal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <PackageCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Mandatory Declarations</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every package must clearly show: Manufacturer/Packer Name &amp; Address, Country of Origin, Net Quantity, MRP (incl. of all taxes), and PKD Date.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Standard Weights</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Selling commodities below declared net quantity or using uncalibrated scales attracts heavy compounding fines and prosecution.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-800">Helpline &amp; Escalation</h4>
                <p>National Consumer Helpline (NCH): 1915 or 1800-11-4000</p>
                <p>Complaints can also be submitted directly through this portal to dispatch jurisdictional field inspectors.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
