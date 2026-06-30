import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  BrainCircuit, 
  Cpu, 
  Check, 
  X, 
  Clock, 
  Mic, 
  Sparkles
} from "lucide-react";
import { ChatMessage, PersonaType } from "../types";

interface DecisionCoachProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  aiPersona: PersonaType;
}

export default function DecisionCoach({ chatHistory, setChatHistory, aiPersona }: DecisionCoachProps) {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Handle sending message
  const handleSendMessage = async (textToSend?: string) => {
    const finalInput = textToSend || userInput;
    if (!finalInput.trim() || isLoading) return;

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: finalInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      // 2. Call server-side Coach API
      const response = await fetch("/api/gemini/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: chatHistory.map(m => ({ role: m.role, text: m.text })),
          message: finalInput.trim(),
          persona: aiPersona
        })
      });
      const data = await response.json();

      if (data && !data.error) {
        // 3. Add coach response with Vercel Generative UI simulator payloads
        const coachMsg: ChatMessage = {
          id: "msg-coach-" + Date.now(),
          role: "coach",
          text: data.text || "I've processed your choice. Let's look at the strategic breakdown:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          generativeUI: data.generativeUI?.type !== "null" && data.generativeUI?.type ? data.generativeUI : undefined
        };
        setChatHistory(prev => [...prev, coachMsg]);
      }
    } catch (err) {
      console.error(err);
      // Fallback response on local simulation
      const coachMsg: ChatMessage = {
        id: "msg-coach-" + Date.now(),
        role: "coach",
        text: "I couldn't establish full API latency context, but strategically, focusing on your quantifiable goals (like TCS Aptitude prep) always yields a 45% stress reduction index. Let me build a recovery outline for you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, coachMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-configured Dilemma Prompts for instant interaction
  const handleTriggerQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Toggle Voice listening simulation
  const handleToggleVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setUserInput("How should I balance TCS Coding prep with my capstone mockups due today?");
    }, 2500);
  };

  return (
    <div id="coach-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start h-[calc(100vh-10rem)] animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Dilemma quick templates */}
      <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-zinc-800 font-sans">Strategic Templates</h3>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed font-sans">
          Select a template to query the Decision Coach. Your active persona (<strong className="text-indigo-600">{aiPersona}</strong>) will generate customized plans and pros-cons lists using Gen UI elements.
        </p>

        <div className="space-y-3">
          {[
            { label: "TCS Aptitude Prep Strategy", query: "Give me an action plan to prepare for TCS NQT quantitative aptitude sections in 2 weeks." },
            { label: "Figma Mockups Dilemma", query: "Should I spend 3 hours today on Capstone Figma mockups or aptitude prep? Show me the Pros and Cons." },
            { label: "Create Custom Focus Blocks", query: "Help me build a custom schedule block template to balance study, coding drills, and stretching sessions today." }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleTriggerQuickPrompt(item.query)}
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-indigo-500/40 text-left text-xs text-zinc-700 font-sans font-semibold hover:text-zinc-900 hover:bg-zinc-100/60 transition-all cursor-pointer block leading-normal shadow-sm"
            >
              {item.label}
              <span className="text-[10px] text-indigo-600 font-mono block mt-1.5 font-normal">→ Launch template prompt</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Chat messenger */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 flex flex-col h-full overflow-hidden">
        
        {/* Header bar */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-indigo-600 animate-pulse" />
            <div>
              <h4 className="text-xs font-bold text-zinc-800 font-sans">Decision Coach Portal</h4>
              <span className="text-[10px] text-zinc-400 font-mono">PERSONA INTEGRATION: {aiPersona}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
            ● Generative UI Active
          </span>
        </div>

        {/* Scrollable Message Box */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {chatHistory.map((msg) => {
            const isCoach = msg.role === "coach";
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-sans shrink-0 border ${
                  isCoach 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold" 
                    : "bg-purple-50 border-purple-200 text-purple-700 font-bold"
                }`}>
                  {isCoach ? "C" : "V"}
                </div>

                {/* Bubble */}
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl text-xs font-sans leading-relaxed ${
                    isCoach 
                      ? "bg-zinc-50 text-zinc-800 border border-zinc-200/80" 
                      : "bg-indigo-600 text-white border border-indigo-600 shadow-sm"
                  }`}>
                    {msg.text}
                    
                    <span className={`text-[9px] font-mono block text-right mt-1.5 select-none ${isCoach ? "text-zinc-400" : "text-indigo-200"}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Vercel AI SDK Generative UI Components rendering inside chat bubbles */}
                  {isCoach && msg.generativeUI && (
                    <div className="mt-2.5 p-4 rounded-xl border bg-gradient-to-tr from-zinc-50 via-indigo-50/10 to-white border-indigo-100 shadow-md space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      
                      <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-700 uppercase">
                          {msg.generativeUI.title} (Gen UI)
                        </span>
                      </div>

                      {/* Render custom schedules */}
                      {msg.generativeUI.type === "custom_schedule" && msg.generativeUI.data.blocks && (
                        <div className="space-y-2">
                          {msg.generativeUI.data.blocks.map((block: any, bIdx: number) => (
                            <div key={bIdx} className="p-2 rounded-lg bg-white border border-zinc-200 flex justify-between items-center text-xs shadow-sm">
                              <span className="font-semibold text-zinc-800">{block.activity}</span>
                              <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-[10px]">
                                <Clock className="w-3 h-3 text-indigo-500" />
                                <span>{block.time} ({block.durationMinutes || 60}m)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Render action plans / checklists */}
                      {msg.generativeUI.type === "action_plan" && msg.generativeUI.data.tasks && (
                        <div className="space-y-2">
                          {msg.generativeUI.data.tasks.map((task: string, tIdx: number) => (
                            <label key={tIdx} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-700 cursor-pointer hover:bg-zinc-50 shadow-sm">
                              <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                              <span>{task}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Render double column Pros and Cons list */}
                      {msg.generativeUI.type === "pros_cons" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3.5">
                            <div className="space-y-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] font-mono text-emerald-700 font-bold block">PROS</span>
                              {msg.generativeUI.data.pros?.map((pro: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-700">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-2 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                              <span className="text-[9px] font-mono text-rose-600 font-bold block">CONS</span>
                              {msg.generativeUI.data.cons?.map((con: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-700">
                                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {msg.generativeUI.data.recommendation && (
                            <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs">
                              <span className="font-bold text-indigo-700 font-mono text-[10px] uppercase block">★ RECOMMENDATION</span>
                              <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">{msg.generativeUI.data.recommendation}</p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xs shrink-0 animate-pulse">
                C
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 font-mono italic animate-pulse">
                {aiPersona} is generating strategic options...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Message panel */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex gap-2.5 items-center">
          
          <button
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl border cursor-pointer shrink-0 transition-colors ${
              isListening 
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                : "bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-indigo-300 text-zinc-500 hover:text-zinc-800"
            }`}
            title="Dictate message"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          <input 
            type="text" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={`Consult with your ${aiPersona}...`}
            className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!userInput.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4.5 h-4.5" />
          </button>

        </div>

      </div>

    </div>
  );
}
