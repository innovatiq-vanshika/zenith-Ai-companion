import React from "react";
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Clock, 
  Award,
  Lock,
  Unlock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Achievement, Task, Goal } from "../types";
import { CONTRIBUTION_GRID_DATA } from "../mockData";

interface AnalyticsDashboardProps {
  tasks: Task[];
  goals: Goal[];
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
}

export default function AnalyticsDashboard({ tasks, goals, achievements, setAchievements }: AnalyticsDashboardProps) {
  // Weekly performance graph mock data
  const chartData = [
    { day: "Mon", focusMinutes: 45, completionRate: 35, riskFactor: 30 },
    { day: "Tue", focusMinutes: 90, completionRate: 50, riskFactor: 25 },
    { day: "Wed", focusMinutes: 120, completionRate: 65, riskFactor: 20 },
    { day: "Thu", focusMinutes: 60, completionRate: 65, riskFactor: 40 },
    { day: "Fri", focusMinutes: 180, completionRate: 75, riskFactor: 15 },
    { day: "Sat", focusMinutes: 150, completionRate: 85, riskFactor: 10 },
    { day: "Sun", focusMinutes: 90, completionRate: 90, riskFactor: 8 }
  ];

  // Helper to color contribution grid boxes
  const getContributionColor = (level: number) => {
    switch (level) {
      case 4: return "bg-indigo-600 shadow-sm"; // deep focus
      case 3: return "bg-indigo-400";
      case 2: return "bg-indigo-200";
      case 1: return "bg-indigo-50 border border-indigo-200/20";
      default: return "bg-zinc-100 border border-zinc-200/10";
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame": return <Flame className="w-5 h-5 text-orange-500" />;
      case "Trophy": return <Trophy className="w-5 h-5 text-indigo-600" />;
      case "Sparkles": return <Sparkles className="w-5 h-5 text-indigo-500" />;
      default: return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div id="analytics-view" className="space-y-8 animate-in fade-in duration-300">
      
      {/* FEATURE 13: Glowing Recharts Area/Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Focus Time Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
              <h3 className="text-sm font-bold text-zinc-800 font-sans">Weekly Focus Time Logged</h3>
            </div>
            <span className="text-xs font-mono text-indigo-600 font-bold">Total: 735 minutes</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="focusGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="day" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", borderRadius: "12px", color: "#18181b", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                  itemStyle={{ color: "#4f46e5" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="focusMinutes" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#focusGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sprint Completion & Risk Factors Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="text-sm font-bold text-zinc-800 font-sans">Sprint Completion vs Risk Index</h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Dynamic AI simulation</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="day" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", borderRadius: "12px", color: "#18181b", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completionRate" 
                  name="Completion Rate %"
                  stroke="#0284c7" 
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="riskFactor" 
                  name="Risk Index %"
                  stroke="#e11d48" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FEATURE 12: GitHub-Like Streak Contribution Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
            <h3 className="text-sm font-bold text-zinc-800 font-sans">Deep Focus Streaks Matrix</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Completed work blocks logged this year</span>
        </div>

        <p className="text-xs text-zinc-500 leading-normal font-sans">
          This matrix displays your historic consistency tracking deep-work blocks, similar to Git commits but mapped purely to your placement and capstone focus timelines. Keep your streaks glowing!
        </p>

        {/* Matrix contribution container */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
          <div className="flex gap-1 min-w-[620px] h-[80px]">
            {CONTRIBUTION_GRID_DATA.slice(0, 48).map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1 flex-1">
                {col.map((day, dayIdx) => (
                  <div 
                    key={dayIdx} 
                    className={`flex-1 rounded-[2px] transition-all hover:scale-115 cursor-crosshair ${getContributionColor(day.level)}`}
                    title={`Week ${colIdx}, Day ${dayIdx}: Logged ${day.minutesLogged} minutes of pure focus`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
          <span>Less Focus</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-100 border border-zinc-200/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-50 border border-indigo-200/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-200" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600 shadow-sm" />
          <span>More Focus</span>
        </div>
      </div>

      {/* FEATURE 12: Unlockable Achievements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-zinc-800 font-sans">Unlockable Goal Achievements</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {achievements.map((ach) => {
            const isUnlocked = ach.progress >= 100;
            return (
              <div 
                key={ach.id} 
                className={`p-4.5 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all ${
                  isUnlocked 
                    ? "bg-gradient-to-tr from-indigo-50/50 via-zinc-50/10 to-white border-indigo-200/60 shadow-sm" 
                    : "bg-white border-zinc-200/60 opacity-60"
                }`}
              >
                {/* Unlock lock visual badge */}
                <div className="absolute top-4 right-4">
                  {isUnlocked ? (
                    <div className="p-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-600" title="Achievement Unlocked!">
                      <Unlock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="p-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-400" title={`${ach.progress}% completed`}>
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                      {getIcon(ach.icon)}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate font-sans ${isUnlocked ? "text-zinc-800" : "text-zinc-400"}`}>{ach.title}</h4>
                      <span className="text-[9px] font-mono text-indigo-600 block mt-0.5 font-semibold">
                        {isUnlocked ? "UNLOCKED" : "LOCKED"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{ach.description}</p>
                </div>

                {/* mini achievements progress bar */}
                <div className="mt-4 pt-3.5 border-t border-zinc-100">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>Progress</span>
                    <span>{ach.progress}%</span>
                  </div>
                  <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full" style={{ width: `${ach.progress}%` }} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
