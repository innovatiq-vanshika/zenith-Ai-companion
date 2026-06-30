import { Task, Goal, ScheduleBlock, Achievement, AppNotification, ChatMessage } from "./types";

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Prepare for TCS NQT placement exam",
    description: "Review quantitative aptitude, practice advanced coding section, and complete mock technical assessments on corporate interviews.",
    dueDate: new Date().toISOString().split("T")[0], // Today
    priority: "CRITICAL",
    estimatedMinutes: 120,
    actualMinutesLogged: 45,
    completed: false,
    progress: 35,
    subtasks: [
      { id: "sub-1-1", title: "Practice quantitative reasoning questions", completed: true, estimatedMinutes: 40 },
      { id: "sub-1-2", title: "Solve 3 competitive coding questions", completed: false, estimatedMinutes: 50 },
      { id: "sub-1-3", title: "Take mock aptitude test", completed: false, estimatedMinutes: 30 }
    ],
    milestones: ["Quantitative Prep", "Coding Proficiency", "Full Mock Passed"],
    treeNodes: [
      { id: "root-1", label: "TCS NQT Strategy", type: "root", parentId: "" },
      { id: "node-1-1", label: "Quantitative Aptitude", type: "phase", parentId: "root-1" },
      { id: "node-1-2", label: "Coding & Algorithms", type: "phase", parentId: "root-1" },
      { id: "sub-1-1", label: "Practice math series", type: "subtask", parentId: "node-1-1" },
      { id: "sub-1-2", label: "Solve tree problems", type: "subtask", parentId: "node-1-2" }
    ],
    riskScore: 25,
    riskLevel: "MODERATE",
    riskFactors: ["High difficulty in advanced coding", "Short timeline remaining"],
    recommendedReason: "This task has high placement weight and is due today. Finishing it will reduce upcoming stress by 40%."
  },
  {
    id: "task-2",
    title: "Update resume & portfolio projects",
    description: "Polish job experience descriptions, highlight Cloud Run projects, and verify broken links on personal portfolio site.",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    priority: "HIGH",
    estimatedMinutes: 90,
    actualMinutesLogged: 0,
    completed: false,
    progress: 10,
    subtasks: [
      { id: "sub-2-1", title: "Draft impact-focused bullet points", completed: false, estimatedMinutes: 45 },
      { id: "sub-2-2", title: "Add screenshot of current workspace app", completed: false, estimatedMinutes: 45 }
    ],
    milestones: ["Resume Drafted", "Portfolio Linked"],
    treeNodes: [
      { id: "root-2", label: "Brand Polish", type: "root", parentId: "" },
      { id: "node-2-1", label: "Resume Rewrite", type: "phase", parentId: "root-2" },
      { id: "sub-2-1", label: "Add impact figures", type: "subtask", parentId: "node-2-1" }
    ],
    riskScore: 12,
    riskLevel: "LOW",
    riskFactors: ["No active threats, plenty of time"],
    recommendedReason: "Quick win to build momentum after aptitude preparations."
  },
  {
    id: "task-3",
    title: "Submit final capstone design mockups",
    description: "Design the comprehensive user journey maps, high-fidelity landing screens, and developer handoff assets in Figma.",
    dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday (Overdue!)
    priority: "CRITICAL",
    estimatedMinutes: 180,
    actualMinutesLogged: 120,
    completed: false,
    progress: 75,
    subtasks: [
      { id: "sub-3-1", title: "Review typography scales", completed: true, estimatedMinutes: 30 },
      { id: "sub-3-2", title: "Create components library", completed: true, estimatedMinutes: 60 },
      { id: "sub-3-3", title: "Write documentation handoff file", completed: false, estimatedMinutes: 90 }
    ],
    milestones: ["Figma Wireframes", "UX Research approved", "Full Specs Deliverable"],
    treeNodes: [
      { id: "root-3", label: "Design Delivery", type: "root", parentId: "" },
      { id: "node-3-1", label: "Layout Specs", type: "phase", parentId: "root-3" },
      { id: "sub-3-3", label: "Write text specs", type: "subtask", parentId: "node-3-1" }
    ],
    riskScore: 88,
    riskLevel: "CRITICAL",
    riskFactors: ["Past due date!", "Requires deep concentration block to complete final writeup"],
    recommendedReason: "OVERDUE. This requires urgent recovery planning to align with professor deadlines."
  },
  {
    id: "task-4",
    title: "Setup database server for Zenith app",
    description: "Initialize server logic, test core API routes locally, and configure database connection pooling.",
    dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0], // 2 Days from now
    priority: "MEDIUM",
    estimatedMinutes: 60,
    actualMinutesLogged: 60,
    completed: true,
    progress: 100,
    subtasks: [
      { id: "sub-4-1", title: "Test API latency", completed: true, estimatedMinutes: 30 },
      { id: "sub-4-2", title: "Write pool client code", completed: true, estimatedMinutes: 30 }
    ],
    milestones: ["Server Initialized", "Database Connected"],
    treeNodes: [
      { id: "root-4", label: "Server Arch", type: "root", parentId: "" },
      { id: "node-4-1", label: "Connection Pooling", type: "phase", parentId: "root-4" }
    ],
    riskScore: 0,
    riskLevel: "LOW",
    riskFactors: []
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: "goal-1",
    title: "Crack TCS NQT Placement",
    description: "Secure a system engineer or developer tier placement role at TCS by crushing the upcoming aptitude and coding panels.",
    category: "Career",
    deadline: "2026-07-15",
    progress: 68,
    streakCount: 14,
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: "Aptitude Foundations",
        duration: "Weeks 1-2",
        focus: "Quantitative reasoning, speed tricks, logical sequences, verbal agility",
        milestones: ["Score > 85% on Mock 1", "Complete 50 Aptitude Tests"],
        recommendedTasks: ["Practice math puzzle sheets", "Take daily reasoning quizzes"]
      },
      {
        phaseNumber: 2,
        title: "Coding Mastery",
        duration: "Weeks 3-4",
        focus: "Dynamic programming, recursion, graph traversals, data structures",
        milestones: ["Solve 100 LeetCode problems", "Complete 5 advanced coding simulation rounds"],
        recommendedTasks: ["Practice advanced trees", "Analyze algorithm complexity"]
      },
      {
        phaseNumber: 3,
        title: "Handoff & Mock Interviews",
        duration: "Week 5",
        focus: "Behavioral questions, resume review, soft-skills grooming, dynamic pitches",
        milestones: ["Secure professional resume score of 90+", "Conduct 3 peer mock interviews"],
        recommendedTasks: ["Draft STAR stories for projects", "Complete communication session"]
      }
    ]
  },
  {
    id: "goal-2",
    title: "Build & Launch SaaS Product",
    description: "Launch Zenith AI as a production-grade container service with functional AI planning utilities.",
    category: "Project",
    deadline: "2026-08-01",
    progress: 42,
    streakCount: 8,
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: "UI Design & Handoff",
        duration: "Weeks 1-3",
        focus: "Interactive components, customizable visual boards, responsive bento grids",
        milestones: ["Figma handoff approved", "Theme templates configured"],
        recommendedTasks: ["Setup layout structure", "Configure theme parameters"]
      },
      {
        phaseNumber: 2,
        title: "Vite + Express Orchestration",
        duration: "Weeks 4-6",
        focus: "Client routing integration, secure API proxies, Gemini LLM context pooling",
        milestones: ["Complete full-stack integration", "All 17 core features wired up"],
        recommendedTasks: ["Wire up database endpoints", "Test Gemini routing latency"]
      }
    ]
  }
];

export const INITIAL_SCHEDULE: ScheduleBlock[] = [
  { id: "block-1", time: "09:00", durationMinutes: 60, activity: "Aptitude Math Practice", type: "study", completed: true },
  { id: "block-2", time: "10:00", durationMinutes: 30, activity: "Coffee & Morning Sync", type: "break", completed: true },
  { id: "block-3", time: "10:30", durationMinutes: 90, activity: "Coding Drills (Dynamic Programming)", type: "study", completed: false },
  { id: "block-4", time: "12:00", durationMinutes: 60, activity: "Lunch and Walk", type: "break", completed: false },
  { id: "block-5", time: "13:00", durationMinutes: 120, activity: "Resume Polish & Capstone Edits", type: "work", completed: false },
  { id: "block-6", time: "15:00", durationMinutes: 30, activity: "Stretching Break", type: "break", completed: false },
  { id: "block-7", time: "15:30", durationMinutes: 90, activity: "Figma Mockups Review", type: "work", completed: false }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Overdue Deadline Alert",
    message: "Your Capstone design mockups are overdue! Click to initiate Recovery Planner.",
    type: "risk",
    timestamp: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    title: "AI Optimization Ready",
    message: "New task breakdown suggestions are available for TCS NQT strategy.",
    type: "success",
    timestamp: "1 hour ago",
    read: false
  },
  {
    id: "notif-3",
    title: "Focus Block Upcoming",
    message: "Your 'Coding Drills' session starts in 15 minutes. Prepare workspace.",
    type: "info",
    timestamp: "15 mins ago",
    read: true
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", title: "Focus Disciple", description: "Log a continuous 120 minutes of pure deep focus mode.", icon: "Flame", unlockedAt: "2026-06-25", progress: 100 },
  { id: "ach-2", title: "Milestone Crusher", description: "Complete all core milestones on an active Roadmap ahead of schedule.", icon: "Trophy", progress: 65 },
  { id: "ach-3", title: "Guilt-Free Bounce", description: "Successfully execute a Recovery Plan on an overdue task.", icon: "Sparkles", progress: 40 },
  { id: "ach-4", title: "Unstoppable Force", description: "Maintain a 10-day streak tracking time toward placement goals.", icon: "Zap", unlockedAt: "2026-06-26", progress: 100 }
];

export const CHAT_STARTER_HISTORY: ChatMessage[] = [
  {
    id: "chat-msg-1",
    role: "coach",
    text: "Hello Vanshika! I am your Zenith AI companion. Today you have 3 important focus items, including Aptitude exam preparation. What strategic choice or task breakdown can I assist you with today?",
    timestamp: "09:00 AM"
  }
];

export const CONTRIBUTION_GRID_DATA = Array.from({ length: 52 }, (_, colIdx) => {
  return Array.from({ length: 7 }, (_, rowIdx) => {
    // Generate organic density of completed focus blocks (higher density on recent dates)
    const random = Math.random();
    let level = 0;
    if (random > 0.85) level = 4; // ultra deep focus
    else if (random > 0.65) level = 3;
    else if (random > 0.45) level = 2;
    else if (random > 0.25) level = 1;
    return {
      col: colIdx,
      row: rowIdx,
      level, // 0 to 4
      minutesLogged: level * 45
    };
  });
});
