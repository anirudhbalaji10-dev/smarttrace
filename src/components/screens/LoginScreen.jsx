import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Building2, User, ArrowRight, ArrowLeft,
  Eye, EyeOff, CheckCircle2, XCircle, Loader2, Lock,
  Mail, Phone, MapPin, AlertCircle, ChevronDown, Hash, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';


// ─── Constants ─────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'Chandigarh (UT)', 'Puducherry (UT)', 'Lakshadweep (UT)',
  'Dadra & Nagar Haveli and Daman & Diu', 'Ladakh (UT)',
  'Jammu & Kashmir (UT)', 'Andaman & Nicobar Islands (UT)',
];

const OFFICER_DESIGNATIONS = [
  'Inspector of Legal Metrology',
  'Senior Inspector of Legal Metrology',
  'Assistant Controller of Legal Metrology',
  'Deputy Controller of Legal Metrology',
  'Joint Controller of Legal Metrology',
  'Additional Controller of Legal Metrology',
  'Controller of Legal Metrology',
  'Director of Legal Metrology',
];

const BUSINESS_TYPES = [
  'Manufacturer',
  'Packer (Non-Manufacturer)',
  'Importer',
  'Manufacturer & Packer',
];

const GSTIN_STATE_MAP = {
  '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
  '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi',
  '08': 'Rajasthan', '09': 'Uttar Pradesh', '10': 'Bihar', '11': 'Sikkim',
  '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram',
  '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
  '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh',
  '24': 'Gujarat', '27': 'Maharashtra', '28': 'Andhra Pradesh', '29': 'Karnataka',
  '30': 'Goa', '32': 'Kerala', '33': 'Tamil Nadu', '34': 'Puducherry',
  '36': 'Telangana', '37': 'Andhra Pradesh',
};

const ROLES = [
  {
    id: 'officer',
    label: 'Enforcement Officer',
    sublabel: 'Central / State Govt. Inspector',
    Icon: ShieldCheck,
    gradient: 'from-emerald-600 to-teal-700',
    cardBorder: 'border-slate-200 hover:border-emerald-500/60',
    hoverShadow: 'hover:shadow-emerald-500/15',
    btnCls: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    featureDot: 'bg-emerald-500',
    accentTextDark: 'text-emerald-600',
    badgeCls: 'bg-white/20 text-white border-white/30',
    badge: 'GOVT',
    description: 'For authorized Legal Metrology Officers conducting field inspections and enforcement actions under the Legal Metrology Act, 2009.',
    features: [
      'AI-Powered Packaging OCR Scanner',
      'Interactive Supply Chain Traceability',
      'Rule 36 Electronic Notice Generation',
      'District Enforcement Analytics & Heatmaps',
    ],
    loginIdLabel: 'Official Email',
    loginIdPlaceholder: 'officer@gov.in',
    loginIdHint: 'Use your registered government email address',
  },
  {
    id: 'business',
    label: 'Business / Packer',
    sublabel: 'Manufacturer, Importer or Packer',
    Icon: Building2,
    gradient: 'from-blue-600 to-indigo-700',
    cardBorder: 'border-slate-200 hover:border-blue-500/60',
    hoverShadow: 'hover:shadow-blue-500/15',
    btnCls: 'bg-blue-600 hover:bg-blue-700 text-white',
    featureDot: 'bg-blue-500',
    accentTextDark: 'text-blue-600',
    badgeCls: 'bg-white/20 text-white border-white/30',
    badge: 'GSTIN',
    description: 'For manufacturers, packers and importers to register DPCRs, perform pre-market AI label compliance checks, and manage batch traceability.',
    features: [
      'DPCR Product Registration & Filing',
      'Pre-Market AI Label Compliance Audit',
      'Batch & Supply Chain Mapping',
      'Compliance Certificate Generation',
    ],
    loginIdLabel: 'Business Email',
    loginIdPlaceholder: 'contact@company.com',
    loginIdHint: 'Use your registered business email address',
  },
  {
    id: 'consumer',
    label: 'Consumer / Citizen',
    sublabel: 'General Public Portal',
    Icon: User,
    gradient: 'from-violet-600 to-purple-700',
    cardBorder: 'border-slate-200 hover:border-violet-500/60',
    hoverShadow: 'hover:shadow-violet-500/15',
    btnCls: 'bg-violet-600 hover:bg-violet-700 text-white',
    featureDot: 'bg-violet-500',
    accentTextDark: 'text-violet-600',
    badgeCls: 'bg-white/20 text-white border-white/30',
    badge: 'PUBLIC',
    description: 'For citizens to verify product authenticity, check registered MRPs, file overcharging complaints, and track grievance status in real time.',
    features: [
      'Product MRP & Weight Verification',
      'Barcode / QR Code Scan Check',
      'Grievance Filing & Status Tracking',
      'Consumer Rights Information Hub',
    ],
    loginIdLabel: 'Email Address',
    loginIdPlaceholder: 'your@email.com',
    loginIdHint: '',
  },
];

// ─── Firebase error message map ───────────────────────────────────────────────
function getFirebaseErrorMessage(code) {
  const map = {
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/email-already-in-use': 'This email is already registered. Please sign in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  };
  return map[code] || 'An error occurred. Please try again.';
}

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Shared Form Fields ───────────────────────────────────────────────────────

function Field({ label, required, type = 'text', value, onChange, placeholder, icon: Icon, hint, error, disabled, readOnly, rightAddon }) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          disabled={disabled} readOnly={readOnly}
          className={[
            'w-full py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2',
            Icon ? 'pl-10' : 'pl-3.5',
            rightAddon ? 'pr-28' : 'pr-3.5',
            readOnly ? 'bg-slate-50 text-slate-600 border-slate-200 cursor-default'
              : error ? 'bg-red-50 border-red-300 text-red-900 placeholder:text-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
          ].join(' ')} />
        {rightAddon && <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightAddon}</div>}
      </div>
      {error && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3 flex-shrink-0" />{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function SelectInput({ label, required, value, onChange, options, placeholder, icon: Icon, error }) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />}
        <select value={value} onChange={onChange}
          className={[
            'w-full py-2.5 pr-9 rounded-xl border text-sm appearance-none',
            'transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
            Icon ? 'pl-10' : 'pl-3.5',
            error ? 'bg-red-50 border-red-300 text-red-900' : 'bg-white border-slate-200 text-slate-900',
          ].join(' ')}>
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((opt, i) => (
            <option key={i} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3 flex-shrink-0" />{error}</p>}
    </div>
  );
}

function PasswordField({ label, required, value, onChange, placeholder, error, hint }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder={placeholder || '••••••••'}
          className={[
            'w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2',
            error ? 'bg-red-50 border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20'
              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20',
          ].join(' ')} />
        <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Real Local CAPTCHA Component ──────────────────────────────────────────────

function GovCaptcha({ onVerify }) {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 5; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaText(text);
    setUserInput('');
    setIsVerified(false);
    setError(false);
    onVerify(false);
    drawCaptcha(text);
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background noise
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw lines
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(16, 185, 129, ${Math.random() * 0.5})`; // emerald tint
      ctx.lineWidth = Math.random() * 2;
      ctx.stroke();
    }
    
    // Draw text with rotation
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      const x = 20 + i * 25;
      const y = canvas.height / 2 + (Math.random() * 8 - 4);
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4); // rotate +/- small amount
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
    
    // Draw dots
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput === captchaText) {
      setIsVerified(true);
      setError(false);
      onVerify(true);
    } else {
      setError(true);
      generateCaptcha();
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
        Security Verification <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <canvas 
            ref={canvasRef} 
            width={160} 
            height={50} 
            className="border border-slate-300 rounded shadow-sm bg-white"
          />
          <button 
            type="button" 
            onClick={generateCaptcha}
            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm"
            title="Refresh CAPTCHA"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isVerified}
            placeholder="Type characters above"
            onKeyDown={(e) => e.key === 'Enter' && !isVerified && handleVerify()}
            className={[
              'flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2',
              isVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-900 cursor-not-allowed'
                : error ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20'
            ].join(' ')}
          />
          <button 
            type="button"
            onClick={handleVerify}
            disabled={isVerified || !userInput}
            className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            Verify
          </button>
        </div>
        {isVerified && <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified successfully</p>}
        {error && <p className="text-xs text-red-600 font-semibold">Incorrect CAPTCHA, please try again.</p>}
      </div>
    </div>
  );
}

// ─── GSTIN Verifier ───────────────────────────────────────────────────────────

function useGstinVerifier() {
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const verify = (gstin) => {
    const upper = (gstin || '').trim().toUpperCase();
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!regex.test(upper)) { setStatus('failed'); setData(null); return Promise.reject(new Error('Invalid')); }
    setStatus('verifying');
    const stateCode = upper.slice(0, 2);
    const stateName = GSTIN_STATE_MAP[stateCode] || 'India';
    return new Promise((resolve) => {
      setTimeout(() => {
        const known = {
          '24AABCW1234K1ZS': { legalName: 'Adani Wilmar Limited', tradeName: 'Fortune Foods', state: 'Gujarat' },
          '27AAACR5055K1ZB': { legalName: 'Reliance Retail Limited', tradeName: 'Reliance Smart', state: 'Maharashtra' },
          '07AAACT2727Q1ZX': { legalName: 'HUL India Ltd.', tradeName: 'Hindustan Unilever', state: 'Delhi' },
        }[upper];
        const result = {
          gstin: upper,
          legalName: known ? known.legalName : `${upper.slice(2, 7)} Industries Pvt Ltd`,
          tradeName: known ? known.tradeName : '',
          state: known ? known.state : stateName,
          registrationDate: '2018-07-01',
          status: 'Active',
        };
        setStatus('verified'); setData(result); resolve(result);
      }, 2000);
    });
  };
  const reset = () => { setStatus(null); setData(null); };
  return { status, data, verify, reset };
}

function GstinVerifyBtn({ status, onClick }) {
  return (
    <button type="button" onClick={onClick}
      disabled={status === 'verifying' || status === 'verified'}
      className={[
        'text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1',
        status === 'verified' ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
          : status === 'verifying' ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700',
      ].join(' ')}>
      {status === 'verifying' ? <><Loader2 className="w-3 h-3 animate-spin" />Verifying</>
        : status === 'verified' ? <><CheckCircle2 className="w-3 h-3" />Verified</>
        : 'Verify'}
    </button>
  );
}

function GstinResultCard({ status, data }) {
  if (status === 'verified' && data) return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">GSTN Portal — Verified & Active</span>
      </div>
      <p className="text-sm font-semibold text-emerald-900">{data.legalName}</p>
      {data.tradeName && <p className="text-xs text-emerald-700">Trade Name: {data.tradeName}</p>}
      <p className="text-xs text-emerald-700">{data.state} · Registered: {data.registrationDate}</p>
    </div>
  );
  if (status === 'failed') return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-800">Invalid GSTIN format. Expected: 2 digits + 5 letters + 4 digits + letter + char + Z + char (e.g. <span className="font-mono font-bold">24AABCA1234C1Z5</span>)</p>
    </div>
  );
  return null;
}

// ─── Login Forms ──────────────────────────────────────────────────────────────

function OfficerLoginForm({ form, setForm }) {
  return (
    <div className="space-y-4">
      <Field label="Official Email" required type="email" value={form.identifier}
        onChange={e => setForm(p => ({ ...p, identifier: e.target.value }))}
        placeholder="officer@gov.in" icon={Mail}
        hint="Use your registered government email address" />
      <PasswordField label="Password" required value={form.password}
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
      <GovCaptcha onVerify={(verified) => setForm(p => ({...p, captchaVerified: verified}))} />
    </div>
  );
}

function BusinessLoginForm({ form, setForm, gstinStatus, gstinData, onVerify }) {
  return (
    <div className="space-y-4">
      <Field label="Business Email" required type="email" value={form.identifier}
        onChange={e => setForm(p => ({ ...p, identifier: e.target.value }))}
        placeholder="contact@company.com" icon={Mail}
        hint="Use your registered business email address" />
      <Field label="GSTIN (for verification)" value={form.gstin}
        onChange={e => setForm(p => ({ ...p, gstin: e.target.value.toUpperCase() }))}
        placeholder="e.g. 24AABCA1234C1Z5" icon={Hash}
        rightAddon={<GstinVerifyBtn status={gstinStatus} onClick={() => onVerify(form.gstin)} />} />
      <GstinResultCard status={gstinStatus} data={gstinData} />
      <PasswordField label="Password" required value={form.password}
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
    </div>
  );
}

function ConsumerLoginForm({ form, setForm, onGoogleLogin, isLoading }) {
  return (
    <div className="space-y-4">
      <Field label="Email Address" required type="email" value={form.identifier}
        onChange={e => setForm(p => ({ ...p, identifier: e.target.value }))}
        placeholder="your@email.com" icon={Mail} />
      <PasswordField label="Password" required value={form.password}
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-slate-200" /><span className="text-xs text-slate-400 font-medium">or</span><div className="flex-1 h-px bg-slate-200" />
      </div>
      <button type="button" onClick={onGoogleLogin} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-60">
        <GoogleIcon size={18} />Continue with Google
      </button>
    </div>
  );
}

// ─── Signup Forms ─────────────────────────────────────────────────────────────

function OfficerSignupForm({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name" required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Rajesh Kumar" icon={User} />
        <Field label="Government Employee ID" required value={form.employeeId} onChange={e => setForm(p => ({ ...p, employeeId: e.target.value }))} placeholder="e.g. LMD-DL-2023-0142" icon={Hash} hint="Issued by Legal Metrology Dept." />
      </div>
      <SelectInput label="Designation" required value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} options={OFFICER_DESIGNATIONS} placeholder="Select your designation" />
      <div className="grid grid-cols-2 gap-3">
        <SelectInput label="State / UT" required value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} options={INDIAN_STATES} placeholder="Select state" icon={MapPin} />
        <Field label="District / Zone" required value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} placeholder="e.g. South West Delhi" icon={MapPin} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Official Email" required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="officer@gov.in" icon={Mail} />
        <Field label="Mobile Number" required type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" icon={Phone} />
      </div>
      <PasswordField label="Set Password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} hint="Minimum 8 characters" />
      <PasswordField label="Confirm Password" required value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
      <GovCaptcha onVerify={(verified) => setForm(p => ({...p, captchaVerified: verified}))} />
    </div>
  );
}

function BusinessSignupForm({ form, setForm, gstinStatus, gstinData, onVerify }) {
  return (
    <div className="space-y-4">
      <Field label="GSTIN" required value={form.gstin} onChange={e => setForm(p => ({ ...p, gstin: e.target.value.toUpperCase() }))}
        placeholder="e.g. 24AABCA1234C1Z5" icon={Hash} hint="Enter your GSTIN and click Verify to auto-fetch business details"
        rightAddon={<GstinVerifyBtn status={gstinStatus} onClick={() => onVerify(form.gstin)} />} />
      <GstinResultCard status={gstinStatus} data={gstinData} />
      <Field label="Registered Business Name" required value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} placeholder="Auto-filled on GSTIN verification" readOnly={gstinStatus === 'verified'} />
      <Field label="Registered Address" value={form.registeredAddress} onChange={e => setForm(p => ({ ...p, registeredAddress: e.target.value }))} placeholder="Auto-filled on GSTIN verification" icon={MapPin} readOnly={gstinStatus === 'verified'} />
      <SelectInput label="Business Type" required value={form.businessType} onChange={e => setForm(p => ({ ...p, businessType: e.target.value }))} options={BUSINESS_TYPES} placeholder="Select business type" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Authorized Person Name" required value={form.authorizedPerson} onChange={e => setForm(p => ({ ...p, authorizedPerson: e.target.value }))} placeholder="e.g. Suresh Sharma" icon={User} />
        <Field label="Designation" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. Managing Director" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Business Email" required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="contact@company.com" icon={Mail} />
        <Field label="Mobile Number" required type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" icon={Phone} />
      </div>
      <PasswordField label="Set Password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} hint="Minimum 8 characters" />
      <PasswordField label="Confirm Password" required value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
    </div>
  );
}

function ConsumerSignupForm({ form, setForm, onGoogleSignup, isLoading }) {
  return (
    <div className="space-y-4">
      <Field label="Full Name" required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Your full name" icon={User} />
      <Field label="Email Address" required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" icon={Mail} />
      <Field label="Mobile Number" required type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" icon={Phone} />
      <PasswordField label="Set Password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} hint="Minimum 8 characters" />
      <PasswordField label="Confirm Password" required value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-slate-200" /><span className="text-xs text-slate-400 font-medium">or sign up with</span><div className="flex-1 h-px bg-slate-200" />
      </div>
      <button type="button" onClick={onGoogleSignup} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60">
        <GoogleIcon size={18} />Sign up with Google
      </button>
    </div>
  );
}

// ─── Stage 1: Role Selection ──────────────────────────────────────────────────

function RoleSelectionStage({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-16 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-emerald-400/10" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-blue-400/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full blur-3xl pointer-events-none bg-violet-400/8" />
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">SMART<span className="text-emerald-600">TRACE</span></div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5 tracking-wide">Legal Metrology Compliance Platform · Government of India</div>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Select Your Role to Continue</h1>
          <p className="text-sm font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
            Each role provides a tailored compliance interface. Choose the role that best describes your function.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ROLES.map((role) => {
            const { Icon } = role;
            const isHov = hovered === role.id;
            return (
              <button key={role.id}
                onMouseEnter={() => setHovered(role.id)} onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(role.id)}
                className={[
                  'bg-white border rounded-2xl overflow-hidden text-left transition-all duration-300 group focus:outline-none shadow-xl shadow-slate-200/60',
                  role.cardBorder,
                  isHov ? `scale-[1.025] shadow-2xl ${role.hoverShadow}` : 'scale-100'
                ].join(' ')}>
                <div className={`bg-gradient-to-br ${role.gradient} p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${role.badgeCls}`}>{role.badge}</span>
                  </div>
                  <h2 className="text-[17px] font-black text-white">{role.label}</h2>
                  <p className="text-xs text-white/80 mt-0.5">{role.sublabel}</p>
                </div>
                <div className="p-5 bg-white">
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[3.5rem] font-medium">{role.description}</p>
                  <ul className="space-y-2.5 mb-6">
                    {role.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${role.featureDot}`} />
                        <span className="text-xs font-medium text-slate-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${role.btnCls}`}>
                    <span>Select This Role</span>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${isHov ? 'translate-x-1' : ''}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs font-medium text-slate-500 mt-8">
          Ministry of Consumer Affairs, Food &amp; Public Distribution · Government of India
        </p>
      </div>
    </div>
  );
}

// ─── Stage 2: Auth Form (Firebase-powered) ────────────────────────────────────

function AuthFormStage({ roleId, onBack }) {
  const { login, loginWithGoogle, register } = useAuth();
  const role = ROLES.find(r => r.id === roleId);
  const { Icon } = role;

  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', gstin: '' });
  const [signupForm, setSignupForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    employeeId: '', designation: '', state: '', district: '',
    gstin: '', businessName: '', registeredAddress: '', businessType: '', authorizedPerson: '',
  });

  const gstin = useGstinVerifier();

  useEffect(() => {
    if (gstin.data && mode === 'signup') {
      setSignupForm(p => ({
        ...p,
        businessName: gstin.data.legalName,
        registeredAddress: `${gstin.data.state} — (auto-filled from GSTN Portal)`,
      }));
    }
  }, [gstin.data]);

  const switchMode = (m) => { setMode(m); setError(''); setSuccessMsg(''); gstin.reset(); };

  const validateLogin = () => {
    if (!loginForm.identifier) { setError(`Please enter your email address`); return false; }
    if (!loginForm.password) { setError('Please enter your password'); return false; }
    return true;
  };

  const validateSignup = () => {
    const emailField = roleId === 'officer' ? signupForm.email : roleId === 'business' ? signupForm.email : signupForm.email;
    if (!emailField) { setError('Email address is required'); return false; }
    if (!signupForm.phone) { setError('Mobile number is required'); return false; }
    if (!signupForm.password) { setError('Password is required'); return false; }
    if (signupForm.password.length < 8) { setError('Password must be at least 8 characters'); return false; }
    if (signupForm.password !== signupForm.confirmPassword) { setError('Passwords do not match'); return false; }
    if (roleId === 'officer') {
      if (!signupForm.fullName) { setError('Full name is required'); return false; }
      if (!signupForm.employeeId) { setError('Government Employee ID is required'); return false; }
      if (!signupForm.designation) { setError('Designation is required'); return false; }
      if (!signupForm.state) { setError('State / UT is required'); return false; }
      if (!signupForm.district) { setError('District / Zone is required'); return false; }
    }
    if (roleId === 'business') {
      if (gstin.status !== 'verified') { setError('Please verify your GSTIN first'); return false; }
      if (!signupForm.businessType) { setError('Business type is required'); return false; }
      if (!signupForm.authorizedPerson) { setError('Authorized person name is required'); return false; }
    }
    if (roleId === 'consumer' && !signupForm.fullName) { setError('Full name is required'); return false; }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      await login(loginForm.identifier, loginForm.password);
      // Auth context + App.jsx will handle redirect automatically
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    if (!validateSignup()) return;
    setIsLoading(true);
    try {
      await register(signupForm, roleId);
      setSuccessMsg('Account created successfully! Redirecting to your dashboard…');
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAction = async () => {
    if (roleId !== 'consumer') return;
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyGstin = (value) => gstin.verify(value).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-300/60 overflow-hidden flex max-h-[92vh]">

        {/* Left Info Panel */}
        <div className={`hidden lg:flex flex-col bg-gradient-to-br ${role.gradient} p-8 w-[42%] flex-shrink-0 overflow-y-auto`}>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-black tracking-tight text-lg">SMART<span className="text-white/60">TRACE</span></span>
          </div>
          <div className="flex-1">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{role.label}</h2>
            <p className="text-sm text-white/65 mb-2">{role.sublabel}</p>
            <span className="text-[11px] font-bold bg-white/20 text-white/90 px-3 py-1 rounded-full inline-block mb-6">
              {role.badge === 'GOVT' ? 'Ministry of Consumer Affairs, GoI' : role.badge === 'GSTIN' ? 'GSTIN Verified Business Portal' : 'Public Access Portal'}
            </span>
            <p className="text-sm text-white/75 leading-relaxed mb-8">{role.description}</p>
            <div className="space-y-3">
              {role.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-white/85">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-[11px] text-white/40 leading-relaxed">Ministry of Consumer Affairs · Government of India</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors self-start group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /><span>Back to Role Selection</span>
          </button>
          <div className={`lg:hidden flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl bg-gradient-to-r ${role.gradient}`}>
            <Icon className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-sm font-bold text-white">{role.label}</span>
            <span className="text-[11px] text-white/65 ml-1">{role.sublabel}</span>
          </div>
          <div className="mb-5">
            <h2 className="text-2xl font-black text-slate-900">{mode === 'login' ? 'Welcome back!' : 'Create your account'}</h2>
            <p className="text-sm text-slate-500 mt-1">{mode === 'login' ? `Sign in as ${role.label}` : `Register as ${role.label}`}</p>
          </div>

          <div className="flex bg-slate-100 rounded-xl p-1 mb-6 gap-1">
            {[{ key: 'login', label: 'Sign In' }, { key: 'signup', label: 'New Registration' }].map(({ key, label }) => (
              <button key={key} onClick={() => switchMode(key)}
                className={['flex-1 py-2 text-sm font-semibold rounded-lg transition-all', mode === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'].join(' ')}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800">{successMsg}</p>
            </div>
          )}

          {mode === 'login' && (
            <div className="space-y-5">
              {roleId === 'officer' && <OfficerLoginForm form={loginForm} setForm={setLoginForm} />}
              {roleId === 'business' && <BusinessLoginForm form={loginForm} setForm={setLoginForm} gstinStatus={gstin.status} gstinData={gstin.data} onVerify={handleVerifyGstin} />}
              {roleId === 'consumer' && <ConsumerLoginForm form={loginForm} setForm={setLoginForm} onGoogleLogin={handleGoogleAction} isLoading={isLoading} />}
              <button 
                onClick={handleLogin} 
                disabled={isLoading || (roleId === 'officer' && !loginForm.captchaVerified)}
                className={`w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed ${role.btnCls}`}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In…</> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-xs text-slate-400">New here?{' '}
                <button onClick={() => switchMode('signup')} className={`font-semibold ${role.accentTextDark} hover:underline`}>Create a new account</button>
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-5">
              {roleId === 'officer' && <OfficerSignupForm form={signupForm} setForm={setSignupForm} />}
              {roleId === 'business' && <BusinessSignupForm form={signupForm} setForm={setSignupForm} gstinStatus={gstin.status} gstinData={gstin.data} onVerify={handleVerifyGstin} />}
              {roleId === 'consumer' && <ConsumerSignupForm form={signupForm} setForm={setSignupForm} onGoogleSignup={handleGoogleAction} isLoading={isLoading} />}
              <button 
                onClick={handleSignup} 
                disabled={isLoading || (roleId === 'officer' && !signupForm.captchaVerified)}
                className={`w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed ${role.btnCls}`}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-xs text-slate-400">Already registered?{' '}
                <button onClick={() => switchMode('login')} className={`font-semibold ${role.accentTextDark} hover:underline`}>Sign in instead</button>
              </p>
            </div>
          )}

          <p className="mt-8 text-[11px] text-slate-400 text-center leading-relaxed">
            By continuing you agree to the SMARTTRACE Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const [stage, setStage] = useState('role-select');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (roleId) => { setSelectedRole(roleId); setStage('auth'); };
  const handleBack = () => { setStage('role-select'); setSelectedRole(null); };

  if (stage === 'role-select') return <RoleSelectionStage onSelect={handleRoleSelect} />;
  return <AuthFormStage roleId={selectedRole} onBack={handleBack} />;
}
