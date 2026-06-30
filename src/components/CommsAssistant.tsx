import React, { useState } from "react";
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  BrainCircuit, 
  AlertCircle
} from "lucide-react";

export default function CommsAssistant() {
  const [recipient, setRecipient] = useState("Professor");
  const [topic, setTopic] = useState("Requesting 24-hour extension on Capstone Project");
  const [tone, setTone] = useState("Apologetic");
  const [additionalContext, setAdditionalContext] = useState("My internet was down yesterday due to severe regional storms.");

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [draft, setDraft] = useState<{
    subject: string;
    body: string;
    tips: string[];
  } | null>({
    subject: "Extension Request: Capstone Project Mockups - [Your Name]",
    body: `Dear Professor [Professor Name],
\nI hope you are having a pleasant week.
\nI am writing to respectfully request a brief 24-hour extension on the Capstone Design Mockups, which were scheduled for delivery yesterday. 
\nUnfortunately, our region experienced severe storms yesterday, leading to major power grid outages and loss of high-speed internet access. This unexpected utility breakdown significantly disrupted my ability to finalize the export sheets and developer handoff documentation.
\nI currently have completed 80% of the spec grids and mock components. If permitted, I will submit the comprehensive Figma deliverables tomorrow before 6:00 PM. 
\nThank you very much for your time, understanding, and continued support.
\nSincerely,
[Your Name]
Student ID: [Your Student ID]`,
    tips: [
      "Keep the explanation factual and avoid sounding overly defensive.",
      "Highlight your active progress (80% complete) to show dedication and minimize grading risk.",
      "Propose a highly specific timeline (tomorrow before 6 PM) to maintain professional trust."
    ]
  });

  const triggerDraftGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !topic) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini/communication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, topic, tone, additionalContext })
      });
      const data = await response.json();
      
      if (data && !data.error) {
        setDraft(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!draft) return;
    const fullText = `Subject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="comms-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Input Form */}
      <form onSubmit={triggerDraftGeneration} className="xl:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-zinc-800 font-sans">Comms Drafter</h2>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Recipient Role</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          >
            <option value="Professor">Professor</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="Tech Lead / Manager">Tech Lead / Manager</option>
            <option value="Client">Client</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Topic or Request Topic</label>
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Explaining minor delay in coding sprint deliverables"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Professional Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          >
            <option value="Apologetic">Apologetic & Professional</option>
            <option value="Polite">Polite & Direct</option>
            <option value="Urgent">Urgent Request</option>
            <option value="Diplomatic">Diplomatic Update</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Context & Excuses</label>
          <textarea 
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Jot down brief reasons, internet outage info, or current milestone progression status..."
            className="w-full h-24 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> {isLoading ? "Drafting with AI..." : "Formulate Professional Draft"}
          </button>
        </div>
      </form>

      {/* RIGHT COLUMN: Output Draft Display */}
      <div className="xl:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-6">
        {draft ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-zinc-800 font-sans">AI-Structured Communication</h3>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                title="Copy full message"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Subject Line</span>
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-800">
                {draft.subject}
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Message Body</span>
              <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-700 leading-relaxed font-sans whitespace-pre-wrap select-all shadow-inner">
                {draft.body}
              </pre>
            </div>

            {/* Tips list */}
            {draft.tips && draft.tips.length > 0 && (
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <div className="flex items-center gap-1 text-indigo-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Coach Communication Tips</span>
                </div>
                <div className="space-y-1.5 pl-4.5">
                  {draft.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-500 font-medium font-sans">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="p-10 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
            Enter your recipient role and delayed topics on the left, then click 'Formulate Professional Draft' to ask Gemini to compose an elegant email.
          </div>
        )}
      </div>

    </div>
  );
}
