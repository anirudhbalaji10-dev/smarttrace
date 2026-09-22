import React, { useState } from 'react';
import {
  Archive,
  ClipboardSignature,
  WifiOff,
  Wifi,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  AlertTriangle,
  Upload,
  FileText
} from 'lucide-react';


const statusColors = {
  'Awaiting Signature': 'bg-violet-50 text-violet-700 border-violet-200',
  'Pending Wi-Fi Sync': 'bg-amber-50 text-amber-700 border-amber-200',
  'Signed — Syncing': 'bg-blue-50 text-blue-700 border-blue-200',
  'Synced': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function EvidenceVaultScreen({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [drafts, setDrafts] = useState([]);
  const [signing, setSigning] = useState(null);

  const handleSign = (id) => {
    setSigning(id);
    setTimeout(() => {
      setDrafts(prev => prev.map(d =>
        d.id === id ? { ...d, status: 'Signed — Syncing', cached: false } : d
      ));
      setSigning(null);
    }, 1800);
  };

  const filtered = drafts.filter(d => {
    const matchesSearch = d.product.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'All' || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const awaitingCount = drafts.filter(d => d.status === 'Awaiting Signature').length;
  const offlineCount = drafts.filter(d => d.cached).length;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-200">
            <Archive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Evidence Vault & Drafts</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage pending violation reports awaiting digital signature and offline-cached scans</p>
          </div>
        </div>

        {/* Status summary pills */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
            <ClipboardSignature className="w-4 h-4 text-violet-600" />
            <div>
              <p className="text-xs font-black text-violet-900">{awaitingCount}</p>
              <p className="text-[10px] text-violet-600 font-semibold">Awaiting Signature</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs font-black text-amber-900">{offlineCount}</p>
              <p className="text-[10px] text-amber-600 font-semibold">Offline Cached</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs font-black text-blue-900">{drafts.length}</p>
              <p className="text-[10px] text-blue-600 font-semibold">Total Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search product or location..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs text-slate-700 focus:outline-none bg-transparent"
          >
            <option value="All">All Statuses</option>
            <option value="Awaiting Signature">Awaiting Signature</option>
            <option value="Pending Wi-Fi Sync">Pending Wi-Fi Sync</option>
            <option value="Signed — Syncing">Signed — Syncing</option>
          </select>
        </div>
      </div>

      {/* Draft Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Archive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-700">No drafts found</p>
            <p className="text-xs text-slate-500 mt-1">Offline-cached inspection reports will appear here.</p>
          </div>
        )}

        {filtered.map(draft => (
          <div key={draft.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{draft.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${statusColors[draft.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {draft.status}
                  </span>
                  {draft.cached && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-widest">
                      <WifiOff className="w-2.5 h-2.5" /> Offline Cached
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-slate-900">{draft.product}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{draft.manufacturer} · Batch: <span className="font-mono">{draft.batch}</span></p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" /> {draft.time} · {draft.date}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">{draft.images} evidence photo(s)</p>
              </div>
            </div>

            {/* Issue */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">{draft.issueType}</p>
              <p className="text-xs text-rose-900 font-semibold">{draft.issue}</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{draft.location}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              {draft.status === 'Awaiting Signature' && (
                <button
                  onClick={() => handleSign(draft.id)}
                  disabled={signing === draft.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-60"
                >
                  {signing === draft.id ? (
                    <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing…</>
                  ) : (
                    <><ClipboardSignature className="w-3.5 h-3.5" /> Apply Digital Signature</>
                  )}
                </button>
              )}
              {draft.status === 'Pending Wi-Fi Sync' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Force Sync to Server
                </button>
              )}
              {(draft.status === 'Signed — Syncing' || draft.status === 'Synced') && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Report Signed & Queued for Sync
                </div>
              )}
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
                <FileText className="w-3.5 h-3.5" /> Preview Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
