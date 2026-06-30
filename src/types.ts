/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PersonaType = "Friendly Coach" | "Strict Mentor" | "Study Buddy" | "Professional Advisor";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface TreeNode {
  id: string;
  label: string;
  type: "root" | "milestone" | "phase" | "subtask";
  parentId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  estimatedMinutes: number;
  actualMinutesLogged: number;
  completed: boolean;
  progress: number; // 0 to 100
  subtasks: SubTask[];
  milestones: string[];
  treeNodes?: TreeNode[];
  riskScore?: number;
  riskLevel?: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  riskFactors?: string[];
  recommendedReason?: string;
  activeSessionStart?: number; // timestamp if timer is running
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "Academic" | "Career" | "Health" | "Project" | "Personal";
  deadline: string;
  progress: number; // 0 to 100
  streakCount: number;
  roadmapPhases?: RoadmapPhase[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  focus: string;
  milestones: string[];
  recommendedTasks: string[];
}

export interface ScheduleBlock {
  id: string;
  time: string; // e.g., "09:00"
  durationMinutes: number;
  activity: string;
  type: "work" | "study" | "break" | "personal";
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "coach";
  text: string;
  timestamp: string;
  generativeUI?: {
    type: "action_plan" | "pros_cons" | "custom_schedule";
    title: string;
    data: {
      tasks?: string[];
      pros?: string[];
      cons?: string[];
      recommendation?: string;
      blocks?: Array<{ time: string; activity: string; durationMinutes?: number }>;
    };
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "risk";
  timestamp: string;
  read: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface FocusSession {
  id: string;
  taskId: string;
  taskTitle: string;
  durationMinutes: number;
  timestamp: string;
  notes: string;
}
