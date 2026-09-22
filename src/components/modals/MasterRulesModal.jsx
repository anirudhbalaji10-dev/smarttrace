import React, { useState } from 'react';
import { X, BookOpen, Scale, FileText, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
const mandatoryDeclarationsRule6 = [
  { rule: 'Rule 6(1)(a)', title: 'Name and Address of Manufacturer', detail: 'Must be present on the package.', status: 'Mandatory' },
  { rule: 'Rule 6(1)(b)', title: 'Generic Name', detail: 'Commonly used name of the commodity.', status: 'Mandatory' },
  { rule: 'Rule 6(1)(c)', title: 'Net Quantity', detail: 'In standard metric units.', status: 'Mandatory' },
  { rule: 'Rule 6(1)(e)', title: 'Maximum Retail Price (MRP)', detail: 'Inclusive of all taxes.', status: 'Mandatory' }
];

const scheduleIITolerances = [
  { range: '0 - 50g', maxErrorPercent: '9%', maxAbsoluteError: '-', notes: 'Small packs' },
  { range: '50g - 100g', maxErrorPercent: '-', maxAbsoluteError: '4.5g', notes: 'Medium packs' },
];

const rule9FontHeights = [
  { pdaArea: '< 50 sq. cm', minFontHeightMm: '1.0 mm', numeralHeightMm: '1.0 mm' },
  { pdaArea: '50 - 100 sq. cm', minFontHeightMm: '1.5 mm', numeralHeightMm: '1.5 mm' },
];

const gazetteNotifications = [
  { id: 'GSR 123(E)', date: '12 Jan 2024', subject: 'Amendment to Rule 6', status: 'Active' },
];

export default function MasterRulesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("rule6");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Legal Metrology Master Data & Statutory Rules Library</h3>
              <p className="text-[11px] text-slate-400">Legal Metrology (Packaged Commodities) Rules 2011 • Official Reference</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab("rule6")}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "rule6" ? "border-emerald-600 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Rule 6: Mandatory Declarations
          </button>
          <button
            onClick={() => setActiveTab("tolerances")}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "tolerances" ? "border-emerald-600 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Schedule II: Permissible Error Limits (MPE)
          </button>
          <button
            onClick={() => setActiveTab("font")}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "font" ? "border-emerald-600 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Rule 9: Minimum Font Height Standards
          </button>
          <button
            onClick={() => setActiveTab("gazette")}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "gazette" ? "border-emerald-600 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Gazette Notifications & Circulars
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800 flex-1">
          
          {/* TAB 1: RULE 6 DECLARATIONS */}
          {activeTab === "rule6" && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 text-[11px] leading-relaxed">
                <strong>Statutory Mandate:</strong> Every pre-packaged commodity sold in India (in physical retail or on e-commerce marketplaces) must carry these 7 core declarations. Absence of any parameter constitutes a compoundable offense under Section 36 of the Legal Metrology Act.
              </div>

              <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
                {mandatoryDeclarationsRule6.map((d, i) => (
                  <div key={i} className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {d.rule}
                        </span>
                        <h4 className="font-bold text-slate-900">{d.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{d.detail}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE II ERROR TOLERANCES */}
          {activeTab === "tolerances" && (
            <div className="space-y-3">
              <p className="text-slate-600 text-xs">
                Under <strong>Section 36 & Second Schedule</strong>, commodities found below declared quantity exceeding these negative errors are deemed non-compliant and liable for batch seizure.
              </p>

              <table className="w-full text-left border rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Quantity Declared Range</th>
                    <th className="p-3">Max Permissible Error (%)</th>
                    <th className="p-3">Max Absolute Error (g / ml)</th>
                    <th className="p-3">Statutory Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleIITolerances.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{t.range}</td>
                      <td className="p-3 font-mono text-emerald-700 font-semibold">{t.maxErrorPercent}</td>
                      <td className="p-3 font-mono text-slate-800 font-bold">{t.maxAbsoluteError}</td>
                      <td className="p-3 text-slate-500">{t.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: RULE 9 FONT HEIGHT */}
          {activeTab === "font" && (
            <div className="space-y-3">
              <p className="text-slate-600 text-xs">
                Under <strong>Rule 9(1)</strong>, font and numeral heights for mandatory declarations (MRP, Net Quantity, Expiry) are determined by the Principal Display Area (PDA) of the packaging package.
              </p>

              <table className="w-full text-left border rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Principal Display Area (PDA)</th>
                    <th className="p-3">Minimum Letter Height</th>
                    <th className="p-3">Minimum Numeral Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rule9FontHeights.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{f.pdaArea}</td>
                      <td className="p-3 font-mono font-bold text-blue-700">{f.minFontHeightMm}</td>
                      <td className="p-3 font-mono font-bold text-emerald-700">{f.numeralHeightMm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: GAZETTE NOTIFICATIONS */}
          {activeTab === "gazette" && (
            <div className="space-y-3">
              {gazetteNotifications.map((g, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-emerald-800 text-xs">{g.id}</span>
                    <span className="text-[10px] text-slate-400">{g.date}</span>
                  </div>
                  <p className="font-bold text-slate-900">{g.subject}</p>
                  <span className="inline-block text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            Close Master Library
          </button>
        </div>

      </div>
    </div>
  );
}
