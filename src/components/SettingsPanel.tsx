import React from "react";
import { Settings, Cpu, User, RefreshCw, CheckCircle } from "lucide-react";
import { PersonaType } from "../types";

interface SettingsPanelProps {
  aiPersona: PersonaType;
  setAiPersona: (persona: PersonaType) => void;
}

export default function SettingsPanel({ aiPersona, setAiPersona }: SettingsPanelProps) {
  const personas: Array<{ id: PersonaType; label: string; desc: string; tone: string }> = [
    { 
      id: "Friendly Coach", 
      label: "Friendly Coach", 
      desc: "Warm, highly encouraging, and empathetic. Emphasizes self-care and continuous steady progress.",
      tone: "Empathetic & Supportive"
    },
    { 
      id: "Strict Mentor", 
      label: "Strict Mentor", 
      desc: "Direct, raw, and holds you extremely accountable. Focuses on crushing excuses and maximizing discipline.",
      tone: "Direct & No-Nonsense"
    },
    { 
      id: "Study Buddy", 
      label: "Study Buddy", 
      desc: "Collaborative, highly energetic, and uses student slang. Feels like working alongside a peer in a library.",
      tone: "High Energy & Collaborative"
    },
    { 
      id: "Professional Advisor", 
      label: "Professional Advisor", 
      desc: "Structured, highly analytical, and business-focused. Evaluates opportunities based on placement metrics.",
      tone: "Analytical & Results-Oriented"
    }
  ];

  return (
    <div id="settings-view" className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
        <Settings className="w-5.5 h-5.5 text-indigo-600" />
        <h2 className="text-lg font-bold text-zinc-800 font-sans">Companion Configurations</h2>
      </div>

      {/* AI Personality Engine Selection */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-5">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-zinc-800 font-sans">AI Personality Engine</h3>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed font-sans">
          Alter the cognitive persona of your companion. This changes how the Insight Orb, Smart Alert triggers, and Decision Coach responses formulate and respond to your workload stress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((p) => {
            const isSelected = aiPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setAiPersona(p.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected 
                    ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                    : "bg-zinc-50 border-zinc-200 hover:border-indigo-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-sans ${isSelected ? "text-indigo-700" : "text-zinc-800"}`}>
                    {p.label}
                  </span>
                  {isSelected && <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">ACTIVE</span>}
                </div>
                
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed font-sans">{p.desc}</p>
                
                <div className="mt-3.5 pt-2 border-t border-zinc-100 flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Tone Style</span>
                  <span className="text-zinc-700 font-semibold">{p.tone}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Settings */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-4">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-zinc-800 font-sans">Workspace Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">User Handle</label>
            <input 
              type="text" 
              value="Vanshika" 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-700 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Primary Email</label>
            <input 
              type="text" 
              value="vanshikaspanjwani@gmail.com" 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-700 cursor-not-allowed"
              disabled
            />
          </div>
        </div>
      </div>

      {/* API Synchronization States */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-3.5">
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin-slow" />
          <h3 className="text-sm font-bold text-zinc-800 font-sans">System Connections</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
            <span className="text-zinc-700 font-sans font-semibold">Google Gemini LLM Connection</span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[10px] font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>CONNECTED (models/gemini-2.5-flash)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
            <span className="text-zinc-700 font-sans font-semibold">Local State Synchronization Engine</span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[10px] font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ACTIVE (localStorage)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
