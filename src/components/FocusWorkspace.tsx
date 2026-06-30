import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  FileText, 
  Sparkles, 
  Trophy,
  Coffee,
  Mic,
  StopCircle,
  CheckCircle2,
  ChevronDown,
  Info,
  Clock,
  Check,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Task } from "../types";

interface FocusWorkspaceProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTask: Task | null;
  onStopSession: () => void;
  elapsedTimeString: string;
}

export default function FocusWorkspace({
  tasks,
  setTasks,
  activeTask,
  onStopSession,
  elapsedTimeString
}: FocusWorkspaceProps) {
  // Navigation / Mode Selection
  // Switch between "pomodoro" and "stopwatch"
  const [focusMode, setFocusMode] = useState<"pomodoro" | "stopwatch">("pomodoro");

  // Pomodoro Countdown States
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "short_break" | "long_break">("focus");

  // Linked Task for Pomodoro Focus session
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Session Notes & Active Ambient Audio states
  const [sessionNotes, setSessionNotes] = useState("");
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [ambientTrack, setAmbientTrack] = useState<string | null>(null);

  // Voice Assistant states
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Automatically adjust focus mode when an active stopwatch task exists
  useEffect(() => {
    if (activeTask) {
      setFocusMode("stopwatch");
    }
  }, [activeTask]);

  // Timer Countdown logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(prev => prev - 1);
          setTimerSeconds(59);
        } else {
          setIsActive(false);
          handleSessionCompletion();
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timerMinutes, timerSeconds]);

  const handleSessionCompletion = () => {
    const minutesSpent = sessionType === "focus" ? 25 : sessionType === "short_break" ? 5 : 15;
    const targetTask = activeTask || tasks.find(t => t.id === selectedTaskId);

    if (targetTask) {
      setTasks(prev => prev.map(t => {
        if (t.id === targetTask.id) {
          const nextLogged = t.actualMinutesLogged + minutesSpent;
          return {
            ...t,
            actualMinutesLogged: nextLogged,
            progress: Math.min(100, Math.round((nextLogged / t.estimatedMinutes) * 100)),
            completed: Math.min(100, Math.round((nextLogged / t.estimatedMinutes) * 100)) >= 100 ? true : t.completed
          };
        }
        return t;
      }));
      setVoiceFeedback(`✨ Pomodoro block completed! Logged ${minutesSpent}m to "${targetTask.title}". Progress synced!`);
    } else {
      setVoiceFeedback(`✨ Pomodoro block completed! Refreshed with a ${minutesSpent}m interval.`);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = (type: "focus" | "short_break" | "long_break") => {
    setIsActive(false);
    setSessionType(type);
    if (type === "focus") {
      setTimerMinutes(25);
    } else if (type === "short_break") {
      setTimerMinutes(5);
    } else {
      setTimerMinutes(15);
    }
    setTimerSeconds(0);
  };

  // Ambient Audio Toggle
  const handleToggleAmbient = (trackName: string) => {
    setAmbientTrack(prev => prev === trackName ? null : trackName);
  };

  // Simulated Voice Assistant interaction
  const triggerVoiceAssistant = () => {
    setIsListening(true);
    setVoiceFeedback("🎤 Listening to your vocal commands...");
    
    setTimeout(() => {
      setIsListening(false);
      const simulatedPhrases = [
        "Logged active 25 minutes to your quantitative aptitude research backlog.",
        "Synthesizing customized 90-minute study segment with active ambient soundscapes.",
        "Risk metrics adjusted: Your Capstone completion index is secure."
      ];
      const randomFeedback = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
      setVoiceFeedback(`🗣️ AI Voice Response: "${randomFeedback}"`);
    }, 2400);
  };

  // Utility actions for Notes Scribble Pad
  const handleCopyNotes = () => {
    if (!sessionNotes.trim()) return;
    navigator.clipboard.writeText(sessionNotes);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const handleClearNotes = () => {
    setSessionNotes("");
  };

  // Filter incomplete tasks that can be focused on
  const focusableTasks = tasks.filter(t => !t.completed);

  // Circle progress calculation for SVG ring
  const circleRadius = 95;
  const circumference = 2 * Math.PI * circleRadius;
  const totalSecondsInSession = sessionType === "focus" ? 25 * 60 : sessionType === "short_break" ? 5 * 60 : 15 * 60;
  const currentRemainingSeconds = timerMinutes * 60 + timerSeconds;
  const progressPercentage = currentRemainingSeconds / totalSecondsInSession;
  const strokeDashoffset = circumference - (progressPercentage * circumference);

  return (
    <div id="focus-view" className="space-y-6">
      
      {/* Mode Navigation Bar - Simple & Intuitive Switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-zinc-200/80 p-3 rounded-2xl shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFocusMode("pomodoro")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              focusMode === "pomodoro"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            Classic Pomodoro Timer
          </button>
          <button
            onClick={() => setFocusMode("stopwatch")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 relative ${
              focusMode === "stopwatch"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            <StopCircle className="w-4 h-4" />
            Continuous Stopwatch Focus
            {activeTask && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200/60">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Select Classic Pomodoro for structured countdown blocks, or Stopwatch for real-time tracking.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Active Workspace Timer/Clock Hub */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {focusMode === "pomodoro" ? (
              
              /* CLASSIC POMODORO TIMER PANEL */
              <motion.div
                key="pomodoro-panel"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[520px] relative overflow-hidden"
              >
                {/* Visual Ambient Blur Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-50/40 blur-3xl pointer-events-none" />

                {/* Pomodoro Session Type Tabs */}
                <div className="flex gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/60 z-10 mb-8 max-w-full overflow-x-auto scrollbar-none">
                  {[
                    { type: "focus", label: "Deep Focus (25m)" },
                    { type: "short_break", label: "Short Break (5m)" },
                    { type: "long_break", label: "Long Break (15m)" }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      onClick={() => resetTimer(btn.type as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                        sessionType === btn.type
                          ? "bg-white text-indigo-700 shadow-sm border border-zinc-200/40"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Glowing Circular Progress Clock Face */}
                <div className="relative w-64 h-64 rounded-full bg-white border border-zinc-100 shadow-lg shadow-indigo-100/30 flex flex-col items-center justify-center z-10 mb-8">
                  {/* SVG Circle Progress indicator */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    {/* Background Ring */}
                    <circle
                      cx="128"
                      cy="128"
                      r={circleRadius}
                      className="stroke-zinc-100"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {/* Active Progress Ring */}
                    <motion.circle
                      cx="128"
                      cy="128"
                      r={circleRadius}
                      className="stroke-indigo-600"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: Number.isNaN(strokeDashoffset) ? circumference : strokeDashoffset }}
                      transition={{ duration: 0.8, ease: "linear" }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Inner Timer Content */}
                  <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                    {sessionType === "focus" ? "Concentration Phase" : "MIND REFRESH"}
                  </span>

                  <span className="text-5xl font-mono font-bold text-zinc-800 mt-2 tracking-tight select-none">
                    {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                  </span>

                  {/* Dynamic Target Indicator inside clock */}
                  <div className="mt-3 text-center px-6 max-w-[210px]">
                    {activeTask ? (
                      <span className="text-[10px] text-zinc-500 font-sans font-medium line-clamp-1" title={activeTask.title}>
                        Target: {activeTask.title}
                      </span>
                    ) : selectedTaskId ? (
                      <span className="text-[10px] text-zinc-500 font-sans font-medium line-clamp-1" title={tasks.find(t => t.id === selectedTaskId)?.title}>
                        Linked: {tasks.find(t => t.id === selectedTaskId)?.title}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Solo Session</span>
                    )}
                  </div>
                </div>

                {/* Clock Controls */}
                <div className="flex items-center gap-4 z-10 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md transition-all ${
                      isActive
                        ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                    }`}
                  >
                    {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => resetTimer(sessionType)}
                    className="w-11 h-11 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4.5 h-4.5" />
                  </motion.button>
                </div>

                {/* Task Binder picker to make Pomodoro understandable */}
                <div className="w-full max-w-sm z-10 border-t border-zinc-100 pt-6">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center mb-2">
                    Bind focus block to active Task
                  </label>
                  
                  {activeTask ? (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center text-xs text-indigo-700 font-semibold font-sans">
                      🔒 Clock bound to active stopwatch task: {activeTask.title}
                    </div>
                  ) : focusableTasks.length > 0 ? (
                    <div className="relative">
                      <select
                        value={selectedTaskId}
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-zinc-700 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">-- Click to bind task (optional) --</option>
                        {focusableTasks.map(t => (
                          <option key={t.id} value={t.id}>
                            [{t.priority}] {t.title} ({t.estimatedMinutes}m estimate)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="text-center text-[11px] text-zinc-400 py-1 font-medium font-sans">
                      All tasks completed! Set up new tasks in the Task Engine to bind them here.
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              
              /* CONTINUOUS STOPWATCH MODE PANEL */
              <motion.div
                key="stopwatch-panel"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[520px] relative overflow-hidden"
              >
                {/* Visual Ambient Glow Rings */}
                <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-emerald-50/30 blur-3xl pointer-events-none" />

                <div className="space-y-6 flex-1 flex flex-col justify-center items-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                      ● Stopwatch Focus Engine
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-500 font-sans mt-2">Active Continuous Duration</h3>
                  </div>

                  {activeTask ? (
                    <div className="flex flex-col items-center space-y-6 w-full text-center">
                      {/* Big Stopwatch Display */}
                      <div className="text-6xl font-mono font-bold text-zinc-800 tracking-tight font-semibold py-4 select-all">
                        {elapsedTimeString}
                      </div>

                      {/* Info Container */}
                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70 w-full max-w-md space-y-4 text-left shadow-inner">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">Active Target Task</span>
                          <span className="text-sm font-bold text-zinc-800 font-sans mt-1 block">{activeTask.title}</span>
                          <span className="text-xs text-zinc-500 mt-1 block">{activeTask.description || "No description provided."}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 border-t border-zinc-100 pt-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                            <span>Logged Time: {activeTask.actualMinutesLogged}m / {activeTask.estimatedMinutes}m</span>
                            <span>{activeTask.progress}% Complete</span>
                          </div>
                          <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activeTask.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Log / Stop Controls */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onStopSession}
                        className="w-full max-w-md py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5" />
                        Complete & Log Elapsed Time
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm space-y-4">
                      <div className="p-3.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400">
                        <Clock className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-800 font-sans">No Active Stopwatch Session</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                        Continuous focus tracking logs your work dynamically in real-time. To start a continuous stopwatch focus block:
                      </p>
                      
                      <ol className="text-left text-xs text-zinc-600 space-y-2 list-decimal pl-4 font-sans font-medium">
                        <li>Navigate to the <span className="text-indigo-600 font-semibold">Task Engine</span> tab.</li>
                        <li>Find any critical study task or placement deliverable.</li>
                        <li>Click the <span className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200">Start Focus</span> button.</li>
                      </ol>

                      <div className="pt-4 w-full">
                        <button
                          onClick={() => setFocusMode("pomodoro")}
                          className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs text-zinc-700 font-semibold cursor-pointer transition-colors"
                        >
                          Use Classic Pomodoro Instead
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Voice Engine, Ambient Audio, Scribble Pad */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI VOICE ASSISTANT CARD */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4.5 h-4.5 text-indigo-600" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">AI Voice Assistant</span>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={triggerVoiceAssistant}
                disabled={isListening}
                className={`p-3 rounded-full flex items-center justify-center cursor-pointer relative transition-all border ${
                  isListening 
                    ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                    : "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                }`}
                title="Trigger voice simulation"
              >
                {isListening && (
                  <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-45" />
                )}
                <Mic className="w-4.5 h-4.5" />
              </motion.button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              Speak or simulate placement-prep vocal commands (e.g. tracking study hours or creating immediate backlog cards).
            </p>

            {/* Listening Visual Waves */}
            {isListening && (
              <div className="flex items-center justify-center gap-1 py-2">
                {[0.4, 0.9, 0.6, 0.8, 0.5].map((scale, index) => (
                  <motion.div
                    key={index}
                    animate={{ scaleY: [1, 2.8, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.7,
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-1 h-4 bg-indigo-600 rounded-full origin-center"
                  />
                ))}
              </div>
            )}

            {/* Simulated Response Box */}
            <AnimatePresence>
              {voiceFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 mt-2">
                    <span className="text-[9px] text-zinc-400 font-mono uppercase block">Companion Response</span>
                    <p className="text-xs font-semibold text-zinc-700 mt-1 leading-relaxed">{voiceFeedback}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AMBIENT SOUND PANELS */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-sm font-bold text-zinc-800 font-sans">Ambient Sound Waves</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "binaural", title: "Binaural Focus", desc: "40Hz cognitive waves", icon: <Sparkles className="w-4 h-4 text-indigo-500" /> },
                { id: "synth", title: "Cyberpunk Synth", desc: "Ambient chill loops", icon: <Trophy className="w-4 h-4 text-purple-500" /> },
                { id: "rain", title: "Rainy Coffee Shop", desc: "White noise rain", icon: <Coffee className="w-4 h-4 text-rose-500" /> },
                { id: "noise", title: "Cosmic Static", desc: "Steady brown noise", icon: <Volume2 className="w-4 h-4 text-amber-500" /> },
              ].map((track) => {
                const isActive = ambientTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleToggleAmbient(track.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isActive 
                        ? "bg-indigo-50/80 border-indigo-200 shadow-sm" 
                        : "bg-zinc-50/50 border-zinc-200 hover:border-indigo-500/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {track.icon}
                        <span className="text-xs font-bold text-zinc-800 truncate">{track.title}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-none">{track.desc}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-100 w-full flex items-center justify-between text-[9px] font-mono text-zinc-400">
                      <span>Status</span>
                      <span className={isActive ? "text-indigo-600 font-bold flex items-center gap-1" : "text-zinc-300"}>
                        {isActive && (
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                          </span>
                        )}
                        {isActive ? "PLAYING" : "MUTED"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SCRIBBLE PAD CARD */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-zinc-700" />
                <h3 className="text-sm font-bold text-zinc-800 font-sans">Active Session Scribble Pad</h3>
              </div>
              
              <div className="flex items-center gap-1">
                {sessionNotes.trim() && (
                  <>
                    <button
                      onClick={handleCopyNotes}
                      className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                      title="Copy notes to clipboard"
                    >
                      {copiedNotes ? <Check className="w-4.5 h-4.5 text-emerald-600" /> : <FileText className="w-4.5 h-4.5" />}
                    </button>
                    <button
                      onClick={handleClearNotes}
                      className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="Clear Notes"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              Jot down formulas, interview highlights, complex logic ideas, or rapid conceptual notes to keep your mind entirely focused.
            </p>

            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Star Interview layouts, Quant Formulas, or active code blocks..."
              className="w-full h-24 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none shadow-inner"
            />

            {sessionNotes.trim() && (
              <div className="flex justify-end text-[10px] text-zinc-400 font-mono">
                {sessionNotes.length} characters written
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
