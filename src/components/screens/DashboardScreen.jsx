import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  MessageSquareWarning,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Scan,
  GitFork,
  ChevronRight,
  Search,
  Loader2,
  MapPin,
  Bell,
  Archive,
  ClipboardSignature,
  WifiOff,
  ShieldAlert,
  Clock,
  TrendingUp,
  TrendingDown,
  Navigation,
  Layers
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats, getRecentInspections, getViolationCategories, getRecentViolations } from '../../services/inspectionsService';
import { getComplaints } from '../../services/complaintsService';

// Leaflet map imports
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const officerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to recenter map when position changes
function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position]);
  return null;
}

// Inspection targets near a position (mocked relative to officer)
function getAssignedTargets(lat, lng) {
  return [];
}

const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' };

const targetIcon = (priority) => new L.DivIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${priorityColors[priority] || '#64748b'};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function DashboardScreen({ onNavigate, onSelectProduct }) {
  const { userProfile } = useAuth();
  const [filterResult, setFilterResult] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(true);
  const [officerPos, setOfficerPos] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [assignedTargets, setAssignedTargets] = useState([]);
  const [tipAlerts, setTipAlerts] = useState([]);

  // Shift-level daily metrics (derived from today's inspections)
  const [shiftStats, setShiftStats] = useState({ compliant: 0, nonCompliant: 0, total: 0 });

  const [stats, setStats] = useState({
    totalInspections: 0,
    compliantCount: 0,
    compliantPercent: '0%',
    nonCompliantCount: 0,
    nonCompliantPercent: '0%',
    activeComplaints: 0
  });
  const [inspections, setInspections] = useState([]);
  const [violations, setViolations] = useState([]);
  const [categories, setCategories] = useState([]);

  // Evidence vault drafts (offline-cached items)
  const [vaultDrafts] = useState([
    { id: 'DFT-001', product: 'Fortune Sunflower Oil 1L', issue: 'MRP Mismatch ₹20 excess', status: 'Awaiting Signature', cached: true, time: '14:32' },
    { id: 'DFT-002', product: 'Amul Butter 500g', issue: 'Net weight 480g vs declared 500g', status: 'Pending Wi-Fi Sync', cached: true, time: '11:15' },
  ]);

  // Load live dashboard data
  useEffect(() => {
    async function loadLiveData() {
      try {
        setLoading(true);
        const [liveStats, liveInspections, liveCategories, liveViolations] = await Promise.all([
          getDashboardStats(),
          getRecentInspections(20),
          getViolationCategories(),
          getRecentViolations(5),
        ]);
        if (liveStats) setStats(liveStats);
        setInspections(liveInspections || []);
        setCategories(liveCategories || []);
        setViolations(liveViolations || []);

        // Compute today's shift stats from live inspections
        const today = new Date().toDateString();
        const todayItems = (liveInspections || []).filter(i => new Date(i.date).toDateString() === today);
        setShiftStats({
          compliant: todayItems.filter(i => i.result === 'Compliant').length,
          nonCompliant: todayItems.filter(i => i.result === 'Non-Compliant').length,
          total: todayItems.length,
        });
      } catch (err) {
        console.warn('Error loading live dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  // Load consumer tip alerts from Firestore complaints
  useEffect(() => {
    getComplaints(10).then(complaints => {
      if (complaints && complaints.length > 0) {
        setTipAlerts(complaints.slice(0, 5));
      }
    }).catch(() => {});
  }, []);

  // Get real GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported by your browser.');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setOfficerPos([latitude, longitude]);
        setAssignedTargets(getAssignedTargets(latitude, longitude));
        setGeoLoading(false);
      },
      (err) => {
        setGeoError('Location access denied. Enable GPS for geotagging.');
        // Fall back to Delhi coordinates for demo
        setOfficerPos([28.6139, 77.2090]);
        setAssignedTargets(getAssignedTargets(28.6139, 77.2090));
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const filteredInspections = inspections.filter(item => {
    const matchesFilter = filterResult === 'All' || item.result === filterResult;
    const matchesSearch =
      (item.product || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.batch || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">

      {/* ── Welcome Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Enforcement Command Dashboard</h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Live National Grid
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome, <strong>{userProfile?.fullName || userProfile?.displayName || 'Enforcement Officer'}</strong>{' '}
            ({userProfile?.designation || 'Senior Legal Metrology Officer'}). Today's field compliance overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Today, {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button
            onClick={() => onNavigate('inspection')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>New AI Inspection</span>
          </button>
        </div>
      </div>

      {/* ── Daily Shift Metric Tracker ──────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700/60 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-black text-white">Today's Shift Tracker</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long' })} · Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-black text-white">{shiftStats.total || stats.totalInspections || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Total Scans</p>
            <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-blue-400 font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>Live Count</span>
            </div>
          </div>

          <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
            <p className="text-2xl font-black text-emerald-400">{shiftStats.compliant || stats.compliantCount || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Compliant</p>
            <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-emerald-400 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.compliantPercent || '—'}</span>
            </div>
          </div>

          <div className="bg-rose-500/10 rounded-xl p-4 text-center border border-rose-500/20">
            <p className="text-2xl font-black text-rose-400">{shiftStats.nonCompliant || stats.nonCompliantCount || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Violations</p>
            <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-rose-400 font-bold">
              <TrendingDown className="w-3 h-3" />
              <span>{stats.nonCompliantPercent || '—'}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Shift Compliance Rate</span>
            <span className="font-bold text-white">{stats.compliantPercent || '—'}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: stats.compliantPercent || '0%' }}
            />
          </div>
        </div>
      </div>

      {/* ── Map + Consumer Tips Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Geo-Location Map */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                Geo-Location Field Dashboard
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {geoLoading ? 'Acquiring GPS signal…' : geoError ? geoError : `Officer GPS: ${officerPos?.[0].toFixed(5)}, ${officerPos?.[1].toFixed(5)}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {geoLoading ? 'Locating…' : 'Live GPS'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 flex items-center gap-4 text-[11px] font-semibold text-slate-600 border-b border-slate-100 bg-white flex-wrap">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow" /> Officer Location</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow" /> High Priority</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" /> Medium Priority</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" /> Low Priority</span>
          </div>

          <div className="h-72 relative">
            {geoLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3">
                <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-600">Acquiring GPS location…</p>
                <p className="text-xs text-slate-400">Please allow location access when prompted</p>
              </div>
            ) : officerPos ? (
              <MapContainer
                center={officerPos}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapRecenter position={officerPos} />

                {/* Officer position with blue pulsing circle */}
                <Circle
                  center={officerPos}
                  radius={120}
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2 }}
                />
                <Marker position={officerPos} icon={officerIcon}>
                  <Popup>
                    <div className="text-xs font-semibold">
                      <p className="font-bold text-slate-900">📍 Officer Location (You)</p>
                      <p className="text-slate-600">{userProfile?.fullName || 'Enforcement Officer'}</p>
                      <p className="text-slate-500 mt-1">{officerPos[0].toFixed(5)}, {officerPos[1].toFixed(5)}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Assigned inspection targets */}
                {assignedTargets.map(target => (
                  <Marker
                    key={target.id}
                    position={[target.lat, target.lng]}
                    icon={targetIcon(target.priority)}
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold text-slate-900">{target.name}</p>
                        <p className="text-slate-500">{target.type}</p>
                        <span style={{ color: priorityColors[target.priority], fontWeight: 700 }}>
                          {target.priority} Priority
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : null}
          </div>

          {/* Assigned targets list */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Inspection Targets Today</p>
            <div className="grid grid-cols-2 gap-2">
              {assignedTargets.slice(0, 4).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: priorityColors[t.priority] }} />
                  <span className="font-semibold text-slate-800 truncate">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consumer Tip Alerts */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Consumer Tip Alerts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Localized complaints in your jurisdiction</p>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Prioritized
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {tipAlerts.length > 0 ? tipAlerts.map((tip, idx) => (
              <div key={tip.id || idx} className="p-3.5 hover:bg-amber-50/40 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-xs leading-snug">{tip.productName || tip.product}</span>
                  <StatusBadge status={tip.status || 'Pending Investigation'} size="sm" />
                </div>
                <p className="text-[11px] text-rose-700 font-semibold">{tip.issueType || tip.violation}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{tip.placeOfPurchase || tip.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400">{tip.filedOn || tip.date || 'Recently reported'}</span>
                  <button
                    onClick={() => onNavigate('complaints')}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-600 flex items-center gap-1"
                  >
                    Assign Inspector <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-amber-300" />
                </div>
                <p className="text-sm font-bold text-slate-700">No Tip Alerts</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Consumer complaints in your district will appear here in real-time for immediate dispatch.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => onNavigate('complaints')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquareWarning className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Full Grievance Queue</span>
            </button>
          </div>
        </div>
      </div>


      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Evidence Vault & Drafts */}
        <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Archive className="w-4 h-4 text-violet-600" />
                Evidence Vault & Drafts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Pending signatures & offline-cached scans</p>
            </div>
            <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
              {vaultDrafts.length} Pending
            </span>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {vaultDrafts.map((draft) => (
              <div key={draft.id} className="p-3.5 rounded-xl border border-violet-100 bg-violet-50/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 font-mono bg-white border border-slate-200 px-2 py-0.5 rounded">{draft.id}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" /> {draft.time} today
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900">{draft.product}</p>
                <p className="text-[11px] text-rose-700 font-semibold">{draft.issue}</p>
                <div className="flex items-center justify-between pt-1.5 border-t border-violet-100">
                  <div className="flex items-center gap-1.5">
                    {draft.cached && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        <WifiOff className="w-2.5 h-2.5" /> Offline Cached
                      </span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${draft.status === 'Awaiting Signature' ? 'text-violet-700 bg-violet-50 border-violet-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                      {draft.status}
                    </span>
                  </div>
                  <button className="text-[10px] font-bold text-violet-700 hover:text-violet-600 flex items-center gap-1">
                    <ClipboardSignature className="w-3 h-3" /> Sign
                  </button>
                </div>
              </div>
            ))}

            {vaultDrafts.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500 space-y-1">
                <Archive className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">Vault is Empty</p>
                <p className="text-[11px] text-slate-400">Completed scan drafts waiting for signature will appear here.</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => onNavigate('vault')}
              className="w-full py-2 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Open Full Evidence Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Violation Categories + Recent Inspections Table ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Inspections Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent Field Inspections</h3>
              <p className="text-xs text-slate-500">Live feed from calibrated inspector terminals</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter product/batch..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <select
                value={filterResult}
                onChange={e => setFilterResult(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Results</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Warning">Warning</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Inspector</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInspections.length > 0 ? (
                  filteredInspections.map((item, idx) => (
                    <tr key={item.id || item.inspectionId || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          {item.result === 'Non-Compliant' && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                          <span>{item.product}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{item.manufacturer}</td>
                      <td className="p-3 font-mono text-slate-500 font-semibold">{item.batch}</td>
                      <td className="p-3"><StatusBadge status={item.result} size="sm" /></td>
                      <td className="p-3 text-slate-500">{item.date}</td>
                      <td className="p-3 text-slate-600">{item.inspector}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => { if (onSelectProduct) onSelectProduct(item.productId); onNavigate('inspection'); }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Audit</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                      No field inspections recorded yet. Start a new AI inspection to populate live data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 text-center text-xs text-slate-500 bg-slate-50/30">
            Showing {filteredInspections.length} of {inspections.length} recent inspections
          </div>
        </div>

        {/* Violation Categories */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Top Violation Categories</h2>
              <p className="text-xs text-slate-500">Distribution across non-compliant cases</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {stats.nonCompliantCount || 0} Total
            </span>
          </div>

          <div className="space-y-3 py-2">
            {categories.length > 0 ? (
              categories.map((vc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: vc.color }} />
                      <span>{vc.name}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{vc.percentage}% ({vc.count})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${vc.percentage}%`, backgroundColor: vc.color }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-semibold text-slate-700">No Non-Compliant Categories</p>
                <p className="text-[11px] text-slate-400">Recorded violations will automatically group here.</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Primary Offense: <strong>{categories[0]?.name || 'None'}</strong></span>
            <button onClick={() => onNavigate('reports')} className="text-emerald-700 font-bold hover:underline">
              View Analytics →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
