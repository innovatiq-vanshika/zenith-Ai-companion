import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Tv, 
  Compass, 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  MessageSquare, 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  Trophy, 
  Flame, 
  ListTodo, 
  Calendar, 
  Mail, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  PlayCircle,
  HelpCircle,
  CheckCircle2,
  Info
} from "lucide-react";

interface DemoVideoWalkthroughProps {
  setActiveTab: (tab: string) => void;
  aiPersona: string;
}

interface Scene {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  subtitle: string;
  narration: string;
}

const SCENES: Scene[] = [
  {
    id: 0,
    timeStart: 0,
    timeEnd: 10,
    title: "Welcome to Zenith",
    subtitle: "A professional AI Companion built for placement success & deep flow.",
    narration: "Hello, and welcome to Zenith! Zenith is your high-fidelity, professional AI-driven companion. It combines robust goal roadmapping, strategic priority planning, decision support tools, and high-performance focus workspaces. Let's see how it works!"
  },
  {
    id: 1,
    timeStart: 10,
    timeEnd: 25,
    title: "1. The AI Dashboard Hub",
    subtitle: "AI Insight Orb & Future Self real-time projection metrics.",
    narration: "First, your landing pad is the Dashboard. The AI Insight Orb automatically syncs with your selected active advisor persona to deliver personalized study tips, while 'Future Self Mode' projects critical probability models of your placement milestones."
  },
  {
    id: 2,
    timeStart: 25,
    timeEnd: 42,
    title: "2. Strategic Task Engine",
    subtitle: "Map tasks with duration estimates, checklists, and direct focus bindings.",
    narration: "The Task Engine allows you to create placement preparation deliverables, assign duration estimates, set critical categories, and bind them immediately to your timer. Track progress seamlessly with real-time logs."
  },
  {
    id: 3,
    timeStart: 42,
    timeEnd: 60,
    title: "3. Focus Workspace & Sounds",
    subtitle: "Classic Pomodoro vs. Continuous Stopwatch focus modes.",
    narration: "Deep Focus mode supercharges your concentration. Bind tasks to a classic circular Pomodoro countdown or track continuous stopwatch blocks. Select cognitive ambient wave tracks like Binaural focus and scribble notes on-the-fly."
  },
  {
    id: 4,
    timeStart: 60,
    timeEnd: 78,
    title: "4. AI Decision Coach",
    subtitle: "Consult advisor personas & render custom Generative UI widgets.",
    narration: "Stuck between plural career directions? The Decision Coach uses Gemini 3.5 to help you solve dilemmas, structuring options into interactive Generative UI blocks: interactive Action Plans, Pros/Cons, and custom Decision Trees."
  },
  {
    id: 5,
    timeStart: 78,
    timeEnd: 95,
    title: "5. Roadmap & Schedule Builders",
    subtitle: "Synchronize long-term goals with your dynamic daily schedule.",
    narration: "Zenith brings long-term objectives down to daily tasks. Map out career roadmaps, decompose key targets into actionable tasks, and organize your workdays visually in the clean, interactive Schedule Builder."
  },
  {
    id: 6,
    timeStart: 95,
    timeEnd: 105,
    title: "Unleash Your Absolute Focus",
    subtitle: "Empower your career trajectory today with Zenith.",
    narration: "You're now ready to use Zenith to its full potential! Play this simulated tour anytime, or start our step-by-step Interactive Live Tour to walk through the actual interface now. Let's conquer your placement milestones!"
  }
];

export default function DemoVideoWalkthrough({ setActiveTab, aiPersona }: DemoVideoWalkthroughProps) {
  // Mode selection: "video" (Simulated Player) or "live" (Interactive Tour Guide)
  const [activeMode, setActiveMode] = useState<"video" | "live">("video");

  // Simulated Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 105 seconds
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);

  // Live Tour Guide States
  const [tourStep, setTourStep] = useState(0);
  const [showLiveTourOverlay, setShowLiveTourOverlay] = useState(false);

  // Auto-play ticking effect for simulated video
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeMode === "video") {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1 * playbackSpeed;
          if (next >= 105) {
            setIsPlaying(false);
            return 105;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeMode]);

  // Determine active scene based on currentTime
  const currentScene = SCENES.find(
    s => currentTime >= s.timeStart && currentTime < s.timeEnd
  ) || SCENES[SCENES.length - 1];

  // Handler to jump to a specific scene
  const handleJumpToScene = (scene: Scene) => {
    setCurrentTime(scene.timeStart);
    setIsPlaying(true);
  };

  // Reset player
  const handleResetVideo = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Live Tour Steps configuration
  const TOUR_STEPS = [
    {
      targetTab: "dashboard",
      title: "Welcome to Zenith Dashboard",
      description: "Here lies your central command. You can monitor your productivity score, inspect daily mission tasks, view the AI Insight Orb, and assess Future Self projections. Start here to check your focus score!",
      highlightSelector: "#dashboard-view"
    },
    {
      targetTab: "tasks",
      title: "The Strategic Task Engine",
      description: "This is where you organize study tasks, placement topics, and backlog cards. Categorize your priorities (Critical, High, Medium, Low) and click 'Start Focus' to sync active items instantly.",
      highlightSelector: "#tasks-view"
    },
    {
      targetTab: "focus",
      title: "Deep Focus Workspace",
      description: "Our core concentration room. Pick Classic Pomodoro for structured 25m countdown blocks or Stopwatch for continuous logs. You can lock active tasks, play binaural tracks, and write down scribble notes here.",
      highlightSelector: "#focus-view"
    },
    {
      targetTab: "coach",
      title: "AI Decision Coach",
      description: "Facing complex choices or feeling stuck? Converse with your advisor here. Zenith automatically designs custom Pros/Cons widgets and Decision Trees to make career decisions crystal clear.",
      highlightSelector: "#coach-view"
    },
    {
      targetTab: "roadmaps",
      title: "Roadmaps & Goal Tracker",
      description: "Plan your long-term roadmap. Decompose broad goals (like securing a TCS role) into a sequential tree of actionable micro-tasks that feed straight into your dynamic queue.",
      highlightSelector: "#roadmaps-view"
    },
    {
      targetTab: "schedule",
      title: "Schedule & Calendar Builder",
      description: "Visualize your entire week in a simple drag-and-drop or checklist-based planner to protect your study slots from schedule overlap.",
      highlightSelector: "#schedule-view"
    }
  ];

  // Start the live tour
  const handleStartLiveTour = () => {
    setActiveMode("live");
    setTourStep(0);
    setShowLiveTourOverlay(true);
    setActiveTab(TOUR_STEPS[0].targetTab);
  };

  const handleNextTourStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      setActiveTab(TOUR_STEPS[nextStep].targetTab);
    } else {
      setShowLiveTourOverlay(false);
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      setActiveTab(TOUR_STEPS[prevStep].targetTab);
    }
  };

  return (
    <div id="demo-view" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 p-6 md:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-44 h-44 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            ZENITH EXPLORER GUIDE
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight">
            How to Master Your Zenith Experience
          </h1>
          <p className="text-sm text-indigo-100 font-sans leading-relaxed">
            Understand every feature of your AI companion in minutes. Watch our interactive simulated walkthrough video, or launch the Live Walkthrough Tour to guide you step-by-step through the live app!
          </p>
        </div>

        <div className="flex flex-row sm:flex-col gap-2.5 relative z-10 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveMode("video");
              setIsPlaying(true);
            }}
            className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeMode === "video" 
                ? "bg-white text-indigo-700 shadow-lg shadow-indigo-950/20" 
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Play Demo Video Simulator
          </button>
          
          <button
            onClick={handleStartLiveTour}
            className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeMode === "live"
                ? "bg-white text-indigo-700 shadow-lg"
                : "bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/55"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-300" />
            Launch Live Workspace Tour
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeMode === "video" ? (
          
          /* HIGH-FIDELITY SIMULATED VIDEO PLAYER */
          <motion.div
            key="video-mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* The Simulated Media Canvas Screen */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative aspect-video w-full flex flex-col justify-between">
                
                {/* TOP BAR OF SIMULATED VIDEO PLAYER */}
                <div className="bg-black/60 backdrop-blur-md px-5 py-3 flex items-center justify-between text-white z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase">Simulated Video Playback</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-indigo-400">
                    Scene {currentScene.id + 1} of {SCENES.length}: {currentScene.title}
                  </span>
                </div>

                {/* THE DYNAMIC SCREEN SCENE CONTENT (Animate with keys to feel like transitions) */}
                <div className="flex-1 flex items-center justify-center p-6 relative">
                  
                  {/* Subtle Background grids */}
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene.id}
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full flex items-center justify-center relative z-10"
                    >
                      {/* Render simulated visuals based on active scene */}
                      {currentScene.id === 0 && (
                        <div className="text-center space-y-4 max-w-md">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 shadow-lg text-white mx-auto"
                          >
                            <BrainCircuit className="w-8 h-8" />
                          </motion.div>
                          <h2 className="text-2xl font-extrabold text-white tracking-tight">Zenith AI Companion</h2>
                          <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full" />
                          <p className="text-xs text-zinc-300 font-medium">Empowering your career strategy & daily study habits</p>
                        </div>
                      )}

                      {currentScene.id === 1 && (
                        <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-left text-zinc-200 text-xs font-sans space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                            <span className="font-bold text-zinc-300 flex items-center gap-1.5"><LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" /> Simulated Dashboard</span>
                            <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900">SIMULATION</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80">
                              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-mono">Productivity Score</span>
                              <span className="text-lg font-black text-white mt-1 block">88 <span className="text-emerald-500 text-[10px] font-bold font-mono ml-1">+4.2%</span></span>
                            </div>
                            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80">
                              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-mono">Completion Index</span>
                              <span className="text-lg font-black text-white mt-1 block">75% Excellent</span>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60 relative overflow-hidden">
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                            <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block font-bold">Insight Orb (Friendly Coach)</span>
                            <p className="text-[10px] text-indigo-200 leading-relaxed font-medium mt-1">
                              "I've reviewed your placement goals, Vanshika. Tackling 45m of aptitude questions before 2 PM today will secure your TCS exam completion rate!"
                            </p>
                          </div>
                        </div>
                      )}

                      {currentScene.id === 2 && (
                        <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-left text-zinc-200 text-xs font-sans space-y-3.5">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-zinc-300 flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-purple-400" /> Strategic Task Engine</span>
                            <span className="text-[9px] text-zinc-500 font-mono">Simulating Task Add</span>
                          </div>

                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-zinc-900 border border-rose-950 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[8px] bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded font-bold font-mono">CRITICAL</span>
                                <h4 className="text-[11px] font-bold text-white mt-1">Capstone Figma Mockups & Delivery</h4>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono">90 min est</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-zinc-900 border border-indigo-950 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded font-bold font-mono">HIGH</span>
                                <h4 className="text-[11px] font-bold text-white mt-1">TCS Placement Quant Exam Prep</h4>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono">45 min est</span>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-[10px] text-zinc-400">
                            <span className="bg-zinc-800 text-white px-2 py-1 rounded font-mono">Typing cursor...</span>
                            <span className="text-zinc-300 font-semibold italic">"Research placements probability metrics"</span>
                          </div>
                        </div>
                      )}

                      {currentScene.id === 3 && (
                        <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-left text-zinc-200 text-xs font-sans space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-zinc-300 flex items-center gap-1.5"><Timer className="w-3.5 h-3.5 text-emerald-400" /> Deep Focus Mode</span>
                            <span className="text-[9px] text-emerald-400 font-mono animate-pulse">● ACTIVE POMODORO</span>
                          </div>

                          <div className="flex items-center gap-5">
                            {/* Tiny ticking simulator wheel */}
                            <div className="relative w-24 h-24 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center shrink-0">
                              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin duration-[10s]" />
                              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Focus</span>
                              <span className="text-xl font-mono font-bold text-white mt-1">24:45</span>
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                                <span className="text-[8px] text-zinc-500 uppercase font-mono block">Active Target Task</span>
                                <span className="text-[10px] font-bold text-zinc-300 truncate block">TCS Placement Quant Exam Prep</span>
                              </div>
                              
                              <div className="flex gap-1.5">
                                <span className="bg-emerald-950/50 border border-emerald-900/60 text-emerald-400 text-[8px] px-2 py-1 rounded-lg font-mono">🔊 Binaural Focus</span>
                                <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-1 rounded-lg font-mono">🎙️ AI Voice OK</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentScene.id === 4 && (
                        <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-left text-zinc-200 text-xs font-sans space-y-3.5">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-zinc-300 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Decision Coach Simulator</span>
                            <span className="text-[9px] text-blue-400 font-mono font-semibold">Gemini 3.5 Generated UI</span>
                          </div>

                          <div className="space-y-2 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                              <span>Widget: Pros & Cons Matrix</span>
                              <span className="text-indigo-400">Decision: Start Placements Prep early?</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="bg-emerald-950/20 border border-emerald-900/40 p-2 rounded-lg text-[9.5px]">
                                <span className="text-emerald-400 font-bold font-mono">PROS</span>
                                <p className="text-zinc-300 mt-1 leading-snug">Secures stable corporate entry and regional study scoring benchmarks.</p>
                              </div>
                              <div className="bg-rose-950/20 border border-rose-900/40 p-2 rounded-lg text-[9.5px]">
                                <span className="text-rose-400 font-bold font-mono">CONS</span>
                                <p className="text-zinc-300 mt-1 leading-snug">Leaves less time for core engineering hobby projects this trimester.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentScene.id === 5 && (
                        <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-left text-zinc-200 text-xs font-sans space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                            <span className="font-bold text-zinc-300 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-amber-400" /> Goals & Schedules Map</span>
                            <span className="text-[9px] text-zinc-500 font-mono">72-Hour Sync</span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest block font-bold">Goal Roadmap Tree</span>
                            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-zinc-200 text-[10.5px]">Goal: Crack TCS Placement Exam</span>
                                <span className="text-emerald-500 font-bold font-mono text-[9px]">40% DONE</span>
                              </div>
                              <div className="pl-3.5 border-l border-zinc-800 space-y-1">
                                <span className="text-[9px] text-zinc-400 block">✔ Solve Aptitude Ratios backlog card (Logged 45m)</span>
                                <span className="text-[9px] text-zinc-500 block">□ Complete 3 core coding Mock Tests</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentScene.id === 6 && (
                        <div className="text-center space-y-4 max-w-md">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-extrabold text-white tracking-tight">You're Fully Trained!</h2>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Zenith is completely optimized for your workflow. Play the walkthrough guide anytime or jump to specific chapters.
                          </p>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* THE SUBTITLES / TRANSCRIPT DRAWER */}
                <div className="bg-black/90 border-t border-zinc-800/80 p-4 min-h-[70px] flex items-center justify-center relative z-10">
                  <p className="text-center text-xs text-zinc-200 leading-relaxed max-w-2xl font-sans font-medium selection:bg-indigo-600">
                    "{currentScene.narration}"
                  </p>
                </div>

                {/* VIDEO TIMELINE TRACK SLIDER */}
                <div className="bg-black/80 px-5 py-2.5 flex items-center gap-4 border-t border-zinc-800 select-none z-10">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, "0")}
                  </span>
                  
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full relative cursor-pointer group" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    setCurrentTime(Math.round(pct * 105));
                  }}>
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
                      style={{ width: `${(currentTime / 105) * 100}%` }}
                    />
                    <div 
                      className="absolute w-3.5 h-3.5 bg-white rounded-full border border-indigo-600 shadow-md top-1/2 -translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform"
                      style={{ left: `${(currentTime / 105) * 100}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400">1:45</span>
                </div>

                {/* MEDIA PLAYER CONTROLS BAR */}
                <div className="bg-black/95 px-5 py-3.5 flex items-center justify-between z-10 text-zinc-400 border-t border-zinc-900">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 hover:text-white cursor-pointer transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      onClick={handleResetVideo}
                      className="p-1 hover:text-white cursor-pointer transition-colors"
                      title="Reset video playback to beginning"
                    >
                      <RotateCcw className="w-4.5 h-4.5" />
                    </button>

                    <div className="h-4 w-px bg-zinc-800" />

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 hover:text-white cursor-pointer transition-colors"
                      title={isMuted ? "Unmute simulated voiceover" : "Mute simulated voiceover"}
                    >
                      {isMuted ? <VolumeX className="w-4.5 h-4.5 text-rose-400" /> : <Volume2 className="w-4.5 h-4.5 text-emerald-400" />}
                    </button>

                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      {isMuted ? "Audio Muted" : "Simulated Audio OK"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Playback speed selector */}
                    <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 text-[10px] font-mono">
                      {([1, 1.5, 2] as const).map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-2 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                            playbackSpeed === speed 
                              ? "bg-indigo-600 text-white" 
                              : "hover:text-white"
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <div className="h-4 w-px bg-zinc-800" />

                    <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg">
                      1080p HD
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Info Tip */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-start gap-3">
                <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-600 leading-normal font-sans">
                  <strong>Simulating Live Interface:</strong> The screens above are reactive visual models rendered live in real-time. Drag the slider track or choose standard timeline chapters on the right to instantly jump directly to any topic of interest!
                </p>
              </div>
            </div>

            {/* THE CHAPTERS PLAYLIST SIDEBAR */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Tv className="w-4.5 h-4.5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-zinc-800 font-sans">Chapters & Timeline</h3>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {SCENES.map((scene) => {
                    const isSceneActive = currentTime >= scene.timeStart && currentTime < scene.timeEnd;
                    return (
                      <button
                        key={scene.id}
                        onClick={() => handleJumpToScene(scene)}
                        className={`w-full p-3.5 rounded-xl text-left border cursor-pointer transition-all flex items-start gap-3 relative ${
                          isSceneActive
                            ? "bg-indigo-50/80 border-indigo-200 shadow-sm"
                            : "bg-zinc-50/50 border-zinc-200/60 hover:border-zinc-300"
                        }`}
                      >
                        {isSceneActive && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-md" />
                        )}
                        
                        <div className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isSceneActive ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-500"
                        }`}>
                          {scene.id + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-zinc-800 block truncate">{scene.title}</span>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                            {Math.floor(scene.timeStart / 60)}:{String(scene.timeStart % 60).padStart(2, "0")} - {Math.floor(scene.timeEnd / 60)}:{String(scene.timeEnd % 60).padStart(2, "0")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-zinc-100">
                  <button
                    onClick={handleStartLiveTour}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                  >
                    <Compass className="w-4 h-4 text-amber-300 animate-bounce" />
                    Launch Live Workspace Tour Now
                  </button>
                </div>
              </div>

              {/* App Status Details */}
              <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm space-y-3.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">App Information</span>
                
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">App Name</span>
                    <span className="font-bold text-zinc-800">Zenith AI</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Framework</span>
                    <span className="font-mono text-[11px] font-semibold text-zinc-700">React + Vite + Tailwind</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Database Engine</span>
                    <span className="font-mono text-[11px] text-zinc-700 font-semibold">Local state engine</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Intelligence Core</span>
                    <span className="font-mono text-[11px] text-indigo-600 font-bold">Gemini 3.5 Flash</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          
          /* LIVE TOUR MODE INFORMATION LANDING */
          <motion.div
            key="live-mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Compass className="w-8 h-8 animate-spin duration-1000" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-zinc-800 font-sans">Live Walkthrough Tour Mode Enabled</h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
                Zenith will now take you on a dynamic tour of your live interface workspace, showcasing every tab so you'll instantly understand how to navigate and operate each feature.
              </p>
            </div>

            {/* Steps Preview */}
            <div className="bg-zinc-50 border border-zinc-200/50 p-4 rounded-2xl text-left max-w-md mx-auto">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2 font-bold">Workspace Checklist Map</span>
              <div className="space-y-2 text-xs font-sans text-zinc-600">
                <div className="flex items-center gap-2 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span>1. Dashboard metrics, score rings, and Insight Orb advice</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span>2. Task Engine priorities, timeline estimative values</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span>3. Deep Focus classic Pomodoro & Stopwatch controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span>4. AI Decision Coach generative trees, criteria tables</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setActiveMode("video");
                  setIsPlaying(true);
                }}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 cursor-pointer transition-colors"
              >
                Back to Video Player
              </button>

              <button
                onClick={handleStartLiveTour}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-md shadow-indigo-100"
              >
                Begin Walkthrough Guide
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOUR DIALOG DIALOG OVERLAY PORTAL */}
      <AnimatePresence>
        {showLiveTourOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-6 right-6 z-50 bg-white rounded-3xl p-6 border-2 border-indigo-600 shadow-2xl max-w-md w-[calc(100vw-3rem)] space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] font-mono font-extrabold text-indigo-600 uppercase tracking-widest">
                  Active Tour: Chapter {tourStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <button 
                onClick={() => setShowLiveTourOverlay(false)}
                className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Desc */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-zinc-900 font-sans">
                {TOUR_STEPS[tourStep].title}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans font-medium">
                {TOUR_STEPS[tourStep].description}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
              <div className="flex gap-1.5">
                <button
                  onClick={handlePrevTourStep}
                  disabled={tourStep === 0}
                  className="p-2 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent text-zinc-600 rounded-xl cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextTourStep}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1"
                >
                  {tourStep === TOUR_STEPS.length - 1 ? "Complete Guide" : "Next Module"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowLiveTourOverlay(false)}
                className="text-[10.5px] font-sans font-semibold text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                Skip Walkthrough
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
