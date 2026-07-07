import React, { useState, useEffect } from "react";
import { Users, Activity, Heart, Shield, Target, MessageSquare } from "lucide-react";

export function SocialIntelligenceDashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/social/history");
      const data = (await res.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } }));
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-400">Loading Social Intelligence Layer...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-8 h-8 text-pink-500" />
        <h2 className="text-2xl font-semibold text-gray-100">Social Cognitive Intelligence</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-gray-400">No social cognitive history available yet. Run a mission to generate social intelligence.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {history.map((record, i) => (
            <div key={record.id || i} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-200">Mission: {record.missionContext}</h3>
                <p className="text-sm text-gray-400">Timestamp: {new Date(record.timestamp).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Emotions */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="w-4 h-4 text-red-400" />
                    <h4 className="font-medium text-gray-300">Detected Emotions</h4>
                  </div>
                  <div className="space-y-2">
                    {record.detected_emotions?.map((e: any, j: number) => (
                      <div key={j} className="text-sm">
                        <span className="text-gray-200 capitalize">{e.emotion}</span>
                        <span className="text-gray-500 ml-2">({(e.confidence_score * 100).toFixed(0)}% conf)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Model */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <h4 className="font-medium text-gray-300">Trust Model</h4>
                  </div>
                  <div className="space-y-2">
                    {record.trust_model?.map((t: any, j: number) => (
                      <div key={j} className="text-sm">
                        <span className="text-gray-200">{t.relationship}</span>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.trust_risk === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            Risk: {t.trust_risk}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h4 className="font-medium text-gray-300">Motivation Analysis</h4>
                  </div>
                  <div className="space-y-2">
                    {record.motivation_model?.map((m: any, j: number) => (
                      <div key={j} className="text-sm">
                        <span className="text-gray-400">{m.stakeholder}:</span>
                        <span className="text-gray-200 ml-2">{m.motivation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-yellow-400" />
                    <h4 className="font-medium text-gray-300">Communication Adapter</h4>
                  </div>
                  <div className="space-y-2">
                    {record.communication_style?.map((c: any, j: number) => (
                      <div key={j} className="text-sm">
                        <span className="text-gray-400">{c.audience}:</span>
                        <span className="text-gray-200 ml-2">{c.style}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stress */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700/50 md:col-span-2 lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <h4 className="font-medium text-gray-300">Stress Predictor</h4>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="text-gray-400">Overall Level: </span>
                    <span className="text-gray-200 capitalize">{record.stress_prediction?.overall_stress_level || "Unknown"}</span>
                  </div>
                  <div className="space-y-1">
                    {record.stress_prediction?.stress_factors?.map((f: any, j: number) => (
                      <div key={j} className="text-sm text-gray-300 flex justify-between">
                        <span>• {f.factor}</span>
                        <span className="text-gray-500">{f.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
