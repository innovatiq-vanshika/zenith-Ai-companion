import React from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, 
  Sparkles, 
  Trophy, 
  Clock, 
  AlertCircle, 
  Play, 
  ArrowRight,
  Brain,
  Zap,
  Target
} from "lucide-react";
import { Task, Goal, PersonaType } from "../types";

interface DashboardProps {
  tasks: Task[];
  goals: Goal[];
  aiPersona: PersonaType;
  setActiveTab: (tab: string) => void;
  onStartSession: (task: Task) => void;
}

export default function Dashboard({ tasks, goals, aiPersona, setActiveTab, onStartSession }: DashboardProps) {
  // Compute dashboard metrics
  const activeTasks = tasks.filter(t => !t.completed);
  const tasksDueToday = activeTasks.filter(t => {
    const today = new Date().toISOString().split("T")[0];
    return t.dueDate === today;
  });
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Custom productivity score
  const activeGoalCount = goals.length;
  const criticalMissed = tasks.some(t => {
    const todayStr = new Date().toISOString().split("T")[0];
    return !t.completed && t.dueDate < todayStr;
  });
  const riskScore = criticalMissed ? 85 : 30;

  // Distill top 3 important tasks for "Daily Mission" (Feature 4)
  const dailyMissionTasks = tasks.filter(t => !t.completed).slice(0, 3);

  // Generate dynamic persona-based advice for the Insight Orb (Feature 3)
  const getOrbAdvice = (persona: PersonaType) => {
    switch (persona) {
      case "Friendly Coach":
        return "I've reviewed your agenda, Vanshika. You've completed 1 major database task! If you tackle 45 mins of aptitude prep before 2 PM, you'll feel absolutely amazing this evening. Remember to take a quick walk during breaks!";
      case "Strict Mentor":
        return "ATTENTION REQUIRED: You have 1 critical overdue task (Capstone Figma Mockups) which threatens your weekly milestones. Stop browsing minor tasks. Begin your 90-minute design focus block immediately. No excuses.";
      case "Study Buddy":
        return "Hey Vanshika! Ready to crush today's sprint? We've got our TCS aptitude session and Figma mockups. Let's tackle the toughest coding section first while our brains are 100% fresh. I'll cue up the synth music!";
      case "Professional Advisor":
        return "RISK FORECAST: Your project delay index is currently Moderate. Mitigating the overdue Figma mockups task will lift your productivity score to 92. I suggest prioritizing the Capstone delivery to secure client alignment.";
    }
  };

  return (
    <div id="dashboard-view" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Hero Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 via-purple-50/55 to-white p-6 rounded-3xl border border-indigo-100/60 shadow-sm">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-widest">Workspace Dashboard</span>
          <h1 className="text-3xl font-sans font-extrabold tracking-tight text-zinc-900 mt-1">
            Good Morning, Vanshika
          </h1>
          <p className="text-sm text-zinc-600 mt-1.5 font-sans">
            Your Zenith engine is synchronized. Today's strategic focus is <span className="text-indigo-600 font-semibold underline decoration-indigo-300 decoration-2">Placement Aptitude</span>.
          </p>
          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => setActiveTab("demo")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer transition-all shadow-sm shadow-indigo-100"
            >
              <Play className="w-3 h-3 fill-current" />
              Watch Demo Video & Start Workspace Tour
            </button>
            <span className="text-[10px] text-zinc-400 font-mono">Simple 1:45 min guide</span>
          </div>
        </div>
        
        {/* Productivity Score Ring Widget */}
        <div className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-2xl border border-zinc-200/80 shadow-sm shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="21" className="stroke-zinc-100 fill-none stroke-2" />
              <circle 
                cx="24" 
                cy="24" 
                r="21" 
                className="stroke-indigo-600 fill-none stroke-3 transition-all duration-500" 
                strokeDasharray="132" 
                strokeDashoffset={132 - (132 * completionRate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-zinc-800">{completionRate}%</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest block">Completion Index</span>
            <span className="text-sm font-bold text-zinc-800 block">Excellent Pace</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Glowing Cards (Core Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-semibold font-sans">Productivity Score</span>
            <Trophy className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-sans text-zinc-900">88</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">+4.2% wk</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">Top 5% of regional students</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-semibold font-sans">Active Roadmaps</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-sans text-zinc-900">{activeGoalCount}</span>
            <span className="text-xs text-zinc-500 font-sans">Goals</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">Secure placement & Build product</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-semibold font-sans">Due Today</span>
            <Clock className="w-4 h-4 text-pink-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-sans text-zinc-900">{tasksDueToday.length}</span>
            <span className="text-xs text-zinc-500 font-sans">Strategic items</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">TCS exam & Capstone preparation</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-colors">
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition-colors ${criticalMissed ? "bg-rose-500/10" : "bg-emerald-500/5"}`} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-semibold font-sans">Deadline Risks</span>
            <ShieldAlert className={`w-4 h-4 ${criticalMissed ? "text-rose-500 animate-bounce" : "text-emerald-500"}`} />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-sans ${criticalMissed ? "text-rose-600" : "text-emerald-600"}`}>
              {criticalMissed ? "CRITICAL" : "LOW"}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Index: {riskScore}/100</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            {criticalMissed ? "1 task overdue! Action required." : "All systems aligned perfectly"}
          </p>
        </div>

      </div>

      {/* The Insight Orb & Future Self Mode Widget Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Glowing Insight Orb */}
        <div className="lg:col-span-2 bg-gradient-to-b from-indigo-50/70 to-white p-6 rounded-2xl border border-indigo-100/70 relative overflow-hidden flex flex-col justify-between shadow-sm">
          {/* Glowing Radial Orb Ambient BG */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full opacity-10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-pink-400 to-indigo-400 rounded-full opacity-5 blur-3xl animate-pulse" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-200/50 text-indigo-600">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                Insight Orb (AI Sync)
              </span>
            </div>
            
            <p className="text-zinc-800 font-sans text-sm leading-relaxed font-semibold">
              "{getOrbAdvice(aiPersona)}"
            </p>
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between border-t border-indigo-100 pt-4">
            <span className="text-[10px] text-zinc-400 font-mono">Active Advisor: {aiPersona}</span>
            <button 
              onClick={() => setActiveTab("coach")}
              className="text-xs font-sans text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              Consult Decision Coach <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Future Self Projection Widget */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 flex flex-col justify-between shadow-sm relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4.5 h-4.5 text-amber-500" />
              <span className="text-xs font-mono text-amber-600 uppercase tracking-wider font-bold">
                Future Self Mode
              </span>
            </div>
            
            <p className="text-xs text-zinc-700 font-sans leading-relaxed">
              If you dedicate <strong className="text-amber-600">90 minutes today</strong> to TCS Quant practice, your completion probability increases to <strong className="text-emerald-600">94%</strong>.
            </p>
            
            <div className="mt-4 p-3 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[10px] text-zinc-600 font-sans leading-snug">
                If skipped, you'll need <strong className="text-amber-700 font-semibold">3 extra hours</strong> this weekend to catch up with placement exam syllabus.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-400">
            <span>Projection Interval: 72 Hours</span>
            <span className="text-amber-600 font-semibold">Simulating...</span>
          </div>
        </div>

      </div>

      {/* Feature 4: Daily Mission */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold font-sans text-zinc-800">Daily Mission</h2>
          </div>
          <span className="text-xs text-zinc-500 font-sans font-medium">Focus down on 3 critical milestones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dailyMissionTasks.length === 0 ? (
            <div className="md:col-span-3 p-10 rounded-2xl bg-zinc-50 border border-zinc-200/60 text-center">
              <p className="text-sm text-zinc-500 font-medium">🎉 Congratulations, Vanshika! All of today's Daily Mission goals are completed!</p>
            </div>
          ) : (
            dailyMissionTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-5 rounded-2xl border border-zinc-200/70 relative flex flex-col justify-between group hover:border-indigo-400/50 hover:shadow-md transition-all shadow-sm"
              >
                {/* Priority ribbon */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider ${
                    task.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                  }`}>
                    {task.priority}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">{task.estimatedMinutes} mins est</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-800 mt-3 group-hover:text-indigo-600 transition-colors font-sans">
                    {task.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2 font-sans leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span className="text-[10px] text-zinc-500 font-mono">Progress: {task.progress}%</span>
                  </div>
                  <button 
                    onClick={() => onStartSession(task)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" /> Focus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
