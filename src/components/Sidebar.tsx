import React, { useState } from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Compass, 
  Calendar, 
  MessageSquare, 
  Timer, 
  Mail, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  BrainCircuit,
  Cpu,
  PlayCircle
} from "lucide-react";
import { PersonaType } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  aiPersona: PersonaType;
}

export default function Sidebar({ activeTab, setActiveTab, aiPersona }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Task Engine", icon: CheckSquare },
    { id: "roadmaps", label: "Roadmaps & Goals", icon: Compass },
    { id: "schedule", label: "Schedule Builder", icon: Calendar },
    { id: "coach", label: "Decision Coach", icon: MessageSquare },
    { id: "focus", label: "Focus Mode", icon: Timer },
    { id: "comms", label: "Comms Assistant", icon: Mail },
    { id: "analytics", label: "Analytics & Streaks", icon: BarChart3 },
    { id: "demo", label: "Video Demo & Tour", icon: PlayCircle },
  ];

  const getPersonaColor = (persona: PersonaType) => {
    switch (persona) {
      case "Friendly Coach": return "from-emerald-500 to-teal-400";
      case "Strict Mentor": return "from-rose-500 to-orange-400";
      case "Study Buddy": return "from-pink-500 to-purple-400";
      case "Professional Advisor": return "from-indigo-500 to-cyan-400";
    }
  };

  return (
    <aside 
      id="app-sidebar"
      className={`relative h-screen bg-white border-r border-zinc-200/80 flex flex-col transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* App Logo / Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-sm">
              <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-zinc-900 text-lg tracking-tight block leading-none">Zenith</span>
              <span className="text-[10px] font-mono text-indigo-600 font-semibold tracking-widest uppercase">AI Companion</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-sm">
              <BrainCircuit className="w-5.5 h-5.5 text-white" />
            </div>
          </div>
        )}

        <button 
          id="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white border border-zinc-200 hover:border-indigo-500 text-zinc-400 hover:text-zinc-800 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* AI Persona Banner */}
      {!isCollapsed ? (
        <div className="mx-4 mt-5 p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPersonaColor(aiPersona)} shadow-[0_0_6px_rgba(79,70,229,0.3)]`} />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Active Assistant</span>
            <span className="text-xs text-zinc-700 font-semibold truncate block">{aiPersona}</span>
          </div>
          <Cpu className="w-4 h-4 text-indigo-500" />
        </div>
      ) : (
        <div className="my-5 flex justify-center">
          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${getPersonaColor(aiPersona)} shadow-sm`} title={`Persona: ${aiPersona}`} />
        </div>
      )}

      {/* Nav Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all group relative ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 border border-transparent"
              }`}
            >
              {/* Active neon strip indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-md" />
              )}
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-indigo-500"}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-16 bg-white text-zinc-800 text-xs py-1.5 px-3 rounded-lg border border-zinc-200 font-sans font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Account Info */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-sans font-semibold shadow-sm">
              V
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-zinc-800 truncate block">Vanshika</span>
              <span className="text-[10px] text-zinc-500 truncate block">vanshikaspanjwani@...</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm cursor-pointer">
              V
            </div>
            {/* Popover/Tooltip for collapsed profile */}
            <div className="absolute bottom-12 left-12 bg-white text-zinc-800 text-xs p-3 rounded-xl border border-zinc-200 font-sans opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
              <span className="font-bold block text-zinc-800">Vanshika</span>
              <span className="text-zinc-500 block">vanshikaspanjwani@gmail.com</span>
              <span className="text-[10px] text-emerald-600 font-mono mt-1 block">● System Active</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
