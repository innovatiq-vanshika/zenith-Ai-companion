import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Plus, 
  Check, 
  Trash2, 
  LayoutList,
  Coffee,
  Code,
  Laptop
} from "lucide-react";
import { ScheduleBlock } from "../types";

interface ScheduleTimelineProps {
  schedule: ScheduleBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
}

export default function ScheduleTimeline({ schedule, setSchedule }: ScheduleTimelineProps) {
  // Add schedule block states
  const [time, setTime] = useState("09:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [activity, setActivity] = useState("");
  const [type, setType] = useState<"work" | "study" | "break" | "personal">("study");

  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Toggle completion
  const handleToggleBlock = (id: string) => {
    setSchedule(prev => prev.map(b => b.id === id ? { ...b, completed: !b.completed } : b));
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    setSchedule(prev => prev.filter(b => b.id !== id));
  };

  // Add block
  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    const newBlock: ScheduleBlock = {
      id: "block-" + Date.now(),
      time,
      durationMinutes,
      activity: activity.trim(),
      type,
      completed: false
    };

    // Sort schedule chronologically by time
    setSchedule(prev => [...prev, newBlock].sort((a, b) => a.time.localeCompare(b.time)));
    setActivity("");
    setDurationMinutes(60);
  };

  // Trigger AI Schedule Optimization (Feature 5)
  const triggerAIScheduleBuild = async () => {
    setIsGeneratingSchedule(true);
    // Simulate smart sequencing based on cognitive peak hours
    setTimeout(() => {
      const optimizedSchedule: ScheduleBlock[] = [
        { id: "block-ai-1", time: "08:30", durationMinutes: 15, activity: "AI Cognitive Alignment", type: "study", completed: false },
        { id: "block-ai-2", time: "08:45", durationMinutes: 90, activity: "Aptitude Coding (DP Drills)", type: "study", completed: false },
        { id: "block-ai-3", time: "10:15", durationMinutes: 20, activity: "Strategic Hydration Break", type: "break", completed: false },
        { id: "block-ai-4", time: "10:35", durationMinutes: 120, activity: "Figma Capstone Mockups Completion", type: "work", completed: false },
        { id: "block-ai-5", time: "12:35", durationMinutes: 60, activity: "Mindful Lunch Session", type: "break", completed: false },
        { id: "block-ai-6", time: "13:35", durationMinutes: 90, activity: "Quantitative Aptitude Mock", type: "study", completed: false },
        { id: "block-ai-7", time: "15:05", durationMinutes: 15, activity: "Stretching & Breath Refresh", type: "break", completed: false },
        { id: "block-ai-8", time: "15:20", durationMinutes: 90, activity: "Resume Polish & Recruiter Emailing", type: "work", completed: false }
      ];
      setSchedule(optimizedSchedule);
      setIsGeneratingSchedule(false);
    }, 1500);
  };

  const getBlockStyles = (type: string) => {
    switch (type) {
      case "work": return "border-blue-200 bg-blue-50/50 text-blue-700 shadow-sm";
      case "study": return "border-indigo-200 bg-indigo-50/50 text-indigo-700 shadow-sm";
      case "break": return "border-rose-200 bg-rose-50/50 text-rose-700 shadow-sm";
      case "personal": return "border-purple-200 bg-purple-50/50 text-purple-700 shadow-sm";
      default: return "border-zinc-200 bg-white text-zinc-700";
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "work": return <Laptop className="w-4 h-4 text-blue-500" />;
      case "study": return <Code className="w-4 h-4 text-indigo-500" />;
      case "break": return <Coffee className="w-4 h-4 text-rose-500" />;
      default: return <Clock className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div id="schedule-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Add Schedule Block Form */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-800 font-sans">Block Scheduler</h2>
          </div>

          <form onSubmit={handleAddBlock} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Activity Description</label>
              <input 
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="e.g., Quantitative practice sessions"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Start Time</label>
                <input 
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Duration (Mins)</label>
                <input 
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(5, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Focus Block Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["study", "work", "break", "personal"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition-all border cursor-pointer ${
                      type === t 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Schedule Focus Block
              </button>
            </div>
          </form>
        </div>

        {/* AI builder optimization callout */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h3 className="text-sm font-bold font-sans">AI Schedule Optimization</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            Have the AI build an optimized schedule block timeline tailored directly to your placement test commitments and cognitive peak-focus hours.
          </p>
          <button
            onClick={triggerAIScheduleBuild}
            disabled={isGeneratingSchedule}
            className="w-full py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isGeneratingSchedule ? "Calculating peaks..." : "AI Optimize Schedule"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Day Block Timeline */}
      <div className="xl:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-zinc-700" />
            <h3 className="text-base font-bold text-zinc-800 font-sans">Focus Block Timeline</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Blocks are arranged chronologically</span>
        </div>

        {schedule.length === 0 ? (
          <div className="p-10 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
            No focus blocks scheduled for today yet. Schedule your work blocks and refreshing coffee breaks manually, or click 'AI Optimize Schedule' to auto-build your day!
          </div>
        ) : (
          <div className="space-y-4 relative pl-6 border-l border-zinc-200">
            
            {schedule.map((block) => (
              <div 
                key={block.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all hover:-translate-x-1 duration-150 relative ${getBlockStyles(block.type)}`}
              >
                {/* Visual Circle pin on the timeline border */}
                <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-zinc-200 bg-white flex items-center justify-center z-10">
                  <div className={`w-2 h-2 rounded-full ${
                    block.completed ? "bg-indigo-600" : "bg-zinc-400 animate-pulse"
                  }`} />
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white border border-zinc-200 shadow-sm shrink-0">
                    {getBlockIcon(block.type)}
                  </div>
                  
                  <div className="min-w-0">
                    <span className={`text-xs font-semibold block truncate ${
                      block.completed ? "line-through opacity-50" : "text-zinc-800"
                    }`}>
                      {block.activity}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 mt-1">
                      <Clock className="w-3 h-3 text-zinc-300" />
                      <span>Start: {block.time} | Duration: {block.durationMinutes}m</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleToggleBlock(block.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                      block.completed 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "border-zinc-300 hover:border-indigo-500 bg-white text-transparent hover:text-indigo-600"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                    title="Remove block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
