import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  ArrowRight, 
  ArrowLeft, 
  Factory, 
  Truck, 
  Building2, 
  Store, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Layers,
  Search,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getTraceabilityByBatch } from '../../services/traceabilityService';

export default function TraceabilityScreen({ onNavigate }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isBackwardTracing, setIsBackwardTracing] = useState(false);
  const [traceabilityData, setTraceabilityData] = useState(null);
  const [searchBatch, setSearchBatch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchBatch) return;
    setIsSearching(true);
    try {
      const liveData = await getTraceabilityByBatch(searchBatch);
      if (liveData) {
        setTraceabilityData(liveData);
        setSelectedNodeId(liveData.nodes[liveData.nodes.length - 2]?.id || 'retailer');
      } else {
        setTraceabilityData(null);
      }
    } catch (err) {
      console.warn("Error fetching traceability data:", err);
      setTraceabilityData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const selectedNode = traceabilityData?.nodes?.find(n => n.id === selectedNodeId) || traceabilityData?.nodes?.[0];

  const handleBackwardTrace = () => {
    setIsBackwardTracing(true);
    if (!traceabilityData || !traceabilityData.nodes) return;
    
    // Reverse cycle from end to beginning
    const sequence = [...traceabilityData.nodes].reverse().map(n => n.id);
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setSelectedNodeId(sequence[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsBackwardTracing(false);
      }
    }, 600);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Factory": return Factory;
      case "Truck": return Truck;
      case "Building2": return Building2;
      case "Store": return Store;
      case "UserCheck": return UserCheck;
      default: return Factory;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header Card with Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Product Traceability & Custody Graph</h1>
            {traceabilityData && <StatusBadge status={traceabilityData.currentStatus || "Registered"} size="sm" />}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconstruct the point-to-point supply chain journey using global ledger nodes.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              placeholder="Enter Batch Number (e.g. B12345A)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-800 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching || !searchBatch}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center min-w-[90px]"
          >
            {isSearching ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Trace"}
          </button>
        </form>
      </div>

      {!traceabilityData ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
            <GitFork className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800">No Supply Chain Record Selected</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Please scan a product or manually enter a batch code above to retrieve its decentralized ledger history and reconstruct the custody graph.
          </p>
        </div>
      ) : (
        <>
          {/* Backward Trace Alert Explainer */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl border border-emerald-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
                <GitFork className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <p className="font-bold text-emerald-300">Bi-Directional Supply Chain Integrity Ledger</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Click any node in the horizontal pipeline to inspect transaction manifests, transit temperatures, and e-way bill hashes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                <span>Active Root:</span>
                <strong>{traceabilityData.manufacturer || "Registered Brand"} #{traceabilityData.batchNo || "Unknown"}</strong>
              </div>
              <button
                onClick={handleBackwardTrace}
                disabled={isBackwardTracing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold bg-amber-600 text-white hover:bg-amber-500 transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`w-3 h-3 ${isBackwardTracing ? "animate-spin" : ""}`} /> 
                <span className="hidden sm:inline">Play Trace</span>
              </button>
            </div>
          </div>

          {/* Visual Pipeline Nodes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <div className="min-w-[760px] flex items-center justify-between relative py-4">
              <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
              
              {traceabilityData.nodes.map((node) => {
                const Icon = getIcon(node.icon);
                const isSelected = selectedNodeId === node.id;
                const hasViolation = node.hasViolation;

                return (
                  <div 
                    key={node.id} 
                    onClick={() => setSelectedNodeId(node.id)}
                    className="flex flex-col items-center cursor-pointer group relative z-10 transition-all"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
                      isSelected 
                        ? hasViolation 
                          ? "bg-rose-600 text-white ring-4 ring-rose-300 scale-110"
                          : "bg-emerald-600 text-white ring-4 ring-emerald-300 scale-110"
                        : hasViolation
                          ? "bg-rose-100 text-rose-700 border-2 border-rose-400 group-hover:scale-105"
                          : "bg-white text-slate-700 border-2 border-slate-300 group-hover:border-emerald-500 group-hover:text-emerald-700 group-hover:scale-105"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center mt-2.5 max-w-[120px]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{node.stage}</span>
                      <p className={`font-bold text-xs mt-0.5 truncate ${isSelected ? "text-slate-900" : "text-slate-700"}`}>{node.entityName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{node.date}</p>
                      {hasViolation && (
                        <span className="mt-1 inline-block text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full">Violation Flag</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${selectedNode.hasViolation ? "bg-rose-600" : "bg-emerald-600"}`}>
                        {React.createElement(getIcon(selectedNode.icon), { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{selectedNode.entityName}</h3>
                        <p className="text-xs text-slate-500">{selectedNode.role}</p>
                      </div>
                    </div>
                    <StatusBadge status={selectedNode.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Timestamp</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedNode.date} ({selectedNode.time || "00:00"})</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                      <p className="font-semibold text-slate-800 mt-0.5 truncate">{selectedNode.location}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Quantity Received/Sent</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedNode.quantity || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Reference Doc</span>
                      <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedNode.referenceDoc || "N/A"}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5 text-slate-600">
                    <p className="font-bold text-slate-800">Node Custody Parameters:</p>
                    {selectedNode.details ? Object.entries(selectedNode.details).map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between gap-2 text-[11px]">
                        <span className="capitalize text-slate-500">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium text-slate-800 text-right">{v}</span>
                      </div>
                    )) : <p className="text-slate-400 italic">No extra parameters registered.</p>}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Verified Hash: <code className="text-slate-800 font-mono">{selectedNode.verifiedHash || "0x00...000"}</code></span>
                  <span className="text-emerald-700 font-bold">Ledger Block Sealed</span>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Chain-of-Custody Ledger</h3>
                    <p className="text-xs text-slate-500">Electronic E-Way Bill & Point-of-Sale audit trail</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded text-slate-700">
                    {traceabilityData.movementHistory?.length || 0} Hops Recorded
                  </span>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Transit Route (From → To)</th>
                        <th className="p-3">Document</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {traceabilityData.movementHistory?.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{m.date}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{m.from}</div>
                            <div className="text-[10px] text-slate-500">↓ to {m.to}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">{m.carrier}</div>
                          </td>
                          <td className="p-3 font-mono text-slate-700 font-medium">{m.document}</td>
                          <td className="p-3 whitespace-nowrap">
                            <StatusBadge status={m.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                      {!traceabilityData.movementHistory?.length && (
                        <tr><td colSpan={4} className="p-4 text-center text-slate-500 italic">No movement recorded.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}
