import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import TaskBreakdown from "./components/TaskBreakdown";
import GoalRoadmap from "./components/GoalRoadmap";
import ScheduleTimeline from "./components/ScheduleTimeline";
import DecisionCoach from "./components/DecisionCoach";
import FocusWorkspace from "./components/FocusWorkspace";
import CommsAssistant from "./components/CommsAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import SettingsPanel from "./components/SettingsPanel";
import DemoVideoWalkthrough from "./components/DemoVideoWalkthrough";

import { 
  Task, 
  Goal, 
  ScheduleBlock, 
  AppNotification, 
  Achievement, 
  ChatMessage, 
  PersonaType 
} from "./types";

import { 
  INITIAL_TASKS, 
  INITIAL_GOALS, 
  INITIAL_SCHEDULE, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ACHIEVEMENTS, 
  CHAT_STARTER_HISTORY 
} from "./mockData";

export default function App() {
  // Global States (synchronized to localStorage)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("zenith_tasks") || localStorage.getItem("focusflow_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("zenith_goals") || localStorage.getItem("focusflow_goals");
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [schedule, setSchedule] = useState<ScheduleBlock[]>(() => {
    const saved = localStorage.getItem("zenith_schedule") || localStorage.getItem("focusflow_schedule");
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("zenith_notifications") || localStorage.getItem("focusflow_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("zenith_achievements") || localStorage.getItem("focusflow_achievements");
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("zenith_chat_history") || localStorage.getItem("focusflow_chat_history");
    return saved ? JSON.parse(saved) : CHAT_STARTER_HISTORY;
  });

  const [aiPersona, setAiPersona] = useState<PersonaType>(() => {
    const saved = localStorage.getItem("zenith_persona") || localStorage.getItem("focusflow_persona");
    return saved ? (saved as PersonaType) : "Friendly Coach";
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Feature 17: Active stopwatch timer states
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeSessionStart, setActiveSessionStart] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Synchronize state values to localStorage
  useEffect(() => {
    localStorage.setItem("zenith_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("zenith_goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("zenith_schedule", JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem("zenith_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("zenith_achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("zenith_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("zenith_persona", aiPersona);
  }, [aiPersona]);

  // Stopwatch ticking logic effect
  useEffect(() => {
    if (activeTask && activeSessionStart) {
      timerRef.current = setInterval(() => {
        const deltaSeconds = Math.floor((Date.now() - activeSessionStart) / 1000);
        setElapsedTime(deltaSeconds);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeTask, activeSessionStart]);

  // Start stopwatch focus tracking session (Feature 17)
  const handleStartSession = (task: Task) => {
    setActiveTask(task);
    setActiveSessionStart(Date.now());
    setElapsedTime(0);
    setActiveTab("focus"); // route to the beautiful Pomodoro / Focus Mode immediately!

    // Add smart notification alert
    const newAlert: AppNotification = {
      id: "alert-" + Date.now(),
      title: "Focus Block Started",
      message: `Deep-work session launched for '${task.title}'. Distractions filtered.`,
      type: "info",
      timestamp: "Just now",
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Stop focus tracking session and log actual minutes spent (Feature 17)
  const handleStopSession = () => {
    if (!activeTask || !activeSessionStart) return;

    const totalSecondsSpent = elapsedTime;
    const minutesSpent = Math.max(1, Math.round(totalSecondsSpent / 60));

    // Update tasks state
    setTasks(prev => prev.map(t => {
      if (t.id === activeTask.id) {
        const updatedLogged = t.actualMinutesLogged + minutesSpent;
        const nextProgress = Math.min(100, Math.round((updatedLogged / t.estimatedMinutes) * 100));
        return {
          ...t,
          actualMinutesLogged: updatedLogged,
          progress: nextProgress,
          completed: nextProgress >= 100 ? true : t.completed
        };
      }
      return t;
    }));

    // Reset stopwatch states
    setActiveTask(null);
    setActiveSessionStart(null);
    setElapsedTime(0);

    // Increment achievements progress
    setAchievements(prev => prev.map(ach => {
      if (ach.id === "ach-1") {
        const nextProgress = Math.min(100, ach.progress + 25);
        return {
          ...ach,
          progress: nextProgress,
          unlockedAt: nextProgress >= 100 ? new Date().toISOString().split("T")[0] : ach.unlockedAt
        };
      }
      return ach;
    }));

    // Push smart notification alert for logging
    const newAlert: AppNotification = {
      id: "alert-" + Date.now(),
      title: "Focus Session Logged",
      message: `Logged ${minutesSpent}m of actual concentration time to '${activeTask.title}'. Analytics synchronized.`,
      type: "success",
      timestamp: "Just now",
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Convert stopwatch seconds to format: MM:SS
  const formatStopwatchTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const elapsedTimeString = formatStopwatchTime(elapsedTime);

  // Render proper Tab Page Views
  const renderTabPage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            tasks={tasks} 
            goals={goals} 
            aiPersona={aiPersona} 
            setActiveTab={setActiveTab}
            onStartSession={handleStartSession}
          />
        );
      case "tasks":
        return (
          <TaskBreakdown 
            tasks={tasks} 
            setTasks={setTasks} 
            activeTask={activeTask}
            setActiveTask={setActiveTask}
            onStartSession={handleStartSession}
            onStopSession={handleStopSession}
            elapsedTimeString={elapsedTimeString}
          />
        );
      case "roadmaps":
        return (
          <GoalRoadmap 
            goals={goals} 
            setGoals={setGoals} 
            tasks={tasks}
            setTasks={setTasks}
          />
        );
      case "schedule":
        return (
          <ScheduleTimeline 
            schedule={schedule} 
            setSchedule={setSchedule} 
          />
        );
      case "coach":
        return (
          <DecisionCoach 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
            aiPersona={aiPersona} 
          />
        );
      case "focus":
        return (
          <FocusWorkspace 
            tasks={tasks} 
            setTasks={setTasks} 
            activeTask={activeTask}
            onStopSession={handleStopSession}
            elapsedTimeString={elapsedTimeString}
          />
        );
      case "comms":
        return <CommsAssistant />;
      case "analytics":
        return (
          <AnalyticsDashboard 
            tasks={tasks} 
            goals={goals} 
            achievements={achievements}
            setAchievements={setAchievements}
          />
        );
      case "demo":
        return (
          <DemoVideoWalkthrough 
            setActiveTab={setActiveTab} 
            aiPersona={aiPersona} 
          />
        );
      default:
        return <SettingsPanel aiPersona={aiPersona} setAiPersona={setAiPersona} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-50 overflow-hidden font-sans antialiased text-zinc-800">
      
      {/* Sidebar navigation panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        aiPersona={aiPersona} 
      />

      {/* Main container with Topbar and scrollable content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Topbar 
          notifications={notifications} 
          setNotifications={setNotifications} 
          aiPersona={aiPersona}
          setAiPersona={setAiPersona}
          activeTask={activeTask}
          onStopSession={handleStopSession}
          elapsedTimeString={elapsedTimeString}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8 max-w-7xl w-full mx-auto pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              {renderTabPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
