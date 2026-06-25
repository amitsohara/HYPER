import React from "react";
import {
  Brain,
  ShieldAlert,
  CheckCircle,
  Lightbulb,
  Zap,
  Scale,
  AlertTriangle,
} from "lucide-react";

export function CommonSenseDashboard({ mission }: any) {
  const cs = mission?.common_sense;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            Common Sense Engine
          </h2>
          <p className="text-sm text-slate-400">
            Maintain persistent common-sense rules, physical constraints, and
            detect impossibilities.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">
            Status
          </div>
          <div
            className={`text-sm font-bold uppercase ${cs?.impossible_plans?.length > 0 || cs?.contradictions_flagged?.length > 0 ? "text-red-400" : "text-emerald-400"}`}
          >
            {cs?.impossible_plans?.length > 0 ||
            cs?.contradictions_flagged?.length > 0
              ? "Violations Detected"
              : "Plausible"}
          </div>
        </div>
      </div>

      {!cs ? (
        <div className="text-slate-500 py-12 text-center">
          Run a mission to initialize the Common Sense constraints.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rules & Assumptions */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl h-full">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-emerald-400" /> Foundation
              </h3>

              <div className="space-y-4">
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-emerald-500 uppercase font-bold mb-3 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Base Rules Applied
                  </div>
                  {cs.common_sense_rules?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                      {cs.common_sense_rules.map((rule: string, i: number) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-slate-500">
                      No specific rules noted.
                    </div>
                  )}
                </div>

                {cs.violated_assumptions?.length > 0 && (
                  <div className="bg-amber-900/10 border border-amber-900/30 p-4 rounded-xl">
                    <div className="text-xs text-amber-500 uppercase font-bold mb-3 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Violated Assumptions
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-amber-200">
                      {cs.violated_assumptions.map(
                        (assm: string, i: number) => (
                          <li key={i}>{assm}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contradictions & Impossibilities */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl h-full">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-red-400" /> Violations
              </h3>

              <div className="space-y-4">
                {/* Impossible Plans */}
                <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                  <div className="text-xs text-red-500 uppercase font-bold mb-3 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Impossible Actions
                  </div>
                  {cs.impossible_plans?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-sm text-red-200">
                      {cs.impossible_plans.map((plan: string, i: number) => (
                        <li key={i}>{plan}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      No impossible actions detected.
                    </div>
                  )}
                </div>

                {/* Contradictions */}
                <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                  <div className="text-xs text-red-500 uppercase font-bold mb-3 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Contradictions Flagged
                  </div>
                  {cs.contradictions_flagged?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-sm text-red-200">
                      {cs.contradictions_flagged.map(
                        (contra: string, i: number) => (
                          <li key={i}>{contra}</li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      No logical contradictions.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
