import React, { useState } from "react";
import { Bell, Sparkles, User, Check, AlertTriangle, Pause } from "lucide-react";
import { AppNotification, PersonaType, Task } from "../types";

interface TopbarProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  aiPersona: PersonaType;
  setAiPersona: (persona: PersonaType) => void;
  activeTask: Task | null;
  onStopSession: () => void;
  elapsedTimeString: string;
}

export default function Topbar({ 
  notifications, 
  setNotifications, 
  aiPersona, 
  setAiPersona,
  activeTask,
  onStopSession,
  elapsedTimeString
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPersonaQuote = (persona: PersonaType) => {
    switch (persona) {
      case "Friendly Coach":
        return "✨ Small progress is still progress. You've got this, Vanshika!";
      case "Strict Mentor":
        return "🎯 Extreme focus yields extreme results. Check your deadlines.";
      case "Study Buddy":
        return "🚀 Time to crush this study session. Let's get these wins!";
      case "Professional Advisor":
        return "📈 Strategize first, execute with high precision. Reduce risk.";
    }
  };

  return (
    <header 
      id="app-topbar"
      className="h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10 w-full"
    >
      {/* Dynamic Persona Greeting / Advice Quote */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
        <span className="text-xs md:text-sm font-sans text-zinc-500 font-semibold italic transition-all">
          "{getPersonaQuote(aiPersona)}"
        </span>
      </div>

      {/* Action Tray */}
      <div className="flex items-center gap-4">
        
        {/* stopwatch Quick Status Widget */}
        {activeTask && (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono text-rose-700 font-bold">
              LIVE TRACKING: {elapsedTimeString}
            </span>
            <span className="text-[10px] text-rose-500 font-medium max-w-[120px] truncate">
              ({activeTask.title})
            </span>
            <button
              onClick={onStopSession}
              className="p-0.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer"
              title="Stop tracking"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        )}

        {/* AI Personality Quick Switcher */}
        <div className="relative">
          <button
            id="persona-switcher-btn"
            onClick={() => {
              setShowPersonaMenu(!showPersonaMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 hover:border-indigo-500/40 text-xs text-zinc-700 transition-all cursor-pointer font-sans shadow-sm"
          >
            <span className="text-indigo-600 font-semibold font-mono">PERSONA:</span>
            <span>{aiPersona}</span>
          </button>

          {showPersonaMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-zinc-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-100 mb-1">
                Select Brain Persona
              </div>
              {(["Friendly Coach", "Strict Mentor", "Study Buddy", "Professional Advisor"] as PersonaType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setAiPersona(p);
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-colors ${
                    aiPersona === p 
                      ? "bg-indigo-50/70 text-indigo-700 border-l-2 border-indigo-600 font-semibold" 
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <span>{p}</span>
                  {aiPersona === p && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Smart Notifications Dropdown */}
        <div className="relative">
          <button
            id="notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowPersonaMenu(false);
            }}
            className="relative p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-indigo-500/40 text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer shadow-sm"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <span className="text-sm font-bold text-zinc-800">Smart Alerts</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] text-indigo-600 hover:text-indigo-500 font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <span className="text-xs text-zinc-400 font-sans block">All clear! No recent alerts.</span>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3.5 hover:bg-zinc-50/50 transition-colors relative ${!notif.read ? "bg-indigo-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-2.5">
                        {notif.type === "risk" && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                        {notif.type === "success" && <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                        {notif.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        {notif.type === "info" && <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className={`text-xs font-semibold ${!notif.read ? "text-zinc-800" : "text-zinc-600"}`}>{notif.title}</span>
                            <span className="text-[9px] font-mono text-zinc-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{notif.message}</p>
                        </div>

                        <button 
                          onClick={() => clearNotification(notif.id)}
                          className="text-zinc-400 hover:text-zinc-800 text-xs px-1 cursor-pointer"
                          title="Dismiss"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Workspace Indicator */}
        <div className="flex items-center gap-2.5 border-l border-zinc-200/80 pl-4">
          <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200 text-indigo-600 shadow-sm" title="Workspace Profile">
            <User className="w-4.5 h-4.5" />
          </div>
        </div>

      </div>
    </header>
  );
}
