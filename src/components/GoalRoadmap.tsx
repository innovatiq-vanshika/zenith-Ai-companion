import React, { useState } from "react";
import { 
  Compass, 
  Flame, 
  Calendar, 
  Plus, 
  Trophy, 
  ChevronRight, 
  Activity, 
  Lightbulb
} from "lucide-react";
import { Goal, Task, RoadmapPhase } from "../types";

interface GoalRoadmapProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function GoalRoadmap({ goals, setGoals, tasks, setTasks }: GoalRoadmapProps) {
  // Input states
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [category, setCategory] = useState<"Academic" | "Career" | "Health" | "Project" | "Personal">("Career");
  const [deadline, setDeadline] = useState("2026-07-31");

  // Selected goal for showing roadmap
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(goals[0] || null);

  // AI states
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isGeneratingRecovery, setIsGeneratingRecovery] = useState(false);

  // Recovery output state
  const [recoveryPlan, setRecoveryPlan] = useState<{
    motivationQuote: string;
    encouragementMessage: string;
    recoverySteps: string[];
    revisedTimelineSuggestions: Array<{ taskTitle: string; reasoning: string; suggestedDelayDays: number }>;
  } | null>(null);

  // Add goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const newGoal: Goal = {
      id: "goal-" + Date.now(),
      title: goalTitle.trim(),
      description: goalDesc.trim(),
      category,
      deadline,
      progress: 0,
      streakCount: 0,
    };

    setGoals(prev => [newGoal, ...prev]);
    setSelectedGoal(newGoal);
    setGoalTitle("");
    setGoalDesc("");
    setCategory("Career");
  };

  // Run AI Goal to Roadmap Generator (Feature 6)
  const triggerAIRoadmapGeneration = async (goal: Goal) => {
    setIsGeneratingRoadmap(true);
    try {
      const response = await fetch("/api/gemini/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalTitle: goal.title, timelineWeeks: 5 })
      });
      const data = await response.json();
      
      if (data && !data.error) {
        setGoals(prev => prev.map(g => {
          if (g.id === goal.id) {
            return {
              ...g,
              roadmapPhases: data.phases
            };
          }
          return g;
        }));

        const updatedGoal = {
          ...goal,
          roadmapPhases: data.phases
        };
        setSelectedGoal(updatedGoal);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Run AI Recovery Planner (Feature 7)
  const triggerAIRecovery = async () => {
    setIsGeneratingRecovery(true);
    const overdueTasks = tasks.filter(t => {
      const today = new Date().toISOString().split("T")[0];
      return !t.completed && t.dueDate < today;
    });

    try {
      const response = await fetch("/api/gemini/recovery-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          missedTasks: overdueTasks.length > 0 ? overdueTasks : tasks.slice(0, 2),
          activeGoals: goals
        })
      });
      const data = await response.json();
      
      if (data && !data.error) {
        setRecoveryPlan(data);

        // Apply revised timelines to tasks list
        if (data.revisedTimelineSuggestions && data.revisedTimelineSuggestions.length > 0) {
          setTasks(prev => prev.map(t => {
            const suggestion = data.revisedTimelineSuggestions.find((s: any) => s.taskTitle.toLowerCase() === t.title.toLowerCase() || t.title.toLowerCase().includes(s.taskTitle.toLowerCase()));
            if (suggestion) {
              const currentDueDate = new Date(t.dueDate);
              currentDueDate.setDate(currentDueDate.getDate() + suggestion.suggestedDelayDays);
              return {
                ...t,
                dueDate: currentDueDate.toISOString().split("T")[0],
                riskScore: Math.max(0, (t.riskScore || 30) - 40) // reduce risk score
              };
            }
            return t;
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRecovery(false);
    }
  };

  return (
    <div id="roadmaps-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Create Goal & Goals List */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* Create Goal Card */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-800 font-sans">Set Ambitious Goal</h2>
          </div>

          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Goal Headline</label>
              <input 
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g., Secure Placement at TCS NQT"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Goal Purpose</label>
              <textarea 
                value={goalDesc}
                onChange={(e) => setGoalDesc(e.target.value)}
                placeholder="Highlight what achieving this goal unlocks for your career, project scale, or personal growth..."
                className="w-full h-16 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                >
                  <option value="Career">Career</option>
                  <option value="Academic">Academic</option>
                  <option value="Project">Project</option>
                  <option value="Health">Health</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Deadline</label>
                <input 
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Initialize Goal
              </button>
            </div>
          </form>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest">Active Roadmap Targets</h3>
          
          <div className="space-y-3">
            {goals.map((g) => {
              const isSelected = selectedGoal?.id === g.id;
              return (
                <div 
                  key={g.id}
                  onClick={() => setSelectedGoal(g)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? "bg-indigo-50/40 border-indigo-200 shadow-sm" 
                      : "bg-white border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {g.category}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-800 mt-2 font-sans">{g.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{g.description}</p>
                    </div>

                    {g.streakCount > 0 && (
                      <div className="flex items-center gap-1 font-mono text-xs text-orange-600 shrink-0 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                        <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                        <span>{g.streakCount}d</span>
                      </div>
                    )}
                  </div>

                  {/* Progress info */}
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Due: {g.deadline}
                    </span>
                    <span className="text-indigo-600 font-bold">Progress: {g.progress}%</span>
                  </div>

                  {/* mini bar */}
                  <div className="mt-2 h-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Roadmap Timeline Scroll & Recovery Planner */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Horizontal Scroll Timeline Roadmap */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600 animate-spin-slow" />
              <h3 className="text-sm font-bold text-zinc-800 font-sans">Strategic Milestone Roadmap</h3>
            </div>
            {selectedGoal && (
              <button
                onClick={() => triggerAIRoadmapGeneration(selectedGoal)}
                disabled={isGeneratingRoadmap}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100/85 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {isGeneratingRoadmap ? "Formulating Roadmap..." : "AI Generate Timeline"}
              </button>
            )}
          </div>

          {selectedGoal ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 font-mono block">CURRENT WORKSPACE TARGET</span>
                <span className="text-xs font-bold text-zinc-800 block mt-0.5">{selectedGoal.title}</span>
              </div>

              {selectedGoal.roadmapPhases && selectedGoal.roadmapPhases.length > 0 ? (
                /* Horizontal Scrollable Timeline Wrapper */
                <div className="flex gap-5 overflow-x-auto pb-4 pt-2 px-1 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                  {selectedGoal.roadmapPhases.map((phase: RoadmapPhase, idx: number) => (
                    <div 
                      key={idx} 
                      className="min-w-[280px] max-w-[280px] p-4.5 rounded-2xl bg-white border border-zinc-200 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between shrink-0 shadow-sm relative"
                    >
                      {/* Connector Line visual overlay */}
                      {idx < (selectedGoal.roadmapPhases?.length || 0) - 1 && (
                        <div className="hidden md:block absolute -right-3 top-1/2 w-3.5 border-t border-dashed border-zinc-200" />
                      )}

                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-indigo-600 uppercase tracking-widest font-bold">Phase {phase.phaseNumber}</span>
                          <span className="text-[10px] font-mono text-zinc-400">{phase.duration}</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-800 font-sans">{phase.title}</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{phase.focus}</p>
                        
                        {/* Phase Milestones */}
                        <div className="space-y-1 pt-1.5 border-t border-zinc-100">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block">Milestones</span>
                          {phase.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="flex items-start gap-1.5 text-[10px] text-zinc-600 font-sans">
                              <span className="text-indigo-500 mt-0.5">•</span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>

                        {/* Phase Recommended Actionable Tasks */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block">Recommended Actions</span>
                          {phase.recommendedTasks.map((t, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-sans font-semibold">
                              <ChevronRight className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="truncate">{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
                  No chronological roadmap formulated. Click 'AI Generate Timeline' to ask Gemini to structure horizontal sprints and milestones for {selectedGoal.title}.
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
              Select an active goal target to load or synthesize roadmap phases.
            </div>
          )}
        </div>

        {/* Feature 7: Recovery Planner */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <h3 className="text-sm font-bold text-zinc-800 font-sans">Strategic Recovery Planner</h3>
            </div>
            <button
              onClick={triggerAIRecovery}
              disabled={isGeneratingRecovery}
              className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isGeneratingRecovery ? "Synthesizing Strategy..." : "Activate Recovery"}
            </button>
          </div>

          {recoveryPlan ? (
            <div className="space-y-4 border-l-2 border-amber-300 pl-4.5 py-1 animate-in fade-in duration-200">
              {/* Motivation Quote */}
              <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-amber-700 block tracking-widest font-bold">★ COACHING FOCUS</span>
                <p className="text-xs font-bold text-amber-900 italic mt-1 leading-normal">"{recoveryPlan.motivationQuote}"</p>
                <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed">{recoveryPlan.encouragementMessage}</p>
              </div>

              {/* Actionable recovery steps */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Immediate Bouncing-Back Steps</span>
                <div className="space-y-1.5">
                  {recoveryPlan.recoverySteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 font-sans">
                      <span className="w-4.5 h-4.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                      <span className="mt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revised suggestions */}
              {recoveryPlan.revisedTimelineSuggestions && recoveryPlan.revisedTimelineSuggestions.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-zinc-100">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Revised Rescheduling Proposals</span>
                  <div className="space-y-2.5">
                    {recoveryPlan.revisedTimelineSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white border border-zinc-200 text-xs">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-zinc-800">{suggestion.taskTitle}</span>
                          <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                            +{suggestion.suggestedDelayDays} Days Delay suggested
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1.5">{suggestion.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
              <p>No active Recovery Plan activated yet. In case of missed deadlines or exam pressure overwhelm, click 'Activate Recovery' to recalculate timelines guilt-free and realign scheduling paths instantly.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
