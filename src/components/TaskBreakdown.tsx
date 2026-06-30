import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Check, 
  Trash2, 
  AlertTriangle, 
  BrainCircuit, 
  ListTodo, 
  Clock, 
  GitFork,
  Activity
} from "lucide-react";
import { Task } from "../types";

interface TaskBreakdownProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  onStartSession: (task: Task) => void;
  onStopSession: () => void;
  elapsedTimeString: string;
}

export default function TaskBreakdown({
  tasks,
  setTasks,
  activeTask,
  setActiveTask,
  onStartSession,
  onStopSession,
  elapsedTimeString
}: TaskBreakdownProps) {
  // Input fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [priority, setPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);

  // Selected task in UI for showing breakdown tree
  const [selectedTaskForBreakdown, setSelectedTaskForBreakdown] = useState<Task | null>(tasks[0] || null);
  
  // AI States
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  
  // Prioritization results
  const [prioritizationResult, setPrioritizationResult] = useState<{
    rankedTaskIds: string[];
    reasonings: Array<{ taskId: string; priorityLevel: string; reason: string }>;
    recommendedAction: { taskId: string; title: string; reason: string; benefit: string };
  } | null>(null);

  // Risk results
  const [riskResult, setRiskResult] = useState<{
    riskScore: number;
    completionProbability: number;
    riskLevel: string;
    riskFactors: string[];
    mitigations: string[];
  } | null>({
    riskScore: 35,
    completionProbability: 78,
    riskLevel: "MODERATE",
    riskFactors: ["Figma Mockups are past due date!", "Preparation workload concentrated in single daily blocks"],
    mitigations: ["Deploy a 90-minute design focus sprints immediately.", "De-prioritize low impact project tasks."]
  });

  // Task creation
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: "task-" + Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      estimatedMinutes,
      actualMinutesLogged: 0,
      completed: false,
      progress: 0,
      subtasks: [],
      milestones: []
    };

    setTasks(prev => [newTask, ...prev]);
    setSelectedTaskForBreakdown(newTask);
    setTitle("");
    setDescription("");
    setEstimatedMinutes(60);
    setPriority("MEDIUM");
  };

  // Toggle subtask completion
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        const completedSubCount = updatedSubtasks.filter(s => s.completed).length;
        const progress = Math.round((completedSubCount / updatedSubtasks.length) * 100);
        return {
          ...t,
          subtasks: updatedSubtasks,
          progress: updatedSubtasks.length > 0 ? progress : t.progress
        };
      }
      return t;
    }));
  };

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          progress: nextCompleted ? 100 : 0
        };
      }
      return t;
    }));
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskForBreakdown?.id === id) {
      setSelectedTaskForBreakdown(null);
    }
  };

  // Run Gemini Task Breakdown (Feature 1)
  const triggerAITaskBreakdown = async (task: Task) => {
    setIsBreakingDown(true);
    try {
      const response = await fetch("/api/gemini/task-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.description })
      });
      const data = await response.json();
      
      if (data && !data.error) {
        setTasks(prev => prev.map(t => {
          if (t.id === task.id) {
            return {
              ...t,
              estimatedMinutes: data.subtasks?.reduce((acc: number, val: any) => acc + (val.estimatedMinutes || 0), 0) || t.estimatedMinutes,
              subtasks: data.subtasks?.map((sub: any, idx: number) => ({
                id: `sub-${t.id}-${idx}`,
                title: sub.title,
                completed: false,
                estimatedMinutes: sub.estimatedMinutes
              })) || [],
              milestones: data.milestones || [],
              treeNodes: data.treeNodes || []
            };
          }
          return t;
        }));
        
        // Refresh local selected task copy
        const updatedTask = {
          ...task,
          subtasks: data.subtasks?.map((sub: any, idx: number) => ({
            id: `sub-${task.id}-${idx}`,
            title: sub.title,
            completed: false,
            estimatedMinutes: sub.estimatedMinutes
          })) || [],
          milestones: data.milestones || [],
          treeNodes: data.treeNodes || []
        };
        setSelectedTaskForBreakdown(updatedTask);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBreakingDown(false);
    }
  };

  // Run Gemini Smart Prioritization (Feature 2)
  const triggerAIPrioritization = async () => {
    setIsPrioritizing(true);
    try {
      const response = await fetch("/api/gemini/prioritization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });
      const data = await response.json();
      
      if (data && !data.error) {
        setPrioritizationResult(data);
        
        // Optionally re-arrange local tasks list visually to prioritize
        const orderMap = new Map(data.rankedTaskIds.map((id: string, idx: number) => [id, idx]));
        setTasks(prev => [...prev].sort((a, b) => {
          const idxA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 999;
          const idxB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 999;
          return idxA - idxB;
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPrioritizing(false);
    }
  };

  // Run Gemini Deadline Risk Analysis (Feature 3)
  const triggerAIRiskAnalysis = async () => {
    setIsAnalyzingRisk(true);
    try {
      const response = await fetch("/api/gemini/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });
      const data = await response.json();
      if (data && !data.error) {
        setRiskResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  // Synchronize initial selected item
  useEffect(() => {
    if (!selectedTaskForBreakdown && tasks.length > 0) {
      setSelectedTaskForBreakdown(tasks[0]);
    }
  }, [tasks, selectedTaskForBreakdown]);

  return (
    <div id="tasks-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Add Task & Active Task List */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Task Creation Glass Card */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/70 shadow-sm shadow-zinc-100/50">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold font-sans text-zinc-800">Create Strategic Task</h2>
          </div>
          
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Practicing quantitative aptitude papers"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Strategic Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe goal alignment, desired milestone outcomes, or research deliverables..."
                  className="w-full h-16 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Est. Duration (Minutes)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Math.max(5, parseInt(e.target.value) || 0))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    required
                  />
                  <Clock className="absolute right-3.5 top-3 w-4 h-4 text-zinc-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Due Date</label>
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-xs font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                Add Strategic Task
              </button>
            </div>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-sans text-zinc-700 uppercase tracking-widest font-mono">Active Focus Backlog</h3>
            <span className="text-xs text-zinc-400 font-mono">Total backlog: {tasks.length} items</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isSelected = selectedTaskForBreakdown?.id === task.id;
              const isTrackingThis = activeTask?.id === task.id;
              const todayStr = new Date().toISOString().split("T")[0];
              const isOverdue = !task.completed && task.dueDate < todayStr;

              return (
                <div 
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    isSelected 
                      ? "bg-indigo-50/40 border-indigo-200 shadow-sm shadow-indigo-50/10" 
                      : "bg-white border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Checkbox to mark complete */}
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                        task.completed 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : isOverdue 
                            ? "border-rose-500 hover:border-rose-600 bg-rose-50" 
                            : "border-zinc-300 hover:border-indigo-500 bg-zinc-50"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedTaskForBreakdown(task)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold ${task.completed ? "text-zinc-400 line-through" : "text-zinc-800"}`}>
                          {task.title}
                        </span>
                        
                        {isOverdue && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-bold font-mono">
                            OVERDUE
                          </span>
                        )}
                        
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${
                          task.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border border-rose-200" :
                          task.priority === "HIGH" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                          task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{task.description}</p>
                      
                      {/* Subtask progress mini bar */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-3.5 flex items-center gap-3">
                          <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${task.progress}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400 shrink-0">
                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks ({task.progress}%)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons (Timer / Breakdown Delete) */}
                    <div className="flex items-center gap-2.5 shrink-0 pl-2">
                      
                      {/* Active Time Tracker stopwatch */}
                      {!task.completed && (
                        <button
                          onClick={() => isTrackingThis ? onStopSession() : onStartSession(task)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isTrackingThis 
                              ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100" 
                              : "bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-indigo-500/30 text-zinc-500 hover:text-indigo-600"
                          }`}
                          title={isTrackingThis ? "Stop Focus stopwatch" : "Start Focus stopwatch"}
                        >
                          {isTrackingThis ? (
                            <div className="flex items-center gap-1">
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span className="text-[10px] font-mono font-bold">{elapsedTimeString}</span>
                            </div>
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-xl bg-zinc-50 hover:bg-rose-50 border border-zinc-200 hover:border-rose-300 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>

                  {/* Display logged actual minutes vs estimated minutes */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-2 text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-300" />
                      Est: {task.estimatedMinutes}m | Logged: <strong className="text-indigo-600">{task.actualMinutesLogged}m</strong>
                    </span>
                    <button 
                      onClick={() => triggerAITaskBreakdown(task)}
                      className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      <BrainCircuit className="w-3 h-3 text-indigo-600" /> AI Breakdown Tree
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: AI Panels */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* Prioritization Panel */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4.5 h-4.5 text-indigo-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Smart Prioritization Model</span>
            </div>
            <button
              onClick={triggerAIPrioritization}
              disabled={isPrioritizing || tasks.length === 0}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isPrioritizing ? "Reranking..." : "AI Rerank"}
            </button>
          </div>

          {prioritizationResult ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Recommended Action Display */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/20 to-white border border-indigo-100 shadow-sm">
                <span className="text-[9px] font-mono text-indigo-700 uppercase tracking-widest font-bold block">★ RECOMMENDED ACTION</span>
                <span className="text-xs font-bold text-zinc-800 block mt-1">{prioritizationResult.recommendedAction.title}</span>
                <p className="text-[11px] text-zinc-600 mt-1 leading-normal">{prioritizationResult.recommendedAction.reason}</p>
                <span className="text-[10px] text-indigo-600 font-semibold mt-1.5 block">Benefit: {prioritizationResult.recommendedAction.benefit}</span>
              </div>

              {/* Rerank reasons */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block tracking-wider">Prioritization Reasoning</span>
                {prioritizationResult.reasonings.map((r, idx) => {
                  const correlatedTask = tasks.find(t => t.id === r.taskId);
                  if (!correlatedTask) return null;
                  return (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-50/60 border border-zinc-200/50 flex items-start gap-2.5 text-[11px]">
                      <span className="font-mono text-indigo-600 font-bold mt-0.5">{idx + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-zinc-800 block truncate">{correlatedTask.title}</span>
                        <span className="text-[10px] text-zinc-500 leading-normal block mt-0.5">{r.reason}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed border-zinc-200 rounded-xl text-zinc-400">
              <p className="text-xs font-medium">No prioritization calculations run yet. Click 'AI Rerank' to analyze scheduling sequence and optimize workload density.</p>
            </div>
          )}
        </div>

        {/* AI Task Execution Tree */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitFork className="w-4.5 h-4.5 text-indigo-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Task Execution Tree</span>
            </div>
            {selectedTaskForBreakdown && (
              <button
                onClick={() => triggerAITaskBreakdown(selectedTaskForBreakdown)}
                disabled={isBreakingDown}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isBreakingDown ? "Generating..." : "Generate Tree"}
              </button>
            )}
          </div>

          {selectedTaskForBreakdown ? (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 font-mono">ACTIVE TARGET</span>
                <span className="text-xs font-bold text-zinc-800 block mt-0.5">{selectedTaskForBreakdown.title}</span>
              </div>

              {/* Subtask interactive checklist */}
              {selectedTaskForBreakdown.subtasks && selectedTaskForBreakdown.subtasks.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Interactive Steps</span>
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {selectedTaskForBreakdown.subtasks.map((sub) => (
                      <label 
                        key={sub.id} 
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200/80 cursor-pointer transition-all text-xs"
                      >
                        <input 
                          type="checkbox" 
                          checked={sub.completed}
                          onChange={() => handleToggleSubtask(selectedTaskForBreakdown.id, sub.id)}
                          className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-zinc-700 ${sub.completed ? "line-through text-zinc-400" : ""}`}>{sub.title}</span>
                        {sub.estimatedMinutes && (
                          <span className="ml-auto text-[10px] font-mono text-zinc-400 shrink-0">{sub.estimatedMinutes}m</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Graphical tree visualizer */}
              {selectedTaskForBreakdown.treeNodes && selectedTaskForBreakdown.treeNodes.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Visual Breakdown Tree</span>
                  <div className="bg-zinc-50 border border-zinc-200/60 p-3.5 rounded-xl relative space-y-3 font-sans text-xs">
                    
                    {/* Render tree node rows with nested lines */}
                    {selectedTaskForBreakdown.treeNodes.map((node) => {
                      const isChild = node.parentId !== "";
                      return (
                        <div key={node.id} className="flex items-center gap-2">
                          {isChild && (
                            <div className="flex items-center shrink-0">
                              <div className="w-4 h-5 border-l border-b border-zinc-200 -mt-2.5 mr-1" />
                            </div>
                          )}
                          <div className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                            node.type === "root" ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-sm" :
                            node.type === "phase" ? "bg-purple-50 border-purple-200 text-purple-700 font-semibold" :
                            "bg-white border-zinc-200 text-zinc-700 shadow-sm"
                          }`}>
                            <span className="text-[10px] font-mono font-bold capitalize text-zinc-400">[{node.type}]</span>
                            <span>{node.label}</span>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
                  No execution tree computed. Click "Generate Tree" to leverage Gemini to outline phase hierarchies, deliverables, and dependency diagrams.
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 border border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-xs font-medium">
              Select or create a task to run AI breakdown algorithms.
            </div>
          )}
        </div>

        {/* Deadline Risk Evaluator heatmaps */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-rose-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500">Deadline Risk Engine</span>
            </div>
            <button
              onClick={triggerAIRiskAnalysis}
              disabled={isAnalyzingRisk}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isAnalyzingRisk ? "Evaluating..." : "Check Risks"}
            </button>
          </div>

          {riskResult ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Risk Score & Probability Dial */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                  <span className="text-[10px] text-zinc-400 font-mono block">RISK SCORE</span>
                  <span className={`text-2xl font-bold font-mono ${riskResult.riskScore > 60 ? "text-rose-500" : "text-emerald-500"}`}>
                    {riskResult.riskScore}/100
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Rating: {riskResult.riskLevel}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                  <span className="text-[10px] text-zinc-400 font-mono block">COMPLETION RATE</span>
                  <span className="text-2xl font-bold font-mono text-indigo-600">
                    {riskResult.completionProbability}%
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Confidence probability</span>
                </div>
              </div>

              {/* Heatmap Visual representation */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block tracking-wider">Dynamic Risk Heatmap</span>
                <div className="h-6.5 w-full rounded-lg bg-zinc-100 border border-zinc-200/60 p-1 flex gap-1.5">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const threshold = idx * 10;
                    const isActive = riskResult.riskScore >= threshold;
                    return (
                      <div 
                        key={idx} 
                        className={`flex-1 rounded-sm transition-all duration-300 ${
                          isActive 
                            ? riskResult.riskScore > 60 
                              ? "bg-rose-500 shadow-sm" 
                              : "bg-indigo-500" 
                            : "bg-white"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Risk Factors list */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400 block">Critical Risk Factors</span>
                {riskResult.riskFactors.map((rf, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[10px] text-zinc-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{rf}</span>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="text-center p-6 border border-dashed border-zinc-200 rounded-xl text-zinc-400">
              <p className="text-xs font-medium">Risk predictions are clear. Run evaluation checks to stress test scheduling deadlines against actual focus speeds.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
